package com.ekino.onekeysdk.extensions

import android.content.Context
import android.content.SharedPreferences
import android.content.res.ColorStateList
import android.graphics.Color
import android.graphics.drawable.*
import android.graphics.drawable.shapes.RoundRectShape
import android.view.View
import android.widget.CheckBox
import android.widget.ImageView
import androidx.core.content.ContextCompat
import java.util.*

/**
 * Shared Preferences
 *
 */
fun Context?.getSharedPreferences() =
        this?.getSharedPreferences("OneKeySDK", Context.MODE_PRIVATE)

/**
 * View
 */
fun View.setRippleBackground(color: Int) {
    val outerRadii = FloatArray(8)
    Arrays.fill(outerRadii, 10f)
    val round = RoundRectShape(outerRadii, null, null)
    val shapeDrawable = ShapeDrawable(round)
    shapeDrawable.paint.color = color
    this.background = RippleDrawable(ColorStateList.valueOf(Color.parseColor("#55000000")),
            shapeDrawable, null)
}

fun View.setRippleBackground(color: Int, radius: Float) {
    val outerRadii = FloatArray(8)
    Arrays.fill(outerRadii, radius)
    val round = RoundRectShape(outerRadii, null, null)
    val shapeDrawable = ShapeDrawable(round)
    shapeDrawable.paint.color = color
    this.background = RippleDrawable(ColorStateList.valueOf(Color.parseColor("#55000000")),
            shapeDrawable, null)
}

fun View.setRippleCircleBackground(color: Int) {
    val round = RoundRectShape(floatArrayOf(70f, 70f, 70f, 70f, 70f, 70f, 70f, 70f),
            null, floatArrayOf(70f, 70f, 70f, 70f, 70f, 70f, 70f, 70f))
    val shapeDrawable = ShapeDrawable(round)
    shapeDrawable.paint.color = color
    shapeDrawable.paint.alpha = 50
    this.background = RippleDrawable(ColorStateList.valueOf(Color.parseColor("#55000000")),
            shapeDrawable, null)
}

fun View.setRippleCircleBackground(color: Int, alpha: Int = 255) {
    val round = RoundRectShape(floatArrayOf(70f, 70f, 70f, 70f, 70f, 70f, 70f, 70f),
            null, floatArrayOf(70f, 70f, 70f, 70f, 70f, 70f, 70f, 70f))
    val shapeDrawable = ShapeDrawable(round)
    shapeDrawable.paint.color = color
    shapeDrawable.paint.alpha = alpha
    this.background = RippleDrawable(ColorStateList.valueOf(Color.parseColor("#55000000")),
            shapeDrawable, null)
}

fun View.setRippleBackground(hexColor: String) {
    this.setRippleBackground(hexColor.getColor())
}

fun View.setRippleBackground(hexColor: String, radius: Float) {
    this.setRippleBackground(hexColor.getColor(), radius)
}

fun View.setRippleCircleBackground(hexColor: String) {
    this.setRippleCircleBackground(hexColor.getColor())
}

fun View.setBackgroundWithCorner(backgroundColor: Int, strokeColor: Int, radius: Float = 10f, width: Int = 1) {
    this.background = GradientDrawable().apply {
        cornerRadius = radius
        setColor(backgroundColor)
        setStroke(width, strokeColor)
    }
}

fun CheckBox.setLayerList(normalBackgroundColor: Int, activatedBackgroundColor: Int,
                          strokeColor: Int, strokeWidth: Int, normalIconId: Int, activatedIconId: Int,
                          radius: Float = 12f) {
    val normalIcon = ContextCompat.getDrawable(this.context, normalIconId)
    val activatedIcon = ContextCompat.getDrawable(this.context, activatedIconId)
    val normalDrawable = GradientDrawable().apply {
        cornerRadius = radius
        setColor(normalBackgroundColor)
        setStroke(strokeWidth, strokeColor)
    }
    val activatedDrawable = GradientDrawable().apply {
        cornerRadius = radius
        setColor(activatedBackgroundColor)
        setStroke(strokeWidth, strokeColor)
    }
    val normalInset = InsetDrawable(normalIcon, 20, 10, 20, 10)
    val activatedInset = InsetDrawable(activatedIcon, 20, 10, 20, 10)
    val normalLayer = LayerDrawable(arrayOf(normalDrawable, normalInset))
    val activatedLayer = LayerDrawable(arrayOf(activatedDrawable, activatedInset))
    buttonDrawable = StateListDrawable().apply {
        addState(intArrayOf(android.R.attr.state_checked), activatedLayer)
        addState(intArrayOf(), normalLayer)
    }
}


fun Context.getDrawableById(drawableId: Int): Drawable? =
        ContextCompat.getDrawable(this, drawableId)

fun ImageView.setIconFromDrawableId(drawableId: Int, useColorFilter: Boolean = false, colorFilter: Int = 0) {
    if (useColorFilter) {
        setImageDrawable(context.getDrawableById(drawableId))
        setColorFilter(colorFilter)
    } else
        setImageDrawable(context.getDrawableById(drawableId))
}

fun Context?.getSharedPref(): SharedPreferences? = this?.getSharedPreferences("OneKeySDK", Context.MODE_PRIVATE)

fun <T : View> T.postDelay(run: (view: T) -> Unit, time: Long = 0L) {
    this.postDelayed({
        if (this == null) return@postDelayed
        run(this)
    }, time)
}