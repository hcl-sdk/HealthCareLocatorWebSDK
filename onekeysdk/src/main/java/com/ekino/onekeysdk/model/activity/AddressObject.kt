package com.ekino.onekeysdk.model.activity

import android.os.Parcel
import android.os.Parcelable
import com.ekino.onekeysdk.extensions.isNullable
import com.ekino.onekeysdk.model.LabelObject
import com.iqvia.onekey.GetActivitiesQuery
import com.iqvia.onekey.GetActivityByIdQuery

class AddressObject(var id: String = "", var longLabel: String = "", var country: String = "",
                    var postalCode: String = "", var buildingLabel: String = "", var county: LabelObject? = null,
                    var city: LabelObject? = null, var location: LocationObject? = null) : Parcelable {
    constructor(parcel: Parcel) : this(
            parcel.readString() ?: "", parcel.readString() ?: "", parcel.readString() ?: "",
            parcel.readString() ?: "", parcel.readString() ?: "",
            parcel.readParcelable(LabelObject::class.java.classLoader),
            parcel.readParcelable(LabelObject::class.java.classLoader),
            parcel.readParcelable(LocationObject::class.java.classLoader)) {
    }

    override fun writeToParcel(dest: Parcel?, flags: Int) {
        dest?.apply {
            writeString(id)
            writeString(longLabel)
            writeString(country)
            writeString(postalCode)
            writeString(buildingLabel)
            writeParcelable(county, Parcelable.PARCELABLE_WRITE_RETURN_VALUE)
            writeParcelable(city, Parcelable.PARCELABLE_WRITE_RETURN_VALUE)
            writeParcelable(location, Parcelable.PARCELABLE_WRITE_RETURN_VALUE)
        }
    }

    override fun describeContents(): Int {
        return 0
    }

    companion object CREATOR : Parcelable.Creator<AddressObject> {
        override fun createFromParcel(parcel: Parcel): AddressObject {
            return AddressObject(parcel)
        }

        override fun newArray(size: Int): Array<AddressObject?> {
            return arrayOfNulls(size)
        }
    }

    fun getAddress(): String = "${longLabel}, ${city?.label}"

    /**
     * Convert data from GraphQL
     */

    fun parse(data: GetActivityByIdQuery.Address?): AddressObject {
        if (data.isNullable()) return this
        this.id = data!!.id()
        this.longLabel = data.longLabel()
        this.country = data.country()
        this.postalCode = data.postalCode()
        this.buildingLabel = data.buildingLabel() ?: ""
        this.county = LabelObject().parse(data.county())
        this.city = LabelObject().parse(data.city())
        this.location = LocationObject().parse(data.location())
        return this
    }

    fun parse(data: GetActivitiesQuery.Address?): AddressObject {
        if (data.isNullable()) return this
        this.id = data!!.id()
        this.longLabel = data.longLabel()
        this.country = data.country()
        this.postalCode = data.postalCode()
        this.county = LabelObject().parse(data.county())
        this.city = LabelObject().parse(data.city())
        this.location = LocationObject().parse(data.location())
        return this
    }
}