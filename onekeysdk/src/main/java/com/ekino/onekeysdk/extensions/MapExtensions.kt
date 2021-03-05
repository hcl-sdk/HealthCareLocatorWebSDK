package com.ekino.onekeysdk.extensions

import android.app.Activity
import android.content.Context
import android.location.Location
import android.location.LocationManager
import android.text.TextUtils
import androidx.fragment.app.FragmentActivity
import com.ekino.onekeysdk.model.OneKeyLocation
import com.ekino.onekeysdk.model.map.OneKeyPlace
import com.ekino.onekeysdk.state.HealthCareLocatorSDK
import com.google.android.gms.common.ConnectionResult
import com.google.android.gms.common.GoogleApiAvailability
import com.google.android.gms.common.api.ApiException
import com.google.android.gms.common.api.GoogleApiClient
import com.google.android.gms.common.api.ResolvableApiException
import com.google.android.gms.location.LocationRequest
import com.google.android.gms.location.LocationServices
import com.google.android.gms.location.LocationSettingsRequest
import com.google.android.gms.location.LocationSettingsStatusCodes
import com.google.android.gms.maps.model.LatLng
import com.iqvia.onekey.GetActivitiesQuery
import com.iqvia.onekey.type.GeopointQuery
import org.osmdroid.util.GeoPoint
import kotlin.math.*

const val mapZoomInEvent = 0
const val mapZoomOutEvent = 1
fun getDummyHCP(): ArrayList<OneKeyLocation> {
    return ArrayList<OneKeyLocation>(
    ).apply {
        add(OneKeyLocation("0", "Dr. 1", "General practitioner", "184 Le Dai Hanh, W.15, D.11, HCMC", 10, 10.764329, 106.655959, "1 day ago"))
        add(OneKeyLocation("1", "Dr. 2", "General practitioner", "182 Le Dai Hanh, W.15, D.11, HCMC", 100, 10.763676, 106.656367, "1 day ago", "Cabinet Médical Beaujon-Etoile", true))
        add(OneKeyLocation("2", "Dr. 4", "General practitioner", "555, Lanh Binh Thang, W.12, D.11, HCMC", 500, 10.762842, 106.651708, "2 days ago"))
        add(OneKeyLocation("3", "Dr. 3", "General practitioner", "01, Lu Gia, W.15, D.11, HCMC", 750, 10.771141, 106.653514, "3 days ago"))
        add(OneKeyLocation("4", "Dr. Dao Duy Tu", "General practitioner", "Đào Duy Từ, Phường 7, Quận 10, Thành phố Hồ Chí Minh, Việt Nam", 750, 10.759533, 106.6602585, "3 days ago", "Cabinet Médical Beaujon-Etoile", true))
        add(OneKeyLocation("5", "Dr. NCT", "General practitioner", "616, Nguyễn Chí Thanh, Phường 12, Quận 5, Thành phố Hồ Chí Minh, Việt Nam", 750, 10.7579726, 106.6585543, "3 days ago"))
        add(OneKeyLocation("6", "Dr. CLX", "General practitioner", "Lý Thường Kiệt, Phường 7, Quận 5, Thành phố Hồ Chí Minh, Việt Nam", 750, 10.7619478, 106.6600624, "3 days ago", "Cabinet Médical Beaujon-Etoile", true))
        add(OneKeyLocation("7", "Dr. 32", "General practitioner", "Đường 3/2, P14, Quận 10, Thành phố Hồ Chí Minh, Việt Nam", 750, 10.7642785, 106.6597811, "3 days ago", "Cabinet Médical Beaujon-Etoile", true))
        add(OneKeyLocation("8", "Dr. VVStar", "General practitioner", "252/2 Lý Thường Kiệt, Phường 14, Quận 11, Thành phố Hồ Chí Minh, Việt Nam", 750, 10.7667392, 106.6579213, "3 days ago"))
        add(OneKeyLocation("9", "Dr. TCH", "General practitioner", "249 Lý Thường Kiệt, Phường 15, Quận 11, Thành phố Hồ Chí Minh, Việt Nam", 750, 10.7699863, 106.6558073, "3 days ago"))
    }
}

/**
 * Geo point [GeoPoint]
 */
fun GeoPoint.getLocationString(): String = "$latitude,$longitude"

fun Location.getLatLng(): LatLng = LatLng(latitude, longitude)

/**
 * [Location]
 */
fun Location?.getCurrentLocation(newLocation: Location?): Location? {
    return when {
        this == null -> newLocation
        newLocation == null -> this
        else -> {
            if (newLocation.latitude == this.latitude && newLocation.longitude == this.longitude)
                this
            else newLocation
        }
    }
}


fun FragmentActivity.isGooglePlayServiceAvailable(success: () -> Unit, error: (message: String) -> Unit) {
    when (val status = GoogleApiAvailability.getInstance().isGooglePlayServicesAvailable(this)) {
        ConnectionResult.SUCCESS -> success()
        else -> {
            GoogleApiAvailability.getInstance().getErrorDialog(this, status, 1001).show()
            error(GoogleApiAvailability.getInstance().getErrorString(status))
        }
    }
}

