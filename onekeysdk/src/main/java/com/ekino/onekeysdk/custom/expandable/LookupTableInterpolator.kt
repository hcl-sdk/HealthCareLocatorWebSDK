package com.ekino.onekeysdk.custom.expandable

import android.view.animation.Interpolator

abstract class LookupTableInterpolator(private val mValues: FloatArray) : Interpolator {
    private val mStepSize: Float = 1f / (mValues.size - 1)

    override fun getInterpolation(input: Float): Float {
        if (input >= 1.0f) {
            return 1.0f
        }
        if (input <= 0f) {
            return 0f
        }
        val position = Math.min((input * (mValues.size - 1)).toInt(), mValues.size - 2)
        val quantized = position * mStepSize
        val diff = input - quantized
        val weight = diff / mStepSize

        return mValues[position] + weight * (mValues[position + 1] - mValues[position])
    }
}
