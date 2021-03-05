package com.ekino.onekeysdk.model.map

import android.content.Context
import android.os.Parcel
import android.os.Parcelable
import com.ekino.onekeysdk.R
import com.ekino.onekeysdk.extensions.isNotNullAndEmpty
import com.ekino.onekeysdk.extensions.isNotNullable
import com.google.gson.annotations.SerializedName
import com.iqvia.onekey.type.GeopointQuery
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
                  @SerializedName("address") var address: OneKeyAddress? = null,
                  var distance: Double = 0.0,
                  @SerializedName("boundingbox") var boundingBox: ArrayList<String> = arrayListOf()) : Parcelable {

    constructor(parcel: Parcel) : this(parcel.readString() ?: "", parcel.readString() ?: "",
            parcel.readString() ?: "", parcel.readString() ?: "", parcel.readString() ?: "",
            parcel.readString() ?: "", parcel.readString() ?: "",
            parcel.readString() ?: "", parcel.readString() ?: "",
            parcel.readParcelable(OneKeyAddress::class.java.classLoader), parcel.readDouble()) {
    }

    constructor(context: Context, lat: Double, lng: Double) : this("near_me", latitude = "$lat",
            longitude = "$lng", displayName = context.getString(R.string.hcl_near_me)) {
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
            writeDouble(distance)
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

    fun getBox(): DoubleArray = doubleArrayOf(0.0, 0.0, 0.0, 0.0).apply {
        boundingBox.forEachIndexed { index, position ->
            if (index <= this.size - 1) {
                this[index] = position.toDouble()
            }
        }
    }

    fun getDistanceMeter(): Double = if (address.isNotNullable() &&
            (address!!.road.isNotNullAndEmpty() || address!!.city.isNotNullAndEmpty())) {
        distance
    } else 0.0
}