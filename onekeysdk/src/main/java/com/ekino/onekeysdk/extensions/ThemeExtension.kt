package com.ekino.onekeysdk.extensions

import com.ekino.onekeysdk.model.config.OneKeyViewCustomObject

class ThemeExtension private constructor() {
    private object Instance {
        val instance = ThemeExtension()
    }

    private var config: OneKeyViewCustomObject = OneKeyViewCustomObject.Builder().build()

    companion object {
        @JvmStatic
        fun getInstance(): ThemeExtension = Instance.instance
    }

    fun setThemeConfiguration(themeConfiguration: OneKeyViewCustomObject) {
        this.config = themeConfiguration
    }

    fun getThemeConfiguration(): OneKeyViewCustomObject = config
}