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
        var primaryText: Boolean = false
        var boldText: Boolean = false
        var defaultTextSize: Boolean = false
        var forceTextSize = false
        if (attributeSet != null) {
            var typeArray: TypedArray =
                    context.obtainStyledAttributes(attributeSet, R.styleable.OneKeyTextView)
            font = typeArray.getString(R.styleable.OneKeyTextView_setFont)
            primaryText = typeArray.getBoolean(R.styleable.OneKeyTextView_primaryText, false)
            boldText = typeArray.getBoolean(R.styleable.OneKeyTextView_boldText, false)
            forceTextSize = typeArray.getBoolean(R.styleable.OneKeyTextView_forceTextSize, false)
            defaultTextSize = typeArray.getBoolean(R.styleable.OneKeyTextView_defaultTextSize, false)
            typeArray.recycle()
        }
        setFont(font, boldText)
        setFontSize(primaryText, forceTextSize, defaultTextSize)
        includeFontPadding = false
    }

    private fun setFont(font: String?, boldText: Boolean) {
        try {
            var f = if (boldText) ThemeExtension.getInstance().getThemeConfiguration().fontBold
            else ThemeExtension.getInstance().getThemeConfiguration().fontName
            if (TextUtils.isEmpty(f)) {
                f = context.getString(R.string.roboto_regular)
            }
            typeface = f?.let { FontUtil.getFont(context, it) }
        } catch (e: Exception) {

        }
    }

    fun setFontSize(isPrimary: Boolean, forceTextSize: Boolean = false, defaultTextSize: Boolean = false) {
        if (forceTextSize) return
        textSize = when {
            isPrimary -> ThemeExtension.getInstance().getThemeConfiguration().fontTitle1Size.toFloat()
            defaultTextSize -> ThemeExtension.getInstance().getThemeConfiguration().fontDefaultSize.toFloat()
            else -> ThemeExtension.getInstance().getThemeConfiguration().fontTitle2Size.toFloat()
        }
    }

}