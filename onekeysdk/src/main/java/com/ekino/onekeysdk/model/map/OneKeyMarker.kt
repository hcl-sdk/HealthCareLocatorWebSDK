package com.ekino.onekeysdk.model.map

import org.osmdroid.views.MapView
import org.osmdroid.views.overlay.Marker

class OneKeyMarker(mapView: MapView? = null, var selected: Boolean = false, var distance: Double = 0.0) : Marker(mapView) {
}

fun OneKeyMarker.compareByDistance(marker: OneKeyMarker): OneKeyMarker {
    return if (this.distance >= marker.distance) this
    else marker
}