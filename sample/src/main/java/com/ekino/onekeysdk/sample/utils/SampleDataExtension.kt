package com.ekino.onekeysdk.sample.utils

import com.ekino.onekeysdk.sample.model.FontObject
import com.ekino.onekeysdk.sample.model.ThemeObject

object Pref {
    const val apiKey = "Pref.apiKey"
    const val theme = "Pref.theme"
    const val fontId = "Pref.fontId"
    const val fontRef = "Pref.fontRef"
    const val primaryColorPref = "Pref.primaryColorPref"
    const val secondaryColorPref = "Pref.secondaryColorPref"
    const val markerColorPref = "Pref.markerColorPref"
    const val selectedMarkerColorPref = "Pref.selectedMarkerColorPref"
    const val fontBase = "Pref.fontBase"
    const val fontTitle = "Pref.fontTitle"
    const val home = "Pref.home"
}

fun getThemes(): ArrayList<ThemeObject> = arrayListOf<ThemeObject>().apply {
    add(ThemeObject("G", "Green", "Roboto", fontBase = 12, fontTitle = 16, primaryHexColor = "#06b7a6", secondaryHexColor = "#fd8670", markerHexColor = "#fd8670", markerSelectedHexColor = "#fe8a12"))
    add(ThemeObject("B", "Blue", "Roboto", fontBase = 12, fontTitle = 16, primaryHexColor = "#00a3de", secondaryHexColor = "#fd8670", markerHexColor = "#fd8670", markerSelectedHexColor = "#fe8a12"))
    add(ThemeObject("R", "Red", "Roboto", fontBase = 12, fontTitle = 16, primaryHexColor = "#f95252", secondaryHexColor = "#fd8670", markerHexColor = "#fd8670", markerSelectedHexColor = "#fe8a12"))
    add(ThemeObject("C", "Custom", fontBase = 12, fontTitle = 16, primaryHexColor = "#06b7a6", secondaryHexColor = "#fd8670", markerHexColor = "#fd8670", markerSelectedHexColor = "#fe8a12"))
}

fun getFonts(): ArrayList<FontObject> = arrayListOf<FontObject>().apply {
    add(FontObject("Roboto", "fonts/Roboto-Regular.ttf"))
    add(FontObject("Montserrat", "fonts/Montserrat-Regular.ttf"))
    add(FontObject("Impact", "fonts/impact.ttf"))
}