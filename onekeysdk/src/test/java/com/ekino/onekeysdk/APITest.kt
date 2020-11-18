package com.ekino.onekeysdk

import com.ekino.onekeysdk.service.location.LocationAPI
import com.ekino.onekeysdk.service.location.OneKeyMapService
import org.junit.Test
import java.net.URLEncoder
import java.util.*

class APITest {

    @Test
    fun searchName() {
        val executor: LocationAPI =
            OneKeyMapService.Builder(LocationAPI.mapUrl, LocationAPI::class.java).build()
        val params = hashMapOf<String, String>()
        params["format"] = "json"
        params["accept-language"] = Locale.getDefault().language
        params["addressdetails"] = "1"
        params["limit"] = "10"
        params["q"] = URLEncoder.encode("Ho Chi Minh", "UTF-8")
        executor.searchAddress(params).subscribe({
            println("searchAddress done")
            it.forEach {

            }
        }, {
            it.printStackTrace()
            println("error: ${it.localizedMessage}")
        })
    }
}