package com.ekino.onekeysdk.viewmodel.profile

import androidx.lifecycle.MutableLiveData
import base.extensions.runOnUiThread
import base.viewmodel.ApolloViewModel
import com.ekino.onekeysdk.extensions.ThemeExtension
import com.ekino.onekeysdk.extensions.isNullable
import com.ekino.onekeysdk.fragments.profile.OneKeyProfileFragment
import com.ekino.onekeysdk.model.activity.ActivityObject
import com.ekino.onekeysdk.utils.OneKeyLog
import com.iqvia.onekey.GetActivityByIdQuery

class OneKeyProfileViewModel : ApolloViewModel<OneKeyProfileFragment>() {
    private val theme = ThemeExtension.getInstance().getThemeConfiguration()
    val activity by lazy { MutableLiveData<ActivityObject>() }
    val loading by lazy { MutableLiveData<Boolean>() }

    fun getDetailActivity(id: String) {
        loading.postValue(true)
        query({
            GetActivityByIdQuery.builder().id(id).apiKey(theme.apiKey).locale(theme.locale).build()
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
            OneKeyLog.e(it.localizedMessage)
            loading.postValue(false)
        }, true)
    }
}