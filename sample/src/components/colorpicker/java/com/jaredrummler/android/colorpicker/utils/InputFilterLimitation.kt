package com.jaredrummler.android.colorpicker.utils

import android.text.InputFilter
import android.text.Spanned


class InputFilterLimitation(var min: Int = 0, var max: Int = 0) : InputFilter {
    override fun filter(source: CharSequence?, start: Int, end: Int, dest: Spanned?, p4: Int, p5: Int): CharSequence? {
        try {
            val input: Int = (dest.toString() + source.toString()).toInt()
            if (isInRange(min, max, input)) return null
        } catch (nfe: NumberFormatException) {
        }
        return ""
    }

    private fun isInRange(a: Int, b: Int, c: Int): Boolean {
        return if (b > a) c in a..b else c in b..a
    }
}