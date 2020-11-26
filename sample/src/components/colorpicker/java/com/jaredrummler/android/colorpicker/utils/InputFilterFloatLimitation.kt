package com.jaredrummler.android.colorpicker.utils

import android.text.InputFilter
import android.text.Spanned


class InputFilterFloatLimitation(var min: Float = 0f, var max: Float = 1f) : InputFilter {
    override fun filter(source: CharSequence?, start: Int, end: Int, dest: Spanned?, p4: Int, p5: Int): CharSequence? {
        try {
            val input: Float = (dest.toString() + source.toString()).toFloat()
            if (isInRange(min, max, input)) return null
        } catch (nfe: NumberFormatException) {
        }
        return ""
    }

    private fun isInRange(a: Float, b: Float, c: Float): Boolean {
        return if (b > a) c in a..b else c in b..a
    }
}