fun Activity.requestGPS(requestCode: Int, success: () -> Unit = {}, error: (e: Exception) -> Unit = {}) {
    val client = GoogleApiClient.Builder(this).addApi(LocationServices.API).build()
    val builder = LocationRequest.create().setPriority(LocationRequest.PRIORITY_HIGH_ACCURACY).run {
        LocationSettingsRequest.Builder().addLocationRequest(this).setAlwaysShow(true)
    }
    val result = LocationServices.getSettingsClient(this).checkLocationSettings(builder.build())
    result.addOnCompleteListener {
        try {
            val res = it.getResult(ApiException::class.java)
            if (res?.locationSettingsStates?.isLocationPresent == true) {
                success()
            }
        } catch (e: ApiException) {
            error(e)
            when (e.statusCode) {
                LocationSettingsStatusCodes.RESOLUTION_REQUIRED -> {
                    try {
                        (e as? ResolvableApiException)?.startResolutionForResult(this@requestGPS, requestCode)
                    } catch (ex: Exception) {

                    }
                }
            }
        }
    }.addOnFailureListener { error(it) }
}

fun Context.isLocationServiceEnabled(): Boolean {
    val locationManager = getSystemService(Context.LOCATION_SERVICE) as LocationManager
    return locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER)
}

/**
 * Calculate the coordinates.
 */
const val earthRadius = 6378.1f
fun getDistanceFromLatLonInKm(flatitude: Double, flongitude: Double, dlatitude: Double, dlongitude: Double): Double {
    var dLat = deg2rad(dlatitude - flatitude) // deg2rad below
    var dLon = deg2rad(dlongitude - flongitude)
    var a = sin(dLat / 2) * sin(dLat / 2) + cos(deg2rad(flatitude)) *
            cos(deg2rad(dlatitude)) * sin(dLon / 2) * sin(dLon / 2)
    var c = 2 * atan2(sqrt(a), sqrt(1 - a))
    var d = earthRadius * c // Distance in km
    return d
}

fun getReflection(latitude: Double, longitude: Double, distance: Double,
                  dlatitude: Double, dlongitude: Double,
                  callback: (lat: Double, lng: Double) -> Unit = { _, _ -> }) {
    val data = getReflection(latitude, longitude, distance, dlatitude, dlongitude)
    callback(data[0], data[1])
}

fun getReflection(latitude: Double, longitude: Double, distance: Double,
                  dlatitude: Double, dlongitude: Double): Array<Double> {
    val latR = Math.toRadians(latitude)
    val lonR = Math.toRadians(longitude)
    val dLatR = Math.toRadians(dlatitude)
    val longDiff = Math.toRadians(dlongitude - longitude)
    val y = sin(longDiff) * cos(dLatR)
    val x = cos(latR) * sin(dLatR) - sin(latR) * cos(dLatR) * cos(longDiff)
    val b = (Math.toDegrees(atan2(y, x)) + 360) % 360
    val bearingR = Math.toRadians(b + 180)
    val distanceToRadius = distance.div(earthRadius)
    val newLatR = asin(
            sin(latR) * cos(distanceToRadius) +
                    cos(latR) * sin(distanceToRadius) * cos(bearingR)
    )
    val newLonR = lonR + atan2(
            sin(bearingR) * sin(distanceToRadius) * cos(latR),
            cos(distanceToRadius) - sin(latR) * sin(newLatR)
    )
    val latNew = Math.toDegrees(newLatR)
    val lonNew = Math.toDegrees(newLonR)
    return arrayOf(latNew, lonNew)
}

fun deg2rad(deg: Double): Double {
    return deg * (Math.PI / 180)
}

const val EARTH_RADIUS_IN_METERS = 6371007.177356707
fun getDistanceFromBoundingBox(lat1: Double, lng1: Double, lat2: Double, lng2: Double): Double {
    val latDiff = Math.toRadians(abs(lat2 - lat1))
    val lngDiff = Math.toRadians(abs(lng2 - lng1))
    val a = sin(latDiff / 2) * sin(latDiff / 2) +
            cos(Math.toRadians(lat1)) * cos(Math.toRadians(lat2)) *
            sin(lngDiff / 2) * sin(lngDiff / 2)
    val c = 2 * atan2(sqrt(a), sqrt(1 - a))
    return EARTH_RADIUS_IN_METERS * c
}

fun GetActivitiesQuery.Builder.getQuery(place: OneKeyPlace?): GetActivitiesQuery.Builder {
    val geoBuilder = GeopointQuery.builder()
    if (place.isNotNullable() && place!!.placeId.isNotEmpty() && place.placeId != "near_me") {
        geoBuilder.lat(place.latitude.toDouble())
                .lon(place.longitude.toDouble())
        if (place.address.isNotNullable() && (place.address!!.road.isNotEmpty()
                        || place.address!!.city.isNotEmpty())) {
            val distanceMeter = place.getDistanceMeter()
            geoBuilder.distanceMeter(distanceMeter)
        }else if(place.address.isNotNullable() && place.address!!.countryCode.isNotEmpty()) {
            this@getQuery.country(place.address!!.countryCode)
        }
    }else if(place.isNotNullable() && place!!.placeId.isNotEmpty()){
        geoBuilder.lat(place.latitude.toDouble())
                .lon(place.longitude.toDouble())
    }else{
        val countries = HealthCareLocatorSDK.getInstance().getConfiguration().countries
        if (countries.isNotEmpty()){
            this.country(TextUtils.join(",", countries))
        }
    }
    return this.location(geoBuilder.build())
}
//fun getDistanceFromBoundingBox(lat1: Double, lng1: Double, lat2: Double, lng2: Double): Double {
//    val results = FloatArray(1)
//    Location.distanceBetween(lat1, lng1, lat2, lng2, results)
//    return results[0].toDouble()
//}