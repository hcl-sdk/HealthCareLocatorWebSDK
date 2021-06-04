package com.healthcarelocator.viewmodel.map

import android.Manifest
import androidx.fragment.app.Fragment
import androidx.lifecycle.MutableLiveData
import base.viewmodel.ApolloViewModel
import com.healthcarelocator.extensions.*
import com.healthcarelocator.fragments.map.FullMapFragment
import com.healthcarelocator.model.activity.ActivityObject
import com.healthcarelocator.model.map.HCLPlace
import com.healthcarelocator.service.location.LocationAPI
import com.healthcarelocator.service.location.HCLMapService
import com.healthcarelocator.state.HealthCareLocatorSDK
import com.iqvia.onekey.GetActivitiesQuery
import io.reactivex.Flowable

class FullMapViewModel : ApolloViewModel<FullMapFragment>() {
    private val theme = HealthCareLocatorSDK.getInstance().getConfiguration()

    val permissionRequested by lazy { MutableLiveData<Boolean>() }
    val activities by lazy { MutableLiveData<ArrayList<ActivityObject>>() }
    val loading by lazy { MutableLiveData<Boolean>() }
    private val executor: LocationAPI by lazy {
        HCLMapService.Builder(LocationAPI.mapUrl, LocationAPI::class.java).build()
    }

    fun requestPermissions(context: Fragment) {
        context.requestPermission(
                { granted ->
                    permissionRequested.postValue(granted)
                }, Manifest.permission.WRITE_EXTERNAL_STORAGE,
                Manifest.permission.ACCESS_COARSE_LOCATION, Manifest.permission.ACCESS_FINE_LOCATION
        )
    }

    fun getActivities(criteria: String, specialities: ArrayList<String>, place: HCLPlace?) {
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
            builder.getQuery(place)
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

    fun getActivities(
        criteria: String, specialities: ArrayList<String>, place: HCLPlace?,
        callback: (list: ArrayList<ActivityObject>) -> Unit
    ) {
        query({
            val builder = GetActivitiesQuery.builder()
                    .locale(theme.getLocaleCode()).first(50).offset(0)
            if (specialities.isNotEmpty()) builder.specialties(specialities)
            else {
                if (criteria.isNotEmpty()) builder.criteria(criteria)
            }

            builder.getQuery(place)
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

    fun reverseGeoCoding(place: HCLPlace, callback: (place: HCLPlace) -> Unit) {
        val params = hashMapOf<String, String>()
        params["lat"] = place.latitude
        params["lon"] = place.longitude
        params["format"] = "json"
        disposable?.add(
                executor.reverseGeoCoding(params).map {
                    if (it.address != null) {
                        if (it.address!!.road.isNotEmpty() || it.address!!.city.isNotEmpty()) {
                            val box = it.getBox()
                            it.distance = getDistanceFromBoundingBox(box[0], box[2], box[1], box[3])
                        }
                    }
                    it
                }.compose(compose()).subscribe({ callback(it) }, { callback(place) })
        )
    }

    fun sortActivities(
            list: ArrayList<ActivityObject>, sorting: Int,
            callback: (list: ArrayList<ActivityObject>) -> Unit
    ) {
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