package com.ekino.onekeysdk.viewmodel.search

import android.Manifest
import android.widget.EditText
import androidx.lifecycle.MutableLiveData
import base.fragments.IFragment
import base.viewmodel.AppViewModel
import com.ekino.onekeysdk.extensions.requestPermission
import com.ekino.onekeysdk.fragments.search.SearchFragment
import com.ekino.onekeysdk.model.map.OneKeyPlace
import com.ekino.onekeysdk.service.location.LocationAPI
import com.ekino.onekeysdk.service.location.OneKeyMapService
import com.jakewharton.rxbinding2.widget.RxTextView
import io.reactivex.disposables.CompositeDisposable
import java.net.URLEncoder
import java.util.*
import java.util.concurrent.TimeUnit

class SearchViewModel : AppViewModel<SearchFragment>() {

    private var searchDisposable: CompositeDisposable? = null
    val places by lazy { MutableLiveData<ArrayList<OneKeyPlace>>() }
    val specialityEvent by lazy { MutableLiveData<Boolean>() }
    val addressEvent by lazy { MutableLiveData<Boolean>() }
    val permissionGranted by lazy { MutableLiveData<Boolean>() }

    private val executor: LocationAPI by lazy {
        OneKeyMapService.Builder(LocationAPI.mapUrl, LocationAPI::class.java).build()
    }

    override fun bindView(t: SearchFragment) {
        super.bindView(t)
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

    fun onSpecialityChanged(view: EditText) {
        disposable?.add(
                RxTextView.afterTextChangeEvents(view).map {
                    it.view().text.toString()
                }.subscribe({
                    specialityEvent.postValue(it.isNotEmpty())
                }, {})
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
                                searchAddress()
                            }
                        }, {
                            //Do nothing
                        })
        )
    }

    private fun searchAddress() {
        searchDisposable?.clear()
        searchDisposable?.add(
                executor.searchAddress(searchParameters).delay(300, TimeUnit.MILLISECONDS)
                        .compose(compose()).subscribe({
                            places.postValue(it)
                        }, {
                            places.postValue(arrayListOf())
                        })
        )
    }
}