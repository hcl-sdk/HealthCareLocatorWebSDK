package com.ekino.onekeysdk.fragments.map

import android.content.Context
import android.content.SharedPreferences
import android.graphics.drawable.Drawable
import android.location.Location
import android.os.Bundle
import android.view.*
import android.view.View.OnGenericMotionListener
import androidx.core.content.edit
import base.fragments.IFragment
import com.ekino.onekeysdk.R
import com.ekino.onekeysdk.custom.map.OneKeyMapView
import com.ekino.onekeysdk.custom.map.clustering.RadiusMarkerClusterer
import com.ekino.onekeysdk.extensions.*
import com.ekino.onekeysdk.model.activity.ActivityObject
import com.ekino.onekeysdk.model.activity.AddressObject
import com.ekino.onekeysdk.model.config.OneKeyCustomObject
import com.ekino.onekeysdk.model.map.OneKeyGoogleMarkerItem
import com.ekino.onekeysdk.model.map.OneKeyMarker
import com.ekino.onekeysdk.state.OneKeySDK
import com.ekino.onekeysdk.utils.OneKeyConstant
import com.google.android.gms.maps.*
import com.google.android.gms.maps.model.LatLng
import com.google.android.gms.maps.model.LatLngBounds
import com.google.maps.android.clustering.Cluster
import com.google.maps.android.clustering.ClusterManager
import customization.map.CustomCurrentLocationOverlay
import org.osmdroid.tileprovider.tilesource.TileSourceFactory
import org.osmdroid.util.GeoPoint
import org.osmdroid.views.overlay.CopyrightOverlay
import org.osmdroid.views.overlay.Marker
import org.osmdroid.views.overlay.gestures.RotationGestureOverlay
import org.osmdroid.views.overlay.mylocation.GpsMyLocationProvider
import org.osmdroid.views.overlay.mylocation.IMyLocationConsumer
import org.osmdroid.views.overlay.mylocation.IMyLocationProvider
import org.osmdroid.views.overlay.mylocation.MyLocationNewOverlay

