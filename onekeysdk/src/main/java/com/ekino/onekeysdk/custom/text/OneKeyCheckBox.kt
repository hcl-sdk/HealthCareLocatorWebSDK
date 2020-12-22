package com.ekino.onekeysdk.custom.text

import android.content.Context
import android.content.res.TypedArray
import android.text.TextUtils
import android.util.AttributeSet
import android.widget.CheckBox
import com.ekino.onekeysdk.R
import com.ekino.onekeysdk.custom.IOneKeyView
import com.ekino.onekeysdk.extensions.ThemeExtension
import com.ekino.onekeysdk.extensions.getColor
import com.ekino.onekeysdk.extensions.getEnum
import com.ekino.onekeysdk.model.config.OneKeyViewFontObject
import com.ekino.onekeysdk.utils.FontUtil
import com.ekino.onekeysdk.utils.OneKeyLog

class OneKeyCheckBox : CheckBox, IOneKeyView {
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
        var fontWeight = OneKeyTextView.OneKeyFontWeight.NORMAL
        if (attributeSet != null) {
            var typeArray: TypedArray =
                    context.obtainStyledAttributes(attributeSet, R.styleable.OneKeyTextView)
            textStyle = typeArray.getEnum(R.styleable.OneKeyTextView_OneKeyTextStyle, OneKeyTextView.OneKeyTextStyle.OneKeyStyleDefault)
            colorStyle = typeArray.getEnum(R.styleable.OneKeyTextView_OneKeyTextColor, OneKeyTextView.OneKeyColorStyle.NONE)
            fontWeight = typeArray.getEnum(R.styleable.OneKeyTextView_OneKeyFontWeight, OneKeyTextView.OneKeyFontWeight.NORMAL)
            typeArray.recycle()
        }
        mapFontForView(textStyle, forceTextSize)
        mapTextColor(colorStyle)
        includeFontPadding = false
    }

    private fun mapFontForView(textStyle: OneKeyTextView.OneKeyTextStyle, forceTextSize: Boolean = false) {
        when (textStyle) {
            OneKeyTextView.OneKeyTextStyle.OneKeyStyleDefault ->
                setFont(ThemeExtension.getInstance().getThemeConfiguration().fontDefault, forceTextSize)
            OneKeyTextView.OneKeyTextStyle.OneKeyStyleTitleMain ->
                setFont(ThemeExtension.getInstance().getThemeConfiguration().fontTitleMain, forceTextSize)
            OneKeyTextView.OneKeyTextStyle.OneKeyStyleTitleSecondary ->
                setFont(ThemeExtension.getInstance().getThemeConfiguration().fontTitleSecondary, forceTextSize)
            OneKeyTextView.OneKeyTextStyle.OneKeyStyleSearchResultTotal ->
                setFont(ThemeExtension.getInstance().getThemeConfiguration().fontSearchResultTotal, forceTextSize)
            OneKeyTextView.OneKeyTextStyle.OneKeyStyleSearchResultTitle ->
                setFont(ThemeExtension.getInstance().getThemeConfiguration().fontSearchResultTitle, forceTextSize)
            OneKeyTextView.OneKeyTextStyle.OneKeyStyleResultTitle ->
                setFont(ThemeExtension.getInstance().getThemeConfiguration().fontResultTitle, forceTextSize)
            OneKeyTextView.OneKeyTextStyle.OneKeyStyleResultSubtitle ->
                setFont(ThemeExtension.getInstance().getThemeConfiguration().fontResultSubTitle, forceTextSize)
            OneKeyTextView.OneKeyTextStyle.OneKeyStyleProfileTitle ->
                setFont(ThemeExtension.getInstance().getThemeConfiguration().fontProfileTitle, forceTextSize)
            OneKeyTextView.OneKeyTextStyle.OneKeyStyleProfileSubtitle ->
                setFont(ThemeExtension.getInstance().getThemeConfiguration().fontProfileSubTitle, forceTextSize)
            OneKeyTextView.OneKeyTextStyle.OneKeyStyleProfileTitleSection ->
                setFont(ThemeExtension.getInstance().getThemeConfiguration().fontProfileTitleSection, forceTextSize)
            OneKeyTextView.OneKeyTextStyle.OneKeyStyleCardTitle ->
                setFont(ThemeExtension.getInstance().getThemeConfiguration().fontCardTitle, forceTextSize)
            OneKeyTextView.OneKeyTextStyle.OneKeyStyleModalTitle ->
                setFont(ThemeExtension.getInstance().getThemeConfiguration().fontModalTitle, forceTextSize)
            OneKeyTextView.OneKeyTextStyle.OneKeyStyleSearchInput ->
                setFont(ThemeExtension.getInstance().getThemeConfiguration().fontSearchInput, forceTextSize)
            OneKeyTextView.OneKeyTextStyle.OneKeyStyleButton ->
                setFont(ThemeExtension.getInstance().getThemeConfiguration().fontButton, forceTextSize)
            OneKeyTextView.OneKeyTextStyle.OneKeyStyleSmall ->
                setFont(ThemeExtension.getInstance().getThemeConfiguration().fontSmall, forceTextSize)
        }
    }

    private fun setFont(font: OneKeyViewFontObject, forceTextSize: Boolean = false) {
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
        val theme = ThemeExtension.getInstance().getThemeConfiguration()
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