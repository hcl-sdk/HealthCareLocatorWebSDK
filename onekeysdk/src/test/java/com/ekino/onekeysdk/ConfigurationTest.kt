package com.ekino.onekeysdk

import com.ekino.onekeysdk.extensions.ScreenReference
import com.ekino.onekeysdk.model.config.OneKeyCustomObject
import com.google.common.truth.Truth.assertThat
import org.junit.Before
import org.junit.Test

class ConfigurationTest {
    private lateinit var config: OneKeyCustomObject

    @Before
    fun init() {
        config = OneKeyCustomObject.Builder().build()
    }

    @Test
    fun checkDefaultColorConfiguration() {
        assertThat(config.colorPrimary.getColorCondition()).isTrue()
        assertThat(config.colorSecondary.getColorCondition()).isTrue()
        assertThat(config.colorMarker.getColorCondition()).isTrue()
        assertThat(config.colorMarkerSelected.getColorCondition()).isTrue()
        assertThat(config.colorListBackground.getColorCondition()).isTrue()
        assertThat(config.colorDark.getColorCondition()).isTrue()
        assertThat(config.colorGrey.getColorCondition()).isTrue()
        assertThat(config.colorGreyDark.getColorCondition()).isTrue()
        assertThat(config.colorGreyDarker.getColorCondition()).isTrue()
        assertThat(config.colorGreyLight.getColorCondition()).isTrue()
        assertThat(config.colorGreyLighter.getColorCondition()).isTrue()
        assertThat(config.colorVoteUp.getColorCondition()).isTrue()
        assertThat(config.colorVoteDown.getColorCondition()).isTrue()
        assertThat(config.colorViewBackground.getColorCondition()).isTrue()
        assertThat(config.colorButtonBorder.getColorCondition()).isTrue()
        assertThat(config.colorButtonBackground.getColorCondition()).isTrue()
        assertThat(config.colorButtonAcceptBackground.getColorCondition()).isTrue()
        assertThat(config.colorButtonDiscardBackground.getColorCondition()).isTrue()
    }

    @Test
    fun checkDefaultFontConfiguration() {
        assertThat(config.fontTitleMain.fontName).isNotEmpty()
        assertThat(config.fontTitleSecondary.fontName).isNotEmpty()
        assertThat(config.fontSearchResultTotal.fontName).isNotEmpty()
        assertThat(config.fontButton.fontName).isNotEmpty()
        assertThat(config.fontDefault.fontName).isNotEmpty()
        assertThat(config.fontSmall.fontName).isNotEmpty()
        assertThat(config.fontSearchInput.fontName).isNotEmpty()
        assertThat(config.fontSearchResultTitle.fontName).isNotEmpty()
        assertThat(config.fontResultTitle.fontName).isNotEmpty()
        assertThat(config.fontResultSubTitle.fontName).isNotEmpty()
        assertThat(config.fontProfileTitle.fontName).isNotEmpty()
        assertThat(config.fontProfileSubTitle.fontName).isNotEmpty()
        assertThat(config.fontProfileTitleSection.fontName).isNotEmpty()
        assertThat(config.fontCardTitle.fontName).isNotEmpty()
        assertThat(config.fontSortCriteria.fontName).isNotEmpty()
    }

    @Test
    fun checkDefaultScreenReference(){
        assertThat(config.screenReference).isEqualTo(ScreenReference.HOME)
    }

    private fun String.getColorCondition(): Boolean =
        isNotEmpty() && this.startsWith("#")
}