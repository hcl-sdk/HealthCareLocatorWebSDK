package com.ekino.onekeysdk.model.activity

import android.os.Parcel
import android.os.Parcelable
import com.ekino.onekeysdk.extensions.isNullable
import com.ekino.onekeysdk.model.LabelObject
import com.iqvia.onekey.GetActivitiesQuery
import com.iqvia.onekey.GetActivityByIdQuery

class ActivityObject(var id: String = "", var phone: String = "", var role: LabelObject? = null,
                     var fax: String = "", var webAddress: String = "",
                     var workplace: ActivityWorkplaceObject? = null,
                     var individual: ActivityIndividualObject? = null,
                     var distance: Double = 0.0, var createdAt: Long = System.currentTimeMillis(),
                     var createdDate: String = "") : Parcelable, Cloneable {
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
        this.individual = ActivityIndividualObject().parse(activity.individual())
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