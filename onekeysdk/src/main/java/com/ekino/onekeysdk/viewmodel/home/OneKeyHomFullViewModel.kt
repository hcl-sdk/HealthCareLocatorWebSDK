package com.ekino.onekeysdk.viewmodel.home

import android.content.SharedPreferences
import android.text.format.DateUtils
import androidx.lifecycle.MutableLiveData
import base.viewmodel.AppViewModel
import com.ekino.onekeysdk.extensions.getConsultedProfiles
import com.ekino.onekeysdk.fragments.OneKeyHomeFullFragment
import com.ekino.onekeysdk.model.OneKeyLocation
import com.google.gson.Gson
import io.reactivex.Flowable

class OneKeyHomFullViewModel : AppViewModel<OneKeyHomeFullFragment>() {
    private val gson by lazy { Gson() }
    val consultedProfiles by lazy { MutableLiveData<ArrayList<OneKeyLocation>>() }

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