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
import com.ekino.onekeysdk.extensions.ThemeExtension
import com.ekino.onekeysdk.extensions.getColor
import com.ekino.onekeysdk.extensions.getDrawableFilledIcon
import com.ekino.onekeysdk.model.activity.ActivityObject
import com.ekino.onekeysdk.model.config.OneKeyViewCustomObject
import com.ekino.onekeysdk.model.map.OneKeyMarker
import com.ekino.onekeysdk.utils.OneKeyConstant
import customization.map.CustomCurrentLocationOverlay
import org.osmdroid.tileprovider.tilesource.TileSourceFactory
import org.osmdroid.util.BoundingBox
import org.osmdroid.util.GeoPoint
import org.osmdroid.views.MapView
import org.osmdroid.views.overlay.CopyrightOverlay
import org.osmdroid.views.overlay.Marker
import org.osmdroid.views.overlay.gestures.RotationGestureOverlay
import org.osmdroid.views.overlay.mylocation.GpsMyLocationProvider
import org.osmdroid.views.overlay.mylocation.IMyLocationConsumer
import org.osmdroid.views.overlay.mylocation.IMyLocationProvider
import org.osmdroid.views.overlay.mylocation.MyLocationNewOverlay

class MapFragment : IFragment(), IMyLocationConsumer, Marker.OnMarkerClickListener {

    companion object {
        fun newInstance(oneKeyViewCustomObject: OneKeyViewCustomObject,
                        activities: ArrayList<ActivityObject>, modifyZoomLevel: Float = 0f,
                        boundingBox: Boolean = false) =
                MapFragment().apply {
                    this.oneKeyViewCustomObject = oneKeyViewCustomObject
                    this.activities = activities
                    this.modifyZoomLevel = modifyZoomLevel
                    this.boundingBox = boundingBox
                }
    }

    private var oneKeyViewCustomObject: OneKeyViewCustomObject =
            ThemeExtension.getInstance().getThemeConfiguration()
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

    override fun onCreateView(
            inflater: LayoutInflater,
            container: ViewGroup?,
            savedInstanceState: Bundle?
    ): View? {
        //Note! we are programmatically construction the map view
        //be sure to handle application lifecycle correct (see note in on pause)
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
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        if (savedInstanceState != null) {
            boundingBox = savedInstanceState.getBoolean("boundingBox", false)
            val list =
                    savedInstanceState.getParcelableArrayList<ActivityObject>(OneKeyConstant.locations)
            if (!list.isNullOrEmpty())
                activities = list
        }
        drawMarkerOnMap(activities)

//        mMapView?.overlays?.addAll(oneKeyMarkers)
    }

    fun drawMarkerOnMap(activities: ArrayList<ActivityObject>, moveCamera: Boolean = false) {
        mMapView?.apply {
            val clustersFiltered = overlays?.filterIsInstance<RadiusMarkerClusterer>() ?: listOf()
            overlays.removeAll(clustersFiltered)
            val clusters = RadiusMarkerClusterer(context!!)
            clusters.textPaint.textSize = 14 * resources.displayMetrics.density
            clusters.mAnchorV = Marker.ANCHOR_BOTTOM
            mMapView?.overlays?.add(clusters)
            selectedIcon = context!!.getDrawableFilledIcon(
                    R.drawable.ic_location_on_white_36dp,
                    oneKeyViewCustomObject.colorMarkerSelected.getColor()
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
                            oneKeyViewCustomObject.colorMarker.getColor()
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
                controller.animateTo(position, 16.5, 2000)
            }
            if (this@MapFragment.boundingBox) {
                val geoPoints = arrayListOf<GeoPoint>().apply {
                    oneKeyMarkers.forEach {
                        add(it.position)
                    }
                }
                zoomToBoundingBox(BoundingBox.fromGeoPointsSafe(geoPoints), true)
            }
        }
    }

    fun moveToPosition(position:GeoPoint){
        mMapView?.apply {
            controller.setCenter(position)
            controller.animateTo(position, 13.0, 2000)
        }
    }

