package com.ekino.onekeysdk.extensions

import android.content.res.ColorStateList
import android.graphics.Color
import android.graphics.drawable.RippleDrawable
import android.graphics.drawable.ShapeDrawable
import android.graphics.drawable.shapes.RoundRectShape
import android.view.View
import java.util.*

fun View.setRippleBackground(color: Int) {
    val outerRadii = FloatArray(8)
    Arrays.fill(outerRadii, 10f)
    val round = RoundRectShape(outerRadii, null, null)
    val shapeDrawable = ShapeDrawable(round)
    shapeDrawable.paint.color = color
    this.background = RippleDrawable(ColorStateList.valueOf(Color.parseColor("#55000000")),
            shapeDrawable, null)
}

fun View.setRippleCircleBackground(color: Int) {
    val round = RoundRectShape(floatArrayOf(50f, 50f, 50f, 50f, 50f, 50f, 50f, 50f),
            null, floatArrayOf(50f, 50f, 50f, 50f, 50f, 50f, 50f, 50f))
    val shapeDrawable = ShapeDrawable(round)
    shapeDrawable.paint.color = color
    shapeDrawable.paint.alpha = 50
    this.background = RippleDrawable(ColorStateList.valueOf(Color.parseColor("#55000000")),
            shapeDrawable, null)
}

fun View.setRippleBackground(hexColor: String) {
    this.setRippleBackground(hexColor.getColor())
}

fun View.setRippleCircleBackground(hexColor: String) {
    this.setRippleCircleBackground(hexColor.getColor())
}