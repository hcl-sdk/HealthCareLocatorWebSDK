package com.healthcarelocator.viewmodel.map

import android.content.Context
import base.viewmodel.AppViewModel
import com.healthcarelocator.extensions.*
import com.healthcarelocator.fragments.map.MapFragment
import com.healthcarelocator.fragments.map.OneKeyNearMeFragment
import com.healthcarelocator.model.activity.ActivityObject
import com.healthcarelocator.model.map.OneKeyMarker
import com.healthcarelocator.model.map.compareByDistance
import com.healthcarelocator.service.location.LocationClient
import com.healthcarelocator.utils.OneKeyLog
import com.google.android.gms.maps.CameraUpdateFactory
import com.google.android.gms.maps.GoogleMap
import com.google.android.gms.maps.model.LatLng
import com.google.android.gms.maps.model.LatLngBounds
import io.reactivex.Flowable
import org.osmdroid.util.BoundingBox
import org.osmdroid.util.GeoPoint
import org.osmdroid.views.MapView
import kotlin.math.max
import kotlin.math.min

class OneKeyMapViewModel : AppViewModel<MapFragment>() {

    /**
     * Get 4 coordinates to create a bounding box
     * The result must be an [Array] [North, East, South, West]
     */
    fun getOSMBoundLevel(map: MapView, markers: ArrayList<OneKeyMarker>) {
        disposable?.add(
                Flowable.just(markers)
                        .map {
                            val latSorted = ArrayList(it).apply {
                                sortWith(Comparator { o1, o2 ->
                                    o2.position.latitude.compareTo(o1.position.latitude)
                                })
                            }
                            val lngSorted = ArrayList(it).apply {
                                sortWith(Comparator { o1, o2 ->
                                    o2.position.longitude.compareTo(o1.position.longitude)
                                })
                            }
                            arrayOf<Double>(latSorted.first().position.latitude, lngSorted.first().position.longitude,
                                    latSorted.last().position.latitude, lngSorted.last().position.longitude)
                        }
                        .compose(compose())
                        .subscribe({
                            map.zoomToBoundingBox(BoundingBox(it[0], it[1], it[2], it[3]), true, (getScreenWidth() * 0.1).toInt())
                        }, {
                            OneKeyLog.e("Error:: ${it.localizedMessage}")
                        })
        )
    }

    fun getGoogleMapBoundLevel(map: GoogleMap, markers: ArrayList<OneKeyMarker>) {
        disposable?.add(
                Flowable.just(markers)
                        .map {
                            val latSorted = ArrayList(it).apply {
                                sortWith(Comparator { o1, o2 ->
                                    o2.position.latitude.compareTo(o1.position.latitude)
                                })
                            }
                            val lngSorted = ArrayList(it).apply {
                                sortWith(Comparator { o1, o2 ->
                                    o2.position.longitude.compareTo(o1.position.longitude)
                                })
                            }
                            arrayListOf(latSorted.first().position, lngSorted.first().position,
                                    latSorted.last().position, lngSorted.last().position)
                        }
                        .compose(compose())
                        .subscribe({ list ->
                            val boundBuilder = LatLngBounds.builder()
                            list.forEach { boundBuilder.include(LatLng(it.latitude, it.longitude)) }
                            map.animateCamera(CameraUpdateFactory.newLatLngBounds(boundBuilder.build(), (getScreenWidth() * 0.1).toInt()))
                        }, {
                            OneKeyLog.e("Error:: ${it.localizedMessage}")
                        })
        )
    }

