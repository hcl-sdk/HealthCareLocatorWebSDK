package com.ekino.onekeysdk.viewmodel.search

import android.widget.EditText
import androidx.lifecycle.MutableLiveData
import base.viewmodel.AppViewModel
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

    private val searchParameters by lazy {
        hashMapOf<String, String>().apply {
            put("format", "json")
            put("accept-language", Locale.getDefault().language)
            put("addressdetails", "1")
            put("limit", "10")
        }
    }

    fun onAddressChanged(view: EditText) {
        disposable?.add(
                RxTextView.afterTextChangeEvents(view).debounce(300, TimeUnit.MILLISECONDS)
                        .map { event -> event.view().text.toString() }
                        .subscribe({ key ->
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
                executor.searchAddress(searchParameters)
                        .compose(compose()).subscribe({
                            places.postValue(it)
                        }, {
                            places.postValue(arrayListOf())
                        })
        )
    }
}