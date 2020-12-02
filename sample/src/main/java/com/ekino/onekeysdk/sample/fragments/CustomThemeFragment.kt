package com.ekino.onekeysdk.sample.fragments

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.AdapterView
import androidx.core.content.edit
import base.fragments.IFragment
import com.ekino.onekeysdk.R
import com.ekino.onekeysdk.extensions.getColor
import com.ekino.onekeysdk.model.config.OneKeyViewFontObject
import com.ekino.onekeysdk.sample.SampleApplication
import com.ekino.onekeysdk.sample.SampleOneKeySDKActivity
import com.ekino.onekeysdk.sample.model.ThemeObject
import com.ekino.onekeysdk.sample.utils.Pref
import com.ekino.onekeysdk.sample.utils.getFonts
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import com.jaredrummler.android.colorpicker.ColorPickerDialog
import com.jaredrummler.android.colorpicker.ColorPickerDialogListener
import kotlinx.android.synthetic.main.fragment_custom_theme.*

class CustomThemeFragment(
        val themeObject: ThemeObject,
        val callback: (theme: ThemeObject) -> Unit
) :
        IFragment(), AdapterView.OnItemSelectedListener, View.OnClickListener {

    companion object {
        fun newInstance(themeObject: ThemeObject, callback: (theme: ThemeObject) -> Unit) =
                CustomThemeFragment(themeObject.clone() as ThemeObject, callback)
    }

    private val fonts by lazy { getFonts() }
    private var fontDefault: OneKeyViewFontObject = OneKeyViewFontObject.Builder(id = "default", title = "Default").build()
    private var fontTitle: OneKeyViewFontObject = OneKeyViewFontObject.Builder(id = "title1", title = "Title 1").build()
    private var fontTitle2: OneKeyViewFontObject = OneKeyViewFontObject.Builder(id = "title2", title = "Title 2").build()
    private var fontTitle3: OneKeyViewFontObject = OneKeyViewFontObject.Builder(id = "title3", title = "Title 3").build()
    private var fontButton: OneKeyViewFontObject = OneKeyViewFontObject.Builder(id = "button", title = "Button").build()
    private var fontSmall: OneKeyViewFontObject = OneKeyViewFontObject.Builder(id = "small", title = "Small").build()
    private var fontSearchInput: OneKeyViewFontObject = OneKeyViewFontObject.Builder(id = "searchInput", title = "Search Input").build()
    private val gson by lazy { Gson() }

    override fun onCreateView(
            inflater: LayoutInflater,
            container: ViewGroup?,
            savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.fragment_custom_theme, container, false)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        SampleApplication.sharedPreferences.also {
            (it.getString(Pref.fontDefault, "") ?: "").apply {
                if (this.isNotEmpty())
                    fontDefault = getFontSetting(this)
            }
            (it.getString(Pref.fontTitle1, "") ?: "").apply {
                if (this.isNotEmpty())
                    fontTitle = getFontSetting(this)
            }
            (it.getString(Pref.fontButton, "") ?: "").apply {
                if (this.isNotEmpty())
                    fontButton = getFontSetting(this)
            }
            (it.getString(Pref.fontTitle2, "") ?: "").apply {
                if (this.isNotEmpty())
                    fontTitle2 = getFontSetting(this)
            }
            (it.getString(Pref.fontTitle3, "") ?: "").apply {
                if (this.isNotEmpty())
                    fontTitle3 = getFontSetting(this)
            }
            (it.getString(Pref.fontSmall, "") ?: "").apply {
                if (this.isNotEmpty())
                    fontSmall = getFontSetting(this)
            }
            (it.getString(Pref.fontSearchInput, "") ?: "").apply {
                if (this.isNotEmpty())
                    fontSearchInput = getFontSetting(this)
            }
        }
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        btnBack.setOnClickListener { activity?.onBackPressed() }
        btnApply.setOnClickListener { _ ->
            SampleApplication.sharedPreferences.also {
                it.edit {
                    putString(Pref.fontDefault, gson.toJson(fontDefault))
                    putString(Pref.fontTitle1, gson.toJson(fontTitle))
                    putString(Pref.fontButton, gson.toJson(fontButton))
                    putString(Pref.fontTitle2, gson.toJson(fontTitle2))
                    putString(Pref.fontTitle3, gson.toJson(fontTitle3))
                    putString(Pref.fontSmall, gson.toJson(fontSmall))
                    putString(Pref.fontSearchInput, gson.toJson(fontSearchInput))
                }
            }
            callback(themeObject)
            activity?.onBackPressed()
        }
        btnDefault.setOnClickListener(this)
        btnTitle.setOnClickListener(this)
        btnButton.setOnClickListener(this)
        btnTitle2.setOnClickListener(this)
        btnTitle3.setOnClickListener(this)
        btnSmall.setOnClickListener(this)
        btnSearchInput.setOnClickListener(this)
        initColorPicker()
    }

    override fun onNothingSelected(parent: AdapterView<*>?) {

    }

    override fun onItemSelected(parent: AdapterView<*>?, view: View?, position: Int, id: Long) {

    }

    private fun initColorPicker() {
        viewPrimary.setBackgroundColor(themeObject.primaryHexColor.getColor())
        viewSecondary.setBackgroundColor(themeObject.secondaryHexColor.getColor())
        viewMarker.setBackgroundColor(themeObject.markerHexColor.getColor())
        viewSelectedMarker.setBackgroundColor(themeObject.markerSelectedHexColor.getColor())
        viewPrimary.setOnClickListener {
            ColorPickerDialog.newBuilder().setDialogType(ColorPickerDialog.TYPE_CUSTOM)
                    .setAllowPresets(false).setDialogId(0)
                    .setColor(themeObject.primaryHexColor.getColor())
                    .setShowAlphaSlider(true)
                    .setColorPickerDialogListener(object : ColorPickerDialogListener {
                        override fun onDialogDismissed(dialogId: Int) {
                        }

                        override fun onColorSelected(dialogId: Int, color: Int) {
                            val hexColor = "#${Integer.toHexString(color)}"
                            themeObject.primaryHexColor = hexColor
                            viewPrimary.setBackgroundColor(color)
                        }

                    }).show(activity)
        }
        viewSecondary.setOnClickListener {
            ColorPickerDialog.newBuilder().setDialogType(ColorPickerDialog.TYPE_CUSTOM)
                    .setAllowPresets(false).setDialogId(0)
                    .setColor(themeObject.secondaryHexColor.getColor())
                    .setShowAlphaSlider(true)
                    .setColorPickerDialogListener(object : ColorPickerDialogListener {
                        override fun onDialogDismissed(dialogId: Int) {
                        }

                        override fun onColorSelected(dialogId: Int, color: Int) {
                            val hexColor = "#${Integer.toHexString(color)}"
                            themeObject.secondaryHexColor = hexColor
                            viewSecondary.setBackgroundColor(color)
                        }

                    }).show(activity)
        }
        viewMarker.setOnClickListener {
            ColorPickerDialog.newBuilder().setDialogType(ColorPickerDialog.TYPE_CUSTOM)
                    .setAllowPresets(false).setDialogId(0)
                    .setColor(themeObject.markerHexColor.getColor())
                    .setShowAlphaSlider(true)
                    .setColorPickerDialogListener(object : ColorPickerDialogListener {
                        override fun onDialogDismissed(dialogId: Int) {
                        }

                        override fun onColorSelected(dialogId: Int, color: Int) {
                            val hexColor = "#${Integer.toHexString(color)}"
                            themeObject.markerHexColor = hexColor
                            viewMarker.setBackgroundColor(color)
                        }

                    }).show(activity)
        }
        viewSelectedMarker.setOnClickListener {
            ColorPickerDialog.newBuilder().setDialogType(ColorPickerDialog.TYPE_CUSTOM)
                    .setAllowPresets(false).setDialogId(0)
                    .setColor(themeObject.markerSelectedHexColor.getColor())
                    .setShowAlphaSlider(true)
                    .setColorPickerDialogListener(object : ColorPickerDialogListener {
                        override fun onDialogDismissed(dialogId: Int) {
                        }

                        override fun onColorSelected(dialogId: Int, color: Int) {
                            val hexColor = "#${Integer.toHexString(color)}"
                            themeObject.markerSelectedHexColor = hexColor
                            viewSelectedMarker.setBackgroundColor(color)
                        }

                    }).show(activity)
        }
    }

    override fun onClick(v: View?) {
        when (v?.id) {
            R.id.btnDefault -> {
                (activity as? SampleOneKeySDKActivity)?.openPreviewFont(fontDefault) {
                    fontDefault = it
                }
            }
            R.id.btnTitle -> {
                (activity as? SampleOneKeySDKActivity)?.openPreviewFont(fontTitle) {
                    fontTitle = it
                }
            }
            R.id.btnButton -> {
                (activity as? SampleOneKeySDKActivity)?.openPreviewFont(fontButton) {
                    fontButton = it
                }
            }
            R.id.btnTitle2 -> {
                (activity as? SampleOneKeySDKActivity)?.openPreviewFont(fontTitle2) {
                    fontTitle2 = it
                }
            }
            R.id.btnTitle3 -> {
                (activity as? SampleOneKeySDKActivity)?.openPreviewFont(fontTitle3) {
                    fontTitle3 = it
                }
            }
            R.id.btnSmall -> {
                (activity as? SampleOneKeySDKActivity)?.openPreviewFont(fontSmall) {
                    fontSmall = it
                }
            }
            R.id.btnSearchInput -> {
                (activity as? SampleOneKeySDKActivity)?.openPreviewFont(fontSearchInput) {
                    fontSearchInput = it
                }
            }
        }
    }

    private fun getFontSetting(json: String): OneKeyViewFontObject =
            gson.fromJson(json, object : TypeToken<OneKeyViewFontObject>() {}.type)
}