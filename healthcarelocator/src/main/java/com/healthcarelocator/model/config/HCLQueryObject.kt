package com.healthcarelocator.model.config

/**
 * HCLQueryObject provides the parameters for fetching data from the service without UI.
 * @param id is the id of activity or individual.
 * @param first the size of list data which is returning from web service.
 * @param offset the page of the results.
 * @param criteria is searching the key word from user's input.
 * @param locale is the language for results.
 * @param userId is the user identity.
 * @param specialities is the list of speciality id.
 */
data class HCLQueryObject
private constructor(val id: String = "", val first: Int = 5, val offset: Int = 0, val criteria: String = "",
                    val codeTypes: ArrayList<String> = arrayListOf(), val locale: String = "en",
                    val userId: String = "", val specialities: ArrayList<String>,
                    val latitude: Double = 0.0, val longitude: Double = 0.0) {
    data class Builder(var id: String = "", var first: Int = 5, var offset: Int = 0, var criteria: String = "",
                       var codeTypes: ArrayList<String> = arrayListOf(), var locale: String = "en",
                       var userId: String = "", var specialities: ArrayList<String> = arrayListOf(),
                       var latitude: Double = 0.0, var longitude: Double = 0.0) {
        fun id(id: String) = apply { this.id = id }
        fun first(first: Int) = apply { this.first = first }
        fun offset(offset: Int) = apply { this.offset = offset }
        fun criteria(criteria: String) = apply { this.criteria = criteria }
        fun locale(locale: String) = apply { this.locale = locale }
        fun userId(userId: String) = apply { this.userId = userId }
        fun codeTypes(codeTypes: ArrayList<String>) = apply { this.codeTypes = codeTypes }
        fun specialities(specialities: ArrayList<String>) = apply { this.specialities = specialities }
        fun latitude(latitude: Double) = apply { this.latitude = latitude }
        fun longitude(longitude: Double) = apply { this.longitude = longitude }

        fun build() = HCLQueryObject(id, first, offset, criteria, codeTypes, locale, userId,
                specialities, latitude, longitude)
    }
}