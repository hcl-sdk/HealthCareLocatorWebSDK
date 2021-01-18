package com.ekino.onekeysdk.model.map

import android.content.Context
import android.os.Parcel
import android.os.Parcelable
import com.ekino.onekeysdk.R
import com.google.gson.annotations.SerializedName
import org.osmdroid.util.GeoPoint

class OneKeyPlace(@SerializedName("place_id") var placeId: String = "",
                  @SerializedName("licence") var licence: String = "",
                  @SerializedName("osm_id") var osmId: String = "",
                  @SerializedName("lat") var latitude: String = "0.0",
                  @SerializedName("lon") var longitude: String = "0.0",
                  @SerializedName("display_name") var displayName: String = "",
                  @SerializedName("class") var className: String = "",
                  @SerializedName("type") var type: String = "",
                  @SerializedName("icon") var icon: String = "",
                  @SerializedName("address") var address: OneKeyAddress? = null) : Parcelable {

    constructor(parcel: Parcel) : this(parcel.readString() ?: "", parcel.readString() ?: "",
            parcel.readString() ?: "", parcel.readString() ?: "", parcel.readString() ?: "",
            parcel.readString() ?: "", parcel.readString() ?: "",
            parcel.readString() ?: "", parcel.readString() ?: "",
            parcel.readParcelable(OneKeyAddress::class.java.classLoader)) {
    }

    constructor(context: Context, lat: Double, lng: Double) : this("near_me", latitude = "$lat",
            longitude = "$lng", displayName = context.getString(R.string.onekey_sdk_near_me)) {
    }

    fun getGeoPoint(): GeoPoint = GeoPoint(latitude.toDouble(), longitude.toDouble())
    fun getLocation() {}
    override fun writeToParcel(dest: Parcel?, flags: Int) {
        dest?.apply {
            writeString(placeId)
            writeString(licence)
            writeString(osmId)
            writeString(latitude)
            writeString(longitude)
            writeString(displayName)
            writeString(className)
            writeString(type)
            writeString(icon)
        }
    }

    override fun describeContents(): Int = 0

    companion object CREATOR : Parcelable.Creator<OneKeyPlace> {
        override fun createFromParcel(parcel: Parcel): OneKeyPlace {
            return OneKeyPlace(parcel)
        }

        override fun newArray(size: Int): Array<OneKeyPlace?> {
            return arrayOfNulls(size)
        }
    }
}