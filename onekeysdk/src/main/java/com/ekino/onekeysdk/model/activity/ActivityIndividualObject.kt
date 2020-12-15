package com.ekino.onekeysdk.model.activity

import android.os.Parcel
import android.os.Parcelable
import com.ekino.onekeysdk.extensions.isNullable
import com.ekino.onekeysdk.model.LabelObject
import com.iqvia.onekey.GetActivityByIdQuery
import java.util.*

class ActivityIndividualObject(var id: String = "", var firstName: String = "", var lastName: String = "",
                               var middleName: String = "", var mailingName: String = "",
                               var specialties: ArrayList<LabelObject> = ArrayList()) : Parcelable {
    constructor(parcel: Parcel) : this(
            parcel.readString() ?: "",
            parcel.readString() ?: "",
            parcel.readString() ?: "",
            parcel.readString() ?: "",
            parcel.readString() ?: "",
            parcel.createTypedArrayList(LabelObject) ?: arrayListOf()) {
    }

    override fun writeToParcel(dest: Parcel?, flags: Int) {
        dest?.apply {
            writeString(id)
            writeString(firstName)
            writeString(lastName)
            writeString(middleName)
            writeString(mailingName)
            writeTypedList(specialties)
        }
    }

    override fun describeContents(): Int {
        return 0
    }

    companion object CREATOR : Parcelable.Creator<ActivityIndividualObject> {
        override fun createFromParcel(parcel: Parcel): ActivityIndividualObject {
            return ActivityIndividualObject(parcel)
        }

        override fun newArray(size: Int): Array<ActivityIndividualObject?> {
            return arrayOfNulls(size)
        }
    }

    /**
     * Convert data from GraphQL
     */
    fun parse(data: GetActivityByIdQuery.Individual?): ActivityIndividualObject {
        if (data.isNullable()) return this
        this.id = data!!.id()
        this.firstName = data.firstName() ?: ""
        this.lastName = data.lastName()
        this.middleName = data.middleName() ?: ""
        this.mailingName = data.mailingName() ?: ""
        this.specialties = arrayListOf<LabelObject>().apply {
            data.specialties().forEach {
                if (it.label().isNotEmpty())
                    add(LabelObject().parse(it))
            }
        }
        return this
    }
}