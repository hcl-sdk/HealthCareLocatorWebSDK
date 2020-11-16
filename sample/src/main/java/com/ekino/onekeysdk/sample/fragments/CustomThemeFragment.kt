package com.ekino.onekeysdk.sample.fragments

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.AdapterView
import android.widget.ArrayAdapter
import androidx.core.content.edit
import base.fragments.IFragment
import com.ekino.onekeysdk.R
import com.ekino.onekeysdk.extensions.getColor
import com.ekino.onekeysdk.sample.SampleApplication
import com.ekino.onekeysdk.sample.model.FontObject
import com.ekino.onekeysdk.sample.model.ThemeObject
import com.ekino.onekeysdk.sample.utils.Pref
import com.ekino.onekeysdk.sample.utils.getFonts
import com.github.dhaval2404.colorpicker.MaterialColorPickerDialog
import com.github.dhaval2404.colorpicker.model.ColorShape
import kotlinx.android.synthetic.main.fragment_custom_theme.*

class CustomThemeFragment(val themeObject: ThemeObject, val callback: (theme: ThemeObject) -> Unit) :
        IFragment(), AdapterView.OnItemSelectedListener {

    companion object {
        fun newInstance(themeObject: ThemeObject, callback: (theme: ThemeObject) -> Unit) =
                CustomThemeFragment(themeObject.clone() as ThemeObject, callback)
    }

    private val fonts by lazy { getFonts() }

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        return inflater.inflate(R.layout.fragment_custom_theme, container, false)
    }


    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        btnBack.setOnClickListener { activity?.onBackPressed() }
        val selectedFont = (SampleApplication.sharedPreferences.getString(Pref.fontId, "Roboto")
                ?: "Roboto").run {
            fonts.indexOfFirst { it.id == this }
        }
        ArrayAdapter<FontObject>(context!!, android.R.layout.simple_spinner_item, fonts).also {
            it.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
            fontSpinner.adapter = it
        }
        fontSpinner.onItemSelectedListener = this
        fontSpinner.setSelection(selectedFont)

        btnApply.setOnClickListener {
            (fontSpinner.selectedItem as? FontObject)?.also { font ->
                SampleApplication.sharedPreferences.edit {
                    putString(Pref.fontId, font.id)
                    putString(Pref.fontRef, font.font)
                    putInt(Pref.fontBase, themeObject.fontBase)
                    putInt(Pref.fontTitle, themeObject.fontTitle)
                }
                callback(themeObject.apply {
                    fontId = font.id
                    this.font = font.font
                })
            }
            activity?.onBackPressed()
        }
        initSize()
        initColorPicker()
    }

    override fun onNothingSelected(parent: AdapterView<*>?) {

    }

    override fun onItemSelected(parent: AdapterView<*>?, view: View?, position: Int, id: Long) {

    }

    private fun initSize() {
        val sizes = context!!.resources.getStringArray(R.array.sizes)
        ArrayAdapter<String>(context!!, android.R.layout.simple_spinner_item, sizes).also {
            it.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
            fontBaseSpinner.adapter = it
        }
        ArrayAdapter<String>(context!!, android.R.layout.simple_spinner_item, sizes).also {
            it.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
            fontTitleSpinner.adapter = it
        }
        fontBaseSpinner.onItemSelectedListener = object : AdapterView.OnItemSelectedListener {
            override fun onNothingSelected(parent: AdapterView<*>?) {

            }

            override fun onItemSelected(parent: AdapterView<*>?, view: View?, position: Int, id: Long) {
                themeObject.fontBase = (parent?.selectedItem as? String)?.toInt() ?: 16
            }

        }
        fontTitleSpinner.onItemSelectedListener = object : AdapterView.OnItemSelectedListener {
            override fun onNothingSelected(parent: AdapterView<*>?) {

            }

            override fun onItemSelected(parent: AdapterView<*>?, view: View?, position: Int, id: Long) {
                themeObject.fontTitle = (parent?.selectedItem as? String)?.toInt() ?: 20
            }

        }
        val fontBase = SampleApplication.sharedPreferences.getInt(Pref.fontBase, 16)
        val fontTitle = SampleApplication.sharedPreferences.getInt(Pref.fontTitle, 20)
        fontBaseSpinner.setSelection(sizes.indexOfFirst { it == "$fontBase" })
        fontTitleSpinner.setSelection(sizes.indexOfFirst { it == "$fontTitle" })
    }

    private fun initColorPicker() {
        viewPrimary.setBackgroundColor(themeObject.primaryHexColor.getColor())
        viewSecondary.setBackgroundColor(themeObject.secondaryHexColor.getColor())
        viewMarker.setBackgroundColor(themeObject.markerHexColor.getColor())
        viewSelectedMarker.setBackgroundColor(themeObject.markerSelectedHexColor.getColor())
        viewPrimary.setOnClickListener {
            MaterialColorPickerDialog.Builder(activity!!)
                    .setColorShape(ColorShape.CIRCLE)
                    .setDefaultColor(themeObject.primaryHexColor)
                    .setColorListener { _, hexColor ->
                        themeObject.primaryHexColor = hexColor
                        viewPrimary.setBackgroundColor(hexColor.getColor())
                    }
                    .show()
        }
        viewSecondary.setOnClickListener {
            MaterialColorPickerDialog.Builder(activity!!)
                    .setColorShape(ColorShape.CIRCLE)
                    .setDefaultColor(themeObject.secondaryHexColor)
                    .setColorListener { _, hexColor ->
                        themeObject.secondaryHexColor = hexColor
                        viewSecondary.setBackgroundColor(hexColor.getColor())
                    }
                    .show()
        }
        viewMarker.setOnClickListener {
            MaterialColorPickerDialog.Builder(activity!!)
                    .setColorShape(ColorShape.CIRCLE)
                    .setDefaultColor(themeObject.markerHexColor)
                    .setColorListener { _, hexColor ->
                        themeObject.markerHexColor = hexColor
                        viewMarker.setBackgroundColor(hexColor.getColor())
                    }
                    .show()
        }
        viewSelectedMarker.setOnClickListener {
            MaterialColorPickerDialog.Builder(activity!!)
                    .setColorShape(ColorShape.CIRCLE)
                    .setDefaultColor(themeObject.markerSelectedHexColor)
                    .setColorListener { _, hexColor ->
                        themeObject.markerSelectedHexColor = hexColor
                        viewSelectedMarker.setBackgroundColor(hexColor.getColor())
                    }
                    .show()
        }
    }
}