package com.ekino.onekeysdk.state

import androidx.appcompat.app.AppCompatActivity
import base.extensions.addFragment
import com.ekino.onekeysdk.extensions.isNullable
import com.ekino.onekeysdk.fragments.OneKeyHomeFragment
import com.ekino.onekeysdk.fragments.OneKeyHomeFullFragment
import com.ekino.onekeysdk.model.config.OneKeyCustomObject

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
            throw NullPointerException("The provided Activity must NOT be nullable.")
        else if (containerId == 0)
            throw IllegalArgumentException("The provided containerId must NOT be 0.")
        if (config.homeMode == 1)
            activity!!.addFragment(containerId, OneKeyHomeFragment.newInstance(), true)
        else activity!!.addFragment(containerId, OneKeyHomeFullFragment.newInstance(), true)

    }
}