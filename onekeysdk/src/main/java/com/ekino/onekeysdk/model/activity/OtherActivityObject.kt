package com.ekino.onekeysdk.model.activity

import android.os.Parcel
import android.os.Parcelable
import com.ekino.onekeysdk.model.LabelObject
import com.google.gson.annotations.SerializedName
import java.util.*

class OtherActivityObject(@SerializedName("id") var id: String = "",
                          @SerializedName("phone") var phone: String = "",
                          @SerializedName("role") var role: LabelObject? = null,
                          @SerializedName("fax") var fax: String = "",
                          @SerializedName("webAddress") var webAddress: String = "",
                          @SerializedName("workplace") var workplace: ActivityWorkplaceObject? = null) :
        Parcelable {
    constructor(parcel: Parcel) : this(
            parcel.readString() ?: "", parcel.readString() ?: "",
            parcel.readParcelable(LabelObject::class.java.classLoader),
            parcel.readString() ?: "", parcel.readString() ?: "",
            parcel.readParcelable(ActivityWorkplaceObject::class.java.classLoader)) {
    }

    override fun writeToParcel(dest: Parcel?, flags: Int) {
        dest?.apply {
            writeString(id)
            writeString(phone)
            writeString(fax)
            writeString(webAddress)
            writeParcelable(role, Parcelable.PARCELABLE_WRITE_RETURN_VALUE)
            writeParcelable(workplace, Parcelable.PARCELABLE_WRITE_RETURN_VALUE)
        }
    }

    override fun describeContents(): Int {
        return 0
    }

    companion object CREATOR : Parcelable.Creator<OtherActivityObject> {
        override fun createFromParcel(parcel: Parcel): OtherActivityObject {
            return OtherActivityObject(parcel)
        }

        override fun newArray(size: Int): Array<OtherActivityObject?> {
            return arrayOfNulls(size)
        }
    }

    override fun toString(): String {
        return workplace?.address?.getAddress() ?: ""
    }

    fun addMock(): OtherActivityObject {
        return OtherActivityObject(UUID.randomUUID().toString(), "012345678", null,
                "01234598", "mocked.abc", ActivityWorkplaceObject(UUID.randomUUID().toString(),
                "Pharmasave Casselman Pharmacy Mocked", "012345678", "mock.data@abc.com",
                AddressObject("MOCKED rue Principale", "CA",
                        "K0A 1M0", "The Emporium", LabelObject("", "Ontario"),
                        LabelObject("", "Casselman"), LocationObject(45.6464, -73.3013))))
    }
}