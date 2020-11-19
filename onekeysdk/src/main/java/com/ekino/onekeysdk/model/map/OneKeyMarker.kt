package com.ekino.onekeysdk.model.map

import org.osmdroid.views.MapView
import org.osmdroid.views.overlay.Marker

class OneKeyMarker(mapView: MapView? = null, var selected: Boolean = false) : Marker(mapView) {
}