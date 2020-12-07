package com.ekino.onekeysdk.viewmodel.map

import android.Manifest
import android.content.SharedPreferences
import androidx.fragment.app.Fragment
import androidx.lifecycle.MutableLiveData
import base.viewmodel.AppViewModel
import com.ekino.onekeysdk.extensions.requestPermission
import com.ekino.onekeysdk.extensions.storeConsultedProfiles
import com.ekino.onekeysdk.fragments.map.FullMapFragment
import com.ekino.onekeysdk.model.OneKeyLocation
import com.google.gson.Gson
import io.reactivex.Flowable

class FullMapViewModel : AppViewModel<FullMapFragment>() {

    val permissionRequested by lazy { MutableLiveData<Boolean>() }

    fun requestPermissions(context: Fragment) {
        context.requestPermission({ granted ->
            permissionRequested.postValue(granted)
        }, Manifest.permission.WRITE_EXTERNAL_STORAGE,
                Manifest.permission.ACCESS_COARSE_LOCATION, Manifest.permission.ACCESS_FINE_LOCATION)
    }

    fun storeConsultedProfile(pref: SharedPreferences, location: OneKeyLocation) {
        disposable?.add(Flowable.just(0)
                .map {
                    location.createdAt = System.currentTimeMillis()
                    pref.storeConsultedProfiles(Gson(), location)
                }
                .compose(compose())
                .subscribe({}, {}))
    }
}