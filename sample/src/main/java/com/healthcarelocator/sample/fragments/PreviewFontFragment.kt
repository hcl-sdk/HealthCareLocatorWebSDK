package com.healthcarelocator.sample.fragments

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.AdapterView
import android.widget.ArrayAdapter
import androidx.fragment.app.Fragment
import com.ekino.sample.onekeysdk.R
import com.healthcarelocator.model.config.HeathCareLocatorViewFontObject
import com.healthcarelocator.sample.model.FontObject
import com.healthcarelocator.sample.utils.getFonts
import kotlinx.android.synthetic.main.fragment_preview_font.*

class PreviewFontFragment : Fragment(), AdapterView.OnItemSelectedListener, View.OnClickListener {
    companion object {
        fun newInstance(font: HeathCareLocatorViewFontObject, callback: (font: HeathCareLocatorViewFontObject) -> Unit) = PreviewFontFragment().apply {
            this.callback = callback
            this.font = font
        }
    }

    private var callback: (font: HeathCareLocatorViewFontObject) -> Unit = {}
    private var font: HeathCareLocatorViewFontObject = HeathCareLocatorViewFontObject.Builder().build()
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
        initFontWeight()
    }

    private fun initFontName() {
        val selectedFont = fonts.indexOfFirst { it.font == font.fontName }
        ArrayAdapter<FontObject>(requireContext(), android.R.layout.simple_spinner_item, fonts).also {
            it.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
            fontSpinner.adapter = it
        }
        fontSpinner.onItemSelectedListener = this
        fontSpinner.setSelection(selectedFont)
    }

    private fun initFontWeight() {
        val weights = requireContext().resources.getStringArray(R.array.fontWeights)
        ArrayAdapter<String>(requireContext(), android.R.layout.simple_spinner_item, weights).also {
            it.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
            fontWeightSpinner.adapter = it
        }
        fontWeightSpinner.setSelection(font.weight)
        fontWeightSpinner.onItemSelectedListener = this
    }

    private fun initFontSize() {
        val sizes = requireContext().resources.getStringArray(R.array.sizes)
        val selectedSize = sizes.indexOfFirst { it == "${font.size}" }
        ArrayAdapter<String>(requireContext(), android.R.layout.simple_spinner_item, sizes).also {
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
            this@PreviewFontFragment.font.also{
                it.size = fontSize
                it.weight = fontWeightSpinner.selectedItemPosition
            }
            callback(this@PreviewFontFragment.font)
        }
    }

    override fun onNothingSelected(parent: AdapterView<*>?) {

    }

    override fun onItemSelected(parent: AdapterView<*>?, view: View?, position: Int, id: Long) {
        if (parent?.id == fontSizeSpinner.id)
            tvPreview.textSize = (parent?.selectedItem?.toString()?.toInt())?.toFloat() ?: 16f
        else if (parent?.id == fontSpinner.id) {
            tvPreview.setFont(fonts[position].font, fontWeightSpinner.selectedItemPosition)
        } else if (parent?.id == fontWeightSpinner.id) {
            tvPreview.setFont(fonts[fontSpinner.selectedItemPosition].font, position)
        }
    }

    override fun onClick(v: View?) {
        when (v?.id) {
            R.id.btnBack -> activity?.onBackPressed()
        }
    }
}