package com.ekino.onekeysdk.viewmodel.search

import android.Manifest
import android.widget.EditText
import androidx.lifecycle.MutableLiveData
import base.fragments.IFragment
import base.viewmodel.ApolloViewModel
import com.ekino.onekeysdk.extensions.*
import com.ekino.onekeysdk.fragments.search.SearchFragment
import com.ekino.onekeysdk.model.HealthCareLocatorSpecialityObject
import com.ekino.onekeysdk.model.map.OneKeyPlace
import com.ekino.onekeysdk.service.location.LocationAPI
import com.ekino.onekeysdk.service.location.OneKeyMapService
import com.ekino.onekeysdk.state.HealthCareLocatorSDK
import com.ekino.onekeysdk.utils.OneKeyLog
import com.google.android.libraries.places.api.Places
import com.google.android.libraries.places.api.model.AutocompleteSessionToken
import com.google.android.libraries.places.api.model.TypeFilter
import com.google.android.libraries.places.api.net.FindAutocompletePredictionsRequest
import com.google.android.libraries.places.api.net.PlacesClient
import com.iqvia.onekey.GetCodeByLabelQuery
import com.iqvia.onekey.GetIndividualByNameQuery
import com.jakewharton.rxbinding2.widget.RxTextView
import io.reactivex.disposables.CompositeDisposable
import java.net.URLEncoder
import java.util.*
import java.util.concurrent.TimeUnit
import kotlin.collections.ArrayList

class SearchViewModel : ApolloViewModel<SearchFragment>() {
    private val theme = HealthCareLocatorSDK.getInstance().getConfiguration()
    private var searchGoogleToken: AutocompleteSessionToken? = null
    private var placeClient: PlacesClient? = null

    private var searchDisposable: CompositeDisposable? = null
    val places by lazy { MutableLiveData<ArrayList<OneKeyPlace>>() }
    val specialityEvent by lazy { MutableLiveData<Boolean>() }
    val addressEvent by lazy { MutableLiveData<Boolean>() }
    val permissionGranted by lazy { MutableLiveData<Boolean>() }
    val individuals by lazy { MutableLiveData<ArrayList<Any>>() }
    val individualsState by lazy { MutableLiveData<Boolean>() }
    val addressState by lazy { MutableLiveData<Boolean>() }

    private val executor: LocationAPI by lazy {
        OneKeyMapService.Builder(LocationAPI.mapUrl, LocationAPI::class.java).build()
    }

    override fun bindView(t: SearchFragment) {
        super.bindView(t)
        if (HealthCareLocatorSDK.getInstance().getConfiguration().mapService == MapService.GOOGLE_MAP) {
            val key = t.activity?.getMetaDataFromManifest("com.google.android.geo.API_KEY")
            if (key.isNotNullAndEmpty()) {
                Places.initialize(t.context!!, key!!, Locale(HealthCareLocatorSDK.getInstance().getConfiguration().getLocaleCode()))
                searchGoogleToken = AutocompleteSessionToken.newInstance()
                placeClient = Places.createClient(t.context!!)
            }
        }
        searchDisposable = CompositeDisposable()
    }

    override fun unbindView() {
        super.unbindView()
        searchDisposable?.clear()
        searchDisposable?.dispose()
    }

    fun requestPermission(fragment: IFragment) {
        fragment.requestPermission({
            permissionGranted.postValue(it)
        }, Manifest.permission.ACCESS_COARSE_LOCATION, Manifest.permission.ACCESS_FINE_LOCATION)
    }

    private val searchParameters by lazy {
        hashMapOf<String, String>().apply {
            put("format", "json")
            put("accept-language", Locale.getDefault().language)
            put("addressdetails", "1")
            put("limit", "10")
        }
    }

