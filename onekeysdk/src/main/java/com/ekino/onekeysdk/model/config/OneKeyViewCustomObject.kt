package com.ekino.onekeysdk.model.config

import com.ekino.onekeysdk.R

/**
 * OneKeyViewCustomObject provides fields where the implementation app could be changed the style(s) like:
 * text color, text size, font(s), icon(s).
 *
 * Implementation:
 *
 * • With Java: OneKeyViewCustomObject obj = new OneKeyViewCustomObject.Builder().editIcon(`value`).build();
 *
 * • With Kotlin: OneKeyViewCustomObject.Builder(editIcon=`value`).build() or OneKeyViewCustomObject.Builder()..editIcon(`value`).build()
 *
 * If the implementation app doesn't provide those styles, the default will be applied.
 * @param colorPrimary Set primary color in the hex string color (Must start with #).
 * @param colorSecondary Set secondary color in the hex string color (Must start with #).
 * @param textColor Set text color in the hex string color (Must start with #).
 * @param colorMarker Set marker color in colorId which will show on the map (Must start with #).
 * @param colorMarkerSelected Set selected marker color in colorId which will show on the map (Must start with #).
 * @param fontDefaultSize Set default font size in integer.
 * @param fontTitle1Size Set font size for title level 1 in integer.
 * @param fontTitle2Size Set font size for title level 2 in integer.
 * @param searchIcon Set search icon in drawableId.
 * @param editIcon Set edit icon in drawableId.
 * @param markerIcon Set marker icon in drawableId.
 */
data class OneKeyViewCustomObject private constructor(
        val colorPrimary: String = "#43b02a",// Color in hex, must start with #
        val colorSecondary: String = "#00a3e0",
        val textColor: String = "#2d3c4d",
        val colorMarker: String = "#fe8a12",
        val colorMarkerSelected: String = "#fd8670",
        val fontTitle1Size: Int = 20,
        val fontTitle2Size: Int = 16,
        val fontName: String = "fonts/Roboto-Regular.ttf",
        val fontBold: String = "fonts/Roboto-Bold.ttf",
        val fontDefaultSize: Int = 16,
        val searchIcon: Int = R.drawable.baseline_search_white_24dp,
        val editIcon: Int = R.drawable.baseline_edit_white_36dp,
        val markerIcon: Int = R.drawable.baseline_location_on_white_36dp,
        val homeMode: Int = 0,
        val fontSearchInputSize: Int = 16) {

    @Suppress
    data class Builder(
            var colorPrimary: String = "#43b02a",// Color in hex, must start with #
            var colorSecondary: String = "#00a3e0",
            var textColor: String = "#2d3c4d",
            var colorMarker: String = "#fe8a12",
            var colorMarkerSelected: String = "#fd8670",
            var fontTitle1Size: Int = 20,
            var fontTitle2Size: Int = 16,
            var fontName: String = "fonts/Roboto-Regular.ttf",
            var fontBold: String = "fonts/Roboto-Bold.ttf",
            var fontDefaultSize: Int = 16,
            var searchIcon: Int = R.drawable.baseline_search_white_24dp,
            var editIcon: Int = R.drawable.baseline_edit_white_36dp,
            var markerIcon: Int = R.drawable.baseline_location_on_white_36dp,
            var homeMode: Int = 0,
            var fontSearchInputSize: Int = 16) {

        fun colorPrimary(primaryColor: String) = apply { this.colorPrimary = primaryColor }
        fun colorSecondary(secondaryColor: String) = apply { this.colorSecondary = secondaryColor }
        fun textColor(textColor: String) = apply { this.textColor = textColor }
        fun colorMarker(markerColor: String) = apply { this.colorMarker = markerColor }
        fun colorMarkerSelected(markerSelectedColor: String) = apply { this.colorMarkerSelected = markerSelectedColor }
        fun fontTitle1Size(fontBaseSize: Int) = apply { this.fontTitle1Size = fontBaseSize }
        fun fontTitle2Size(fontTitleSize: Int) = apply { this.fontTitle2Size = fontTitleSize }

        fun fontDefaultSize(fontDefaultSize: Int) = apply { this.fontDefaultSize = fontDefaultSize }
        fun searchIcon(searchIcon: Int) = apply { this.searchIcon = searchIcon }
        fun editIcon(editIcon: Int) = apply { this.editIcon = editIcon }
        fun markerIcon(markerIcon: Int) = apply { this.markerIcon = markerIcon }
        fun fontName(font: String) = apply { this.fontName = font }
        fun homeMode(homeMode: Int) = apply { this.homeMode = homeMode }
        fun fontSearchInputSize(fontSearchInputSize: Int) = apply { this.fontSearchInputSize = fontSearchInputSize }

        fun build() = OneKeyViewCustomObject(colorPrimary, colorSecondary, textColor, colorMarker,
                colorMarkerSelected, fontTitle1Size, fontTitle2Size, fontName, fontBold, fontDefaultSize, searchIcon,
                editIcon, markerIcon, homeMode, fontSearchInputSize)
    }
}