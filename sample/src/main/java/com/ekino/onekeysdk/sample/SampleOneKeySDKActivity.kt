package com.ekino.onekeysdk.sample

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.GravityCompat
import base.extensions.addFragment
import com.ekino.onekeysdk.R
import com.ekino.onekeysdk.fragments.OneKeyHomeFragment
import com.ekino.onekeysdk.model.config.OneKeyViewCustomObject
import com.ekino.onekeysdk.model.config.OneKeyViewFontObject
import com.ekino.onekeysdk.sample.fragments.*
import com.ekino.onekeysdk.sample.model.ThemeObject
import com.ekino.onekeysdk.sample.utils.Pref
import com.ekino.onekeysdk.sample.utils.getFonts
import com.ekino.onekeysdk.sample.utils.getThemes
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import kotlinx.android.synthetic.main.activity_sample.*

class SampleOneKeySDKActivity : AppCompatActivity() {
    private val themes by lazy { getThemes() }
    private val fonts by lazy { getFonts() }
    private val gson by lazy { Gson() }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_sample)
        if (savedInstanceState == null) {
            this.addFragment(R.id.drawerMenuContainer, DrawerMenuFragment.newInstance())
            this.addFragment(R.id.fragmentContainer, LandingPageFragment.newInstance(), true)
        }
        btnMenu.setOnClickListener {
            if (drawer.isDrawerOpen(GravityCompat.START))
                drawer.closeDrawer(GravityCompat.START)
            else drawer.openDrawer(GravityCompat.START)
        }
    }

    override fun onBackPressed() {
        if (this.supportFragmentManager.backStackEntryCount == 1)
            finish()
        else
            super.onBackPressed()
    }

    fun closeDrawer() {
        if (drawer.isDrawerOpen(GravityCompat.START))
            drawer.closeDrawer(GravityCompat.START)
    }

    private fun resetStack() {
        for (i in 0 until this.supportFragmentManager.backStackEntryCount) {
            this.supportFragmentManager.popBackStack()
        }
        this.addFragment(R.id.fragmentContainer, LandingPageFragment.newInstance(), true)
    }

    fun launchOneKeySDK() {
        resetStack()
        /**
         * Customize the theme attributes
         */
        val selectedTheme = (SampleApplication.sharedPreferences.getString(Pref.theme,
                "G") ?: "G").run {
            themes.firstOrNull { it.id == this }
        } ?: ThemeObject()
        val font = SampleApplication.sharedPreferences.getString(Pref.fontRef,
                "fonts/Roboto-Regular.ttf") ?: "fonts/Roboto-Regular.ttf"
        val primary = SampleApplication.sharedPreferences.getString(Pref.primaryColorPref, selectedTheme.primaryHexColor)
                ?: selectedTheme.primaryHexColor
        val secondary = SampleApplication.sharedPreferences.getString(Pref.secondaryColorPref, selectedTheme.secondaryHexColor)
                ?: selectedTheme.secondaryHexColor
        val marker = SampleApplication.sharedPreferences.getString(Pref.markerColorPref, selectedTheme.markerHexColor)
                ?: selectedTheme.markerHexColor
        val selectedMarker = SampleApplication.sharedPreferences.getString(Pref.selectedMarkerColorPref, selectedTheme.markerSelectedHexColor)
                ?: selectedTheme.markerSelectedHexColor
        var fontDefault: OneKeyViewFontObject = OneKeyViewFontObject.Builder().build()
        var fontTitle1: OneKeyViewFontObject = OneKeyViewFontObject.Builder().build()
        var fontButton: OneKeyViewFontObject = OneKeyViewFontObject.Builder().build()
        var fontTitle2: OneKeyViewFontObject = OneKeyViewFontObject.Builder().build()
        var fontTitle3: OneKeyViewFontObject = OneKeyViewFontObject.Builder().build()
        var fontSmall: OneKeyViewFontObject = OneKeyViewFontObject.Builder().build()
        var fontSearchInput: OneKeyViewFontObject = OneKeyViewFontObject.Builder().build()
        SampleApplication.sharedPreferences.also {
            (it.getString(Pref.fontDefault, "") ?: "").apply {
                if (this.isNotEmpty())
                    fontDefault = getFontSetting(this)
            }
            (it.getString(Pref.fontTitle1, "") ?: "").apply {
                if (this.isNotEmpty())
                    fontTitle1 = getFontSetting(this)
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
        val homeMode = SampleApplication.sharedPreferences.getInt(Pref.home, 1)
        /**
         * Add OneKey screen into parent application
         */
        this.addFragment(R.id.fragmentContainer, OneKeyHomeFragment.newInstance(
                OneKeyViewCustomObject.Builder()
                        .colorPrimary(primary)
                        .colorSecondary(secondary)
                        .colorMarker(marker)
                        .colorMarkerSelected(selectedMarker)
                        .fontTitleMain(fontTitle1)
                        .fontButton(fontButton)
                        .fontDefault(fontDefault)
                        .fontSmall(fontSmall)
                        .fontSearchInput(fontSearchInput)
                        .homeMode(homeMode)
                        .build()), true)
    }

    private fun getFontSetting(json: String): OneKeyViewFontObject =
            gson.fromJson(json, object : TypeToken<OneKeyViewFontObject>() {}.type)

    fun openSettingsPage() {
        resetStack()
        this.addFragment(R.id.fragmentContainer, SettingFragment.newInstance(), true)
    }

    fun openCustomThemePage(themeObject: ThemeObject, callback: (theme: ThemeObject) -> Unit) {
        this.addFragment(R.id.fragmentContainer, CustomThemeFragment.newInstance(themeObject, callback), true)
    }

    fun openPreviewFont(font: OneKeyViewFontObject, callback: (font: OneKeyViewFontObject) -> Unit) {
        this.addFragment(R.id.fragmentContainer, PreviewFontFragment.newInstance(font, callback), true)
    }
}