package com.ekino.onekeysdk.fragments.map

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.view.animation.AnimationUtils
import android.widget.Toast
import androidx.recyclerview.widget.LinearLayoutManager
import base.fragments.IFragment
import com.ekino.onekeysdk.R
import com.ekino.onekeysdk.adapter.search.SearchAdapter
import com.ekino.onekeysdk.custom.CenterLayoutManager
import com.ekino.onekeysdk.extensions.*
import com.ekino.onekeysdk.model.activity.ActivityObject
import com.ekino.onekeysdk.model.config.HealthCareLocatorCustomObject
import com.ekino.onekeysdk.model.map.OneKeyPlace
import com.ekino.onekeysdk.state.HealthCareLocatorSDK
import kotlinx.android.synthetic.main.fragment_map_result.*
import org.osmdroid.events.MapListener
import org.osmdroid.events.ScrollEvent
import org.osmdroid.events.ZoomEvent


class OneKeyMapResultFragment : IFragment(), View.OnClickListener, MapListener {

    companion object {
        fun newInstance() = OneKeyMapResultFragment().apply {
        }
    }

    private var healthCareLocatorCustomObject: HealthCareLocatorCustomObject = HealthCareLocatorSDK.getInstance().getConfiguration()
    private val mapFragmentTag: String = StarterMapFragment::class.java.name
    private val mapFragment by lazy {
        MapFragment.newInstance(healthCareLocatorCustomObject, activities, 0f, true)
    }
    private var isRelaunch = false
    private var activities: ArrayList<ActivityObject> = arrayListOf()
    private val searchAdapter by lazy { SearchAdapter(getScreenWidth()) }

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        return inflater.inflate(R.layout.fragment_map_result, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        val fm = this@OneKeyMapResultFragment.childFragmentManager
        if (fm.findFragmentByTag(mapFragmentTag) == null && savedInstanceState == null) {
            fm.beginTransaction().add(R.id.mapContainer, mapFragment, mapFragmentTag)
                    .commit()
        }
        mapFragment.onMapListener = this
        isRelaunch = getAbsFragment()?.getRelaunchState() ?: false
        getAbsFragment()?.getActivities()?.also {
            this.activities = it
        }
        rvLocations.apply {
            layoutManager = CenterLayoutManager(context, LinearLayoutManager.HORIZONTAL, false)
            adapter = searchAdapter
            showDistance()
            searchAdapter.setData(activities)
        }
        rvLocations.postDelay({
            getRunningMapFragment()?.drawMarkerOnMap(activities, false,
                    getAbsFragment()?.isNearMe() ?: false)
            getRunningMapFragment()?.onMarkerSelectionChanged = { ids ->
                val selectedPosition = activities.getIndexes {
                    ids.indexOf(it.id)>=0
                }
                if (selectedPosition.isNotEmpty()) {
                    rvLocations.smoothScrollToPosition(selectedPosition.first())
                    searchAdapter.setSelectedPosition(selectedPosition)
                }
            }
        }, 1000L)

        searchAdapter.onHCPCardClickedListener = { oneKeyLocation ->
            if (parentFragment is FullMapFragment) (parentFragment as FullMapFragment).navigateToHCPProfile(oneKeyLocation)
            else if (parentFragment is OneKeyNearMeFragment) (parentFragment as OneKeyNearMeFragment).navigateToHCPProfile(oneKeyLocation)
        }
        showRelaunch(isRelaunch)
        btnRelaunch.setOnClickListener(this)
        btnCurrentLocation.setOnClickListener(this)
        btnRelaunch.setRippleBackground(healthCareLocatorCustomObject.colorSecondary.getColor(), 50f)
        btnCurrentLocation.setIconFromDrawableId(healthCareLocatorCustomObject.iconMapGeoLoc)
    }

    override fun onClick(v: View?) {
        when (v?.id) {
            R.id.btnCurrentLocation -> {
                showLoading(true)
                getRunningMapFragment()?.moveToCurrentLocation() { lat, lng ->
                    getAbsFragment()?.also {
                        it.setNearMeState(true)
                        it.forceSearch(OneKeyPlace(context!!, lat, lng))
                    }
                }
            }
            R.id.btnRelaunch -> {
                animateRelaunch(true)
                getRunningMapFragment()?.getCenter() { lat, lng ->
                    getAbsFragment()?.also {
                        it.setNearMeState(false)
                        it.reverseGeoCoding(OneKeyPlace(context!!, lat, lng))
                    }
                }
            }
        }
    }

    override fun onScroll(event: ScrollEvent?): Boolean {
        if (event != null && event.x != 0 && event.y != 0) {
            requestRelaunch()
        }
        return true
    }

    override fun onZoom(event: ZoomEvent?): Boolean {
        return true
    }

    private fun getRunningMapFragment(): MapFragment? {
        return if (isAdded) childFragmentManager.fragments.getFragmentBy {
            it::class.java.simpleName == MapFragment::class.java.simpleName
        } as? MapFragment
        else null

    }

    fun requestRelaunch() {
        isRelaunch = true
        getAbsFragment()?.setRelaunchState(true)
        showRelaunch(isRelaunch)
    }

    fun updateActivities(activities: ArrayList<ActivityObject>) {
        showDistance()
        showLoading(false)
        animateRelaunch(false)
        this.activities = activities
        searchAdapter.setData(activities)
        getRunningMapFragment()?.let {
            it.drawMarkerOnMap(activities, false, getAbsFragment()?.isNearMe() ?: false)
        }
    }

    private fun showLoading(state: Boolean) {
        loadingCurrentLocation.visibility = state.getVisibility()
    }

    private fun animateRelaunch(state: Boolean) {
        if (state) {
            showRelaunch(true)
            btnRelaunch.isEnabled = false
            context?.also {
                ivRelaunch.startAnimation(AnimationUtils.loadAnimation(it,
                        R.anim.onekey_sdk_rotate).apply { fillAfter = true })
            }
        } else {
            btnRelaunch.isEnabled = true
            ivRelaunch.clearAnimation()
            ivRelaunch.animate().cancel()
            getAbsFragment()?.setRelaunchState(false)
            showRelaunch(state)
        }
    }

    private fun showRelaunch(state: Boolean) {
        btnRelaunch.visibility = state.getVisibility()
    }

    private fun showDistance(){
        searchAdapter.isPlaceAvailable = getAbsFragment()?.getPlaceDetail()?.placeId?.isNotNullAndEmpty()?:false
    }

    private fun getAbsFragment(): AbsMapFragment<*, *>? = parentFragment as? AbsMapFragment<*, *>
}