package com.ekino.onekeysdk.state

import com.ekino.onekeysdk.model.OneKeySpecialityObject
import com.ekino.onekeysdk.model.config.HCLQueryObject

class HealthCareLocatorService {
    private object Instance {
        val instance: HealthCareLocatorService = HealthCareLocatorService()
    }

    private val runner by lazy { HealthCareLocatorServiceRunner() }

    companion object {
        @JvmStatic
        fun getInstance(): HealthCareLocatorService = Instance.instance
    }

    fun getCodeByLabel(parameters: HCLQueryObject, callback: (ArrayList<OneKeySpecialityObject>) -> Unit) {
        runner.bindView(this)
        runner.getCodeByLabel(parameters) {
            callback(it)
            runner.unbindView()
        }
    }
}