package com.ekino.onekeysdk.utils

import android.content.Context
import android.graphics.Typeface
import java.util.*

object FontUtil {
    private val fonts = Hashtable<String, Typeface>()

    fun getFont(context: Context, font: String): Typeface? {
        var typeface: Typeface? = fonts[font]
        if (typeface == null) {
            typeface = Typeface.createFromAsset(context.assets, font)
            fonts[font] = typeface
        }
        return typeface
    }
}