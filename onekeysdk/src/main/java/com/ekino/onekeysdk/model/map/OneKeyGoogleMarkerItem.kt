package com.ekino.onekeysdk.model.map

import com.google.android.gms.maps.model.LatLng
import com.google.maps.android.clustering.ClusterItem

class OneKeyGoogleMarkerItem(var id: String = "", val mTitle: String = "",
                             var mSnippet: String = "", var mPosition: LatLng) : ClusterItem {
    override fun getSnippet(): String = mSnippet
    override fun getTitle(): String = mTitle
    override fun getPosition(): LatLng = mPosition
}