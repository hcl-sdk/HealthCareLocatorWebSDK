package com.ekino.onekeysdk.extensions

import androidx.annotation.StringDef

@StringDef(value = [StatusReference.SUCCESS, StatusReference.ERROR])
@kotlin.annotation.Retention(AnnotationRetention.SOURCE)
annotation class StatusReference {
    companion object {
        const val SUCCESS = "SUCCESS"
        const val ERROR = "ERROR"
    }
}