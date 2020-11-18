package com.ekino.onekeysdk.extensions

import android.view.View

fun Int.isValidPosition(size: Int) = this in 0..size.minus(1)

/**
 * Boolean
 **/
fun Boolean.getVisibility() = if (this) View.VISIBLE else View.GONE