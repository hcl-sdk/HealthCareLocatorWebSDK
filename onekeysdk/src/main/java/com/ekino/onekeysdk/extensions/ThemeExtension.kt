package com.ekino.onekeysdk.extensions

import com.ekino.onekeysdk.model.config.OneKeyCustomObject

class ThemeExtension private constructor() {
    private object Instance {
        val instance = ThemeExtension()
    }

    private var config: OneKeyCustomObject = OneKeyCustomObject.Builder().build()

    companion object {
        @JvmStatic
        fun getInstance(): ThemeExtension = Instance.instance
    }

    fun setThemeConfiguration(themeConfiguration: OneKeyCustomObject) {
        this.config = themeConfiguration
    }

    fun getThemeConfiguration(): OneKeyCustomObject = config
}