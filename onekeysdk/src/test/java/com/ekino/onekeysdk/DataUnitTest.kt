package com.ekino.onekeysdk

import com.ekino.onekeysdk.custom.text.OneKeyTextView
import com.ekino.onekeysdk.model.config.OneKeyViewCustomObject
import com.ekino.onekeysdk.extensions.getDummyHCP
import org.junit.Test

class DataUnitTest {

    @Test
    fun buildCustomViewObject() {
//        val builder = OneKeyViewCustomObject.Builder().markerIcon(1)
//        val builder2 = OneKeyViewCustomObject.Builder(markerIcon = 0)
//        println("buildCustomViewObject: ${builder.build()}")
//        println("buildCustomViewObject: ${builder2.build()}")
    }

    @Test
    fun buildOneKeyLocation() {
        val locations = getDummyHCP()
        println("locations: $locations")
    }
}