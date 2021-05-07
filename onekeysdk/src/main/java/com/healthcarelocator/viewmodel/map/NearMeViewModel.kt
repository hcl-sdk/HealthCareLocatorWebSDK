package com.healthcarelocator.viewmodel.map

import android.Manifest
import android.content.Context
import android.location.Location
import androidx.fragment.app.Fragment
import androidx.lifecycle.MutableLiveData
import base.viewmodel.ApolloViewModel
import com.healthcarelocator.extensions.getDistanceFromBoundingBox
import com.healthcarelocator.extensions.getQuery
import com.healthcarelocator.extensions.isNullable
import com.healthcarelocator.extensions.requestPermission
import com.healthcarelocator.fragments.map.OneKeyNearMeFragment
import com.healthcarelocator.model.activity.ActivityObject
import com.healthcarelocator.model.map.OneKeyPlace
import com.healthcarelocator.service.location.LocationAPI
import com.healthcarelocator.service.location.LocationClient
import com.healthcarelocator.service.location.OneKeyMapService
import com.healthcarelocator.state.HealthCareLocatorSDK
import com.healthcarelocator.utils.OneKeyLog
import com.iqvia.onekey.GetActivitiesQuery
import com.iqvia.onekey.GetLabelByCodeQuery
import com.iqvia.onekey.type.GeopointQuery
import io.reactivex.Flowable

class NearMeViewModel : ApolloViewModel<OneKeyNearMeFragment>() {
    private val theme = HealthCareLocatorSDK.getInstance().getConfiguration()

    val permissionRequested by lazy { MutableLiveData<Boolean>() }
    val activities by lazy { MutableLiveData<ArrayList<ActivityObject>>() }
    val loading by lazy { MutableLiveData<Boolean>() }
    val specialityLabel by lazy { MutableLiveData<String>() }

    private val executor: LocationAPI by lazy {
        OneKeyMapService.Builder(LocationAPI.mapUrl, LocationAPI::class.java).build()
    }

    fun requestPermissions(context: Fragment) {
        context.requestPermission(
                { granted ->
                    permissionRequested.postValue(granted)
                }, Manifest.permission.WRITE_EXTERNAL_STORAGE,
                Manifest.permission.ACCESS_COARSE_LOCATION, Manifest.permission.ACCESS_FINE_LOCATION
        )
    }

    fun getSpecialityNameByCode(code: String) {
        rxQuery({ GetLabelByCodeQuery.builder().codeTypes(listOf("SP")).criteria(code).build() }, {
            it.data?.labelsByCode()?.codes()?.firstOrNull()?.longLbl() ?: ""
        }, {
            specialityLabel.postValue(it)
        }, { OneKeyLog.e("Error:: ${it.localizedMessage}") })
    }

    fun getActivities(
            context: Context, criteria: String, specialities: ArrayList<String>, place: OneKeyPlace?,
            currentLocation: (location: Location) -> Unit
    ) {
        loading.postValue(true)
        val client = LocationClient(context)
        client.requestLastLocation().registerDataCallBack({ location ->
            client.removeLocationUpdate()
            client.releaseApiClient()
            currentLocation(location)
            query({
                val builder = GetActivitiesQuery.builder()
                        .locale(theme.getLocaleCode()).first(50).offset(0)
                if (specialities.isNotEmpty()) {
                    builder.specialties(specialities)
                } else {
                    if (criteria.isNotEmpty())
                        builder.criteria(criteria)
                }
                val p = (place ?: OneKeyPlace()).apply {
                    latitude = "${location.latitude}"
                    longitude = "${location.longitude}"
                }
                builder.getQuery(p)
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
        }, { isAvailable ->
            if (!isAvailable)
                loading.postValue(false)
        }, {
            loading.postValue(false)
        })
    }

    fun getActivities(
            context: Context, criteria: String, specialities: ArrayList<String>, place: OneKeyPlace?,
            usingCurrentLocation: Boolean, callback: (list: ArrayList<ActivityObject>) -> Unit,
            currentLocation: (location: Location) -> Unit
    ) {
        val client = LocationClient(context)
        client.requestLastLocation().registerDataCallBack({ location ->
            client.removeLocationUpdate()
            client.releaseApiClient()
            currentLocation(location)
            query({
                val builder = GetActivitiesQuery.builder()
                        .locale(theme.getLocaleCode()).first(50).offset(0)
                if (specialities.isNotEmpty()) {
                    builder.specialties(specialities)
                } else {
                    if (criteria.isNotEmpty())
                        builder.criteria(criteria)
                }
                if (usingCurrentLocation)
                    builder.location(GeopointQuery.builder().lat(location.latitude)
                            .lon(location.longitude).distanceMeter(2000.0).build())
                else builder.getQuery(place)
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
        }, { isAvailable ->
            if (!isAvailable)
                callback(arrayListOf())
        }, {
            callback(arrayListOf())
        })
    }

    fun reverseGeoCoding(place: OneKeyPlace, callback: (place: OneKeyPlace) -> Unit) {
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
                }.compose(compose())
                        .subscribe({ callback(it) }, { callback(place) })
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