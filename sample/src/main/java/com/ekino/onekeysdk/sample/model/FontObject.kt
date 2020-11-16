package com.ekino.onekeysdk.sample.model

class FontObject(var id: String = "Roboto", var font: String = "fonts/Roboto-Regular.ttf") {
    override fun toString(): String {
        return id
    }
}