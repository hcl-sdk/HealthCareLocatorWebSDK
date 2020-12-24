package com.ekino.onekeysdk.custom.text

import android.content.Context
import android.content.res.TypedArray
import android.graphics.Typeface
import android.text.TextUtils
import android.util.AttributeSet
import androidx.appcompat.widget.AppCompatTextView
import com.ekino.onekeysdk.R
import com.ekino.onekeysdk.custom.IOneKeyView
import com.ekino.onekeysdk.state.OneKeySDK
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
        if (attributeSet != null) {
            var typeArray: TypedArray =
                    context.obtainStyledAttributes(attributeSet, R.styleable.OneKeyTextView)
            textStyle = typeArray.getEnum(R.styleable.OneKeyTextView_OneKeyTextStyle, OneKeyTextStyle.OneKeyStyleDefault)
            colorStyle = typeArray.getEnum(R.styleable.OneKeyTextView_OneKeyTextColor, OneKeyColorStyle.NONE)
            typeArray.recycle()
        }
        mapFontForView(textStyle, forceTextSize)
        mapTextColor(colorStyle)
        includeFontPadding = false
    }

    private fun mapFontForView(textStyle: OneKeyTextStyle, forceTextSize: Boolean = false) {
        when (textStyle) {
            OneKeyTextStyle.OneKeyStyleDefault ->
                setFont(OneKeySDK.getInstance().getConfiguration().fontDefault, forceTextSize)
            OneKeyTextStyle.OneKeyStyleTitleMain ->
                setFont(OneKeySDK.getInstance().getConfiguration().fontTitleMain, forceTextSize)
            OneKeyTextStyle.OneKeyStyleTitleSecondary ->
                setFont(OneKeySDK.getInstance().getConfiguration().fontTitleSecondary, forceTextSize)
            OneKeyTextStyle.OneKeyStyleSearchResultTotal ->
                setFont(OneKeySDK.getInstance().getConfiguration().fontSearchResultTotal, forceTextSize)
            OneKeyTextStyle.OneKeyStyleSearchResultTitle ->
                setFont(OneKeySDK.getInstance().getConfiguration().fontSearchResultTitle, forceTextSize)
            OneKeyTextStyle.OneKeyStyleResultTitle ->
                setFont(OneKeySDK.getInstance().getConfiguration().fontResultTitle, forceTextSize)
            OneKeyTextStyle.OneKeyStyleResultSubtitle ->
                setFont(OneKeySDK.getInstance().getConfiguration().fontResultSubTitle, forceTextSize)
            OneKeyTextStyle.OneKeyStyleProfileTitle ->
                setFont(OneKeySDK.getInstance().getConfiguration().fontProfileTitle, forceTextSize)
            OneKeyTextStyle.OneKeyStyleProfileSubtitle ->
                setFont(OneKeySDK.getInstance().getConfiguration().fontProfileSubTitle, forceTextSize)
            OneKeyTextStyle.OneKeyStyleProfileTitleSection ->
                setFont(OneKeySDK.getInstance().getConfiguration().fontProfileTitleSection, forceTextSize)
            OneKeyTextStyle.OneKeyStyleCardTitle ->
                setFont(OneKeySDK.getInstance().getConfiguration().fontCardTitle, forceTextSize)
            OneKeyTextStyle.OneKeyStyleModalTitle ->
                setFont(OneKeySDK.getInstance().getConfiguration().fontModalTitle, forceTextSize)
            OneKeyTextStyle.OneKeyStyleSearchInput ->
                setFont(OneKeySDK.getInstance().getConfiguration().fontSearchInput, forceTextSize)
            OneKeyTextStyle.OneKeyStyleButton ->
                setFont(OneKeySDK.getInstance().getConfiguration().fontButton, forceTextSize)
            OneKeyTextStyle.OneKeyStyleSmall ->
                setFont(OneKeySDK.getInstance().getConfiguration().fontSmall, forceTextSize)
            OneKeyTextStyle.OneKeyStyleSortCriteria ->
                setFont(OneKeySDK.getInstance().getConfiguration().fontSortCriteria, forceTextSize)
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
        val theme = OneKeySDK.getInstance().getConfiguration()
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

    fun setFont(font: String, weight: Int = Typeface.NORMAL) {
        try {
            var f = font
            if (TextUtils.isEmpty(f)) {
                f = context.getString(R.string.roboto_regular)
            }
            setTypeface(f?.let { FontUtil.getFont(context, it) }, weight)
        } catch (e: Exception) {
            OneKeyLog.e(e.localizedMessage)
        }
    }
}