package com.healthcarelocator.model.activity

import android.os.Parcel
import android.os.Parcelable
import com.healthcarelocator.extensions.isNullable
import com.healthcarelocator.model.LabelObject
import com.iqvia.onekey.GetActivitiesQuery
import com.iqvia.onekey.GetActivityByIdQuery

class AddressObject(var longLabel: String = "", var country: String = "",
                    var postalCode: String = "", var buildingLabel: String = "", var county: LabelObject? = null,
                    var city: LabelObject? = null, var location: LocationObject? = null,
                    var activityId: String = "") : Parcelable {
    constructor(parcel: Parcel) : this(parcel.readString() ?: "", parcel.readString() ?: "",
            parcel.readString() ?: "", parcel.readString() ?: "",
            parcel.readParcelable(LabelObject::class.java.classLoader),
            parcel.readParcelable(LabelObject::class.java.classLoader),
            parcel.readParcelable(LocationObject::class.java.classLoader),
            parcel.readString() ?: "") {
    }

    override fun writeToParcel(dest: Parcel?, flags: Int) {
        dest?.apply {
            writeString(longLabel)
            writeString(country)
            writeString(postalCode)
            writeString(buildingLabel)
            writeParcelable(county, Parcelable.PARCELABLE_WRITE_RETURN_VALUE)
            writeParcelable(city, Parcelable.PARCELABLE_WRITE_RETURN_VALUE)
            writeParcelable(location, Parcelable.PARCELABLE_WRITE_RETURN_VALUE)
            writeString(activityId)
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
        this.longLabel = data!!.longLabel()
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
        this.longLabel = data!!.longLabel()
        this.country = data.country()
        this.postalCode = data.postalCode()
        this.county = LabelObject().parse(data.county())
        this.city = LabelObject().parse(data.city())
        this.location = LocationObject().parse(data.location())
        return this
    }

    fun parse(data: GetActivityByIdQuery.Address1?, activityId: String): AddressObject {
        if (data.isNullable()) return this
        this.longLabel = data!!.longLabel()
        this.country = data.country()
        this.postalCode = data.postalCode()
        this.county = LabelObject().parse(data.county())
        this.city = LabelObject().parse(data.city())
        this.location = LocationObject().parse(data.location())
        this.activityId = activityId
        return this
    }
}