package com.healthcarelocator.custom.text

import android.content.Context
import android.content.res.TypedArray
import android.graphics.Typeface
import android.text.TextUtils
import android.util.AttributeSet
import androidx.appcompat.widget.AppCompatTextView
import com.healthcarelocator.R
import com.healthcarelocator.custom.IOneKeyView
import com.healthcarelocator.state.HealthCareLocatorSDK
import com.healthcarelocator.extensions.getColor
import com.healthcarelocator.extensions.getEnum
import com.healthcarelocator.model.config.HeathCareLocatorViewFontObject
import com.healthcarelocator.utils.FontUtil
import com.healthcarelocator.utils.HCLLog

class HCLTextView : AppCompatTextView, IOneKeyView {
    enum class HCLTextStyle {
        OneKeyStyleDefault, OneKeyStyleTitleMain, OneKeyStyleTitleSecondary,
        OneKeyStyleSearchResultTotal, OneKeyStyleSearchResultTitle, OneKeyStyleResultTitle,
        OneKeyStyleResultSubtitle, OneKeyStyleProfileTitle, OneKeyStyleProfileSubtitle,
        OneKeyStyleProfileTitleSection, OneKeyStyleCardTitle, OneKeyStyleModalTitle,
        OneKeyStyleSearchInput, OneKeyStyleButton, OneKeyStyleSmall, OneKeyStyleSortCriteria,
        OneKeyStyleNoResultTitle, OneKeyStyleNoResultDesc
    }

    enum class HCLColorStyle {
        OneKeyColorPrimary, OneKeyColorSecondary, OneKeyColorButtonBackground, OneKeyColorButtonAcceptBackground,
        OneKeyColorButtonBorder, OneKeyColorCardBorder, OneKeyColorMarker, OneKeyColorMarkerSelected,
        OneKeyColorViewBackground, OneKeyColorListBackground, OneKeyColorVoteUp, OneKeyColorVoteDown,
        OneKeyColorDark, OneKeyColorGrey, OneKeyColorGreyDark, OneKeyColorGreyDarker,
        OneKeyColorGreyLight, OneKeyColorGreyLighter, NONE
    }

    constructor(context: Context) : super(context) {
        init(null)
    }

    constructor(context: Context, attrs: AttributeSet) : super(context, attrs) {
        init(attrs)
    }

    constructor(context: Context, attrs: AttributeSet, defStyleAttr: Int) : super(context, attrs, defStyleAttr) {
        init(attrs)
    }

    override fun init(attributeSet: AttributeSet?) {
        var forceTextSize = false
        var textStyle: HCLTextStyle = HCLTextStyle.OneKeyStyleDefault
        var colorStyle: HCLColorStyle = HCLColorStyle.NONE
        if (attributeSet != null) {
            var typeArray: TypedArray =
                    context.obtainStyledAttributes(attributeSet, R.styleable.OneKeyTextView)
            textStyle = typeArray.getEnum(R.styleable.OneKeyTextView_OneKeyTextStyle, HCLTextStyle.OneKeyStyleDefault)
            colorStyle = typeArray.getEnum(R.styleable.OneKeyTextView_OneKeyTextColor, HCLColorStyle.NONE)
            typeArray.recycle()
        }
        mapFontForView(textStyle, forceTextSize)
        mapTextColor(colorStyle)
        includeFontPadding = false
    }

