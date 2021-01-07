package com.ekino.onekeysdk.extensions

import android.content.Context
import android.graphics.*
import android.graphics.drawable.Drawable
import android.os.Build
import androidx.core.content.ContextCompat
import androidx.core.graphics.drawable.DrawableCompat
import com.google.android.gms.maps.model.BitmapDescriptor
import com.google.android.gms.maps.model.BitmapDescriptorFactory

fun Context.getDrawableFilledIcon(drawableId: Int, color: Int): Drawable? {
    val unWrappedDrawable = ContextCompat.getDrawable(this, drawableId)
            ?.constantState?.newDrawable()?.mutate()
    return unWrappedDrawable?.apply {
        val wrappedDrawable = DrawableCompat.wrap(unWrappedDrawable)
        DrawableCompat.setTint(wrappedDrawable, color)
    }
}

fun Drawable?.getBitmapDescriptor(): BitmapDescriptor?{
    if (this.isNullable())return null
    val canvas = Canvas()
    val bitmap = Bitmap.createBitmap(this!!.intrinsicWidth, intrinsicHeight, Bitmap.Config.ARGB_8888)
    canvas.setBitmap(bitmap)
    setBounds(0, 0, intrinsicWidth, intrinsicHeight)
    draw(canvas)
    return BitmapDescriptorFactory.fromBitmap(bitmap)
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
