package com.ekino.onekeysdk.model.activity

import android.os.Parcel
import android.os.Parcelable
import com.ekino.onekeysdk.extensions.isNullable
import com.iqvia.onekey.GetActivitiesQuery
import com.iqvia.onekey.GetActivityByIdQuery
import org.osmdroid.util.GeoPoint

class LocationObject(var lat: Double = 0.0, var lon: Double = 0.0) : Parcelable {
    constructor(parcel: Parcel) : this(
            parcel.readDouble(),
            parcel.readDouble()) {
    }

    override fun writeToParcel(dest: Parcel?, flags: Int) {
        dest?.apply {
            writeDouble(lat)
            writeDouble(lon)
        }
    }

    override fun describeContents(): Int {
        return 0
    }

    companion object CREATOR : Parcelable.Creator<LocationObject> {
        override fun createFromParcel(parcel: Parcel): LocationObject {
            return LocationObject(parcel)
        }

        override fun newArray(size: Int): Array<LocationObject?> {
            return arrayOfNulls(size)
        }
    }

    fun getGeoPoint(): GeoPoint = GeoPoint(lat, lon)

    fun getLocationByString():String = "$lat,$lon"
    /**
     * Convert data from GraphQL
     */
    fun parse(data: GetActivityByIdQuery.Location?): LocationObject {
        if (data.isNullable()) return this
        this.lat = data!!.lat()
        this.lon = data.lon()
        return this
    }

    fun parse(data: GetActivitiesQuery.Location?): LocationObject {
        if (data.isNullable()) return this
        this.lat = data!!.lat()
        this.lon = data.lon()
        return this
    }
}