package com.healthcarelocator.extensions

import androidx.annotation.StringDef

@StringDef(value = [ErrorReference.ACTIVITY_INVALID, ErrorReference.ID_INVALID,
    ErrorReference.DATA_INVALID, ErrorReference.UNKNOWN])
@kotlin.annotation.Retention(AnnotationRetention.SOURCE)
annotation class ErrorReference {
    companion object {
        const val ACTIVITY_INVALID = "OKE-100"
        const val ID_INVALID = "OKE-200"
        const val DATA_INVALID = "OKE-300"
        const val UNKNOWN = "OKE-UNKNOWN"
        const val API_KEY_INVALID = "OKE-API_KEY_INVALID"
    }
}