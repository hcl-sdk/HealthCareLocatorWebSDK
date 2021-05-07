package com.healthcarelocator.sample.model

class FontObject(var id: String = "Roboto", var font: String = "fonts/Roboto-Regular.ttf",
                 var weight: Int = 0) {
    override fun toString(): String {
        return id
    }
}