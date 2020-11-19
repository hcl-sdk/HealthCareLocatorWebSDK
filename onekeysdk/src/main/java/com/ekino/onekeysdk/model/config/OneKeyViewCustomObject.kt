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
 * @param titleColor Set title (header) color in colorId.
 * @param subTitleColor Set sub title color in colorId.
 * @param textColor Set text color in colorId.
 * @param markerColor Set marker color in colorId which will show on the map.
 * @param textTitleSize Set title (header) size in dimensionId.
 * @param textSubTitleSize Set sub title size in dimensionId.
 * @param textSize Set text size in dimensionId.
 * @param searchIcon Set search icon in drawableId.
 * @param editIcon Set edit icon in drawableId.
 * @param markerIcon Set marker icon in drawableId.
 */
data class OneKeyViewCustomObject private constructor(
        val primaryColor: String = "#43B12B",// Color in hex, must start with #
        val secondaryColor: String = "#E4F3DF",
        val textColor: String = "#2d3c4d",
        val markerColor: String = "#FE8A12",
        val markerSelectedColor: String = "#CD0800",
        val fontBaseSize: Int = 20,
        val fontTitleSize: Int = 16,
        val font: String = "fonts/Roboto-Regular.ttf",
        val fontBold: String = "fonts/Roboto-Bold.ttf",
        val textSize: Int = 16,
        val searchIcon: Int = R.drawable.baseline_search_white_24dp,
        val editIcon: Int = R.drawable.baseline_edit_white_36dp,
        val markerIcon: Int = R.drawable.baseline_location_on_white_36dp) {

    @Suppress
    data class Builder(
            var primaryColor: String = "#43B12B",// Color in hex, must start with #
            var secondaryColor: String = "#E4F3DF",
            var textColor: String = "#2d3c4d",
            var markerColor: String = "#FE8A12",
            var markerSelectedColor: String = "#CD0800",
            var fontBaseSize: Int = 20,
            var fontTitleSize: Int = 16,
            var font: String = "fonts/Roboto-Regular.ttf",
            val fontBold: String = "fonts/Roboto-Bold.ttf",
            var textSize: Int = 16,
            var searchIcon: Int = R.drawable.baseline_search_white_24dp,
            var editIcon: Int = R.drawable.baseline_edit_white_36dp,
            var markerIcon: Int = R.drawable.baseline_location_on_white_36dp) {

        fun primaryColor(primaryColor: String) = apply { this.primaryColor = primaryColor }
        fun secondaryColor(secondaryColor: String) = apply { this.secondaryColor = secondaryColor }
        fun textColor(textColor: String) = apply { this.textColor = textColor }
        fun markerColor(markerColor: String) = apply { this.markerColor = markerColor }
        fun fontBaseSize(fontBaseSize: Int) = apply { this.fontBaseSize = fontBaseSize }
        fun fontTitleSize(fontTitleSize: Int) =
                apply { this.fontTitleSize = fontTitleSize }

        fun textSize(textSize: Int) = apply { this.textSize = textSize }
        fun searchIcon(searchIcon: Int) = apply { this.searchIcon = searchIcon }
        fun editIcon(editIcon: Int) = apply { this.editIcon = editIcon }
        fun markerIcon(markerIcon: Int) = apply { this.markerIcon = markerIcon }
        fun font(font: String) = apply { this.font = font }
        fun markerSelectedColor(markerSelectedColor: String) = apply { this.markerSelectedColor = markerSelectedColor }

        fun build() = OneKeyViewCustomObject(primaryColor, secondaryColor, textColor, markerColor,
                markerSelectedColor, fontBaseSize, fontTitleSize, font, fontBold, textSize, searchIcon,
                editIcon, markerIcon)
    }
}