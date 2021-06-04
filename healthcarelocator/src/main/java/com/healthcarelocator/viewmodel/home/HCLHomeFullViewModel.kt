package com.healthcarelocator.viewmodel.home

import android.Manifest
import android.content.SharedPreferences
import android.location.Location
import android.text.format.DateUtils
import androidx.fragment.app.Fragment
import androidx.lifecycle.MutableLiveData
import base.extensions.runOnUiThread
import base.viewmodel.ApolloViewModel
import com.healthcarelocator.state.HealthCareLocatorSDK
import com.healthcarelocator.extensions.*
import com.healthcarelocator.fragments.HCLHomeFullFragment
import com.healthcarelocator.model.SearchObject
import com.healthcarelocator.model.activity.ActivityObject
import com.google.gson.Gson
import com.iqvia.onekey.GetActivitiesQuery
import com.iqvia.onekey.type.GeopointQuery
import io.reactivex.Flowable

class HCLHomeFullViewModel : ApolloViewModel<HCLHomeFullFragment>() {
    private val gson by lazy { Gson() }
    private val config = HealthCareLocatorSDK.getInstance().getConfiguration()
    val consultedProfiles by lazy { MutableLiveData<ArrayList<ActivityObject>>() }
    val lastSearches by lazy { MutableLiveData<ArrayList<SearchObject>>() }
    val permissionGranted by lazy { MutableLiveData<Boolean>() }
    val loading by lazy { MutableLiveData<Boolean>() }
    val activities by lazy { MutableLiveData<ArrayList<ActivityObject>>() }
    private var lockState = false

    fun requestPermissions(context: Fragment) {
        context.requestPermission({ granted ->
            permissionGranted.postValue(granted)
        }, Manifest.permission.WRITE_EXTERNAL_STORAGE,
                Manifest.permission.ACCESS_COARSE_LOCATION, Manifest.permission.ACCESS_FINE_LOCATION)
    }

    fun getConsultedProfiles(pref: SharedPreferences) {
        disposable?.add(
                Flowable.just(pref)
                        .map { pref.getConsultedProfiles(gson) }
                        .map { list ->
                            val current = System.currentTimeMillis()
                            list.map {
                                it.createdDate = DateUtils.getRelativeTimeSpanString(it.createdAt, current, DateUtils.MINUTE_IN_MILLIS).toString()
                            }
                            list
                        }
                        .compose(compose())
                        .subscribe({
                            consultedProfiles.postValue(it)
                        }, {})
        )
    }

    fun getNearMeHCP(currentLocation: Location, callback: () -> Unit) {
        if (lockState) return
//
//        currentLocation.latitude = fakeInToronto[0]
//        currentLocation.longitude = fakeInToronto[1]
        lockState = true
        loading.postValue(true)
        query({
            val builder = GetActivitiesQuery.builder()
                    .locale(config.getLocaleCode()).first(10).offset(0)
//            if (config.favoriteIds.isNotEmpty()) {
//                builder.specialties(config.favoriteIds)
//            }
            builder.location(GeopointQuery.builder().lat(currentLocation.latitude).lon(currentLocation.longitude).build())
            builder.build()
        }, { response ->
            if (response.data?.activities().isNullable()) {
                activities.postValue(arrayListOf())
                loading.postValue(false)
            } else {
                activities.postValue(response.data!!.activities()!!.run {
                    val list = ArrayList<ActivityObject>()
                    forEach { act ->
                        val obj = ActivityObject().parse(act.activity())
                        obj.distance = act.distance() ?: 0.0
                        list.add(obj)
                    }
                    list
                })
                runOnUiThread(Runnable {
                    callback()
                    loading.postValue(false)
                })
            }
        }, {
            lockState = false
            loading.postValue(false)
        }, true)
    }

    fun getLastSearches(pref: SharedPreferences) {
        disposable?.add(
                Flowable.just(pref)
                        .map { pref.getLastSearches(gson) }
                        .map { list ->
                            val current = System.currentTimeMillis()
                            list.map {
                                it.createdDate = DateUtils.getRelativeTimeSpanString(it.createdAt, current, DateUtils.MINUTE_IN_MILLIS).toString()
                            }
                            list
                        }
                        .compose(compose())
                        .subscribe({
                            lastSearches.postValue(it)
                        }, {})
        )
    }

    fun removeSearch(pref: SharedPreferences, obj: SearchObject) {
        disposable?.add(Flowable.just(obj)
                .map {
                    pref.removeConsultedProfile(Gson(), obj)
                }
                .compose(compose())
                .subscribe({}, {}))
    }
}