    fun onSpecialityChanged(ref: SearchFragment, view: EditText) {
        disposable?.add(
                RxTextView.afterTextChangeEvents(view).debounce(300, TimeUnit.MILLISECONDS).map {
                    it.view().text.toString()
                }.subscribe({
                    specialityEvent.postValue(it.isNotEmpty())
                    if (!ref.onItemClicked) {
                        if (it.isNotEmpty() && it.length >= 3) {
                            individualsState.postValue(true)
                            getIndividualByName(ref, it)
                        } else individuals.postValue(arrayListOf())
                    } else ref.onItemClicked = false
                }, {
                    OneKeyLog.e(it.localizedMessage)
                })
        )
    }

    fun onAddressChanged(view: EditText) {
        disposable?.add(
                RxTextView.afterTextChangeEvents(view)
                        .map { event -> event.view().text.toString() }
                        .subscribe({ key ->
                            addressEvent.postValue(key.isNotEmpty())
                            if (key.isEmpty()) {
                                places.postValue(arrayListOf())
                            } else {
                                searchParameters["q"] = URLEncoder.encode(key, "UTF-8")
                                searchAddress(key)
                            }
                        }, {
                            (getFragmentReference() as? SearchFragment)?.showMessage("Error:: ${it.localizedMessage}")
                            //Do nothing
                        })
        )
    }

    private fun searchAddress(query: String) {
        addressState.postValue(true)
        if (HealthCareLocatorSDK.getInstance().getConfiguration().mapService == MapService.OSM) {
            searchDisposable?.clear()
            searchDisposable?.add(
                    executor.searchAddress(searchParameters).delay(300, TimeUnit.MILLISECONDS)
                            .compose(compose()).subscribe({
                                addressState.postValue(false)
                                places.postValue(it)
                            }, {
                                addressState.postValue(false)
                                places.postValue(arrayListOf())
                            }))
        } else if (HealthCareLocatorSDK.getInstance().getConfiguration().mapService == MapService.GOOGLE_MAP) {
            val request = FindAutocompletePredictionsRequest.builder()
                    .setSessionToken(searchGoogleToken).setTypeFilter(TypeFilter.ADDRESS)
                    .setQuery(query).build()
            placeClient?.findAutocompletePredictions(request)
                    ?.addOnSuccessListener { response ->
                        OneKeyLog.d("$response")
                    }
                    ?.addOnFailureListener { e ->
                        OneKeyLog.e("Error: ${e.localizedMessage}")
                    }
        }
    }

    private fun getIndividualByName(ref: SearchFragment, name: String) {
        getCodeByLabel(name) { codes ->
            ref.clearIndividualData()
            individuals.value = arrayListOf()
            individuals.postValue((individuals.value ?: arrayListOf()).apply {
                this.addAll(codes)
            })
            getIndividualByName(name) { list ->
                individuals.postValue((individuals.value ?: arrayListOf()).apply {
                    this.addAll(list)
                })

                individualsState.postValue(false)
            }
        }
    }

    private fun getIndividualByName(name: String, callback: (ArrayList<GetIndividualByNameQuery.Individual>) -> Unit) {
        query({
            GetIndividualByNameQuery.builder()
                    .criteria(name).first(5).offset(0).locale(theme.getLocaleCode()).build()
        }, { response ->
            if (response.data?.individualsByName()?.individuals().isNullable())
                callback(arrayListOf())
            else
                callback(ArrayList(response.data?.individualsByName()?.individuals()!!))
        }, { e ->
            OneKeyLog.d("onFailure::${e.localizedMessage}")
            callback(arrayListOf())
        })
    }

    private fun getCodeByLabel(name: String, callback: (ArrayList<HealthCareLocatorSpecialityObject>) -> Unit) {
        rxQuery({
            GetCodeByLabelQuery.builder().criteria(name).first(5).offset(0).locale(theme.locale)
                    .codeTypes(listOf("SP")).build()
        }, { response ->
            if (response.data?.codesByLabel()?.codes().isNullable())
                arrayListOf<HealthCareLocatorSpecialityObject>()
            else {
                val list = arrayListOf<HealthCareLocatorSpecialityObject>()
                response.data!!.codesByLabel()!!.codes()!!.forEach {
                    list.add(HealthCareLocatorSpecialityObject().parse(it))
                }
                list
            }
        }, {
            callback(it)
        }, {
            callback(arrayListOf())
        })
    }
}