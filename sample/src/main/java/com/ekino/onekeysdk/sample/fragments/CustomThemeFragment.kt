package com.ekino.onekeysdk.sample.fragments

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.AdapterView
import androidx.core.content.edit
import androidx.recyclerview.widget.LinearLayoutManager
import base.fragments.IFragment
import com.ekino.onekeysdk.R
import com.ekino.onekeysdk.extensions.getColor
import com.ekino.onekeysdk.model.config.OneKeyViewFontObject
import com.ekino.onekeysdk.sample.SampleApplication
import com.ekino.onekeysdk.sample.SampleOneKeySDKActivity
import com.ekino.onekeysdk.sample.adapter.ColorAdapter
import com.ekino.onekeysdk.sample.adapter.FontAdapter
import com.ekino.onekeysdk.sample.model.ColorObject
import com.ekino.onekeysdk.sample.model.ThemeObject
import com.ekino.onekeysdk.sample.utils.Pref
import com.ekino.onekeysdk.sample.utils.getColorList
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

    private var fontDefault: OneKeyViewFontObject =
        OneKeyViewFontObject.Builder(id = "default", title = "Default").build()
    private var fontTitle: OneKeyViewFontObject =
        OneKeyViewFontObject.Builder(id = "titleMain", title = "Title Main").build()
    private var fontTitle2: OneKeyViewFontObject =
        OneKeyViewFontObject.Builder(id = "titleSecondary", title = "Title Secondary").build()
    private var fontTitle3: OneKeyViewFontObject =
        OneKeyViewFontObject.Builder(id = "searchResultTotal", title = "Search Result Total")
            .build()
    private var fontButton: OneKeyViewFontObject =
        OneKeyViewFontObject.Builder(id = "button", title = "Button").build()
    private var fontSmall: OneKeyViewFontObject =
        OneKeyViewFontObject.Builder(id = "small", title = "Small").build()
    private var fontSearchInput: OneKeyViewFontObject =
        OneKeyViewFontObject.Builder(id = "searchInput", title = "Search Input").build()
    private var fontSearchResultTitle: OneKeyViewFontObject =
        OneKeyViewFontObject.Builder(id = "fontSearchResultTitle", title = "Search Result Title")
            .build()
    private var fontResultTitle: OneKeyViewFontObject =
        OneKeyViewFontObject.Builder(id = "fontResultTitle", title = "Result Title").build()
    private var fontResultSubTitle: OneKeyViewFontObject =
        OneKeyViewFontObject.Builder(id = "fontResultSubTitle", title = "Result Sub Title").build()
    private var fontProfileTitle: OneKeyViewFontObject =
        OneKeyViewFontObject.Builder(id = "fontProfileTitle", title = "Profile Title").build()
    private var fontProfileSubTitle: OneKeyViewFontObject =
        OneKeyViewFontObject.Builder(id = "fontProfileSubTitle", title = "Profile Sub Title")
            .build()
    private var fontProfileTitleSection: OneKeyViewFontObject = OneKeyViewFontObject.Builder(
        id = "fontProfileTitleSection",
        title = "Profile Title Section"
    ).build()
    private var fontCardTitle: OneKeyViewFontObject =
        OneKeyViewFontObject.Builder(id = "fontCardTitle", title = "Card Title").build()
    private var fontModalTitle: OneKeyViewFontObject =
        OneKeyViewFontObject.Builder(id = "fontModalTitle", title = "Modal Title").build()
    private var fontSortCriteria: OneKeyViewFontObject =
        OneKeyViewFontObject.Builder(id = "fontSortCriteria", title = "Sort Criteria").build()
    private val gson by lazy { Gson() }
    private val fonts by lazy { arrayListOf<OneKeyViewFontObject>() }
    private var colors = arrayListOf<ColorObject>()
    private val colorAdapter by lazy { ColorAdapter() }
    private val fontAdapter by lazy { FontAdapter() }

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
            (it.getString(Pref.fontSearchResultTitle, "") ?: "").apply {
                if (this.isNotEmpty())
                    fontSearchResultTitle = getFontSetting(this)
            }
            (it.getString(Pref.fontResultTitle, "") ?: "").apply {
                if (this.isNotEmpty())
                    fontResultTitle = getFontSetting(this)
            }
            (it.getString(Pref.fontResultSubTitle, "") ?: "").apply {
                if (this.isNotEmpty())
                    fontResultSubTitle = getFontSetting(this)
            }
            (it.getString(Pref.fontProfileTitle, "") ?: "").apply {
                if (this.isNotEmpty())
                    fontProfileTitle = getFontSetting(this)
            }
            (it.getString(Pref.fontProfileSubTitle, "") ?: "").apply {
                if (this.isNotEmpty())
                    fontProfileSubTitle = getFontSetting(this)
            }
            (it.getString(Pref.fontProfileTitleSection, "") ?: "").apply {
                if (this.isNotEmpty())
                    fontProfileTitleSection = getFontSetting(this)
            }
            (it.getString(Pref.fontCardTitle, "") ?: "").apply {
                if (this.isNotEmpty())
                    fontCardTitle = getFontSetting(this)
            }
            (it.getString(Pref.fontModalTitle, "") ?: "").apply {
                if (this.isNotEmpty())
                    fontModalTitle = getFontSetting(this)
            }
            (it.getString(Pref.fontSortCriteria, "") ?: "").apply {
                if (this.isNotEmpty())
                    fontSortCriteria = getFontSetting(this)
            }
            (it.getString(Pref.colors, "[]") ?: "[]").apply {
                colors = if (this.isNotEmpty() && this != "[]")
                    gson.fromJson(this, object : TypeToken<ArrayList<ColorObject>>() {}.type)
                else getColorList()
            }
        }
        fonts.apply {
            add(fontDefault)
            add(fontTitle)
            add(fontTitle2)
            add(fontTitle3)
            add(fontButton)
            add(fontSmall)
            add(fontSearchInput)
            add(fontSearchResultTitle)
            add(fontResultTitle)
            add(fontResultSubTitle)
            add(fontProfileTitle)
            add(fontProfileSubTitle)
            add(fontProfileTitleSection)
            add(fontCardTitle)
            add(fontModalTitle)
            add(fontSortCriteria)
        }
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        btnBack.setOnClickListener { activity?.onBackPressed() }
        btnApply.setOnClickListener { _ ->
            SampleApplication.sharedPreferences.also {
                it.edit {
                    fonts.forEach { font ->
                        putString("Pref.${font.id}", gson.toJson(font))
                    }
                    putString(Pref.colors, gson.toJson(colorAdapter.getData()))
                }
            }
            callback(themeObject)
            activity?.onBackPressed()
        }
        rvFont.apply {
            layoutManager = LinearLayoutManager(context)
            adapter = fontAdapter
        }
        fontAdapter.setData(fonts)
        fontAdapter.onItemSelectedListener = { data, position ->
            (activity as? SampleOneKeySDKActivity)?.openPreviewFont(data) {
                fontAdapter.getData()[position] = it
            }
        }
        rvColor.apply {
            layoutManager = LinearLayoutManager(context)
            adapter = colorAdapter
        }
        colorAdapter.setData(colors)
        val colorDialogBuilder =
            ColorPickerDialog.newBuilder().setDialogType(ColorPickerDialog.TYPE_CUSTOM)
                .setAllowPresets(false).setDialogId(0)
                .setShowAlphaSlider(true)
        colorAdapter.onColorSelected = { data, position ->
            colorDialogBuilder
                .setColor(data.color.getColor())
                .setColorPickerDialogListener(object : ColorPickerDialogListener {
                    override fun onDialogDismissed(dialogId: Int) {
                    }

                    override fun onColorSelected(dialogId: Int, color: Int) {
                        val hexColor = "#${Integer.toHexString(color)}"
                        colorAdapter.getData()[position].color = hexColor
                        colorAdapter.notifyItemChanged(position)
//                            themeObject.markerHexColor = hexColor
//                            viewMarker.setBackgroundColor(color)
                    }

                }).show(activity)
        }
    }

    override fun onNothingSelected(parent: AdapterView<*>?) {

    }

    override fun onItemSelected(parent: AdapterView<*>?, view: View?, position: Int, id: Long) {

    }

    override fun onClick(v: View?) {
        when (v?.id) {

        }
    }

    private fun getFontSetting(json: String): OneKeyViewFontObject =
        gson.fromJson(json, object : TypeToken<OneKeyViewFontObject>() {}.type)

}