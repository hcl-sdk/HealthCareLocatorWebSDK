package com.healthcarelocator.extensions

import androidx.annotation.IntDef

@IntDef(value = [ScreenReference.HOME, ScreenReference.HOME_FULL, ScreenReference.SEARCH_NEAR_ME])
@kotlin.annotation.Retention(AnnotationRetention.SOURCE)
annotation class ScreenReference {
    companion object {
        const val HOME = 0
        const val HOME_FULL = 1
        const val SEARCH_NEAR_ME = 2
    }
}