package com.ekino.onekeysdk.extensions

fun Int.isValidPosition(size: Int) = this in 0..size.minus(1)