    private fun mapFontForView(textStyle: HCLTextStyle, forceTextSize: Boolean = false) {
        when (textStyle) {
            HCLTextStyle.OneKeyStyleDefault ->
                setFont(HealthCareLocatorSDK.getInstance().getConfiguration().fontDefault, forceTextSize)
            HCLTextStyle.OneKeyStyleTitleMain ->
                setFont(HealthCareLocatorSDK.getInstance().getConfiguration().fontTitleMain, forceTextSize)
            HCLTextStyle.OneKeyStyleTitleSecondary ->
                setFont(HealthCareLocatorSDK.getInstance().getConfiguration().fontTitleSecondary, forceTextSize)
            HCLTextStyle.OneKeyStyleSearchResultTotal ->
                setFont(HealthCareLocatorSDK.getInstance().getConfiguration().fontSearchResultTotal, forceTextSize)
            HCLTextStyle.OneKeyStyleSearchResultTitle ->
                setFont(HealthCareLocatorSDK.getInstance().getConfiguration().fontSearchResultTitle, forceTextSize)
            HCLTextStyle.OneKeyStyleResultTitle ->
                setFont(HealthCareLocatorSDK.getInstance().getConfiguration().fontResultTitle, forceTextSize)
            HCLTextStyle.OneKeyStyleResultSubtitle ->
                setFont(HealthCareLocatorSDK.getInstance().getConfiguration().fontResultSubTitle, forceTextSize)
            HCLTextStyle.OneKeyStyleProfileTitle ->
                setFont(HealthCareLocatorSDK.getInstance().getConfiguration().fontProfileTitle, forceTextSize)
            HCLTextStyle.OneKeyStyleProfileSubtitle ->
                setFont(HealthCareLocatorSDK.getInstance().getConfiguration().fontProfileSubTitle, forceTextSize)
            HCLTextStyle.OneKeyStyleProfileTitleSection ->
                setFont(HealthCareLocatorSDK.getInstance().getConfiguration().fontProfileTitleSection, forceTextSize)
            HCLTextStyle.OneKeyStyleCardTitle ->
                setFont(HealthCareLocatorSDK.getInstance().getConfiguration().fontCardTitle, forceTextSize)
            HCLTextStyle.OneKeyStyleModalTitle ->
                setFont(HealthCareLocatorSDK.getInstance().getConfiguration().fontModalTitle, forceTextSize)
            HCLTextStyle.OneKeyStyleSearchInput ->
                setFont(HealthCareLocatorSDK.getInstance().getConfiguration().fontSearchInput, forceTextSize)
            HCLTextStyle.OneKeyStyleButton ->
                setFont(HealthCareLocatorSDK.getInstance().getConfiguration().fontButton, forceTextSize)
            HCLTextStyle.OneKeyStyleSmall ->
                setFont(HealthCareLocatorSDK.getInstance().getConfiguration().fontSmall, forceTextSize)
            HCLTextStyle.OneKeyStyleSortCriteria ->
                setFont(HealthCareLocatorSDK.getInstance().getConfiguration().fontSortCriteria, forceTextSize)
            HCLTextStyle.OneKeyStyleNoResultTitle ->
                setFont(HealthCareLocatorSDK.getInstance().getConfiguration().fontNoResultTitle, forceTextSize)
            HCLTextStyle.OneKeyStyleNoResultDesc ->
                setFont(HealthCareLocatorSDK.getInstance().getConfiguration().fontNoResultDesc, forceTextSize)
        }
    }

    fun setFont(font: HeathCareLocatorViewFontObject, forceTextSize: Boolean = false) {
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

    private fun mapTextColor(colorStyle: HCLColorStyle) {
        val theme = HealthCareLocatorSDK.getInstance().getConfiguration()
        when (colorStyle) {
            HCLColorStyle.OneKeyColorPrimary -> setTextColor(theme.colorPrimary.getColor())
            HCLColorStyle.OneKeyColorSecondary -> setTextColor(theme.colorSecondary.getColor())
            HCLColorStyle.OneKeyColorDark -> setTextColor(theme.colorDark.getColor())
            HCLColorStyle.OneKeyColorGrey -> setTextColor(theme.colorGrey.getColor())
            HCLColorStyle.OneKeyColorGreyDark -> setTextColor(theme.colorGreyDark.getColor())
            HCLColorStyle.OneKeyColorGreyDarker -> setTextColor(theme.colorGreyDarker.getColor())
            HCLColorStyle.OneKeyColorGreyLight -> setTextColor(theme.colorGreyLight.getColor())
            HCLColorStyle.OneKeyColorGreyLighter -> setTextColor(theme.colorGreyLighter.getColor())
            else -> {
            }
        }
    }

    fun setFont(font: String, weight: Int = Typeface.NORMAL) {
        try {
            var f = font
            if (TextUtils.isEmpty(f)) {
                f = context.getString(R.string.roboto_regular)
            }
            setTypeface(f?.let { FontUtil.getFont(context, it) }, weight)
        } catch (e: Exception) {
            HCLLog.e(e.localizedMessage)
        }
    }
}