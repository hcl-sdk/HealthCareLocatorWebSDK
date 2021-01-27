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
import com.ekino.onekeysdk.model.config.HealthCareLocatorCustomObject
import com.ekino.onekeysdk.model.map.OneKeyPlace

class HealthCareLocatorSDK private constructor() : HealthCareLocatorState {
    private object Instance {
        val instance: HealthCareLocatorState = HealthCareLocatorSDK()
    }

    private var config: HealthCareLocatorCustomObject = HealthCareLocatorCustomObject.Builder().build()
    private var appName: String = ""
    private var appDownloadLink: String = ""
    private var apiKey: String = ""

    companion object {
        @JvmStatic
        fun getInstance(): HealthCareLocatorState = Instance.instance
    }

    override fun init(customObject: HealthCareLocatorCustomObject) {
        this.config = customObject
    }

    override fun setAppName(appName: String): HealthCareLocatorState {
        this.appName = appName
        return this
    }

    override fun setApiKey(apiKey: String): HealthCareLocatorState {
        this.apiKey = apiKey
        return this
    }

    override fun setAppDownloadLink(downloadLink: String): HealthCareLocatorState {
        this.appDownloadLink = downloadLink
        return this
    }

    override fun getApiKey(): String {
        return apiKey
    }

    override fun getAppName(): String {
        return appName
    }

    override fun getAppDownloadLink(): String {
        return appDownloadLink
    }

    override fun getConfiguration(): HealthCareLocatorCustomObject = config

    override fun startSDKFragment(activity: AppCompatActivity?, containerId: Int) {
        if (activity.isNullable())
            throw OneKeyException(ErrorReference.ACTIVITY_INVALID,
                    "The provided Activity must NOT be nullable.")
        else if (containerId == 0)
            throw OneKeyException(ErrorReference.ID_INVALID,
                    "The provided containerId must NOT be 0.")
        if (config.mapService == MapService.GOOGLE_MAP &&
                activity?.getMetaDataFromManifest("com.google.android.geo.API_KEY").isNullOrEmpty())
            throw OneKeyException(ErrorReference.DATA_INVALID,
                    "Should provide the map API key for google map service.")
        when (config.screenReference) {
            ScreenReference.SEARCH_NEAR_ME -> {
                if (config.specialities.isEmpty())
                    throw OneKeyException(ErrorReference.DATA_INVALID,
                            "In SEARCH_NEAR_ME mode, the specialities must NOT be empty.")
                activity!!.changeLocale(config.locale)
                activity.pushFragment(
                        containerId, OneKeyNearMeFragment.newInstance(config, "", null,
                        OneKeyPlace(placeId = "near_me", displayName = activity.getString(R.string.hcl_near_me)),
                        config.specialities), true)
            }
//            ScreenReference.HOME_FULL -> activity!!.addFragment(containerId, OneKeyHomeFullFragment.newInstance(), true)
            else -> activity!!.addFragment(containerId, OneKeyHomeMainFragment.newInstance(), true)
        }
    }

    override fun startSDKActivity(activity: AppCompatActivity?) {
        if (activity.isNullable())
            throw OneKeyException(ErrorReference.ACTIVITY_INVALID,
                    "The provided Activity must NOT be nullable.")
        activity!!.startActivity(Intent(activity, OneKeyActivity::class.java))
    }

    override fun getServices(): HealthCareLocatorService {
        return HealthCareLocatorService.getInstance()
    }
}