package com.ekino.onekeysdk.service.location

import android.content.Context
import android.location.Location
import com.google.android.gms.location.*
import com.google.android.gms.tasks.OnFailureListener
import com.google.android.gms.tasks.OnSuccessListener

class LocationClient(val context: Context, private var requestInterval: Long = 30000L,
                     private var priority: Int = LocationRequest.PRIORITY_HIGH_ACCURACY) :
        OnSuccessListener<Location>, OnFailureListener {

    private var fusedLocationClient: FusedLocationProviderClient? = null
    private var locationRequest: LocationRequest? = null
    private var onLocation: (location: Location) -> Unit = {}
    private var onLocationAvailable: (available: Boolean) -> Unit = {}
    private var onError: (e: Exception) -> Unit = {}

    /**
     * The result will be returned on this callback although the data location is available or NOT
     * @see LocationCallback
     */
    private val locationCallback: LocationCallback by lazy {
        object : LocationCallback() {
            override fun onLocationResult(p0: LocationResult?) {
                super.onLocationResult(p0)
                if (p0?.lastLocation != null)
                    onLocation(p0.lastLocation)
                else {
                    p0?.locations?.forEach {
                        onLocation(it)
                        return@forEach
                    }
                }
            }

            override fun onLocationAvailability(p0: LocationAvailability?) {
                super.onLocationAvailability(p0)
                onLocationAvailable(p0?.isLocationAvailable ?: false)
            }
        }
    }

    init {
        if (fusedLocationClient == null)
            fusedLocationClient = LocationServices.getFusedLocationProviderClient(context)
        if (locationRequest == null) {
            locationRequest = LocationRequest.create().setInterval(this.requestInterval)
                    .setPriority(this.priority)
        }
    }

    @Throws(SecurityException::class)
    fun requestLastLocation(): LocationClient {
        if (fusedLocationClient != null && locationRequest != null)
            fusedLocationClient!!.requestLocationUpdates(locationRequest, locationCallback, null)
        fusedLocationClient?.lastLocation?.addOnSuccessListener(this)?.addOnFailureListener(this)
        return this
    }

    /** setPriority() to notify location service that returned the accurate results or the relative results.
     * @see LocationRequest to see the priority values.
     * @see LocationRequest.PRIORITY_HIGH_ACCURACY it will be able to use high power (battery)
     *@param priority
     */
    fun setPriority(priority: Int): LocationClient {
        this.priority = priority
        locationRequest?.priority = priority
        return this
    }


    /** removeLocationUpdate() to un-register the updated location callback
     * locationCallback must be initialized before.
     */
    fun removeLocationUpdate() {
        fusedLocationClient?.removeLocationUpdates(locationCallback)
        this.onLocation = {}
        this.onLocationAvailable = {}
        this.onError = {}
    }

    /** registerDataCallBack() to register lambda functions
     *@param onLocation: to return the location which is returned by play service
     * @param onLocationAvailable to know the user location is available or NOT
     * @param onError to return the exception when requesting the location.
     */
    fun registerDataCallBack(onLocation: (location: Location) -> Unit,
                             onLocationAvailable: (available: Boolean) -> Unit,
                             onError: (e: Exception) -> Unit): LocationClient {
        this.onLocation = onLocation
        this.onLocationAvailable = onLocationAvailable
        this.onError = onError
        return this
    }

    fun releaseApiClient() {
        fusedLocationClient = null
        locationRequest = null
    }

    override fun onSuccess(p0: Location?) {
        p0?.let { location -> onLocation(location) }
    }

    override fun onFailure(p0: Exception) {
        onError(p0)
    }
}