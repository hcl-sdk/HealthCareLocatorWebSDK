package com.healthcarelocator.custom

import android.content.Context
import android.content.res.TypedArray
import android.util.AttributeSet
import android.view.View
import com.healthcarelocator.R
import com.healthcarelocator.custom.text.OneKeyTextView
import com.healthcarelocator.state.HealthCareLocatorSDK
import com.healthcarelocator.extensions.getColor
import com.healthcarelocator.extensions.getEnum

class OneKeyView : View, IOneKeyView {
    constructor(context: Context) : super(context) {
        init(null)
    }

    constructor(context: Context, attrs: AttributeSet) : super(context, attrs) {
        init(attrs)
    }

    constructor(context: Context, attrs: AttributeSet, defStyleAttr: Int) : super(
            context, attrs, defStyleAttr) {
        init(attrs)
    }

    override fun init(attributeSet: AttributeSet?) {
        var colorStyle: OneKeyTextView.OneKeyColorStyle = OneKeyTextView.OneKeyColorStyle.NONE
        if (attributeSet != null) {
            var typeArray: TypedArray =
                    context.obtainStyledAttributes(attributeSet, R.styleable.OneKeyView)
            colorStyle = typeArray.getEnum(R.styleable.OneKeyView_OneKeyViewColor, OneKeyTextView.OneKeyColorStyle.NONE)
            typeArray.recycle()
        }
        mapViewColor(colorStyle)
    }

    private fun mapViewColor(colorStyle: OneKeyTextView.OneKeyColorStyle) {
        val theme = HealthCareLocatorSDK.getInstance().getConfiguration()
        when (colorStyle) {
            OneKeyTextView.OneKeyColorStyle.OneKeyColorPrimary -> setBackgroundColor(theme.colorPrimary.getColor())
            OneKeyTextView.OneKeyColorStyle.OneKeyColorSecondary -> setBackgroundColor(theme.colorSecondary.getColor())
            OneKeyTextView.OneKeyColorStyle.OneKeyColorDark -> setBackgroundColor(theme.colorDark.getColor())
            OneKeyTextView.OneKeyColorStyle.OneKeyColorGrey -> setBackgroundColor(theme.colorGrey.getColor())
            OneKeyTextView.OneKeyColorStyle.OneKeyColorGreyDark -> setBackgroundColor(theme.colorGreyDark.getColor())
            OneKeyTextView.OneKeyColorStyle.OneKeyColorGreyDarker -> setBackgroundColor(theme.colorGreyDarker.getColor())
            OneKeyTextView.OneKeyColorStyle.OneKeyColorGreyLight -> setBackgroundColor(theme.colorGreyLight.getColor())
            OneKeyTextView.OneKeyColorStyle.OneKeyColorGreyLighter -> setBackgroundColor(theme.colorGreyLighter.getColor())
            OneKeyTextView.OneKeyColorStyle.OneKeyColorCardBorder -> setBackgroundColor(theme.colorCardBorder.getColor())
            else -> {
            }
        }
    }
}