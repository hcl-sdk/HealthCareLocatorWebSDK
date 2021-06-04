package com.healthcarelocator.model.map

import android.os.Parcel
import android.os.Parcelable

class HCLBoundingBox(var position: String = "0.0") : Parcelable {
    constructor(parcel: Parcel) : this(parcel.readString() ?: "") {
    }

    override fun writeToParcel(dest: Parcel?, flags: Int) {
        dest?.apply {
            writeString(position)
        }
    }

    override fun describeContents(): Int = 0

    companion object CREATOR : Parcelable.Creator<HCLBoundingBox> {
        override fun createFromParcel(parcel: Parcel): HCLBoundingBox {
            return HCLBoundingBox(parcel)
        }

        override fun newArray(size: Int): Array<HCLBoundingBox?> {
            return arrayOfNulls(size)
        }
    }
}