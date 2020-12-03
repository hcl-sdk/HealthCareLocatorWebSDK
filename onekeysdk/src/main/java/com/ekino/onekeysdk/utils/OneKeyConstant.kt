package com.ekino.onekeysdk.utils

import android.util.Log

object OneKeyConstant {
    const val userAgent = "OsmNavigator/2.2"
    const val locations = "locations"
    const val place = "place"
    const val speciality = "speciality"
    const val activeResultScreen = "activeResultScreen"
    const val navigateToProfile = "navigateToProfile"
}

object OneKeyLog {
    fun d(text: String) {
        Log.d("OneKeyLog", text)
    }

    fun e(text: String) {
        Log.e("OneKeyLog", text)
    }
}