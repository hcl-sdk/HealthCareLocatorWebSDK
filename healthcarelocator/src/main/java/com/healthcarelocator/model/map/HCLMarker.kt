package com.healthcarelocator.model.map

import org.osmdroid.views.MapView
import org.osmdroid.views.overlay.Marker

class HCLMarker(mapView: MapView? = null, var selected: Boolean = false, var distance: Double = 0.0,
                var groupSize: Int = 0) : Marker(mapView) {

    fun getLocationInString(): String = "${position.latitude},${position.longitude}"
}

fun HCLMarker.compareByDistance(marker: HCLMarker): HCLMarker {
    return if (this.distance >= marker.distance) this
    else marker
}