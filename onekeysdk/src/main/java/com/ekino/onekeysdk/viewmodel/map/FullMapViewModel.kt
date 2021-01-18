package com.ekino.onekeysdk.viewmodel.map

import android.Manifest
import androidx.fragment.app.Fragment
import androidx.lifecycle.MutableLiveData
import base.viewmodel.ApolloViewModel
import com.ekino.onekeysdk.extensions.isNotNullable
import com.ekino.onekeysdk.extensions.isNullable
import com.ekino.onekeysdk.extensions.requestPermission
import com.ekino.onekeysdk.fragments.map.FullMapFragment
import com.ekino.onekeysdk.model.activity.ActivityObject
import com.ekino.onekeysdk.model.map.OneKeyPlace
import com.ekino.onekeysdk.state.OneKeySDK
import com.iqvia.onekey.GetActivitiesQuery
import com.iqvia.onekey.type.GeopointQuery
import io.reactivex.Flowable

class FullMapViewModel : ApolloViewModel<FullMapFragment>() {
    private val theme = OneKeySDK.getInstance().getConfiguration()

    val permissionRequested by lazy { MutableLiveData<Boolean>() }
    val activities by lazy { MutableLiveData<ArrayList<ActivityObject>>() }
    val loading by lazy { MutableLiveData<Boolean>() }

    fun requestPermissions(context: Fragment) {
        context.requestPermission({ granted ->
            permissionRequested.postValue(granted)
        }, Manifest.permission.WRITE_EXTERNAL_STORAGE,
                Manifest.permission.ACCESS_COARSE_LOCATION, Manifest.permission.ACCESS_FINE_LOCATION)
    }

    fun getActivities(criteria: String, specialities: ArrayList<String>, place: OneKeyPlace?) {
        loading.postValue(true)
        query({
            val builder = GetActivitiesQuery.builder()
                    .locale(theme.getLocaleCode()).first(50).offset(0)
            if (specialities.isNotEmpty()) {
                builder.specialties(specialities)
            } else {
                if (criteria.isNotEmpty())
                    builder.criteria(criteria)
            }
            if (place.isNotNullable() && place!!.placeId.isNotEmpty()) {
                builder.location(GeopointQuery.builder().lat(place!!.latitude.toDouble())
                        .lon(place.longitude.toDouble()).build())
            }
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
                loading.postValue(false)
            }
        }, {
            loading.postValue(false)
            activities.postValue(arrayListOf())
        }, true)
    }

    fun getActivities(criteria: String, specialities: ArrayList<String>, place: OneKeyPlace?,
                      callback: (list: ArrayList<ActivityObject>) -> Unit) {
        query({
            val builder = GetActivitiesQuery.builder()
                    .locale(theme.getLocaleCode()).first(50).offset(0)
            if (specialities.isNotEmpty()) builder.specialties(specialities)
            else {
                if (criteria.isNotEmpty()) builder.criteria(criteria)
            }
            if (place.isNotNullable() && place!!.placeId.isNotEmpty()) {
                builder.location(GeopointQuery.builder().lat(place!!.latitude.toDouble())
                        .lon(place.longitude.toDouble()).build())
            }
            builder.build()
        }, { response ->
            if (response.data?.activities().isNullable()) {
                callback(arrayListOf())
            } else {
                callback(response.data!!.activities()!!.run {
                    val list = ArrayList<ActivityObject>()
                    forEach { act ->
                        val obj = ActivityObject().parse(act.activity())
                        obj.distance = act.distance() ?: 0.0
                        list.add(obj)
                    }
                    list
                })
            }
        }, {
            callback(arrayListOf())
        }, true)
    }

    fun sortActivities(list: ArrayList<ActivityObject>, sorting: Int,
                       callback: (list: ArrayList<ActivityObject>) -> Unit) {
        Flowable.just(list)
                .map {
                    if (sorting == 0) return@map it
                    it.sortWith(Comparator { o1, o2 ->
                        if (sorting == 1) o1.distance.compareTo(o2.distance)
                        else
                            (o1.individual?.lastName ?: "").compareTo(o2.individual?.lastName ?: "")
                    })
                    it
                }
                .compose(compose())
                .subscribe({ callback(it) }, {})
    }
}