class MapFragment : IFragment(), IMyLocationConsumer, Marker.OnMarkerClickListener, OnMapReadyCallback,
        ClusterManager.OnClusterClickListener<OneKeyGoogleMarkerItem>,
        ClusterManager.OnClusterItemClickListener<OneKeyGoogleMarkerItem> {

    companion object {
        fun newInstance(oneKeyCustomObject: OneKeyCustomObject,
                        activities: ArrayList<ActivityObject>, modifyZoomLevel: Float = 0f,
                        boundingBox: Boolean = false) =
                MapFragment().apply {
                    this.oneKeyCustomObject = oneKeyCustomObject
                    this.activities = activities
                    this.modifyZoomLevel = modifyZoomLevel
                    this.boundingBox = boundingBox
                }
    }

    private var oneKeyCustomObject: OneKeyCustomObject =
            OneKeySDK.getInstance().getConfiguration()
    private var activities: ArrayList<ActivityObject> = arrayListOf()
    private var modifyZoomLevel: Float = 0f
    private var boundingBox: Boolean = false

    var onMarkerSelectionChanged: (id: String) -> Unit = {}

    // ===========================================================
    // Constants
    // ===========================================================
    private val PREFS_NAME = "org.andnav.osm.prefs"
    private val PREFS_TILE_SOURCE = "tilesource"
    private val PREFS_LATITUDE_STRING = "latitudeString"
    private val PREFS_LONGITUDE_STRING = "longitudeString"
    private val PREFS_ORIENTATION = "orientation"
    private val PREFS_ZOOM_LEVEL_DOUBLE = "zoomLevelDouble"

    private val MENU_ABOUT = Menu.FIRST + 1
    private val MENU_LAST_ID = MENU_ABOUT + 1

    // ===========================================================
    // Fields
    // ===========================================================
    private var mPrefs: SharedPreferences? = null
    private var mMapView: OneKeyMapView? = null
    private val oneKeyMarkers by lazy { arrayListOf<OneKeyMarker>() }
    private var mLocationOverlay: MyLocationNewOverlay? = null
    private var lastCurrentLocation: Location? = null
    private var mRotationGestureOverlay: RotationGestureOverlay? = null
    private var mCopyrightOverlay: CopyrightOverlay? = null
    private lateinit var selectedIcon: Drawable
    private var locationProvider: GpsMyLocationProvider? = null

    /**
     * Variables for google map
     */
    private lateinit var googleMap: GoogleMap
    private var clusterManager: ClusterManager<OneKeyGoogleMarkerItem>? = null
    private var googleMapMarkerRender: GoogleMapMarkerRender? = null

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        if (oneKeyCustomObject.mapService == MapService.OSM) {
            mMapView = OneKeyMapView(inflater.context)
            mMapView!!.setDestroyMode(false)
            mMapView!!.tag = "mapView" // needed for OpenStreetMapViewTest
            mMapView!!.setOnGenericMotionListener(OnGenericMotionListener { v, event ->
                if (0 != event.source and InputDevice.SOURCE_CLASS_POINTER) {
                    when (event.action) {
                        MotionEvent.ACTION_SCROLL -> {
                            if (event.getAxisValue(MotionEvent.AXIS_VSCROLL) < 0.0f) mMapView!!.controller.zoomOut() else {
                                //this part just centers the map on the current mouse location before the zoom action occurs
                                val iGeoPoint =
                                        mMapView!!.projection.fromPixels(event.x.toInt(), event.y.toInt())
                                mMapView!!.controller.animateTo(iGeoPoint)
                                mMapView!!.controller.zoomIn()
                            }
                            return@OnGenericMotionListener true
                        }
                    }
                }
                false
            })
            return mMapView
        } else {
            return inflater.inflate(R.layout.fragment_one_key_google_map, container, false)
        }
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        if (oneKeyCustomObject.mapService == MapService.OSM) {
            if (savedInstanceState != null) {
                boundingBox = savedInstanceState.getBoolean("boundingBox", false)
                val list =
                        savedInstanceState.getParcelableArrayList<ActivityObject>(OneKeyConstant.locations)
                if (!list.isNullOrEmpty())
                    activities = list
            }
            drawMarkerOnMap(activities)
        } else if (oneKeyCustomObject.mapService == MapService.GOOGLE_MAP) {
            activity?.isGooglePlayServiceAvailable({
                (childFragmentManager.findFragmentById(R.id.googleMapView)
                        as? SupportMapFragment)?.getMapAsync(this)
            }, { })
        }

//        mMapView?.overlays?.addAll(oneKeyMarkers)
    }

    override fun onSaveInstanceState(outState: Bundle) {
        super.onSaveInstanceState(outState)
        outState.putParcelableArrayList(OneKeyConstant.locations, activities)
        outState.putBoolean("boundingBox", boundingBox)
    }

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)
        val context: Context? = this.activity
        locationProvider = GpsMyLocationProvider(context)
        locationProvider!!.startLocationProvider(this)
        if (oneKeyCustomObject.mapService == MapService.OSM) {
            mPrefs = context!!.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
            mLocationOverlay = CustomCurrentLocationOverlay(
                    locationProvider!!, mMapView, R.drawable.ic_current_location)
            mLocationOverlay!!.enableMyLocation()
            mMapView!!.overlays.add(mLocationOverlay)
            mRotationGestureOverlay = RotationGestureOverlay(mMapView)
            mRotationGestureOverlay!!.isEnabled = false
            mMapView!!.overlays.add(mRotationGestureOverlay)
            mMapView!!.mapOrientation = 0f
            mMapView!!.setMultiTouchControls(true)
            mMapView!!.isTilesScaledToDpi = true
            val zoomLevel = mPrefs!!.getFloat(PREFS_ZOOM_LEVEL_DOUBLE, 1f)
            mMapView!!.controller.setZoom(if (modifyZoomLevel > 0f) modifyZoomLevel.toDouble() else zoomLevel.toDouble())
            val orientation = mPrefs!!.getFloat(PREFS_ORIENTATION, 0f)
            val latitudeString = mPrefs!!.getString(PREFS_LATITUDE_STRING, "1.0")
            val longitudeString = mPrefs!!.getString(PREFS_LONGITUDE_STRING, "1.0")
            val latitude = java.lang.Double.valueOf(latitudeString)
            val longitude = java.lang.Double.valueOf(longitudeString)
            mMapView!!.setExpectedCenter(GeoPoint(latitude, longitude))
        }
    }

    override fun onResume() {
        super.onResume()
        if (oneKeyCustomObject.mapService == MapService.OSM) {
            try {
                mMapView!!.setTileSource(TileSourceFactory.WIKIMEDIA)
            } catch (e: IllegalArgumentException) {
                mMapView!!.setTileSource(TileSourceFactory.WIKIMEDIA)
            }
            mMapView?.onResume()
        }
    }

    override fun onPause() {
        if (oneKeyCustomObject.mapService == MapService.OSM) {
            mPrefs?.edit {
                putFloat(PREFS_ORIENTATION, mMapView!!.mapOrientation)
                putString(PREFS_LATITUDE_STRING, "${mMapView!!.mapCenter.latitude}")
                putString(PREFS_LONGITUDE_STRING, "${mMapView!!.mapCenter.longitude}")
                if (modifyZoomLevel == 0f)
                    putFloat(PREFS_ZOOM_LEVEL_DOUBLE, mMapView!!.zoomLevelDouble.toFloat())
            }
            mMapView?.onPause()
        }
        super.onPause()
    }

    override fun onDestroyView() {
        super.onDestroyView()
        mMapView?.onDetach()
        locationProvider?.stopLocationProvider()
    }

    override fun onLocationChanged(location: Location?, source: IMyLocationProvider?) {
        this.lastCurrentLocation = location
    }

    override fun onMarkerClick(marker: Marker?, mapView: org.osmdroid.views.MapView?): Boolean {
        if (mapView == null || mapView.overlays.isNullOrEmpty())
            return true
        marker?.let {
            validateMarker(marker)
            onMarkerSelectionChanged(marker.id)
        }
        return true
    }

    fun drawMarkerOnMap(activities: ArrayList<ActivityObject>, moveCamera: Boolean = false) {
        if (oneKeyCustomObject.mapService == MapService.OSM) {
            mMapView?.apply {
                val clustersFiltered = overlays?.filterIsInstance<RadiusMarkerClusterer>()
                        ?: listOf()
                overlays.removeAll(clustersFiltered)
                val clusters = RadiusMarkerClusterer(context!!)
                clusters.textPaint.textSize = 14 * resources.displayMetrics.density
                clusters.mAnchorV = Marker.ANCHOR_BOTTOM
                mMapView?.overlays?.add(clusters)
                selectedIcon = context!!.getDrawableFilledIcon(
                        R.drawable.ic_location_on_white_36dp,
                        oneKeyCustomObject.colorMarkerSelected.getColor()
                )!!
                activities.forEach { activity ->
                    val marker = OneKeyMarker(mMapView).apply {
                        id = activity.id
                        setOnMarkerClickListener(this@MapFragment)
                        val location = activity.workplace?.address?.location?.getGeoPoint()
                                ?: GeoPoint(0.0, 0.0)
                        position = location
                        setAnchor(Marker.ANCHOR_CENTER, 1f)
                        icon = context!!.getDrawableFilledIcon(
                                R.drawable.baseline_location_on_black_36dp,
                                oneKeyCustomObject.colorMarker.getColor()
                        )
                        title = activity.workplace?.address?.getAddress() ?: ""
                    }
                    clusters.add(marker)
                    oneKeyMarkers.add(marker)
                }
                if (moveCamera && activities.size == 1) {
                    val position = activities[0].workplace?.address?.location?.getGeoPoint()
                            ?: GeoPoint(0.0, 0.0)
                    controller.setCenter(position)
                    controller.animateTo(position, 15.0, 2000)
                }
                if (this@MapFragment.boundingBox) {
                    val position = activities.firstOrNull()?.workplace?.address?.location?.getGeoPoint()
                            ?: return
                    controller.setCenter(position)
                    controller.animateTo(position, 10.0, 2000)
                }
            }
        } else {
            this.activities = activities
            if (clusterManager.isNullable()) return
            googleMap.clear()
            val boundBuilder = LatLngBounds.builder()
            activities.forEach { activity ->
                val location = activity.workplace?.address?.location?.getLatLng()
                        ?: LatLng(0.0, 0.0)
                boundBuilder.include(location)
                val item = OneKeyGoogleMarkerItem(activity.id, activity.workplace?.address?.getAddress()
                        ?: "", "", location)
                clusterManager!!.addItem(item)
            }
            boundLocations(boundBuilder)
        }

    }

    fun drawAddressOnMap(listOfAddress: ArrayList<AddressObject>, moveCamera: Boolean = false) {
        if (oneKeyCustomObject.mapService == MapService.OSM) {
            mMapView?.apply {
                val clustersFiltered = overlays?.filterIsInstance<RadiusMarkerClusterer>()
                        ?: listOf()
                overlays.removeAll(clustersFiltered)
                val clusters = RadiusMarkerClusterer(context!!)
                clusters.textPaint.textSize = 14 * resources.displayMetrics.density
                clusters.mAnchorV = Marker.ANCHOR_BOTTOM
                mMapView?.overlays?.add(clusters)
                selectedIcon = context!!.getDrawableFilledIcon(
                        R.drawable.ic_location_on_white_36dp,
                        oneKeyCustomObject.colorMarkerSelected.getColor()
                )!!
                listOfAddress.forEach { address ->
                    val marker = OneKeyMarker(mMapView).apply {
                        id = address.activityId
                        setOnMarkerClickListener(this@MapFragment)
                        val location = address.location?.getGeoPoint()
                                ?: GeoPoint(0.0, 0.0)
                        position = location
                        setAnchor(Marker.ANCHOR_CENTER, 1f)
                        icon = context!!.getDrawableFilledIcon(
                                R.drawable.baseline_location_on_black_36dp,
                                oneKeyCustomObject.colorMarker.getColor()
                        )
                        title = address.getAddress() ?: ""
                    }
                    clusters.add(marker)
                    oneKeyMarkers.add(marker)
                }
                if (moveCamera && listOfAddress.size == 1) {
                    val position = listOfAddress[0].location?.getGeoPoint()
                            ?: GeoPoint(0.0, 0.0)
                    controller.setCenter(position)
                    controller.animateTo(position, 15.0, 2000)
                }
                if (this@MapFragment.boundingBox) {
                    val position = activities.firstOrNull()?.workplace?.address?.location?.getGeoPoint()
                            ?: return
                    controller.setCenter(position)
                    controller.animateTo(position, 10.0, 2000)
                }
            }
        } else if (oneKeyCustomObject.mapService == MapService.GOOGLE_MAP) {
            googleMap.clear()
            var location: LatLng = LatLng(0.0, 0.0)
            val items = arrayListOf<OneKeyGoogleMarkerItem>()
            val markerDescriptor = context!!.getDrawableFilledIcon(oneKeyCustomObject.markerIcon,
                    oneKeyCustomObject.colorMarker.getColor()).getBitmapDescriptor()
            listOfAddress.forEach { address ->
                location = address.location?.getLatLng() ?: LatLng(0.0, 0.0)
                val item = OneKeyGoogleMarkerItem(address.activityId, address.getAddress(), "", location)
                items.add(item)
            }
            context!!.showMarkerOnGoogleMap(googleMap, items, markerDescriptor)
            animateCameraGoogleMap(CameraUpdateFactory.newLatLngZoom(location, 13f))
        }
    }

    fun moveToPosition(position: GeoPoint) {
        mMapView?.apply {
            controller.setCenter(position)
            controller.animateTo(position, 13.0, 2000)
        }
    }

    private fun animateCameraGoogleMap(update: CameraUpdate) {
        googleMap.animateCamera(update)
    }

    private fun validateMarker(marker: Marker) {
        if (mMapView == null) return
        mMapView?.controller?.apply {
            setCenter(marker.position)
            animateTo(marker.position, mMapView!!.zoomLevelDouble.toDouble(), 2000)
        }
        oneKeyMarkers.filter { oneKeyMarker -> oneKeyMarker.selected }
                .mapIndexed { _, oneKeyMarker ->
                    val lastIndexOfOverLay = mMapView!!.overlays.indexOf(oneKeyMarker)
                    oneKeyMarker.icon = context!!.getDrawableFilledIcon(
                            R.drawable.baseline_location_on_black_36dp,
                            oneKeyCustomObject.colorMarker.getColor())
                    oneKeyMarker.selected = false
                    if (lastIndexOfOverLay >= 0) {
                        mMapView!!.overlays[lastIndexOfOverLay] = oneKeyMarker
                    }
                }
        val cluster = (mMapView?.overlays?.firstOrNull { o -> o is RadiusMarkerClusterer }
                as? RadiusMarkerClusterer)?.items ?: return

        val indexOfOverLay = cluster.indexOf(marker)
        val index = oneKeyMarkers.indexOf(marker)
        if (indexOfOverLay in 0 until cluster.size) {
            if (index >= 0) {
                (marker as? OneKeyMarker)?.apply {
                    marker.icon = selectedIcon
                    selected = true
                    oneKeyMarkers[index] = this
                }
                cluster.removeAt(indexOfOverLay)
                cluster.add(oneKeyMarkers[index])
            }
        }
    }

    fun moveToCurrentLocation(forcedZoom: Boolean = false) {
        locationProvider?.lastKnownLocation?.also { location ->
            if (oneKeyCustomObject.mapService == MapService.OSM) {
                mMapView?.apply {
                    val position = GeoPoint(location.latitude, location.longitude)
                    controller.setCenter(position)
                    controller.animateTo(position, if (forcedZoom) 15.0 else zoomLevelDouble, 2000)
                }
            } else {
                moveToPosition(location.getLatLng())
            }
        }
    }

    fun getLastLocation(): GeoPoint? =
            locationProvider?.lastKnownLocation?.run { GeoPoint(latitude, longitude) }

    /**
     * ================================
     * Functions handle Google map view
     * ================================
     */
    @Throws(SecurityException::class)
    override fun onMapReady(p0: GoogleMap?) {
        if (p0.isNullable()) return
        this.googleMap = p0!!
        googleMap.apply {
            isMyLocationEnabled = true
            uiSettings.isMyLocationButtonEnabled = false
            clusterManager = ClusterManager(context, this)
            googleMapMarkerRender = GoogleMapMarkerRender(context!!, this, clusterManager!!,
                    context!!.getDrawableFilledIcon(oneKeyCustomObject.markerIcon,
                            oneKeyCustomObject.colorMarker.getColor()).getBitmapDescriptor(),
                    context!!.getDrawableFilledIcon(oneKeyCustomObject.markerIcon,
                            oneKeyCustomObject.colorMarkerSelected.getColor()).getBitmapDescriptor())
            clusterManager?.renderer = googleMapMarkerRender
            clusterManager?.setOnClusterClickListener(this@MapFragment)
            clusterManager?.setOnClusterItemClickListener(this@MapFragment)
            setOnCameraIdleListener(clusterManager)
            setOnMarkerClickListener(clusterManager)
            drawMarkerOnMap(activities)
        }
    }

    override fun onClusterClick(cluster: Cluster<OneKeyGoogleMarkerItem>?): Boolean {
        val builder = LatLngBounds.builder()
        if (cluster == null) return true
        for (item in cluster.items) {
            builder.include(item.position)
        }
        boundLocations(builder)
        return true
    }

    override fun onClusterItemClick(p0: OneKeyGoogleMarkerItem?): Boolean {
        if (p0.isNullable()) return true
        googleMapMarkerRender?.apply {
            val lastItem = getLastItemSelected()
            if (lastItem.isNotNullable()) {
                try {
                    setMarkerIcon()
                } catch (e: Exception) {
                }
            }
            setSelectedMarkerIcon(p0!!)
        }
        onMarkerSelectionChanged(p0!!.id)
        return true
    }

    private fun boundLocations(boundBuilder: LatLngBounds.Builder) {
        try {
            animateCameraGoogleMap(CameraUpdateFactory.newLatLngBounds(boundBuilder.build(), 100))
        } catch (e: Exception) {
        }
    }

    private fun moveToPosition(latLng: LatLng) {
        googleMap.animateCamera(CameraUpdateFactory.newLatLngZoom(latLng, googleMap.cameraPosition.zoom))
    }
}