package com.healthcarelocator.custom

import android.content.Context
import android.content.res.TypedArray
import android.util.AttributeSet
import android.view.View
import com.healthcarelocator.R
import com.healthcarelocator.custom.text.HCLTextView
import com.healthcarelocator.state.HealthCareLocatorSDK
import com.healthcarelocator.extensions.getColor
import com.healthcarelocator.extensions.getEnum

class HCLView : View, IOneKeyView {
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
        var colorStyle: HCLTextView.HCLColorStyle = HCLTextView.HCLColorStyle.NONE
        if (attributeSet != null) {
            var typeArray: TypedArray =
                    context.obtainStyledAttributes(attributeSet, R.styleable.OneKeyView)
            colorStyle = typeArray.getEnum(R.styleable.OneKeyView_OneKeyViewColor, HCLTextView.HCLColorStyle.NONE)
            typeArray.recycle()
        }
        mapViewColor(colorStyle)
    }

    private fun mapViewColor(colorStyle: HCLTextView.HCLColorStyle) {
        val theme = HealthCareLocatorSDK.getInstance().getConfiguration()
        when (colorStyle) {
            HCLTextView.HCLColorStyle.OneKeyColorPrimary -> setBackgroundColor(theme.colorPrimary.getColor())
            HCLTextView.HCLColorStyle.OneKeyColorSecondary -> setBackgroundColor(theme.colorSecondary.getColor())
            HCLTextView.HCLColorStyle.OneKeyColorDark -> setBackgroundColor(theme.colorDark.getColor())
            HCLTextView.HCLColorStyle.OneKeyColorGrey -> setBackgroundColor(theme.colorGrey.getColor())
            HCLTextView.HCLColorStyle.OneKeyColorGreyDark -> setBackgroundColor(theme.colorGreyDark.getColor())
            HCLTextView.HCLColorStyle.OneKeyColorGreyDarker -> setBackgroundColor(theme.colorGreyDarker.getColor())
            HCLTextView.HCLColorStyle.OneKeyColorGreyLight -> setBackgroundColor(theme.colorGreyLight.getColor())
            HCLTextView.HCLColorStyle.OneKeyColorGreyLighter -> setBackgroundColor(theme.colorGreyLighter.getColor())
            HCLTextView.HCLColorStyle.OneKeyColorCardBorder -> setBackgroundColor(theme.colorCardBorder.getColor())
            else -> {
            }
        }
    }
}