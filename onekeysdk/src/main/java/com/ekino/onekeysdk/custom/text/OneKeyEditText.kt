package com.ekino.onekeysdk.custom.text

import android.content.Context
import android.content.res.TypedArray
import android.text.TextUtils
import android.util.AttributeSet
import androidx.appcompat.widget.AppCompatEditText
import com.ekino.onekeysdk.R
import com.ekino.onekeysdk.custom.IOneKeyView
import com.ekino.onekeysdk.extensions.ThemeExtension
import com.ekino.onekeysdk.utils.FontUtil

class OneKeyEditText : AppCompatEditText, IOneKeyView {
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
        if (attributeSet != null) {
            var typeArray: TypedArray =
                    context.obtainStyledAttributes(attributeSet, R.styleable.OneKeyTextView)
            font = typeArray.getString(R.styleable.OneKeyTextView_setFont)
            primaryText = typeArray.getBoolean(R.styleable.OneKeyTextView_primaryText, false)
            typeArray.recycle()
        }
        setFont(font)
        setFontSize(primaryText)
        includeFontPadding = false
    }

    fun setFont(font: String?) {
        try {
            var f = ThemeExtension.getInstance().getThemeConfiguration().font
            if (TextUtils.isEmpty(f)) {
                f = context.getString(R.string.roboto_regular)
            }
            typeface = f?.let { FontUtil.getFont(context, it) }
        } catch (e: Exception) {

        }
    }

    private fun setFontSize(isPrimary: Boolean) {
        textSize = if (isPrimary) {
            ThemeExtension.getInstance().getThemeConfiguration().fontTitleSize.toFloat()
        } else
            ThemeExtension.getInstance().getThemeConfiguration().fontBaseSize.toFloat()
    }

}