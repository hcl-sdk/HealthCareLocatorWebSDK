package com.ekino.onekeysdk.sample

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.GravityCompat
import base.extensions.addFragment
import com.ekino.onekeysdk.R
import com.ekino.onekeysdk.fragments.OneKeyHomeFragment
import com.ekino.onekeysdk.model.config.OneKeyViewCustomObject
import com.ekino.onekeysdk.sample.fragments.CustomThemeFragment
import com.ekino.onekeysdk.sample.fragments.DrawerMenuFragment
import com.ekino.onekeysdk.sample.fragments.LandingPageFragment
import com.ekino.onekeysdk.sample.fragments.SettingFragment
import com.ekino.onekeysdk.sample.model.ThemeObject
import com.ekino.onekeysdk.sample.utils.Pref
import com.ekino.onekeysdk.sample.utils.getFonts
import com.ekino.onekeysdk.sample.utils.getThemes
import kotlinx.android.synthetic.main.activity_sample.*

class SampleOneKeySDKActivity : AppCompatActivity() {
    private val themes by lazy { getThemes() }
    private val fonts by lazy { getFonts() }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_sample)
        if (savedInstanceState == null) {
            this.addFragment(R.id.drawerMenuContainer, DrawerMenuFragment.newInstance())
            this.addFragment(R.id.fragmentContainer, OneKeyHomeFragment.newInstance(), true)
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
        val fontBase = SampleApplication.sharedPreferences.getInt(Pref.fontBase, 16)
        val fontTitle = SampleApplication.sharedPreferences.getInt(Pref.fontTitle, 20)
        this.addFragment(R.id.fragmentContainer, OneKeyHomeFragment.newInstance(
                OneKeyViewCustomObject.Builder().font(font)
                        .primaryColor(primary)
                        .secondaryColor(secondary)
                        .markerColor(marker)
                        .markerSelectedColor(selectedMarker)
                        .fontBaseSize(fontBase)
                        .fontTitleSize(fontTitle)
                        .build()), true)
    }

    fun openSettingsPage() {
        resetStack()
        this.addFragment(R.id.fragmentContainer, SettingFragment.newInstance(), true)
    }

    fun openCustomThemePage(themeObject: ThemeObject, callback: (theme: ThemeObject) -> Unit) {
        this.addFragment(R.id.fragmentContainer, CustomThemeFragment.newInstance(themeObject, callback), true)
    }
}