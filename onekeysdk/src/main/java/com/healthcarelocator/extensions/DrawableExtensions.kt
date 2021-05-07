package com.healthcarelocator.extensions

import android.content.Context
import android.graphics.*
import android.graphics.drawable.BitmapDrawable
import android.graphics.drawable.Drawable
import android.os.Build
import androidx.core.content.ContextCompat
import androidx.core.graphics.drawable.DrawableCompat
import com.google.android.gms.maps.model.BitmapDescriptor
import com.google.android.gms.maps.model.BitmapDescriptorFactory


fun Context.getDrawableFilledIcon(drawableId: Int, color: Int, size: Int = 1): Drawable? {
    val unWrappedDrawable = ContextCompat.getDrawable(this, drawableId)
            ?.constantState?.newDrawable()?.mutate()
    return unWrappedDrawable?.run {
        val wrappedDrawable = DrawableCompat.wrap(this)
        DrawableCompat.setTint(wrappedDrawable, color)
        if (size > 1)
            drawOnDrawable(this, size)
        else this
    }
}

fun Context.drawOnDrawable(drawable: Drawable?, size: Int = 1): BitmapDrawable? {
    if (drawable.isNullable()) return null
    var w = drawable!!.intrinsicWidth
    w = if (w > 0) w else 1
    var h = drawable.intrinsicHeight
    h = if (h > 0) h else 1
    val bitmap = Bitmap.createBitmap(w, h, Bitmap.Config.ARGB_8888)
    val canvas = Canvas(bitmap)
    drawable.setBounds(0, 0, canvas.width, canvas.height)
    drawable.draw(canvas)
    val circlePaint = Paint().apply {
        style = Paint.Style.FILL
        setColor(Color.WHITE)
    }
    canvas.drawCircle(bitmap.width / 2f, bitmap.height / 2.5f, 20f, circlePaint)

    val paint = Paint()
    paint.style = Paint.Style.FILL
    paint.color = Color.RED
    paint.textSize = 30f
    val text = "$size"
    canvas.drawText(text, bitmap.width / if (text.length > 1) 3f else 2.5f, bitmap.height / 2f, paint)
    return BitmapDrawable(resources, bitmap)
}

fun Drawable?.getBitmapDescriptor(): BitmapDescriptor? {
    if (this.isNullable()) return null
    val canvas = Canvas()
    val bitmap =
            Bitmap.createBitmap(this!!.intrinsicWidth, intrinsicHeight, Bitmap.Config.ARGB_8888)
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
