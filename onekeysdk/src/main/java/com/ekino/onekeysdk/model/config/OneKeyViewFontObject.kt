package com.ekino.onekeysdk.model.config

import android.os.Parcel
import android.os.Parcelable

/**
 * OneKeyViewFontObject provides the method(s) to define font and font size for
 * @param id  is default size and text where defining default style already.
 * @param fontName is font family path from assets folder.
 * @param size is font size to make the text small or big.
 */
data class OneKeyViewFontObject
private constructor(var id: String = "default",
                    var fontName: String = "fonts/Roboto-Regular.ttf",
                    var size: Int = 16,
                    var title: String = "Default") : Parcelable {

    constructor(parcel: Parcel) : this(parcel.readString() ?: "defau[String] lt",
            parcel.readString() ?: "fonts/Roboto-Regular.ttf",
            parcel.readInt() ?: 16, parcel.readString() ?: "Default")

    override fun writeToParcel(dest: Parcel?, flags: Int) {
        dest?.apply {
            writeString(id)
            writeString(fontName)
            writeInt(size)
        }
    }

    data class Builder(var id: String = "default",
                       var fontName: String = "fonts/Roboto-Regular.ttf",
                       var size: Int = 16, var title: String = "Default") {
        fun id(id: String) = apply { this.id = id }
        fun fontName(fontName: String) = apply { this.fontName = fontName }
        fun size(size: Int) = apply { this.size = size }
        fun title(title: String) = apply { this.title = title }

        fun build() = OneKeyViewFontObject(id, fontName, size, title)
    }

    companion object CREATOR : Parcelable.Creator<OneKeyViewFontObject> {
        override fun createFromParcel(parcel: Parcel): OneKeyViewFontObject {
            return OneKeyViewFontObject(parcel)
        }

        override fun newArray(size: Int): Array<OneKeyViewFontObject?> {
            return arrayOfNulls(size)
        }
    }

    override fun describeContents(): Int = 0
}