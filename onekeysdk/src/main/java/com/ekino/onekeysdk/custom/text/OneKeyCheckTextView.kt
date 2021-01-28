package com.ekino.onekeysdk.custom.text

import android.content.Context
import android.content.res.TypedArray
import android.text.TextUtils
import android.util.AttributeSet
import androidx.appcompat.widget.AppCompatCheckedTextView
import com.ekino.onekeysdk.R
import com.ekino.onekeysdk.custom.IOneKeyView
import com.ekino.onekeysdk.state.HealthCareLocatorSDK
import com.ekino.onekeysdk.extensions.getColor
import com.ekino.onekeysdk.extensions.getEnum
import com.ekino.onekeysdk.model.config.HeathCareLocatorViewFontObject
import com.ekino.onekeysdk.utils.FontUtil
import com.ekino.onekeysdk.utils.OneKeyLog

class OneKeyCheckTextView : AppCompatCheckedTextView, IOneKeyView {
    constructor(context: Context) : super(context) {
        init(null)
    }

    constructor(context: Context, attrs: AttributeSet) : super(context, attrs) {
        init(attrs)
    }

    constructor(context: Context, attrs: AttributeSet, defStyleAttr: Int) : super(
            context,
            attrs,
            defStyleAttr
    ) {
        init(attrs)
    }

    override fun init(attributeSet: AttributeSet?) {
        var forceTextSize = false
        var textStyle: OneKeyTextView.OneKeyTextStyle = OneKeyTextView.OneKeyTextStyle.OneKeyStyleDefault
        var colorStyle: OneKeyTextView.OneKeyColorStyle = OneKeyTextView.OneKeyColorStyle.NONE
        if (attributeSet != null) {
            var typeArray: TypedArray =
                    context.obtainStyledAttributes(attributeSet, R.styleable.OneKeyTextView)
            textStyle = typeArray.getEnum(R.styleable.OneKeyTextView_OneKeyTextStyle, OneKeyTextView.OneKeyTextStyle.OneKeyStyleDefault)
            colorStyle = typeArray.getEnum(R.styleable.OneKeyTextView_OneKeyTextColor, OneKeyTextView.OneKeyColorStyle.NONE)
            typeArray.recycle()
        }
        mapFontForView(textStyle, forceTextSize)
        mapTextColor(colorStyle)
        includeFontPadding = false
    }

    private fun mapFontForView(textStyle: OneKeyTextView.OneKeyTextStyle, forceTextSize: Boolean = false) {
        when (textStyle) {
            OneKeyTextView.OneKeyTextStyle.OneKeyStyleDefault ->
                setFont(HealthCareLocatorSDK.getInstance().getConfiguration().fontDefault, forceTextSize)
            OneKeyTextView.OneKeyTextStyle.OneKeyStyleTitleMain ->
                setFont(HealthCareLocatorSDK.getInstance().getConfiguration().fontTitleMain, forceTextSize)
            OneKeyTextView.OneKeyTextStyle.OneKeyStyleTitleSecondary ->
                setFont(HealthCareLocatorSDK.getInstance().getConfiguration().fontTitleSecondary, forceTextSize)
            OneKeyTextView.OneKeyTextStyle.OneKeyStyleSearchResultTotal ->
                setFont(HealthCareLocatorSDK.getInstance().getConfiguration().fontSearchResultTotal, forceTextSize)
            OneKeyTextView.OneKeyTextStyle.OneKeyStyleSearchResultTitle ->
                setFont(HealthCareLocatorSDK.getInstance().getConfiguration().fontSearchResultTitle, forceTextSize)
            OneKeyTextView.OneKeyTextStyle.OneKeyStyleResultTitle ->
                setFont(HealthCareLocatorSDK.getInstance().getConfiguration().fontResultTitle, forceTextSize)
            OneKeyTextView.OneKeyTextStyle.OneKeyStyleResultSubtitle ->
                setFont(HealthCareLocatorSDK.getInstance().getConfiguration().fontResultSubTitle, forceTextSize)
            OneKeyTextView.OneKeyTextStyle.OneKeyStyleProfileTitle ->
                setFont(HealthCareLocatorSDK.getInstance().getConfiguration().fontProfileTitle, forceTextSize)
            OneKeyTextView.OneKeyTextStyle.OneKeyStyleProfileSubtitle ->
                setFont(HealthCareLocatorSDK.getInstance().getConfiguration().fontProfileSubTitle, forceTextSize)
            OneKeyTextView.OneKeyTextStyle.OneKeyStyleProfileTitleSection ->
                setFont(HealthCareLocatorSDK.getInstance().getConfiguration().fontProfileTitleSection, forceTextSize)
            OneKeyTextView.OneKeyTextStyle.OneKeyStyleCardTitle ->
                setFont(HealthCareLocatorSDK.getInstance().getConfiguration().fontCardTitle, forceTextSize)
            OneKeyTextView.OneKeyTextStyle.OneKeyStyleModalTitle ->
                setFont(HealthCareLocatorSDK.getInstance().getConfiguration().fontModalTitle, forceTextSize)
            OneKeyTextView.OneKeyTextStyle.OneKeyStyleSearchInput ->
                setFont(HealthCareLocatorSDK.getInstance().getConfiguration().fontSearchInput, forceTextSize)
            OneKeyTextView.OneKeyTextStyle.OneKeyStyleButton ->
                setFont(HealthCareLocatorSDK.getInstance().getConfiguration().fontButton, forceTextSize)
            OneKeyTextView.OneKeyTextStyle.OneKeyStyleSmall ->
                setFont(HealthCareLocatorSDK.getInstance().getConfiguration().fontSmall, forceTextSize)
        }
    }

    private fun setFont(font: HeathCareLocatorViewFontObject, forceTextSize: Boolean = false) {
        try {
            var f = font.fontName
            if (TextUtils.isEmpty(f)) {
                f = context.getString(R.string.roboto_regular)
            }
            setTypeface(f?.let { FontUtil.getFont(context, it) }, font.weight)
            setFontSize(forceTextSize, font.size)
        } catch (e: Exception) {
            OneKeyLog.e(e.localizedMessage)
        }
    }

    private fun setFontSize(forceTextSize: Boolean = false, size: Int) {
        if (forceTextSize) return
        textSize = size.toFloat()
    }

    private fun mapTextColor(colorStyle: OneKeyTextView.OneKeyColorStyle) {
        val theme = HealthCareLocatorSDK.getInstance().getConfiguration()
        when (colorStyle) {
            OneKeyTextView.OneKeyColorStyle.OneKeyColorPrimary -> setTextColor(theme.colorPrimary.getColor())
            OneKeyTextView.OneKeyColorStyle.OneKeyColorSecondary -> setTextColor(theme.colorSecondary.getColor())
            OneKeyTextView.OneKeyColorStyle.OneKeyColorDark -> setTextColor(theme.colorDark.getColor())
            OneKeyTextView.OneKeyColorStyle.OneKeyColorGrey -> setTextColor(theme.colorGrey.getColor())
            OneKeyTextView.OneKeyColorStyle.OneKeyColorGreyDark -> setTextColor(theme.colorGreyDark.getColor())
            OneKeyTextView.OneKeyColorStyle.OneKeyColorGreyDarker -> setTextColor(theme.colorGreyDarker.getColor())
            OneKeyTextView.OneKeyColorStyle.OneKeyColorGreyLight -> setTextColor(theme.colorGreyLight.getColor())
            OneKeyTextView.OneKeyColorStyle.OneKeyColorGreyLighter -> setTextColor(theme.colorGreyLighter.getColor())
            else -> {
            }
        }
    }
}