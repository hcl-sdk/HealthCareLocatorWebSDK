package com.healthcarelocator.model.map

import android.os.Parcel
import android.os.Parcelable

class HCLSortObject(var id: String = "", var title: String = "", var selected: Boolean = false) : Parcelable {
    constructor(parcel: Parcel) : this(parcel.readString() ?: "", parcel.readString() ?: "",
            parcel.readInt() == 1)

    override fun writeToParcel(dest: Parcel?, flags: Int) {
        dest?.apply {
            writeString(id)
            writeString(title)
            writeInt(if (selected) 1 else 0)
        }
    }

    override fun describeContents(): Int = 0

    companion object CREATOR : Parcelable.Creator<HCLSortObject> {
        override fun createFromParcel(parcel: Parcel): HCLSortObject {
            return HCLSortObject(parcel)
        }

        override fun newArray(size: Int): Array<HCLSortObject?> {
            return arrayOfNulls(size)
        }
    }
}