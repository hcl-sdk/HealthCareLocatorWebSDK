package com.ekino.onekeysdk.sample.view

import android.content.Context
import android.util.AttributeSet
import androidx.appcompat.widget.AppCompatSpinner

class SSpinner : AppCompatSpinner {

    private var lastSelected = 0

    constructor(context: Context) : super(context) {
    }

    constructor(context: Context, attrs: AttributeSet) : super(context, attrs) {
    }

    constructor(context: Context, attrs: AttributeSet, defStyleAttr: Int) : super(
            context,
            attrs,
            defStyleAttr
    ) {
    }

    override fun onLayout(changed: Boolean, l: Int, t: Int, r: Int, b: Int) {
        lastSelected = this.selectedItemPosition
        if (this.lastSelected === this.selectedItemPosition && onItemSelectedListener != null) onItemSelectedListener!!.onItemSelected(this, selectedView, this.selectedItemPosition, selectedItemId)
//        if (!changed) lastSelected = this.selectedItemPosition
        super.onLayout(changed, l, t, r, b)
    }
}