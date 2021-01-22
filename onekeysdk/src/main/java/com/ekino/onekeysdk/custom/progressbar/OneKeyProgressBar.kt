package com.ekino.onekeysdk.custom.progressbar

import android.content.Context
import android.util.AttributeSet
import android.widget.ProgressBar
import com.ekino.onekeysdk.state.OneKeySDK
import com.ekino.onekeysdk.extensions.getColor
import com.ekino.onekeysdk.extensions.setColorFilter

class OneKeyProgressBar : ProgressBar {
    constructor(context: Context) : super(context) {
        init(null)
    }

    constructor(context: Context, attrs: AttributeSet) : super(context, attrs) {
        init(attrs)
    }

    constructor(context: Context, attrs: AttributeSet, defStyleAttr: Int) : super(context, attrs, defStyleAttr) {
        init(attrs)
    }

    private fun init(attrs: AttributeSet?) {
        val theme = OneKeySDK.getInstance().getConfiguration()
        indeterminateDrawable.setColorFilter(theme.colorPrimary.getColor())
    }
}