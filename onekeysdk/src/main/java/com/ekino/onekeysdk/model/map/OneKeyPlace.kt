package com.ekino.onekeysdk.model.map

import com.google.gson.annotations.SerializedName
import org.osmdroid.util.GeoPoint

class OneKeyPlace(
        @SerializedName("place_id") var placeId: String = "",
        @SerializedName("licence") var licence: String = "",
        @SerializedName("osm_id") var osmId: String = "",
        @SerializedName("lat") var latitude: String = "0.0",
        @SerializedName("lon") var longitude: String = "0.0",
        @SerializedName("display_name") var displayName: String = "",
        @SerializedName("class") var className: String = "",
        @SerializedName("type") var type: String = "",
        @SerializedName("icon") var icon: String = "",
        @SerializedName("address") var address: OneKeyAddress? = null) {

    fun getGeoPoint(): GeoPoint = GeoPoint(latitude.toDouble(), longitude.toDouble())
    fun getLocation() {}
}