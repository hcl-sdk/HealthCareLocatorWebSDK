package com.healthcarelocator.sample.utils

import com.healthcarelocator.sample.model.ColorObject
import com.healthcarelocator.sample.model.FontObject
import com.healthcarelocator.sample.model.ThemeObject

object Pref {
    const val apiKey = "Pref.apiKey"
    const val theme = "Pref.theme"
    const val fontId = "Pref.fontId"
    const val fontRef = "Pref.fontRef"
    const val primaryColorPref = "Pref.primaryColorPref"
    const val secondaryColorPref = "Pref.secondaryColorPref"
    const val markerColorPref = "Pref.markerColorPref"
    const val selectedMarkerColorPref = "Pref.selectedMarkerColorPref"
    const val fontDefaultSize = "Pref.fontDefaultSize"
    const val fontSearchInputSize = "Pref.fontSearchInputSize"
    const val fontDefault = "Pref.default"
    const val fontBase = "Pref.fontBase"
    const val fontTitle = "Pref.fontTitle"
    const val fontTitle1 = "Pref.titleMain"
    const val fontTitle2 = "Pref.titleSecondary"
    const val fontTitle3 = "Pref.searchResultTotal"
    const val fontSmall = "Pref.small"
    const val fontSearchInput = "Pref.searchInput"
    const val fontButton = "Pref.button"

    const val fontSearchResultTitle = "Pref.fontSearchResultTitle"
    const val fontResultTitle = "Pref.fontResultTitle"
    const val fontResultSubTitle = "Pref.fontResultSubTitle"
    const val fontProfileTitle = "Pref.fontProfileTitle"
    const val fontProfileSubTitle = "Pref.fontProfileSubTitle"
    const val fontProfileTitleSection = "Pref.fontProfileTitleSection"
    const val fontCardTitle = "Pref.fontCardTitle"
    const val fontModalTitle = "Pref.fontModalTitle"
    const val fontSortCriteria = "Pref.fontSortCriteria"
    const val colors = "Pref.colors"

    const val home = "Pref.home"
    const val modification = "Pref.modification"
    const val language = "Pref.language"
    const val mapService = "Pref.mapService"
    const val countryCodes = "Pref.coutryCodes"
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

fun getColorList(): ArrayList<ColorObject> = arrayListOf<ColorObject>().apply {
    add(ColorObject("colorPrimary", "Primary", "#43b02a"))
    add(ColorObject("colorSecondary", "Secondary", "#00a3e0"))
    add(ColorObject("colorButtonBackground", "Button Background", "#fcfcfc"))
    add(ColorObject("colorButtonAcceptBackground", "Button Accept Background", "#43b02a"))
    add(ColorObject("colorButtonDiscardBackground", "Button Discard Background", "#43b02a"))
    add(ColorObject("colorButtonBorder", "Button Border", "#dedede"))
    add(ColorObject("colorCardBorder", "Card Border", "#dedede"))
    add(ColorObject("colorMarker", "Marker", "#fe8a12"))
    add(ColorObject("colorMarkerSelected", "Marker Selected", "#fd8670"))
    add(ColorObject("colorViewBackground", "View Background", "#f8f9fa"))
    add(ColorObject("colorListBackground", "List Background", "#f8f9fa"))
    add(ColorObject("colorVoteUp", "Vote Up", "#43b02a"))
    add(ColorObject("colorVoteDown", "Vote Down", "#ff0000"))
}