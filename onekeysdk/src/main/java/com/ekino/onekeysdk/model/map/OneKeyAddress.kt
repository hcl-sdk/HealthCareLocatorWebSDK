package com.ekino.onekeysdk.model.map

import com.google.gson.annotations.SerializedName

class OneKeyAddress(
        @SerializedName("amenity") var amenity: String = "",
        @SerializedName("tourism") var tourism: String = "",
        @SerializedName("house_number") var houseNumber: String = "",
        @SerializedName("road") var road: String = "",
        @SerializedName("neighbourhood") var neighbourhood: String = "",
        @SerializedName("suburb") var suburb: String = "",
        @SerializedName("town") var town: String = "",
        @SerializedName("district") var district: String = "",
        @SerializedName("postcode") var postcode: String = "",
        @SerializedName("country") var country: String = "",
        @SerializedName("country_code") var countryCode: String = ""
)