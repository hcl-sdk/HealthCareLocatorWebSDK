package com.healthcarelocator.extensions

import androidx.annotation.IntDef

@IntDef(value = [MapService.OSM, MapService.GOOGLE_MAP])
@kotlin.annotation.Retention(AnnotationRetention.SOURCE)
annotation class MapService {
    companion object {
        const val OSM = 0
        const val GOOGLE_MAP = 1
    }
}