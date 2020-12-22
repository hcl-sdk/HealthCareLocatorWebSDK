package com.ekino.onekeysdk.extensions

import android.content.Context
import android.graphics.BlendMode
import android.graphics.BlendModeColorFilter
import android.graphics.Color
import android.graphics.PorterDuff
import android.graphics.drawable.Drawable
import android.os.Build
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

fun Drawable.setColorFilter(color: Int) {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
        colorFilter = BlendModeColorFilter(color, BlendMode.SRC_ATOP)
    } else {
        setColorFilter(color, PorterDuff.Mode.SRC_ATOP)
    }
}
