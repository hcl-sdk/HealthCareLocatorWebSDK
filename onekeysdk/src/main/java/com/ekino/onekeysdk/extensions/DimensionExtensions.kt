package com.ekino.onekeysdk.extensions

import android.content.Context

fun Context.pxFromDp(id: Int): Float {
    return resources.getDimension(id) * resources.displayMetrics.density
}

fun Context.getTextSize(size: Int): Float =
        size.div(this.resources.displayMetrics.scaledDensity)

fun Context.getScreenWidth(): Float = resources.displayMetrics.run { widthPixels.div(density) }
fun Context.getScreenHeight(): Float = resources.displayMetrics.run { heightPixels.div(density) }