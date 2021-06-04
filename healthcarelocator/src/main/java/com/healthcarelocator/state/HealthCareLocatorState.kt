package com.healthcarelocator.state

import android.content.Context
import androidx.appcompat.app.AppCompatActivity
import com.healthcarelocator.error.HCLException
import com.healthcarelocator.model.config.HealthCareLocatorCustomObject

interface HealthCareLocatorState {
    fun setApiKey(apiKey: String): HealthCareLocatorState
    fun getApiKey(): String
    fun setAppName(appName: String): HealthCareLocatorState
    fun getAppName(): String
    fun setAppDownloadLink(downloadLink: String): HealthCareLocatorState
    fun getAppDownloadLink(): String
    fun setCustomObject(customObject: HealthCareLocatorCustomObject)
    fun getConfiguration(): HealthCareLocatorCustomObject
    fun reverseGeoCoding(context: Context)

    /**
     * startOneKeySDKFragment is used to embed OneKeySDK into your Activity.
     * @param activity is the context where OneKeySDK screens will be running on.
     * @param containerId the area in layout where fragment runs on.
     * @exception [HCLException] if data is invalid.
     */
    @Throws(HCLException::class)
    fun startSDKFragment(activity: AppCompatActivity?, containerId: Int)

    @Throws(HCLException::class)
    fun startSDKActivity(activity: AppCompatActivity?)

    /**
     * get data from services without UI
     */
    fun getServices(context: Context): HealthCareLocatorService
}