package com.ekino.onekeysdk.extensions

import android.content.Context
import android.graphics.Color
import android.graphics.drawable.Drawable
import androidx.core.content.ContextCompat
import androidx.core.graphics.drawable.DrawableCompat

fun Context.getDrawableFilledIcon(drawableId: Int, color: Int): Drawable? {
    val unWrappedDrawable = ContextCompat.getDrawable(this, drawableId)
    return unWrappedDrawable?.apply {
        val wrappedDrawable = DrawableCompat.wrap(unWrappedDrawable)
        DrawableCompat.setTint(wrappedDrawable, color)
    }
}

fun String.getColor(): Int {
    return if (!this.contains("#")) {
        Color.parseColor("#43B12B")
    } else Color.parseColor(this)
}
