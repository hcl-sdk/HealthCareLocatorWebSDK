package com.ekino.onekeysdk.state

import android.content.Context
import androidx.appcompat.app.AppCompatActivity
import com.ekino.onekeysdk.error.OneKeyException
import com.ekino.onekeysdk.model.config.HCLQueryObject
import com.ekino.onekeysdk.model.config.HealthCareLocatorCustomObject

interface HealthCareLocatorState {
    fun setApiKey(apiKey: String): HealthCareLocatorState
    fun getApiKey(): String
    fun setAppName(appName: String): HealthCareLocatorState
    fun getAppName(): String
    fun setAppDownloadLink(downloadLink: String): HealthCareLocatorState
    fun getAppDownloadLink(): String
    fun setCustomObject(customObject: HealthCareLocatorCustomObject)
    fun getConfiguration(): HealthCareLocatorCustomObject

    /**
     * startOneKeySDKFragment is used to embed OneKeySDK into your Activity.
     * @param activity is the context where OneKeySDK screens will be running on.
     * @param containerId the area in layout where fragment runs on.
     * @exception [OneKeyException] if data is invalid.
     */
    @Throws(OneKeyException::class)
    fun startSDKFragment(activity: AppCompatActivity?, containerId: Int)

    @Throws(OneKeyException::class)
    fun startSDKActivity(activity: AppCompatActivity?)

    /**
     * get data from services without UI
     */
    fun getServices(context: Context): HealthCareLocatorService
}