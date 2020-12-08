package com.ekino.onekeysdk.custom.text

import android.content.Context
import android.content.res.TypedArray
import android.graphics.Typeface
import android.text.TextUtils
import android.util.AttributeSet
import androidx.appcompat.widget.AppCompatTextView
import com.ekino.onekeysdk.R
import com.ekino.onekeysdk.custom.IOneKeyView
import com.ekino.onekeysdk.extensions.ThemeExtension
import com.ekino.onekeysdk.extensions.getColor
import com.ekino.onekeysdk.extensions.getEnum
import com.ekino.onekeysdk.model.config.OneKeyViewFontObject
import com.ekino.onekeysdk.utils.FontUtil
import com.ekino.onekeysdk.utils.OneKeyLog

class OneKeyTextView : AppCompatTextView, IOneKeyView {
    enum class OneKeyTextStyle {
        OneKeyStyleDefault, OneKeyStyleTitleMain, OneKeyStyleTitleSecondary,
        OneKeyStyleSearchResultTotal, OneKeyStyleSearchResultTitle, OneKeyStyleResultTitle,
        OneKeyStyleResultSubtitle, OneKeyStyleProfileTitle, OneKeyStyleProfileSubtitle,
        OneKeyStyleProfileTitleSection, OneKeyStyleCardTitle, OneKeyStyleModalTitle,
        OneKeyStyleSearchInput, OneKeyStyleButton, OneKeyStyleSmall, OneKeyStyleSortCriteria
    }

    enum class OneKeyColorStyle {
        OneKeyColorPrimary, OneKeyColorSecondary, OneKeyColorButtonBackground, OneKeyColorButtonAcceptBackground,
        OneKeyColorButtonBorder, OneKeyColorCardBorder, OneKeyColorMarker, OneKeyColorMarkerSelected,
        OneKeyColorViewBackground, OneKeyColorListBackground, OneKeyColorVoteUp, OneKeyColorVoteDown,
        OneKeyColorDark, OneKeyColorGrey, OneKeyColorGreyDark, OneKeyColorGreyDarker,
        OneKeyColorGreyLight, OneKeyColorGreyLighter, NONE
    }

