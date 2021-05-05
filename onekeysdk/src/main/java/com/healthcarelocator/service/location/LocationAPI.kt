package com.healthcarelocator.service.location

import com.healthcarelocator.model.map.OneKeyPlace
import io.reactivex.Flowable
import retrofit2.http.GET
import retrofit2.http.QueryMap

interface LocationAPI {
    companion object {
        const val mapUrl = "http://nominatim.openstreetmap.org/"
    }

    @GET("search.php")
    fun searchAddress(@QueryMap query: HashMap<String, String>): Flowable<ArrayList<OneKeyPlace>>

    @GET("reverse")
    fun reverseGeoCoding(@QueryMap query: HashMap<String, String>): Flowable<OneKeyPlace>

}