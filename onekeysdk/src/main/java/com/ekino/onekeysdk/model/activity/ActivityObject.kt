package com.ekino.onekeysdk.model.activity

import android.os.Parcel
import android.os.Parcelable
import com.ekino.onekeysdk.extensions.isNullable
import com.ekino.onekeysdk.model.LabelObject
import com.google.gson.annotations.SerializedName
import com.iqvia.onekey.GetActivitiesQuery
import com.iqvia.onekey.GetActivityByIdQuery

class ActivityObject(@SerializedName("id") var id: String = "",
                     @SerializedName("phone") var phone: String = "",
                     @SerializedName("role") var role: LabelObject? = null,
                     @SerializedName("fax") var fax: String = "",
                     @SerializedName("webAddress") var webAddress: String = "",
                     @SerializedName("workplace") var workplace: ActivityWorkplaceObject? = null,
                     @SerializedName("individual") var individual: ActivityIndividualObject? = null,
                     @SerializedName("distance") var distance: Double = 0.0,
                     @SerializedName("createdAt") var createdAt: Long = System.currentTimeMillis(),
                     @SerializedName("createdDate") var createdDate: String = "") : Parcelable, Cloneable {
    constructor(parcel: Parcel) : this(
            parcel.readString() ?: "",
            parcel.readString() ?: "",
            parcel.readParcelable(LabelObject::class.java.classLoader),
            parcel.readString() ?: "",
            parcel.readString() ?: "",
            parcel.readParcelable(ActivityWorkplaceObject::class.java.classLoader),
            parcel.readParcelable(ActivityIndividualObject::class.java.classLoader),
            parcel.readDouble(), parcel.readLong()) {
    }

    override fun writeToParcel(dest: Parcel?, flags: Int) {
        dest?.apply {
            writeString(id)
            writeString(phone)
            writeParcelable(role, Parcelable.PARCELABLE_WRITE_RETURN_VALUE)
            writeString(fax)
            writeString(webAddress)
            writeParcelable(workplace, Parcelable.PARCELABLE_WRITE_RETURN_VALUE)
            writeParcelable(individual, Parcelable.PARCELABLE_WRITE_RETURN_VALUE)
            writeDouble(distance)
            writeLong(createdAt)
        }
    }

    override fun describeContents(): Int {
        return 0
    }

    companion object CREATOR : Parcelable.Creator<ActivityObject> {
        override fun createFromParcel(parcel: Parcel): ActivityObject {
            return ActivityObject(parcel)
        }

        override fun newArray(size: Int): Array<ActivityObject?> {
            return arrayOfNulls(size)
        }
    }

    public override fun clone(): Any {
        val obj = super.clone()
        return if (obj is ActivityObject) obj
        else obj
    }

    /**
     * Convert data from GraphQL
     */
    fun parse(activity: GetActivityByIdQuery.ActivityByID?): ActivityObject {
        if (activity.isNullable()) return this
        this.id = activity!!.id()
        this.phone = activity.phone() ?: ""
        this.fax = activity.fax() ?: ""
        this.webAddress = activity.webAddress() ?: ""
        this.role = LabelObject().parse(activity.role())
        this.workplace = ActivityWorkplaceObject().parse(activity.workplace())
        this.individual = ActivityIndividualObject().parse(activity.individual(),
                OtherActivityObject(id, phone, role, fax, webAddress, workplace))
        return this
    }

    fun parse(data: GetActivitiesQuery.Activity1?): ActivityObject {
        if (data.isNullable()) return this
        this.id = data!!.id()
        this.workplace = ActivityWorkplaceObject().parse(data.workplace())
        this.individual = ActivityIndividualObject().parse(data.individual())
        return this
    }
}