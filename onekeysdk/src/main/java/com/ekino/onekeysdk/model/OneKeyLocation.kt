package com.ekino.onekeysdk.model

data class OneKeyLocation(var id: String = "", var name: String = "", var speciality: String = "",
                          var address: String = "", var distance: Int = 0,
                          var latitude: Double = 0.0, var longitude: Double = 0.0) {
}