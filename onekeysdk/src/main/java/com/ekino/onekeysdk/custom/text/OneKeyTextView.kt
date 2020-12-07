package com.ekino.onekeysdk.custom.text

import android.content.Context
import android.content.res.TypedArray
import android.text.TextUtils
import android.util.AttributeSet
import androidx.appcompat.widget.AppCompatTextView
import com.ekino.onekeysdk.R
import com.ekino.onekeysdk.custom.IOneKeyView
import com.ekino.onekeysdk.extensions.ThemeExtension
import com.ekino.onekeysdk.utils.FontUtil
import com.ekino.onekeysdk.utils.OneKeyLog

class OneKeyTextView : AppCompatTextView, IOneKeyView {
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
        var font: String? = ""
        var boldText: Boolean = false
        var smallStyle: Boolean = false
        var forceTextSize = false

        var title1Style = false
        var title2Style = false
        var title3Style = false
        var searchInputStyle = false
        var buttonStyle = false
        if (attributeSet != null) {
            var typeArray: TypedArray =
                    context.obtainStyledAttributes(attributeSet, R.styleable.OneKeyTextView)
            font = typeArray.getString(R.styleable.OneKeyTextView_setFont)
            boldText = typeArray.getBoolean(R.styleable.OneKeyTextView_boldText, false)
            forceTextSize = typeArray.getBoolean(R.styleable.OneKeyTextView_forceTextSize, false)
            smallStyle = typeArray.getBoolean(R.styleable.OneKeyTextView_smallStyle, false)

            title1Style = typeArray.getBoolean(R.styleable.OneKeyTextView_title1Style, false)
            title2Style = typeArray.getBoolean(R.styleable.OneKeyTextView_title2Style, false)
            title3Style = typeArray.getBoolean(R.styleable.OneKeyTextView_title3Style, false)
            searchInputStyle = typeArray.getBoolean(R.styleable.OneKeyTextView_searchInputStyle, false)
            buttonStyle = typeArray.getBoolean(R.styleable.OneKeyTextView_OneKey_buttonStyle, false)
            typeArray.recycle()
        }
        setFont(boldText, title1Style, title2Style, title3Style, buttonStyle, smallStyle, searchInputStyle)
        setFontSize(forceTextSize, smallStyle, title1Style, title2Style, title3Style, buttonStyle, searchInputStyle)
        includeFontPadding = false
    }

    fun setFont(boldText: Boolean, title1Style: Boolean, title2Style: Boolean, title3Style: Boolean,
                        buttonStyle: Boolean, smallStyle: Boolean, searchInputStyle: Boolean) {
        try {
            var f = if (boldText) ThemeExtension.getInstance().getThemeConfiguration().fontBold
            else {
                when {
                    title1Style -> ThemeExtension.getInstance().getThemeConfiguration().fontTitle1Size.fontName
                    title2Style -> ThemeExtension.getInstance().getThemeConfiguration().fontTitle2Size.fontName
                    title3Style -> ThemeExtension.getInstance().getThemeConfiguration().fontTitle3Size.fontName
                    searchInputStyle -> ThemeExtension.getInstance().getThemeConfiguration().fontSearchInput.fontName
                    buttonStyle -> ThemeExtension.getInstance().getThemeConfiguration().fontButton.fontName
                    smallStyle -> ThemeExtension.getInstance().getThemeConfiguration().fontSmall.fontName
                    else -> ThemeExtension.getInstance().getThemeConfiguration().fontDefault.fontName
                }
            }
            if (TextUtils.isEmpty(f)) {
                f = context.getString(R.string.roboto_regular)
            }
            typeface = f?.let { FontUtil.getFont(context, it) }
        } catch (e: Exception) {
            OneKeyLog.e(e.localizedMessage)
        }
    }

    private fun setFontSize(forceTextSize: Boolean = false, smallStyle: Boolean = false,
                            title1Style: Boolean, title2Style: Boolean, title3Style: Boolean,
                            buttonStyle: Boolean, searchInputStyle: Boolean) {
        if (forceTextSize) return
        textSize = when {
            title1Style -> ThemeExtension.getInstance().getThemeConfiguration().fontTitle1Size.size.toFloat()
            title2Style -> ThemeExtension.getInstance().getThemeConfiguration().fontTitle2Size.size.toFloat()
            title3Style -> ThemeExtension.getInstance().getThemeConfiguration().fontTitle3Size.size.toFloat()
            buttonStyle -> ThemeExtension.getInstance().getThemeConfiguration().fontButton.size.toFloat()
            searchInputStyle -> ThemeExtension.getInstance().getThemeConfiguration().fontSearchInput.size.toFloat()
            smallStyle -> ThemeExtension.getInstance().getThemeConfiguration().fontSmall.size.toFloat()
            else -> ThemeExtension.getInstance().getThemeConfiguration().fontDefault.size.toFloat()
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

}