package com.healthcarelocator.custom.text

import android.content.Context
import android.content.res.TypedArray
import android.text.TextUtils
import android.util.AttributeSet
import android.widget.CheckBox
import com.healthcarelocator.R
import com.healthcarelocator.custom.IOneKeyView
import com.healthcarelocator.state.HealthCareLocatorSDK
import com.healthcarelocator.extensions.getColor
import com.healthcarelocator.extensions.getEnum
import com.healthcarelocator.model.config.HeathCareLocatorViewFontObject
import com.healthcarelocator.utils.FontUtil
import com.healthcarelocator.utils.HCLLog

class HCLCheckBox : CheckBox, IOneKeyView {
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
        var textStyle: HCLTextView.HCLTextStyle = HCLTextView.HCLTextStyle.OneKeyStyleDefault
        var colorStyle: HCLTextView.HCLColorStyle = HCLTextView.HCLColorStyle.NONE
        if (attributeSet != null) {
            var typeArray: TypedArray =
                    context.obtainStyledAttributes(attributeSet, R.styleable.OneKeyTextView)
            textStyle = typeArray.getEnum(R.styleable.OneKeyTextView_OneKeyTextStyle, HCLTextView.HCLTextStyle.OneKeyStyleDefault)
            colorStyle = typeArray.getEnum(R.styleable.OneKeyTextView_OneKeyTextColor, HCLTextView.HCLColorStyle.NONE)
            typeArray.recycle()
        }
        mapFontForView(textStyle, forceTextSize)
        mapTextColor(colorStyle)
        includeFontPadding = false
    }

    private fun mapFontForView(textStyle: HCLTextView.HCLTextStyle, forceTextSize: Boolean = false) {
        when (textStyle) {
            HCLTextView.HCLTextStyle.OneKeyStyleDefault ->
                setFont(HealthCareLocatorSDK.getInstance().getConfiguration().fontDefault, forceTextSize)
            HCLTextView.HCLTextStyle.OneKeyStyleTitleMain ->
                setFont(HealthCareLocatorSDK.getInstance().getConfiguration().fontTitleMain, forceTextSize)
            HCLTextView.HCLTextStyle.OneKeyStyleTitleSecondary ->
                setFont(HealthCareLocatorSDK.getInstance().getConfiguration().fontTitleSecondary, forceTextSize)
            HCLTextView.HCLTextStyle.OneKeyStyleSearchResultTotal ->
                setFont(HealthCareLocatorSDK.getInstance().getConfiguration().fontSearchResultTotal, forceTextSize)
            HCLTextView.HCLTextStyle.OneKeyStyleSearchResultTitle ->
                setFont(HealthCareLocatorSDK.getInstance().getConfiguration().fontSearchResultTitle, forceTextSize)
            HCLTextView.HCLTextStyle.OneKeyStyleResultTitle ->
                setFont(HealthCareLocatorSDK.getInstance().getConfiguration().fontResultTitle, forceTextSize)
            HCLTextView.HCLTextStyle.OneKeyStyleResultSubtitle ->
                setFont(HealthCareLocatorSDK.getInstance().getConfiguration().fontResultSubTitle, forceTextSize)
            HCLTextView.HCLTextStyle.OneKeyStyleProfileTitle ->
                setFont(HealthCareLocatorSDK.getInstance().getConfiguration().fontProfileTitle, forceTextSize)
            HCLTextView.HCLTextStyle.OneKeyStyleProfileSubtitle ->
                setFont(HealthCareLocatorSDK.getInstance().getConfiguration().fontProfileSubTitle, forceTextSize)
            HCLTextView.HCLTextStyle.OneKeyStyleProfileTitleSection ->
                setFont(HealthCareLocatorSDK.getInstance().getConfiguration().fontProfileTitleSection, forceTextSize)
            HCLTextView.HCLTextStyle.OneKeyStyleCardTitle ->
                setFont(HealthCareLocatorSDK.getInstance().getConfiguration().fontCardTitle, forceTextSize)
            HCLTextView.HCLTextStyle.OneKeyStyleModalTitle ->
                setFont(HealthCareLocatorSDK.getInstance().getConfiguration().fontModalTitle, forceTextSize)
            HCLTextView.HCLTextStyle.OneKeyStyleSearchInput ->
                setFont(HealthCareLocatorSDK.getInstance().getConfiguration().fontSearchInput, forceTextSize)
            HCLTextView.HCLTextStyle.OneKeyStyleButton ->
                setFont(HealthCareLocatorSDK.getInstance().getConfiguration().fontButton, forceTextSize)
            HCLTextView.HCLTextStyle.OneKeyStyleSmall ->
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
            HCLLog.e(e.localizedMessage)
        }
    }

    private fun setFontSize(forceTextSize: Boolean = false, size: Int) {
        if (forceTextSize) return
        textSize = size.toFloat()
    }

    private fun mapTextColor(colorStyle: HCLTextView.HCLColorStyle) {
        val theme = HealthCareLocatorSDK.getInstance().getConfiguration()
        when (colorStyle) {
            HCLTextView.HCLColorStyle.OneKeyColorPrimary -> setTextColor(theme.colorPrimary.getColor())
            HCLTextView.HCLColorStyle.OneKeyColorSecondary -> setTextColor(theme.colorSecondary.getColor())
            HCLTextView.HCLColorStyle.OneKeyColorDark -> setTextColor(theme.colorDark.getColor())
            HCLTextView.HCLColorStyle.OneKeyColorGrey -> setTextColor(theme.colorGrey.getColor())
            HCLTextView.HCLColorStyle.OneKeyColorGreyDark -> setTextColor(theme.colorGreyDark.getColor())
            HCLTextView.HCLColorStyle.OneKeyColorGreyDarker -> setTextColor(theme.colorGreyDarker.getColor())
            HCLTextView.HCLColorStyle.OneKeyColorGreyLight -> setTextColor(theme.colorGreyLight.getColor())
            HCLTextView.HCLColorStyle.OneKeyColorGreyLighter -> setTextColor(theme.colorGreyLighter.getColor())
            else -> {
            }
        }
    }
}