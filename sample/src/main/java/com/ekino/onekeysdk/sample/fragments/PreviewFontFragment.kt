package com.ekino.onekeysdk.sample.fragments

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.AdapterView
import android.widget.ArrayAdapter
import androidx.fragment.app.Fragment
import com.ekino.onekeysdk.R
import com.ekino.onekeysdk.model.config.OneKeyViewFontObject
import com.ekino.onekeysdk.sample.model.FontObject
import com.ekino.onekeysdk.sample.utils.getFonts
import kotlinx.android.synthetic.main.fragment_preview_font.*

class PreviewFontFragment : Fragment(), AdapterView.OnItemSelectedListener, View.OnClickListener {
    companion object {
        fun newInstance(font: OneKeyViewFontObject, callback: (font: OneKeyViewFontObject) -> Unit) = PreviewFontFragment().apply {
            this.callback = callback
            this.font = font
        }
    }

    private var callback: (font: OneKeyViewFontObject) -> Unit = {}
    private var font: OneKeyViewFontObject = OneKeyViewFontObject.Builder().build()
    private val fonts by lazy { getFonts() }

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        return inflater.inflate(R.layout.fragment_preview_font, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        tvTitle.text = "Font ${font.title}"
        btnBack.setOnClickListener(this)
        initFontName()
        initFontSize()
    }

    private fun initFontName() {
        val selectedFont = fonts.indexOfFirst { it.font == font.fontName }
        ArrayAdapter<FontObject>(context!!, android.R.layout.simple_spinner_item, fonts).also {
            it.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
            fontSpinner.adapter = it
        }
        fontSpinner.onItemSelectedListener = this
        fontSpinner.setSelection(selectedFont)
    }

    private fun initFontSize() {
        val sizes = context!!.resources.getStringArray(R.array.sizes)
        val selectedSize = sizes.indexOfFirst { it == "${font.size}" }
        ArrayAdapter<String>(context!!, android.R.layout.simple_spinner_item, sizes).also {
            it.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
            fontSizeSpinner.adapter = it
        }
        fontSizeSpinner.setSelection(selectedSize)
        fontSizeSpinner.onItemSelectedListener = this
    }

    override fun onPause() {
        super.onPause()
        (fontSpinner.selectedItem as? FontObject)?.apply {
            this@PreviewFontFragment.font.fontName = font
            val fontSize = fontSizeSpinner.selectedItem?.toString()?.toInt()
                    ?: this@PreviewFontFragment.font.size
            this@PreviewFontFragment.font.size = fontSize
            callback(this@PreviewFontFragment.font)
        }
    }

    override fun onNothingSelected(parent: AdapterView<*>?) {

    }

    override fun onItemSelected(parent: AdapterView<*>?, view: View?, position: Int, id: Long) {
        if (parent?.id == fontSizeSpinner.id)
            tvPreview.textSize = (parent?.selectedItem?.toString()?.toInt())?.toFloat() ?: 16f
        else if (parent?.id == fontSpinner.id) {
            tvPreview.setFont(fonts[position].font)
        }
    }

    override fun onClick(v: View?) {
        when (v?.id) {
            R.id.btnBack -> activity?.onBackPressed()
        }
    }
}