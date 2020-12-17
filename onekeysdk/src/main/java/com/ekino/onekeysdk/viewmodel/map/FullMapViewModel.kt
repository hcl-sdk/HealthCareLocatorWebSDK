package com.ekino.onekeysdk.viewmodel.map

import android.Manifest
import android.content.SharedPreferences
import androidx.fragment.app.Fragment
import androidx.lifecycle.MutableLiveData
import base.viewmodel.ApolloViewModel
import com.ekino.onekeysdk.extensions.*
import com.ekino.onekeysdk.fragments.map.FullMapFragment
import com.ekino.onekeysdk.model.OneKeyLocation
import com.ekino.onekeysdk.model.OneKeySpecialityObject
import com.ekino.onekeysdk.model.activity.ActivityObject
import com.ekino.onekeysdk.model.map.OneKeyPlace
import com.google.gson.Gson
import com.iqvia.onekey.GetActivitiesQuery
import com.iqvia.onekey.type.GeopointQuery
import io.reactivex.Flowable

class FullMapViewModel : ApolloViewModel<FullMapFragment>() {
    private val theme = ThemeExtension.getInstance().getThemeConfiguration()

    val permissionRequested by lazy { MutableLiveData<Boolean>() }
    val activities by lazy { MutableLiveData<ArrayList<ActivityObject>>() }
    val loading by lazy { MutableLiveData<Boolean>() }

    fun requestPermissions(context: Fragment) {
        context.requestPermission({ granted ->
            permissionRequested.postValue(granted)
        }, Manifest.permission.WRITE_EXTERNAL_STORAGE,
                Manifest.permission.ACCESS_COARSE_LOCATION, Manifest.permission.ACCESS_FINE_LOCATION)
    }

    fun getActivities(criteria: String, specialityObject: OneKeySpecialityObject?, place: OneKeyPlace?) {
        loading.postValue(true)
        query({
            val builder = GetActivitiesQuery.builder().apiKey(theme.apiKey)
                    .locale(theme.locale).first(50).offset(0)
            if (specialityObject.isNotNullable()) {
                builder.specialties(listOf(specialityObject!!.id))
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
        }, true)
    }
}