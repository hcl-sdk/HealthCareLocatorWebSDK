package com.ekino.onekeysdk.model.map

import com.google.android.gms.maps.model.LatLng
import com.google.maps.android.clustering.ClusterItem

class OneKeyClusterObject(private val latLng: LatLng, private val title: String,
                          private val snippet: String) : ClusterItem {
    override fun getSnippet(): String {
        return ""
    }

    override fun getTitle(): String {
        return title
    }

    override fun getPosition(): LatLng {
        return latLng
    }
}