    enum class OneKeyFontWeight { NORMAL, ITALIC, BOLD, BOLD_ITALIC }

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
        var textStyle: OneKeyTextStyle = OneKeyTextStyle.OneKeyStyleDefault
        var colorStyle: OneKeyColorStyle = OneKeyColorStyle.NONE
        var fontWeight = OneKeyFontWeight.NORMAL
        if (attributeSet != null) {
            var typeArray: TypedArray =
                    context.obtainStyledAttributes(attributeSet, R.styleable.OneKeyTextView)
            textStyle = typeArray.getEnum(R.styleable.OneKeyTextView_OneKeyTextStyle, OneKeyTextStyle.OneKeyStyleDefault)
            colorStyle = typeArray.getEnum(R.styleable.OneKeyTextView_OneKeyTextColor, OneKeyColorStyle.NONE)
            fontWeight = typeArray.getEnum(R.styleable.OneKeyTextView_OneKeyFontWeight, OneKeyFontWeight.NORMAL)
            typeArray.recycle()
        }
        mapFontForView(textStyle, forceTextSize)
        mapTextColor(colorStyle)
        includeFontPadding = false
    }

    private fun mapFontForView(textStyle: OneKeyTextStyle, forceTextSize: Boolean = false) {
        when (textStyle) {
            OneKeyTextStyle.OneKeyStyleDefault ->
                setFont(ThemeExtension.getInstance().getThemeConfiguration().fontDefault, forceTextSize)
            OneKeyTextStyle.OneKeyStyleTitleMain ->
                setFont(ThemeExtension.getInstance().getThemeConfiguration().fontTitleMain, forceTextSize)
            OneKeyTextStyle.OneKeyStyleTitleSecondary ->
                setFont(ThemeExtension.getInstance().getThemeConfiguration().fontTitleSecondary, forceTextSize)
            OneKeyTextStyle.OneKeyStyleSearchResultTotal ->
                setFont(ThemeExtension.getInstance().getThemeConfiguration().fontSearchResultTotal, forceTextSize)
            OneKeyTextStyle.OneKeyStyleSearchResultTitle ->
                setFont(ThemeExtension.getInstance().getThemeConfiguration().fontSearchResultTitle, forceTextSize)
            OneKeyTextStyle.OneKeyStyleResultTitle ->
                setFont(ThemeExtension.getInstance().getThemeConfiguration().fontResultTitle, forceTextSize)
            OneKeyTextStyle.OneKeyStyleResultSubtitle ->
                setFont(ThemeExtension.getInstance().getThemeConfiguration().fontResultSubTitle, forceTextSize)
            OneKeyTextStyle.OneKeyStyleProfileTitle ->
                setFont(ThemeExtension.getInstance().getThemeConfiguration().fontProfileTitle, forceTextSize)
            OneKeyTextStyle.OneKeyStyleProfileSubtitle ->
                setFont(ThemeExtension.getInstance().getThemeConfiguration().fontProfileSubTitle, forceTextSize)
            OneKeyTextStyle.OneKeyStyleProfileTitleSection ->
                setFont(ThemeExtension.getInstance().getThemeConfiguration().fontProfileTitleSection, forceTextSize)
            OneKeyTextStyle.OneKeyStyleCardTitle ->
                setFont(ThemeExtension.getInstance().getThemeConfiguration().fontCardTitle, forceTextSize)
            OneKeyTextStyle.OneKeyStyleModalTitle ->
                setFont(ThemeExtension.getInstance().getThemeConfiguration().fontModalTitle, forceTextSize)
            OneKeyTextStyle.OneKeyStyleSearchInput ->
                setFont(ThemeExtension.getInstance().getThemeConfiguration().fontSearchInput, forceTextSize)
            OneKeyTextStyle.OneKeyStyleButton ->
                setFont(ThemeExtension.getInstance().getThemeConfiguration().fontButton, forceTextSize)
            OneKeyTextStyle.OneKeyStyleSmall ->
                setFont(ThemeExtension.getInstance().getThemeConfiguration().fontSmall, forceTextSize)
            OneKeyTextStyle.OneKeyStyleSortCriteria ->
                setFont(ThemeExtension.getInstance().getThemeConfiguration().fontSortCriteria, forceTextSize)
        }
    }

    fun setFont(font: OneKeyViewFontObject, forceTextSize: Boolean = false) {
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

    private fun mapTextColor(colorStyle: OneKeyColorStyle) {
        val theme = ThemeExtension.getInstance().getThemeConfiguration()
        when (colorStyle) {
            OneKeyColorStyle.OneKeyColorPrimary -> setTextColor(theme.colorPrimary.getColor())
            OneKeyColorStyle.OneKeyColorSecondary -> setTextColor(theme.colorSecondary.getColor())
            OneKeyColorStyle.OneKeyColorDark -> setTextColor(theme.colorDark.getColor())
            OneKeyColorStyle.OneKeyColorGrey -> setTextColor(theme.colorGrey.getColor())
            OneKeyColorStyle.OneKeyColorGreyDark -> setTextColor(theme.colorGreyDark.getColor())
            OneKeyColorStyle.OneKeyColorGreyDarker -> setTextColor(theme.colorGreyDarker.getColor())
            OneKeyColorStyle.OneKeyColorGreyLight -> setTextColor(theme.colorGreyLight.getColor())
            OneKeyColorStyle.OneKeyColorGreyLighter -> setTextColor(theme.colorGreyLighter.getColor())
            else -> {
            }
        }
    }

    fun setFont(font: String) {
        try {
            var f = font
            if (TextUtils.isEmpty(f)) {
                f = context.getString(R.string.roboto_regular)
            }
            typeface = f?.let { FontUtil.getFont(context, it) }
        } catch (e: Exception) {
            OneKeyLog.e(e.localizedMessage)
        }
    }

    private fun OneKeyFontWeight.getFontWeight(): Int {
        return when (this) {
            OneKeyFontWeight.NORMAL -> Typeface.NORMAL
            OneKeyFontWeight.BOLD -> Typeface.BOLD
            OneKeyFontWeight.ITALIC -> Typeface.ITALIC
            OneKeyFontWeight.BOLD_ITALIC -> Typeface.BOLD_ITALIC
        }
    }
}