package com.ekino.onekeysdk.sample

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.GravityCompat
import base.extensions.addFragment
import com.ekino.onekeysdk.R
import com.ekino.onekeysdk.fragments.OneKeyHomeFragment
import com.ekino.onekeysdk.model.config.OneKeyCustomObject
import com.ekino.onekeysdk.model.config.OneKeyViewFontObject
import com.ekino.onekeysdk.sample.fragments.*
import com.ekino.onekeysdk.sample.model.ColorObject
import com.ekino.onekeysdk.sample.model.ThemeObject
import com.ekino.onekeysdk.sample.utils.Pref
import com.ekino.onekeysdk.sample.utils.getFonts
import com.ekino.onekeysdk.sample.utils.getThemes
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import kotlinx.android.synthetic.main.activity_sample.*
import java.util.*

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
        val theme = SampleApplication.sharedPreferences.getString(Pref.theme, "G") ?: "G"
        val selectedTheme = theme.run {
            themes.firstOrNull { it.id == this }
        } ?: ThemeObject()
        val font = SampleApplication.sharedPreferences.getString(Pref.fontRef,
                "fonts/Roboto-Regular.ttf") ?: "fonts/Roboto-Regular.ttf"
        val colors = (SampleApplication.sharedPreferences.getString(Pref.colors, "[]")
                ?: "[]").run {
            if (this.isNotEmpty() && this != "[]")
                gson.fromJson(this, object : TypeToken<ArrayList<ColorObject>>() {}.type)
            else arrayListOf<ColorObject>()
        }
        val primary = if (theme != "C") SampleApplication.sharedPreferences.getString(Pref.primaryColorPref, selectedTheme.primaryHexColor)
                ?: selectedTheme.primaryHexColor else colors
        val secondary = SampleApplication.sharedPreferences.getString(Pref.secondaryColorPref, selectedTheme.secondaryHexColor)
                ?: selectedTheme.secondaryHexColor
        val marker = SampleApplication.sharedPreferences.getString(Pref.markerColorPref, selectedTheme.markerHexColor)
                ?: selectedTheme.markerHexColor
        val selectedMarker = SampleApplication.sharedPreferences.getString(Pref.selectedMarkerColorPref, selectedTheme.markerSelectedHexColor)
                ?: selectedTheme.markerSelectedHexColor
        var fontDefault: OneKeyViewFontObject? = null
        var fontTitle1: OneKeyViewFontObject? = null
        var fontButton: OneKeyViewFontObject? = null
        var fontTitle2: OneKeyViewFontObject? = null
        var fontTitle3: OneKeyViewFontObject? = null
        var fontSmall: OneKeyViewFontObject? = null
        var fontSearchInput: OneKeyViewFontObject? = null
        var fontSearchResultTitle: OneKeyViewFontObject? = null
        var fontResultTitle: OneKeyViewFontObject? = null
        var fontResultSubTitle: OneKeyViewFontObject? = null
        var fontProfileTitle: OneKeyViewFontObject? = null
        var fontProfileSubTitle: OneKeyViewFontObject? = null
        var fontProfileTitleSection: OneKeyViewFontObject? = null
        var fontCardTitle: OneKeyViewFontObject? = null
        var fontModalTitle: OneKeyViewFontObject? = null
        var fontSortCriteria: OneKeyViewFontObject? = null
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
        }
        val homeMode = SampleApplication.sharedPreferences.getInt(Pref.home, 1)
        val language = SampleApplication.sharedPreferences.getInt(Pref.language, 0)

        /**
         * Add OneKey screen into parent application
         */
        val builder = OneKeyCustomObject.Builder()
                .fontTitleMain(fontTitle1)
                .fontTitleSecondary(fontTitle2)
                .fontSearchResultTotal(fontTitle3)
                .fontButton(fontButton)
                .fontDefault(fontDefault)
                .fontSmall(fontSmall)
                .fontSearchInput(fontSearchInput)
                .fontSearchResultTitle(fontSearchResultTitle)
                .fontResultTitle(fontResultTitle)
                .fontResultSubTitle(fontResultSubTitle)
                .fontProfileTitle(fontProfileTitle)
                .fontProfileSubTitle(fontProfileSubTitle)
                .fontProfileTitleSection(fontProfileTitleSection)
                .fontCardTitle(fontCardTitle)
                .fontModalTitle(fontModalTitle)
                .fontSortCriteria(fontSortCriteria)
                .homeMode(homeMode)
                .favoriteIds(arrayListOf("SP.WCA.5B", "SP.WCA.08"))
                .locale(if (language == 0) "en" else "fr")
        if (theme == "C") {
            builder.colorPrimary(colors.first { it.id == "colorPrimary" }.color)
                    .colorSecondary(colors.first { it.id == "colorSecondary" }.color)
                    .colorMarker(colors.first { it.id == "colorMarker" }.color)
                    .colorMarkerSelected(colors.first { it.id == "colorMarkerSelected" }.color)
                    .colorListBackground(colors.first { it.id == "colorListBackground" }.color)
                    .colorCardBorder(colors.first { it.id == "colorCardBorder" }.color)
        }
        this.addFragment(R.id.fragmentContainer, OneKeyHomeFragment.newInstance(
                builder.build()), true)
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