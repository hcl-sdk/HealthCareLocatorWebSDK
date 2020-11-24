package com.ekino.onekeysdk.extensions

import android.content.Context
import android.content.res.ColorStateList
import android.graphics.Color
import android.graphics.CornerPathEffect
import android.graphics.Paint
import android.graphics.drawable.Drawable
import android.graphics.drawable.RippleDrawable
import android.graphics.drawable.ShapeDrawable
import android.graphics.drawable.shapes.RoundRectShape
import android.view.View
import androidx.core.content.ContextCompat
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

fun View.setRippleBackground(color: Int, radius: Float) {
    val outerRadii = FloatArray(8)
    Arrays.fill(outerRadii, radius)
    val round = RoundRectShape(outerRadii, null, null)
    val shapeDrawable = ShapeDrawable(round)
    shapeDrawable.paint.color = color
    this.background = RippleDrawable(ColorStateList.valueOf(Color.parseColor("#55000000")),
            shapeDrawable, null)
}

fun View.setRippleBackgroundWithBorder(borderColor: Int, radius: Float) {
    val outerRadii = FloatArray(8)
    Arrays.fill(outerRadii, radius)
    val round = RoundRectShape(outerRadii, null, null)
    val shapeDrawable = ShapeDrawable()
    shapeDrawable.paint.also { paint ->
        paint.style = Paint.Style.STROKE
        paint.strokeJoin = Paint.Join.ROUND
        paint.strokeCap = Paint.Cap.ROUND
        paint.color = borderColor
        paint.strokeWidth = 10f
        paint.isDither = true
        paint.pathEffect = CornerPathEffect(radius * 2f)
        paint.isAntiAlias = true
    }
    this.background = shapeDrawable
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

fun Context.getDrawableById(drawableId: Int): Drawable? =
        ContextCompat.getDrawable(this, drawableId)

fun <T : View> T.postDelay(run: (view: T) -> Unit, time: Long = 0L) {
    this.postDelayed({
        if (this == null) return@postDelayed
        run(this)
    }, time)
}