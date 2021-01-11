package com.ekino.onekeysdk.viewmodel.home

import android.Manifest
import android.content.Context
import android.content.SharedPreferences
import androidx.fragment.app.Fragment
import androidx.lifecycle.MutableLiveData
import base.viewmodel.AppViewModel
import com.ekino.onekeysdk.extensions.getConsultedProfiles
import com.ekino.onekeysdk.extensions.getLastSearches
import com.ekino.onekeysdk.extensions.isNotNullable
import com.ekino.onekeysdk.extensions.requestPermission
import com.ekino.onekeysdk.fragments.home.OneKeyHomeMainFragment
import com.ekino.onekeysdk.service.location.LocationClient
import com.ekino.onekeysdk.utils.OneKeyLog
import com.google.gson.Gson
import io.reactivex.BackpressureStrategy
import io.reactivex.Flowable
import io.reactivex.functions.BiFunction

class OneKeyHomeMainViewModel : AppViewModel<OneKeyHomeMainFragment>() {
    private val gson by lazy { Gson() }
    val permissionGranted by lazy { MutableLiveData<Boolean>() }

    fun requestPermissions(context: Fragment) {
        context.requestPermission(
                { granted ->
                    permissionGranted.postValue(granted)
                }, Manifest.permission.WRITE_EXTERNAL_STORAGE, Manifest.permission.ACCESS_COARSE_LOCATION,
                Manifest.permission.ACCESS_FINE_LOCATION)
    }


    fun checkHomeFullPage(context: Context, screenCallBack: (screen: Int) -> Unit) {
        val client = LocationClient(context)
        client.requestLastLocation().registerDataCallBack({ location ->
            client.removeLocationUpdate()
            client.releaseApiClient()
            val pref = context.getSharedPreferences("OneKeySDK", Context.MODE_PRIVATE)
            disposable?.add(
                    Flowable.combineLatest(getConsulted(pref), getLastSearches(pref),
                            BiFunction<Boolean, Boolean, Boolean> { b1, b2 ->
                                location.isNotNullable() || b1 || b2
                            }).compose(compose())
                            .subscribe({
                                screenCallBack(if (it) 1 else 0)
                            }, { OneKeyLog.e(it) })
            )
        }, {}, {})
    }

    private fun getConsulted(pref: SharedPreferences) =
            Flowable.create<Boolean>({
                val consulted = pref.getConsultedProfiles(gson)
                if (!it.isCancelled) {
                    it.onNext(consulted.isNotEmpty())
                    it.onComplete()
                }
            }, BackpressureStrategy.LATEST)

    private fun getLastSearches(pref: SharedPreferences) =
            Flowable.create<Boolean>({
                val consulted = pref.getLastSearches(gson)
                if (!it.isCancelled) {
                    it.onNext(consulted.isNotEmpty())
                    it.onComplete()
                }
            }, BackpressureStrategy.LATEST)
}