package com.ekino.onekeysdk.utils

import android.util.Log

object OneKeyConstant {
    const val userAgent = "OsmNavigator/2.2"
}

object OneKeyLog {
    fun d(text: String) {
        Log.d("OneKeyLog", text)
    }

    fun e(text: String) {
        Log.e("OneKeyLog", text)
    }
}