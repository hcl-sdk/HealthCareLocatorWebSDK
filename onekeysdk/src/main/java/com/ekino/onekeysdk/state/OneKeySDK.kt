package com.ekino.onekeysdk.state

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import base.extensions.addFragment
import base.extensions.changeLocale
import base.extensions.pushFragment
import com.ekino.onekeysdk.R
import com.ekino.onekeysdk.activities.OneKeyActivity
import com.ekino.onekeysdk.error.OneKeyException
import com.ekino.onekeysdk.extensions.*
import com.ekino.onekeysdk.fragments.home.OneKeyHomeMainFragment
import com.ekino.onekeysdk.fragments.map.OneKeyNearMeFragment
import com.ekino.onekeysdk.model.config.OneKeyCustomObject
import com.ekino.onekeysdk.model.map.OneKeyPlace

class OneKeySDK private constructor() : OneKeyState {
    private object Instance {
        val instance: OneKeyState = OneKeySDK()
    }

    private var config: OneKeyCustomObject = OneKeyCustomObject.Builder().build()

    companion object {
        @JvmStatic
        fun getInstance(): OneKeyState = Instance.instance
    }

    override fun init(customObject: OneKeyCustomObject) {
        this.config = customObject
    }

    override fun getConfiguration(): OneKeyCustomObject = config

    override fun startOneKeySDKFragment(activity: AppCompatActivity?, containerId: Int) {
        if (activity.isNullable())
            throw OneKeyException(ErrorReference.ACTIVITY_INVALID, "The provided Activity must NOT be nullable.")
        else if (containerId == 0)
            throw OneKeyException(ErrorReference.ID_INVALID, "The provided containerId must NOT be 0.")
        if (config.mapService == MapService.GOOGLE_MAP && activity?.getMetaDataFromManifest("com.google.android.geo.API_KEY").isNullOrEmpty())
            throw OneKeyException(ErrorReference.DATA_INVALID, "Should provide the map API key for google map service.")
        when (config.screenReference) {
            ScreenReference.SEARCH_NEAR_ME -> {
                if (config.specialities.isEmpty())
                    throw OneKeyException(ErrorReference.DATA_INVALID,
                            "In SEARCH_NEAR_ME mode, the specialities must NOT be empty.")
                activity!!.changeLocale(config.locale)
                activity.pushFragment(containerId, OneKeyNearMeFragment.newInstance(config, "", null,
                        OneKeyPlace(placeId = "near_me", displayName = activity.getString(R.string.onekey_sdk_near_me)),
                        config.specialities), true)
            }
//            ScreenReference.HOME_FULL -> activity!!.addFragment(containerId, OneKeyHomeFullFragment.newInstance(), true)
            else -> activity!!.addFragment(containerId, OneKeyHomeMainFragment.newInstance(), true)
        }
    }

    override fun startOneKeySDKActivity(activity: AppCompatActivity?) {
        if (activity.isNullable())
            throw OneKeyException(ErrorReference.ACTIVITY_INVALID, "The provided Activity must NOT be nullable.")
        activity!!.startActivity(Intent(activity, OneKeyActivity::class.java))
    }
}