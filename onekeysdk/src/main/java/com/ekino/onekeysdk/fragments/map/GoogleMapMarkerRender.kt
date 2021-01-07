package com.ekino.onekeysdk.fragments.map

import android.content.Context
import com.ekino.onekeysdk.model.map.OneKeyGoogleMarkerItem
import com.google.android.gms.maps.CameraUpdateFactory
import com.google.android.gms.maps.GoogleMap
import com.google.android.gms.maps.model.BitmapDescriptor
import com.google.android.gms.maps.model.MarkerOptions
import com.google.maps.android.clustering.Cluster
import com.google.maps.android.clustering.ClusterManager
import com.google.maps.android.clustering.view.DefaultClusterRenderer

class GoogleMapMarkerRender(val context: Context, private val map: GoogleMap,
                            clusterManager: ClusterManager<OneKeyGoogleMarkerItem>,
                            private val marker: BitmapDescriptor?, private val selectedMarker: BitmapDescriptor?) :
        DefaultClusterRenderer<OneKeyGoogleMarkerItem>(context, map, clusterManager) {
    private var lastItemSelected: OneKeyGoogleMarkerItem? = null

    override fun onBeforeClusterItemRendered(item: OneKeyGoogleMarkerItem?, markerOptions: MarkerOptions?) {
        super.onBeforeClusterItemRendered(item, markerOptions)
        if (lastItemSelected != null && item?.equals(lastItemSelected) == true) {
            markerOptions?.icon(selectedMarker)
        } else markerOptions?.icon(marker)
    }

    override fun shouldRenderAsCluster(cluster: Cluster<OneKeyGoogleMarkerItem>?): Boolean {
        return cluster != null && cluster.size > 1
    }

    fun setMarkerIcon(){
        getMarker(lastItemSelected)?.setIcon(marker)
    }

    fun setSelectedMarkerIcon(item:OneKeyGoogleMarkerItem){
        getMarker(item)?.apply {
            setIcon(selectedMarker)
            setLastItemSelected(item)
            map.animateCamera(CameraUpdateFactory.newLatLngZoom(this.position, map.cameraPosition.zoom))
        }
    }

    fun setLastItemSelected(item: OneKeyGoogleMarkerItem) {
        this.lastItemSelected = item
    }

    fun getLastItemSelected(): OneKeyGoogleMarkerItem? = lastItemSelected
}