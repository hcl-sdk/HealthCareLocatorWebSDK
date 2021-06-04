package com.healthcarelocator.viewmodel.profile

import android.content.Context
import androidx.lifecycle.MutableLiveData
import base.extensions.runOnUiThread
import base.viewmodel.ApolloViewModel
import com.healthcarelocator.extensions.getSharedPref
import com.healthcarelocator.extensions.getVoteById
import com.healthcarelocator.extensions.storeVote
import com.healthcarelocator.fragments.profile.HCLProfileFragment
import com.healthcarelocator.model.activity.ActivityObject
import com.healthcarelocator.state.HealthCareLocatorSDK
import com.healthcarelocator.utils.HCLLog
import com.google.gson.Gson
import com.healthcarelocator.extensions.isNullable
import com.iqvia.onekey.GetActivityByIdQuery
import io.reactivex.Flowable

class HCLProfileViewModel : ApolloViewModel<HCLProfileFragment>() {
    private val theme = HealthCareLocatorSDK.getInstance().getConfiguration()
    private val gson by lazy { Gson() }
    val activity by lazy { MutableLiveData<ActivityObject>() }
    val loading by lazy { MutableLiveData<Boolean>() }
    val voteState by lazy { MutableLiveData<Int>() }

    fun getDetailActivity(id: String) {
        loading.postValue(true)
        query({
            GetActivityByIdQuery.builder().id(id).locale(theme.getLocaleCode()).build()
        }, { response ->
            if (response.data?.activityByID().isNullable()) {
                runOnUiThread(Runnable {
                    loading.postValue(false)
                    //TODO:
                })
            } else {
                val obj = ActivityObject().parse(response.data?.activityByID())
                activity.postValue(obj)
                loading.postValue(false)
            }
        }, {
            HCLLog.e(it.localizedMessage)
            loading.postValue(false)
        }, true)
    }

    fun getVoteById(context: Context?, id: String) {
        val pref = context?.getSharedPref() ?: return
        disposable?.add(Flowable.just(pref)
                .map {
                    it.getVoteById(gson, id)
                }
                .compose(compose())
                .subscribe({ vote ->
                    voteState.postValue(vote)
                }, {
                    voteState.postValue(-1)
                    HCLLog.e(it.localizedMessage)
                }))
    }

    fun storeVote(context: Context?, id: String, vote: Int) {
        val pref = context?.getSharedPref() ?: return
        disposable?.add(Flowable.just(pref)
                .map {
                    it.storeVote(gson, id, vote)
                }
                .compose(compose())
                .subscribe({}, {
                    HCLLog.e(it.localizedMessage)
                }))
    }
}