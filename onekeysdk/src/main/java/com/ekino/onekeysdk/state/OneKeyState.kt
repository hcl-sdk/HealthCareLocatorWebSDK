package com.ekino.onekeysdk.state

import androidx.appcompat.app.AppCompatActivity
import com.ekino.onekeysdk.model.config.OneKeyCustomObject

interface OneKeyState {
    fun init(customObject: OneKeyCustomObject)
    fun getConfiguration(): OneKeyCustomObject

    /**
     * startOneKeySDKFragment is used to embed OneKeySDK into your Activity.
     * @param activity is the context where OneKeySDK screens will be running on.
     * @param containerId the area in layout where fragment runs on.
     * @exception NullPointerException if [activity] is nullable.
     * @exception IllegalArgumentException if [containerId] is 0.
     */
    fun startOneKeySDKFragment(activity: AppCompatActivity?, containerId: Int)
}