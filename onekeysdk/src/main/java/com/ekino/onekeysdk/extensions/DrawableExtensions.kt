package com.ekino.onekeysdk.extensions

import android.content.Context
import android.graphics.drawable.Drawable
import androidx.core.content.ContextCompat
import androidx.core.graphics.drawable.DrawableCompat

fun Context.getDrawableFilledIcon(drawableId: Int, colorId: Int): Drawable? {
    val unWrappedDrawable = ContextCompat.getDrawable(this, drawableId)
    return unWrappedDrawable?.apply {
        val wrappedDrawable = DrawableCompat.wrap(unWrappedDrawable)
        DrawableCompat.setTint(wrappedDrawable, ContextCompat.getColor(this@getDrawableFilledIcon, colorId))
    }
}