    fun getOSMBoundNearMeLevel(className: String, context: Context, map: MapView, markers: ArrayList<OneKeyMarker>) {
        val client = LocationClient(context)
        client.requestLastLocation().registerDataCallBack({ currentLocation ->
            client.removeLocationUpdate()
            client.releaseApiClient()
            disposable?.add(Flowable.just(markers)
                    .map {
                        it.map { marker ->
                            marker.distance = getDistanceFromLatLonInKm(
                                    currentLocation.latitude, currentLocation.longitude,
                                    marker.position.latitude, marker.position.longitude)
                        }
                        val latSorted = ArrayList(it).apply {
                            sortWith(Comparator { o1, o2 ->
                                o2.position.latitude.compareTo(o1.position.latitude)
                            })
                        }
                        val lngSorted = ArrayList(it).apply {
                            sortWith(Comparator { o1, o2 ->
                                o2.position.longitude.compareTo(o1.position.longitude)
                            })
                        }
                        val x = latSorted.first().compareByDistance(latSorted.last())
                        val y = lngSorted.first().compareByDistance(lngSorted.last())
                        val xR = getReflection(
                                currentLocation.latitude, currentLocation.longitude, x.distance,
                                x.position.latitude, x.position.longitude)
                        val yR = getReflection(
                                currentLocation.latitude, currentLocation.longitude, y.distance,
                                y.position.latitude, y.position.longitude)


                        if (className == OneKeyNearMeFragment::class.java.simpleName)
                            arrayOf<Double>(xR[0], yR[1], x.position.latitude, y.position.longitude)
                        else arrayOf<Double>(x.position.latitude, y.position.longitude, xR[0], yR[1])
                    }
                    .compose(compose())
                    .subscribe({
                        val north = max(it[0], it[2])
                        val south = min(it[0], it[2])
                        val east = max(it[1], it[3])
                        val west = min(it[1], it[3])
                        map.zoomToBoundingBox(BoundingBox(north, east, south, west),
                                true, (getScreenWidth() * 0.1).toInt())
                    }, { OneKeyLog.e("Error:: ${it.localizedMessage}") })
            )
        }, {}, {})
    }

    fun getGoogleMapBoundNearMeLevel(context: Context, map: GoogleMap, markers: ArrayList<OneKeyMarker>) {
        val client = LocationClient(context)
        client.requestLastLocation().registerDataCallBack({ currentLocation ->
            client.removeLocationUpdate()
            client.releaseApiClient()
            disposable?.add(Flowable.just(markers)
                    .map {
                        it.map { marker ->
                            marker.distance = getDistanceFromLatLonInKm(
                                    currentLocation.latitude, currentLocation.longitude,
                                    marker.position.latitude, marker.position.longitude)
                        }
                        val latSorted = ArrayList(it).apply {
                            sortWith(Comparator { o1, o2 ->
                                o2.position.latitude.compareTo(o1.position.latitude)
                            })
                        }
                        val lngSorted = ArrayList(it).apply {
                            sortWith(Comparator { o1, o2 ->
                                o2.position.longitude.compareTo(o1.position.longitude)
                            })
                        }
                        val x = latSorted.first().compareByDistance(latSorted.last())
                        val y = lngSorted.first().compareByDistance(lngSorted.last())
                        val xR = getReflection(
                                currentLocation.latitude, currentLocation.longitude, x.distance,
                                x.position.latitude, x.position.longitude)
                        val yR = getReflection(
                                currentLocation.latitude, currentLocation.longitude, y.distance,
                                y.position.latitude, y.position.longitude)

                        arrayListOf(x.position, y.position, GeoPoint(xR[0], xR[1]), GeoPoint(yR[0], yR[1]))
                    }
                    .compose(compose())
                    .subscribe({ list ->
                        val boundBuilder = LatLngBounds.builder()
                        list.forEach { boundBuilder.include(LatLng(it.latitude, it.longitude)) }
                        map.animateCamera(CameraUpdateFactory.newLatLngBounds(boundBuilder.build(), (getScreenWidth() * 0.1).toInt()))
                    }, { OneKeyLog.e("Error:: ${it.localizedMessage}") })
            )
        }, {}, {})
    }

    fun groupLocations(activities: ArrayList<ActivityObject>,
                       callback: (map: HashMap<String, ArrayList<ActivityObject>>) -> Unit) {
        disposable?.add(Flowable.just(activities)
                .map { list ->
                    val map = hashMapOf<String, ArrayList<ActivityObject>>()
                    list.forEach { activity ->
                        val location = activity.workplace?.address?.location
                        if (location.isNotNullable()) {
                            val obj = map[location!!.getLocationByString()]
                            if (obj.isNullable()) map[location.getLocationByString()] = arrayListOf(activity)
                            else {
                                obj!!.add(activity)
                                map[location.getLocationByString()] = obj
                            }
                        }
                    }
                    map
                }
                .compose(compose())
                .subscribe({callback(it)}, {callback(hashMapOf())}))
    }
}