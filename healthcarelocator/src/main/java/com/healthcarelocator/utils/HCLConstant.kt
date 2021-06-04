package com.healthcarelocator.utils

import android.util.Log

object HCLConstant {
    const val userAgent = "OsmNavigator/2.2"
    const val locations = "locations"
    const val place = "place"
    const val speciality = "speciality"
    const val activeResultScreen = "activeResultScreen"
    const val navigateToProfile = "navigateToProfile"
}

object HCLReceiver {
    const val gpsReceiver = "OneKeyReceiver.gpsReceiver"
}

object HCLLog {
    fun d(text: String) {
        Log.d("HCLLog", text)
    }

    fun e(text: String) {
        Log.e("HCLLog", text)
    }

    fun e(throwable: Throwable) {
        Log.e("HCLLog", "Error::${throwable.localizedMessage}")
    }
}