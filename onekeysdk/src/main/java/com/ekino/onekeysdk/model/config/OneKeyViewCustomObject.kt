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
 * @param colorPrimary Set primary color in the hex [String] color (Must start with #).
 * @param colorSecondary Set secondary color in the hex [String] color (Must start with #).
 * @param textColor Set text color in the hex [String] color (Must start with #).
 * @param colorMarker Set marker color in colorId which will show on the map (Must start with #).
 * @param colorMarkerSelected Set selected marker color in colorId which will show on the map (Must start with #).
 * @param fontDefaultSize Set default font size in integer.
 * @param fontTitle1Size Set font size for title level 1 in [OneKeyViewFontObject].
 * @param fontTitle2Size Set font size for title level 2 in [OneKeyViewFontObject].
 * @param fontSmallSize Set font size for small level in [OneKeyViewFontObject].
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
        val fontTitle1Size: OneKeyViewFontObject = OneKeyViewFontObject.Builder(id = "title1", size = 20).build(),
        val fontTitle2Size: OneKeyViewFontObject = OneKeyViewFontObject.Builder(id = "title2", size = 16).build(),
        val fontTitle3Size: OneKeyViewFontObject = OneKeyViewFontObject.Builder(id = "title3", size = 14).build(),
        val fontButton: OneKeyViewFontObject = OneKeyViewFontObject.Builder(id = "button", size = 14).build(),
        val fontBold: String = "fonts/Roboto-Bold.ttf",
        val fontDefaultSize: OneKeyViewFontObject = OneKeyViewFontObject.Builder(id = "default", size = 14).build(),
        val searchIcon: Int = R.drawable.baseline_search_white_24dp,
        val editIcon: Int = R.drawable.baseline_edit_white_36dp,
        val markerIcon: Int = R.drawable.baseline_location_on_white_36dp,
        val homeMode: Int = 0,
        var fontSearchInputSize: OneKeyViewFontObject = OneKeyViewFontObject.Builder(id = "searchInput", size = 16).build(),
        val fontSmallSize: OneKeyViewFontObject = OneKeyViewFontObject.Builder(id = "small", size = 12).build(),
        val colorListBackground: String = "#f8f9fa") {

    @Suppress
    data class Builder(
            var colorPrimary: String = "#43b02a",// Color in hex, must start with #
            var colorSecondary: String = "#00a3e0",
            var textColor: String = "#2d3c4d",
            var colorMarker: String = "#fe8a12",
            var colorMarkerSelected: String = "#fd8670",
            var fontTitle1Size: OneKeyViewFontObject = OneKeyViewFontObject.Builder(id = "title1", size = 20).build(),
            var fontTitle2Size: OneKeyViewFontObject = OneKeyViewFontObject.Builder(id = "title2", size = 16).build(),
            var fontTitle3Size: OneKeyViewFontObject = OneKeyViewFontObject.Builder(id = "title3", size = 14).build(),
            var fontButton: OneKeyViewFontObject = OneKeyViewFontObject.Builder(id = "button", size = 14).build(),
            var fontBold: String = "fonts/Roboto-Bold.ttf",
            var fontDefaultSize: OneKeyViewFontObject = OneKeyViewFontObject.Builder(id = "default", size = 14).build(),
            var searchIcon: Int = R.drawable.baseline_search_white_24dp,
            var editIcon: Int = R.drawable.baseline_edit_white_36dp,
            var markerIcon: Int = R.drawable.baseline_location_on_white_36dp,
            var homeMode: Int = 0,
            var fontSearchInputSize: OneKeyViewFontObject = OneKeyViewFontObject.Builder(id = "searchInput", size = 16).build(),
            var fontSmallSize: OneKeyViewFontObject = OneKeyViewFontObject.Builder(id = "small", size = 12).build(),
            var colorListBackground: String = "#f8f9fa") {

        fun colorPrimary(primaryColor: String) = apply { this.colorPrimary = primaryColor }
        fun colorSecondary(secondaryColor: String) = apply { this.colorSecondary = secondaryColor }
        fun textColor(textColor: String) = apply { this.textColor = textColor }
        fun colorMarker(markerColor: String) = apply { this.colorMarker = markerColor }
        fun colorMarkerSelected(markerSelectedColor: String) = apply { this.colorMarkerSelected = markerSelectedColor }
        fun fontTitle1Size(fontBaseSize: OneKeyViewFontObject) = apply { this.fontTitle1Size = fontBaseSize }
        fun fontTitle2Size(fontTitleSize: OneKeyViewFontObject) = apply { this.fontTitle2Size = fontTitleSize }
        fun fontTitle3Size(fontTitleSize: OneKeyViewFontObject) = apply { this.fontTitle3Size = fontTitleSize }
        fun fontButton(fontButton: OneKeyViewFontObject) = apply { this.fontButton = fontButton }

        fun fontDefaultSize(fontDefaultSize: OneKeyViewFontObject) = apply { this.fontDefaultSize = fontDefaultSize }
        fun searchIcon(searchIcon: Int) = apply { this.searchIcon = searchIcon }
        fun editIcon(editIcon: Int) = apply { this.editIcon = editIcon }
        fun markerIcon(markerIcon: Int) = apply { this.markerIcon = markerIcon }
        fun homeMode(homeMode: Int) = apply { this.homeMode = homeMode }
        fun fontSearchInputSize(fontSearchInputSize: OneKeyViewFontObject) = apply { this.fontSearchInputSize = fontSearchInputSize }
        fun fontSmallSize(fontSmallSize: OneKeyViewFontObject) = apply { this.fontSmallSize = fontSmallSize }
        fun colorListBackground(colorListBackground: String) = apply { this.colorListBackground = colorListBackground }

        fun build() = OneKeyViewCustomObject(colorPrimary, colorSecondary, textColor, colorMarker,
                colorMarkerSelected, fontTitle1Size, fontTitle2Size, fontTitle3Size, fontButton, fontBold, fontDefaultSize, searchIcon,
                editIcon, markerIcon, homeMode, fontSearchInputSize, fontSmallSize, colorListBackground)
    }
}