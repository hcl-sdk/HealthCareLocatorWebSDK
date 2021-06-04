package com.healthcarelocator

import com.healthcarelocator.extensions.getDistanceFromBoundingBox
import com.healthcarelocator.extensions.getDistanceFromLatLonInKm
import com.healthcarelocator.extensions.getReflection
import com.healthcarelocator.service.location.getValidCountryCodes
import com.google.common.truth.Truth.assertThat
import org.junit.Test

class LocationTest {

    @Test
    fun getCoordinateReflection() {
        val distance = getDistanceFromLatLonInKm(45.4000917, -75.8061417, 45.6469, -75.9286)
        assertThat(distance).isGreaterThan(0)
        println("Distance: $distance")
        getReflection(45.4000917, -75.8061417, distance, 45.6469, -75.9286) { lat, lng ->
            println("Reflection: $lat,$lng")
        }
    }

    @Test
    fun calculateDistance() {
        val boundingBoxS = arrayOf(
            "43.65324942859874",
            "43.6331572913184",
            "-79.37172729902234",
            "-79.39556364597549"
        )
        val boundingBox = arrayOf(0.0, 0.0, 0.0, 0.0).apply {
            boundingBoxS.forEachIndexed { index, s ->
                this[index] = s.toDouble()
                print("${s.toDouble()},")
            }
        }
        println(
            "\n${getDistanceFromBoundingBox(
                boundingBox[0],
                boundingBox[2],
                boundingBox[1],
                boundingBox[3]
            )}"
        )
    }

    @Test
    fun checkCountryCode(){
        println("checkCountryCode: ${"Kr ".getValidCountryCodes()}")
    }
}