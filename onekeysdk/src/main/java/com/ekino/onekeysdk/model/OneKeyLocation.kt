package com.ekino.onekeysdk.model

import android.os.Parcel
import android.os.Parcelable
import org.osmdroid.util.GeoPoint

data class OneKeyLocation(var id: String = "", var name: String = "", var speciality: String = "",
                          var address: String = "", var distance: Int = 0,
                          var latitude: Double = 0.0, var longitude: Double = 0.0,
                          var createdDate: String = "", var title: String = "", var isHCP: Boolean = false,
                          var createdAt: Long = System.currentTimeMillis()) : Parcelable {
    constructor(parcel: Parcel) : this(parcel.readString() ?: "", parcel.readString() ?: "",
            parcel.readString() ?: "", parcel.readString() ?: "",
            parcel.readInt(), parcel.readDouble(), parcel.readDouble(), parcel.readString() ?: "",
            parcel.readString() ?: "", parcel.readInt() == 1, parcel.readLong()) {
    }

    override fun writeToParcel(dest: Parcel?, flags: Int) {
        dest?.apply {
            writeString(id)
            writeString(name)
            writeString(speciality)
            writeString(address)
            writeString(createdDate)
            writeInt(distance)
            writeDouble(latitude)
            writeDouble(longitude)
            writeString(title)
            writeInt(if (isHCP) 1 else 0)
            writeLong(createdAt)
        }
    }

    override fun describeContents(): Int = 0

    companion object CREATOR : Parcelable.Creator<OneKeyLocation> {
        override fun createFromParcel(parcel: Parcel): OneKeyLocation {
            return OneKeyLocation(parcel)
        }

        override fun newArray(size: Int): Array<OneKeyLocation?> {
            return arrayOfNulls(size)
        }
    }

    fun getLocationByString(): String = "$latitude,$longitude"
    fun getLocation(): GeoPoint = GeoPoint(latitude, longitude)

    override fun toString(): String {
        return address
    }
}