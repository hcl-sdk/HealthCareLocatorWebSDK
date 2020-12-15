package com.ekino.onekeysdk.model

import android.os.Parcel
import android.os.Parcelable
import com.ekino.onekeysdk.extensions.isNullable
import com.iqvia.onekey.GetActivityByIdQuery

class LabelObject(var code: String = "", var label: String = "") : Parcelable {
    constructor(parcel: Parcel) : this(
            parcel.readString() ?: "",
            parcel.readString() ?: "") {
    }

    override fun writeToParcel(dest: Parcel?, flags: Int) {
        dest?.apply {
            writeString(code)
            writeString(label)
        }
    }

    override fun describeContents(): Int {
        return 0
    }

    companion object CREATOR : Parcelable.Creator<LabelObject> {
        override fun createFromParcel(parcel: Parcel): LabelObject {
            return LabelObject(parcel)
        }

        override fun newArray(size: Int): Array<LabelObject?> {
            return arrayOfNulls(size)
        }
    }

    override fun toString(): String {
        return label
    }

    /**
     * Convert data from GraphQL
     */
    fun parse(data: GetActivityByIdQuery.Role?): LabelObject {
        if (data.isNullable()) return this
        this.code = data!!.code()
        this.label = data.label()
        return this
    }

    fun parse(data: GetActivityByIdQuery.County?): LabelObject {
        if (data.isNullable()) return this
        this.label = data!!.label()
        return this
    }

    fun parse(data: GetActivityByIdQuery.City?): LabelObject {
        if (data.isNullable()) return this
        this.label = data!!.label()
        return this
    }

    fun parse(data: GetActivityByIdQuery.Specialty?): LabelObject {
        if (data.isNullable()) return this
        this.label = data!!.label()
        this.code = data.code()
        return this
    }
}