package com.ekino.onekeysdk.viewmodel.home

import android.Manifest
import android.content.SharedPreferences
import android.text.format.DateUtils
import androidx.fragment.app.Fragment
import androidx.lifecycle.MutableLiveData
import base.viewmodel.ApolloViewModel
import base.viewmodel.AppViewModel
import com.ekino.onekeysdk.extensions.getConsultedProfiles
import com.ekino.onekeysdk.extensions.requestPermission
import com.ekino.onekeysdk.fragments.OneKeyHomeFullFragment
import com.ekino.onekeysdk.model.OneKeyLocation
import com.ekino.onekeysdk.model.activity.ActivityObject
import com.google.gson.Gson
import io.reactivex.Flowable

class OneKeyHomFullViewModel : ApolloViewModel<OneKeyHomeFullFragment>() {
    private val gson by lazy { Gson() }
    val consultedProfiles by lazy { MutableLiveData<ArrayList<ActivityObject>>() }
    val permissionRequested by lazy { MutableLiveData<Boolean>() }

    fun requestPermissions(context: Fragment) {
        context.requestPermission({ granted ->
            permissionRequested.postValue(granted)
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
}