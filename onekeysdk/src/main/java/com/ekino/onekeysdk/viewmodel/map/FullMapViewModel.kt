package com.ekino.onekeysdk.viewmodel.map

import android.Manifest
import androidx.fragment.app.Fragment
import androidx.lifecycle.MutableLiveData
import base.viewmodel.AppViewModel
import com.ekino.onekeysdk.extensions.requestPermission
import com.ekino.onekeysdk.fragments.map.FullMapFragment

class FullMapViewModel : AppViewModel<FullMapFragment>() {

    val permissionRequested by lazy { MutableLiveData<Boolean>() }

    fun requestPermissions(context: Fragment) {
        context.requestPermission({ granted ->
            permissionRequested.postValue(granted)
        }, Manifest.permission.WRITE_EXTERNAL_STORAGE,
                Manifest.permission.ACCESS_COARSE_LOCATION, Manifest.permission.ACCESS_FINE_LOCATION)
    }
}