    override fun onSaveInstanceState(outState: Bundle) {
        super.onSaveInstanceState(outState)
        outState.putParcelableArrayList(OneKeyConstant.locations, activities)
        outState.putBoolean("boundingBox", boundingBox)
    }

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)
        val context: Context? = this.activity
        val dm = context!!.resources.displayMetrics

        mPrefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        //My Location
        //note you have handle the permissions yourself, the overlay did not do it for you
        locationProvider = GpsMyLocationProvider(context)
        locationProvider!!.startLocationProvider(this)
        mLocationOverlay =
                CustomCurrentLocationOverlay(
                        locationProvider!!,
                        mMapView,
                        R.drawable.ic_current_location
                )
        mLocationOverlay!!.enableMyLocation()
        mMapView!!.overlays.add(mLocationOverlay)
//        mCopyrightOverlay = CopyrightOverlay(context)
//        mMapView!!.overlays.add(mCopyrightOverlay)


        //support for map rotation
        mRotationGestureOverlay = RotationGestureOverlay(mMapView)
        mRotationGestureOverlay!!.isEnabled = false
        mMapView!!.overlays.add(mRotationGestureOverlay)
        mMapView!!.mapOrientation = 0f

        //needed for pinch zooms
        mMapView!!.setMultiTouchControls(true)

        //scales tiles to the current screen's DPI, helps with readability of labels
        mMapView!!.isTilesScaledToDpi = true
        //the rest of this is restoring the last map location the user looked at

        //the rest of this is restoring the last map location the user looked at
        val zoomLevel = mPrefs!!.getFloat(PREFS_ZOOM_LEVEL_DOUBLE, 1f)
        mMapView!!.controller.setZoom(if (modifyZoomLevel > 0f) modifyZoomLevel.toDouble() else zoomLevel.toDouble())
        val orientation = mPrefs!!.getFloat(PREFS_ORIENTATION, 0f)
//        mMapView!!.setMapOrientation(orientation, false)
        val latitudeString = mPrefs!!.getString(PREFS_LATITUDE_STRING, "1.0")
        val longitudeString = mPrefs!!.getString(PREFS_LONGITUDE_STRING, "1.0")
        val latitude = java.lang.Double.valueOf(latitudeString)
        val longitude = java.lang.Double.valueOf(longitudeString)
        mMapView!!.setExpectedCenter(GeoPoint(latitude, longitude))
    }

    override fun onResume() {
        super.onResume()
        try {
            mMapView!!.setTileSource(TileSourceFactory.WIKIMEDIA)
        } catch (e: IllegalArgumentException) {
            mMapView!!.setTileSource(TileSourceFactory.WIKIMEDIA)
        }
        mMapView?.onResume()
    }

    override fun onPause() {
        mPrefs?.edit {
            putFloat(PREFS_ORIENTATION, mMapView!!.mapOrientation)
            putString(PREFS_LATITUDE_STRING, "${mMapView!!.mapCenter.latitude}")
            putString(PREFS_LONGITUDE_STRING, "${mMapView!!.mapCenter.longitude}")
            if (modifyZoomLevel == 0f)
                putFloat(PREFS_ZOOM_LEVEL_DOUBLE, mMapView!!.zoomLevelDouble.toFloat())
        }
        mMapView?.onPause()
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

    fun invalidateMapView() {
        mMapView!!.invalidate()
    }

    override fun onMarkerClick(marker: Marker?, mapView: MapView?): Boolean {
        if (mapView == null || mapView.overlays.isNullOrEmpty())
            return true
        marker?.let {
            validateMarker(marker)
            onMarkerSelectionChanged(marker.id)
        }
        return true
    }

    private fun validateMarker(marker: Marker) {
        if (mMapView == null) return
        mMapView?.controller?.apply {
            setCenter(marker.position)
            animateTo(marker.position, 14.0, 2000)
        }
        oneKeyMarkers.filter { oneKeyMarker -> oneKeyMarker.selected }
                .mapIndexed { _, oneKeyMarker ->
                    val lastIndexOfOverLay = mMapView!!.overlays.indexOf(oneKeyMarker)
                    oneKeyMarker.icon = context!!.getDrawableFilledIcon(
                            R.drawable.baseline_location_on_black_36dp,
                            oneKeyViewCustomObject.colorMarker.getColor()
                    )
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

    fun moveToCurrentLocation() {
        locationProvider?.lastKnownLocation?.also { location ->
            mMapView?.apply {
                val position = GeoPoint(location.latitude, location.longitude)
                controller.setCenter(position)
                controller.animateTo(position, 16.0, 2000)
            }
        }
    }

    fun getLastLocation(): GeoPoint? =
            locationProvider?.lastKnownLocation?.run { GeoPoint(latitude, longitude) }
}