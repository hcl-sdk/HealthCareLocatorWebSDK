package com.ekino.onekeysdk.sample.fragments

import android.os.Bundle
import android.text.SpannableString
import android.text.style.UnderlineSpan
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.AdapterView
import android.widget.ArrayAdapter
import androidx.core.content.edit
import base.fragments.IFragment
import com.ekino.onekeysdk.R
import com.ekino.onekeysdk.sample.SampleApplication
import com.ekino.onekeysdk.sample.SampleOneKeySDKActivity
import com.ekino.onekeysdk.sample.model.FontObject
import com.ekino.onekeysdk.sample.model.ThemeObject
import com.ekino.onekeysdk.sample.utils.Pref
import com.ekino.onekeysdk.sample.utils.SpinnerInteractionListener
import com.ekino.onekeysdk.sample.utils.getFonts
import com.ekino.onekeysdk.sample.utils.getThemes
import kotlinx.android.synthetic.main.fragment_setting.*

class SettingFragment : IFragment(), SpinnerInteractionListener.OnSpinnerItemSelectedListener, View.OnClickListener {
    companion object {
        fun newInstance() = SettingFragment()
    }

    private var themeObject: ThemeObject = ThemeObject()
    private val themes by lazy { getThemes() }
    private val fonts by lazy { getFonts() }

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        return inflater.inflate(R.layout.fragment_setting, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        btnBack.setOnClickListener { activity?.onBackPressed() }
        val apiKey = SampleApplication.sharedPreferences.getString(Pref.apiKey, "") ?: ""
        edtAPIKey.setText(apiKey)

        val selectedTheme = (SampleApplication.sharedPreferences.getString(Pref.theme,
                "G") ?: "G").run {
            themes.indexOfFirst { it.id == this }
        }

        ArrayAdapter<ThemeObject>(context!!, android.R.layout.simple_spinner_item, themes).also {
            it.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
            themeSpinner.adapter = it
        }
        val listener = SpinnerInteractionListener(this)
        themeSpinner.onItemSelectedListener = listener
        themeSpinner.setOnTouchListener(listener)
        themeSpinner.setSelection(selectedTheme)
        initHomeSpinner()

        tvResetDefault.text = tvResetDefault.text.run {
            val span = SpannableString(this)
            span.setSpan(UnderlineSpan(), 0, this.length, SpannableString.SPAN_EXCLUSIVE_EXCLUSIVE)
            span
        }
        tvResetDefault.setOnClickListener(this)
    }

    private fun initHomeSpinner() {
        val selectedPosition = SampleApplication.sharedPreferences.getInt(Pref.home, 0)
        if (selectedPosition == 0) rBtnFull.isChecked = true
        else if (selectedPosition == 1) rBtnMin.isChecked = true
        homeGroup.setOnCheckedChangeListener { group, checkedId ->
            when (checkedId) {
                R.id.rBtnFull -> {
                }
                R.id.rBtnMin -> {
                }
            }
        }
    }

    override fun onSpinnerItemSelectedListener(parent: AdapterView<*>?, view: View?, position: Int, id: Long) {
        if (position == 3) {
            this.themeObject = (themeSpinner.selectedItem as? ThemeObject) ?: ThemeObject()
            setThemeData()
            (activity as? SampleOneKeySDKActivity)?.openCustomThemePage(themeObject) { theme ->
                this.themeObject = theme
            }
        } else {
            this.themeObject = (themeSpinner.selectedItem as? ThemeObject) ?: ThemeObject()
        }
    }

    override fun onPause() {
        SampleApplication.sharedPreferences.edit {
            putString(Pref.apiKey, edtAPIKey.text.toString())
            putString(Pref.theme, ((themeSpinner.selectedItem as? ThemeObject)?.id) ?: "G")
            putString(Pref.fontId, themeObject.fontId)
            putString(Pref.fontRef, themeObject.font)
            putString(Pref.primaryColorPref, themeObject.primaryHexColor)
            putString(Pref.secondaryColorPref, themeObject.secondaryHexColor)
            putString(Pref.markerColorPref, themeObject.markerHexColor)
            putString(Pref.selectedMarkerColorPref, themeObject.markerSelectedHexColor)
            putInt(Pref.fontBase, themeObject.fontBase)
            putInt(Pref.fontTitle, themeObject.fontTitle)
            putInt(Pref.home, if (homeGroup.checkedRadioButtonId == rBtnFull.id) 0 else 1)
        }
        super.onPause()
    }

    private fun setThemeData() {
        if (themeObject.id == "C") {
            val primary = SampleApplication.sharedPreferences.getString(Pref.primaryColorPref, themeObject.primaryHexColor)
                    ?: themeObject.primaryHexColor
            val secondary = SampleApplication.sharedPreferences.getString(Pref.secondaryColorPref, themeObject.secondaryHexColor)
                    ?: themeObject.secondaryHexColor
            val marker = SampleApplication.sharedPreferences.getString(Pref.markerColorPref, themeObject.markerHexColor)
                    ?: themeObject.markerHexColor
            val selectedMarker = SampleApplication.sharedPreferences.getString(Pref.selectedMarkerColorPref, themeObject.markerSelectedHexColor)
                    ?: themeObject.markerSelectedHexColor
            val selectedFont = (SampleApplication.sharedPreferences.getString(Pref.fontId, "Roboto")
                    ?: "Roboto").run {
                fonts.firstOrNull { it.id == this }
            } ?: FontObject()

            val fontBase = SampleApplication.sharedPreferences.getInt(Pref.fontBase, 16)
            val fontTitle = SampleApplication.sharedPreferences.getInt(Pref.fontTitle, 20)
            themeObject.font = selectedFont.font
            themeObject.fontId = selectedFont.id
            themeObject.primaryHexColor = primary
            themeObject.secondaryHexColor = secondary
            themeObject.markerHexColor = marker
            themeObject.markerSelectedHexColor = selectedMarker
            themeObject.fontBase = fontBase
            themeObject.fontTitle = fontTitle
        }
    }

    override fun onClick(v: View?) {
        when (v?.id) {
            R.id.tvResetDefault -> {
                resetDefault()
            }
        }
    }

    private fun resetDefault(){
        SampleApplication.sharedPreferences.edit {
            putString(Pref.fontDefault, "") 
            putString(Pref.fontTitle1, "")
            putString(Pref.fontButton, "")
            putString(Pref.fontTitle2, "")
            putString(Pref.fontTitle3, "")
            putString(Pref.fontSmall, "")
            putString(Pref.fontSearchInput, "")
            putString(Pref.fontSearchResultTitle, "")
            putString(Pref.fontResultTitle, "")
            putString(Pref.fontResultSubTitle, "")
            putString(Pref.fontProfileTitle, "")
            putString(Pref.fontProfileSubTitle, "")
            putString(Pref.fontProfileTitleSection, "")
            putString(Pref.fontCardTitle, "")
            putString(Pref.fontModalTitle, "")
            putString(Pref.fontSortCriteria, "")
        }
    }
}