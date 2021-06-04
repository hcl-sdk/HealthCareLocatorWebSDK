package com.healthcarelocator.model.config

import android.graphics.Typeface
import android.os.Parcel
import android.os.Parcelable

/**
 * OneKeyViewFontObject provides the method(s) to define font and font size for
 * @param id  is default size and text where defining default style already.
 * @param fontName is font family path from assets folder.
 * @param size is font size to make the text small or big.
 */
data class HeathCareLocatorViewFontObject
private constructor(var id: String = "default", var fontName: String = "fonts/Roboto-Regular.ttf",
                    var size: Int = 14, var title: String = "Default", var weight: Int = Typeface.NORMAL) : Parcelable {

    constructor(parcel: Parcel) : this(parcel.readString() ?: "default",
            parcel.readString() ?: "fonts/Roboto-Regular.ttf",
            if (parcel.readInt() == 0) 14 else parcel.readInt(), parcel.readString() ?: "Default",
            parcel.readInt())

    override fun writeToParcel(dest: Parcel?, flags: Int) {
        dest?.apply {
            writeString(id)
            writeString(fontName)
            writeInt(size)
            writeInt(weight)
        }
    }

    data class Builder(var id: String = "default",
                       var fontName: String = "fonts/Roboto-Regular.ttf",
                       var size: Int = 14, var title: String = "Default",
                       var weight: Int = Typeface.NORMAL) {
        fun id(id: String) = apply { this.id = id }
        fun fontName(fontName: String) = apply { this.fontName = fontName }
        fun size(size: Int) = apply { this.size = size }
        fun title(title: String) = apply { this.title = title }
        fun weight(weight: Int) = apply { this.weight = weight }

        fun build() = HeathCareLocatorViewFontObject(id, fontName, size, title, weight)
    }

    companion object CREATOR : Parcelable.Creator<HeathCareLocatorViewFontObject> {
        override fun createFromParcel(parcel: Parcel): HeathCareLocatorViewFontObject {
            return HeathCareLocatorViewFontObject(parcel)
        }

        override fun newArray(size: Int): Array<HeathCareLocatorViewFontObject?> {
            return arrayOfNulls(size)
        }
    }

    override fun describeContents(): Int = 0
}