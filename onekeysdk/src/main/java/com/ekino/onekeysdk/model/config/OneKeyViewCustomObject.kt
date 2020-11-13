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
        val titleColor: Int = R.color.colorOneKeyBlue,
        val subTitleColor: Int = R.color.colorOneKeyGreen,
        val textColor: Int = R.color.colorOneKeyText,
        val markerColor: Int = R.color.colorOneKeyMarker,
        val textTitleSize: Int = R.dimen.default_text_bigger,
        val textSubTitleSize: Int = R.dimen.default_text,
        val textSize: Int = R.dimen.default_text,
        val searchIcon: Int = R.drawable.baseline_search_white_24dp,
        val editIcon: Int = R.drawable.baseline_edit_white_36dp,
        val markerIcon: Int = R.drawable.baseline_location_on_white_36dp) {

    @Suppress
    data class Builder(
            var titleColor: Int = R.color.colorOneKeyBlue,
            var subTitleColor: Int = R.color.colorOneKeyGreen,
            var textColor: Int = R.color.colorOneKeyText,
            var markerColor: Int = R.color.colorOneKeyMarker,
            var textTitleSize: Int = R.dimen.default_text_bigger,
            var textSubTitleSize: Int = R.dimen.default_text,
            var textSize: Int = R.dimen.default_text,
            var searchIcon: Int = R.drawable.baseline_search_white_24dp,
            var editIcon: Int = R.drawable.baseline_edit_white_36dp,
            var markerIcon: Int = R.drawable.baseline_location_on_white_36dp) {

        fun titleColor(titleColor: Int) = apply { this.titleColor = titleColor }
        fun subTitleColor(subTitleColor: Int) = apply { this.subTitleColor = subTitleColor }
        fun textColor(textColor: Int) = apply { this.textColor = textColor }
        fun markerColor(markerColor: Int) = apply { this.markerColor = markerColor }
        fun textTitleSize(textTitleSize: Int) = apply { this.textTitleSize = textTitleSize }
        fun textSubTitleSize(textSubTitleSize: Int) =
                apply { this.textSubTitleSize = textSubTitleSize }

        fun textSize(textSize: Int) = apply { this.textSize = textSize }
        fun searchIcon(searchIcon: Int) = apply { this.searchIcon = searchIcon }
        fun editIcon(editIcon: Int) = apply { this.editIcon = editIcon }
        fun markerIcon(markerIcon: Int) = apply { this.markerIcon = markerIcon }

        fun build() = OneKeyViewCustomObject(
            titleColor, subTitleColor, textColor, markerColor,
            textTitleSize, textSubTitleSize, textSize, searchIcon, editIcon, markerIcon
        )
    }
}