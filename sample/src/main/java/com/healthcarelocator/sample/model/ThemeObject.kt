package com.healthcarelocator.sample.model

class ThemeObject(var id: String = "", var name: String = "", var fontId: String = "Roboto",
                  var font: String = "fonts/Roboto-Regular.ttf", var fontBase: Int = 12, var fontTitle: Int = 16,
                  var primaryHexColor: String = "#06b7a6", var secondaryHexColor: String = "#fd8670",
                  var markerHexColor: String = "#fd8670", var markerSelectedHexColor: String = "#fe8a12") : Cloneable {
    override fun toString(): String {
        return name
    }

    public override fun clone(): Any {
        return super.clone() as ThemeObject
    }
}