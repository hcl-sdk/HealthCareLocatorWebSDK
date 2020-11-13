package com.ekino.onekeysdk.fragments.map

import android.content.Context
import android.content.SharedPreferences
import android.location.Location
import android.os.Bundle
import android.util.Log
import android.view.*
import android.view.View.OnGenericMotionListener
import androidx.core.content.edit
import base.fragments.IFragment
import com.ekino.onekeysdk.R
import com.ekino.onekeysdk.extensions.getDrawableFilledIcon
import com.ekino.onekeysdk.model.OneKeyLocation
import com.ekino.onekeysdk.model.config.OneKeyViewCustomObject
import customization.map.CustomCurrentLocationOverlay
import org.osmdroid.tileprovider.tilesource.TileSourceFactory
import org.osmdroid.util.GeoPoint
import org.osmdroid.views.MapView
import org.osmdroid.views.overlay.CopyrightOverlay
import org.osmdroid.views.overlay.Marker
import org.osmdroid.views.overlay.ScaleBarOverlay
import org.osmdroid.views.overlay.compass.CompassOverlay
import org.osmdroid.views.overlay.gestures.RotationGestureOverlay
import org.osmdroid.views.overlay.mylocation.GpsMyLocationProvider
import org.osmdroid.views.overlay.mylocation.IMyLocationConsumer
import org.osmdroid.views.overlay.mylocation.IMyLocationProvider
import org.osmdroid.views.overlay.mylocation.MyLocationNewOverlay

class MapFragment(private val oneKeyViewCustomObject: OneKeyViewCustomObject,
                  private val locations: ArrayList<OneKeyLocation>) :
        IFragment(), IMyLocationConsumer {

    companion object {
        fun newInstance(oneKeyViewCustomObject: OneKeyViewCustomObject, locations: ArrayList<OneKeyLocation>) =
                MapFragment(oneKeyViewCustomObject, locations)
    }

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
    private var mMapView: MapView? = null
    private var mLocationOverlay: MyLocationNewOverlay? = null
    private var lastCurrentLocation: Location? = null
    private val mCompassOverlay: CompassOverlay? = null
    private val mScaleBarOverlay: ScaleBarOverlay? = null
    private var mRotationGestureOverlay: RotationGestureOverlay? = null
    private var mCopyrightOverlay: CopyrightOverlay? = null

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {


        //Note! we are programmatically construction the map view
        //be sure to handle application lifecycle correct (see note in on pause)
        mMapView = MapView(inflater.context)
        mMapView!!.setDestroyMode(false)
        mMapView!!.tag = "mapView" // needed for OpenStreetMapViewTest
        mMapView!!.setOnGenericMotionListener(OnGenericMotionListener { v, event ->
            if (0 != event.source and InputDevice.SOURCE_CLASS_POINTER) {
                when (event.action) {
                    MotionEvent.ACTION_SCROLL -> {
                        if (event.getAxisValue(MotionEvent.AXIS_VSCROLL) < 0.0f) mMapView!!.controller.zoomOut() else {
                            //this part just centers the map on the current mouse location before the zoom action occurs
                            val iGeoPoint = mMapView!!.projection.fromPixels(event.x.toInt(), event.y.toInt())
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
        locations.forEach { location ->
            val marker = Marker(mMapView).apply {
                position = GeoPoint(location.latitude, location.longitude)
                setAnchor(Marker.ANCHOR_CENTER, 1f)
                icon = context!!.getDrawableFilledIcon(R.drawable.baseline_location_on_black_36dp,
                        oneKeyViewCustomObject.markerColor)
                title = location.address
            }
            mMapView?.overlays?.add(marker)
        }
        mMapView?.overlays
    }

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)
        val context: Context? = this.activity
        val dm = context!!.resources.displayMetrics

        mPrefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)

        //My Location
        //note you have handle the permissions yourself, the overlay did not do it for you
        val locationProvider = GpsMyLocationProvider(context)
        locationProvider.startLocationProvider(this)
        mLocationOverlay = CustomCurrentLocationOverlay(locationProvider, mMapView, R.drawable.ic_current_location)
        mLocationOverlay!!.enableMyLocation()
        mMapView!!.overlays.add(mLocationOverlay)

        mCopyrightOverlay = CopyrightOverlay(context)
        mMapView!!.overlays.add(mCopyrightOverlay)


        //support for map rotation
        mRotationGestureOverlay = RotationGestureOverlay(mMapView)
        mRotationGestureOverlay!!.isEnabled = true
        mMapView!!.overlays.add(mRotationGestureOverlay)

        //needed for pinch zooms
        mMapView!!.setMultiTouchControls(true)

        //scales tiles to the current screen's DPI, helps with readability of labels
        mMapView!!.isTilesScaledToDpi = true
        //the rest of this is restoring the last map location the user looked at

        //the rest of this is restoring the last map location the user looked at
        val zoomLevel = mPrefs!!.getFloat(PREFS_ZOOM_LEVEL_DOUBLE, 1f)
        mMapView!!.controller.setZoom(zoomLevel.toDouble())
        val orientation = mPrefs!!.getFloat(PREFS_ORIENTATION, 0f)
        mMapView!!.setMapOrientation(orientation, false)
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
            putFloat(PREFS_ZOOM_LEVEL_DOUBLE, mMapView!!.zoomLevelDouble.toFloat())
        }
        mMapView?.onPause()
        super.onPause()
    }

    override fun onDestroyView() {
        super.onDestroyView()
        mMapView?.onDetach()
    }

    override fun onLocationChanged(location: Location?, source: IMyLocationProvider?) {
        this.lastCurrentLocation = location
        Log.d("onLocationChanged", "lat: ${location?.latitude} -- lng: ${location?.longitude}")
    }

    fun zoomIn() {
        mMapView?.controller?.zoomIn()
    }

    fun zoomOut() {
        mMapView?.controller?.zoomOut()
    }

    // @Override
    // public boolean onTrackballEvent(final MotionEvent event) {
    // return this.mMapView.onTrackballEvent(event);
    // }
    fun invalidateMapView() {
        mMapView!!.invalidate()
    }
}