package com.ekino.onekeysdk.extensions

import android.content.Context
import android.content.res.Resources

fun Context.pxFromDp(id: Int): Float {
    return resources.getDimension(id) * resources.displayMetrics.density
}

fun Context.getTextSize(size: Int): Float =
        size.div(this.resources.displayMetrics.scaledDensity)

fun getScreenWidth(): Int = Resources.getSystem().displayMetrics.run { widthPixels }
fun getScreenHeight(): Int = Resources.getSystem().displayMetrics.run { heightPixels }