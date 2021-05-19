package com.healthcarelocator.sample

import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.GravityCompat
import base.extensions.addFragment
import com.ekino.sample.onekeysdk.BuildConfig
import com.ekino.sample.onekeysdk.R
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import com.healthcarelocator.extensions.ScreenReference
import com.healthcarelocator.model.config.HealthCareLocatorCustomObject
import com.healthcarelocator.model.config.HeathCareLocatorViewFontObject
import com.healthcarelocator.sample.fragments.*
import com.healthcarelocator.sample.model.ColorObject
import com.healthcarelocator.sample.model.ThemeObject
import com.healthcarelocator.sample.utils.Pref
import com.healthcarelocator.sample.utils.getFonts
import com.healthcarelocator.sample.utils.getThemes
import com.healthcarelocator.service.location.getCountryCodes
import com.healthcarelocator.state.HealthCareLocatorSDK
import com.healthcarelocator.utils.KeyboardUtils
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
            KeyboardUtils.hideSoftKeyboard(this)
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

    fun launchOneKeySDK(
        nearMe: Boolean = false,
        favoriteNearMe: Boolean = false,
        resetStack: Boolean = true
    ) {
        if (resetStack)
            resetStack()
        /**
         * Customize the theme attributes
         */
        val theme = SampleApplication.sharedPreferences.getString(Pref.theme, "G") ?: "G"
        val selectedTheme = theme.run {
            themes.firstOrNull { it.id == this }
        } ?: ThemeObject()
        val font = SampleApplication.sharedPreferences.getString(
            Pref.fontRef,
            "fonts/Roboto-Regular.ttf"
        ) ?: "fonts/Roboto-Regular.ttf"
        val colors = (SampleApplication.sharedPreferences.getString(Pref.colors, "[]")
            ?: "[]").run {
            if (this.isNotEmpty() && this != "[]")
                gson.fromJson(this, object : TypeToken<ArrayList<ColorObject>>() {}.type)
            else arrayListOf<ColorObject>()
        }
        val primary = if (theme != "C") SampleApplication.sharedPreferences.getString(
            Pref.primaryColorPref,
            selectedTheme.primaryHexColor
        )
            ?: selectedTheme.primaryHexColor else colors
        val secondary = SampleApplication.sharedPreferences.getString(
            Pref.secondaryColorPref,
            selectedTheme.secondaryHexColor
        )
            ?: selectedTheme.secondaryHexColor
        val marker = SampleApplication.sharedPreferences.getString(
            Pref.markerColorPref,
            selectedTheme.markerHexColor
        )
            ?: selectedTheme.markerHexColor
        val selectedMarker = SampleApplication.sharedPreferences.getString(
            Pref.selectedMarkerColorPref,
            selectedTheme.markerSelectedHexColor
        )
            ?: selectedTheme.markerSelectedHexColor
        var fontDefault: HeathCareLocatorViewFontObject? = null
        var fontTitle1: HeathCareLocatorViewFontObject? = null
        var fontButton: HeathCareLocatorViewFontObject? = null
        var fontTitle2: HeathCareLocatorViewFontObject? = null
        var fontTitle3: HeathCareLocatorViewFontObject? = null
        var fontSmall: HeathCareLocatorViewFontObject? = null
        var fontSearchInput: HeathCareLocatorViewFontObject? = null
        var fontSearchResultTitle: HeathCareLocatorViewFontObject? = null
        var fontResultTitle: HeathCareLocatorViewFontObject? = null
        var fontResultSubTitle: HeathCareLocatorViewFontObject? = null
        var fontProfileTitle: HeathCareLocatorViewFontObject? = null
        var fontProfileSubTitle: HeathCareLocatorViewFontObject? = null
        var fontProfileTitleSection: HeathCareLocatorViewFontObject? = null
        var fontCardTitle: HeathCareLocatorViewFontObject? = null
        var fontModalTitle: HeathCareLocatorViewFontObject? = null
        var fontSortCriteria: HeathCareLocatorViewFontObject? = null
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
        val builder = HealthCareLocatorCustomObject.Builder()
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
//                .iconSearch(R.drawable.baseline_location_on_white_36dp)
//                .iconProfile(R.drawable.baseline_map_white_24dp)
//                .iconCross(R.drawable.baseline_share_black_36dp)
//                .iconMarkerMin(R.drawable.baseline_directions_black_36dp)
//                .iconSort(R.drawable.baseline_location_on_white_36dp)
//                .iconMapGeoLoc(R.drawable.baseline_print_black_36dp)
//                .iconLocation(R.drawable.baseline_list_white_24dp)
            .locale(if (language == 0) "en" else "fr")
        if (theme == "C") {
            builder.colorPrimary(colors.first { it.id == "colorPrimary" }.color)
                .colorSecondary(colors.first { it.id == "colorSecondary" }.color)
                .colorMarker(colors.first { it.id == "colorMarker" }.color)
                .colorMarkerSelected(colors.first { it.id == "colorMarkerSelected" }.color)
                .colorListBackground(colors.first { it.id == "colorListBackground" }.color)
                .colorCardBorder(colors.first { it.id == "colorCardBorder" }.color)
        } else if (theme == "B" || theme == "R") {
            builder.colorPrimary(selectedTheme.primaryHexColor)
                .colorSecondary(selectedTheme.secondaryHexColor)
                .colorMarker(selectedTheme.markerHexColor)
                .colorMarkerSelected(selectedTheme.markerSelectedHexColor)
        }
        if (favoriteNearMe) {
            builder.specialities(arrayListOf("SP.WCA.08"))
                .entryScreen(ScreenReference.SEARCH_NEAR_ME)
        }
        if (nearMe) {
            builder.entryScreen(ScreenReference.SEARCH_NEAR_ME)
        }
        val countryCodeString =
            SampleApplication.sharedPreferences.getString(Pref.countryCodes, "") ?: ""
        builder.countries(countryCodeString.getCountryCodes())
        builder.env(BuildConfig.env)
        builder.showModificationForm(
            SampleApplication.sharedPreferences.getInt(
                Pref.modification,
                0
            ) == 0
        )
        builder.mapService(SampleApplication.sharedPreferences.getInt(Pref.mapService, 0))

        val apiKey = SampleApplication.sharedPreferences.getString(Pref.apiKey, "") ?: ""
        HealthCareLocatorSDK.init(apiKey).setAppName("Sample")
            .setAppDownloadLink("http://google.com").setCustomObject(builder.build())
        HealthCareLocatorSDK.getInstance().startSDKFragment(this, R.id.fragmentContainer)
//        HealthCareLocatorSDK.getInstance().startSDKActivity(this)
    }

    private fun getFontSetting(json: String): HeathCareLocatorViewFontObject =
        gson.fromJson(json, object : TypeToken<HeathCareLocatorViewFontObject>() {}.type)

    fun openSettingsPage() {
        resetStack()
        this.addFragment(R.id.fragmentContainer, SettingFragment.newInstance(), true)
    }

    fun openCustomThemePage(themeObject: ThemeObject, callback: (theme: ThemeObject) -> Unit) {
        this.addFragment(
            R.id.fragmentContainer,
            CustomThemeFragment.newInstance(themeObject, callback),
            true
        )
    }

    fun openPreviewFont(
        font: HeathCareLocatorViewFontObject,
        callback: (font: HeathCareLocatorViewFontObject) -> Unit
    ) {
        this.addFragment(
            R.id.fragmentContainer,
            PreviewFontFragment.newInstance(font, callback),
            true
        )
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
    }
}