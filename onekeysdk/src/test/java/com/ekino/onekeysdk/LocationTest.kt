package com.ekino.onekeysdk

import com.ekino.onekeysdk.extensions.getDistanceFromLatLonInKm
import com.ekino.onekeysdk.extensions.getReflection
import com.google.common.truth.Truth.assertThat
import org.junit.Test

class LocationTest {

    @Test
    fun getCoordinateReflection() {
        val distance = getDistanceFromLatLonInKm( 45.4000917,  -75.8061417, 45.6469, -75.9286)
        assertThat(distance).isGreaterThan(0)
        println("Distance: $distance")
        getReflection(45.4000917,  -75.8061417, distance, 45.6469, -75.9286){lat, lng->
            println("Reflection: $lat,$lng")
        }
    }
}