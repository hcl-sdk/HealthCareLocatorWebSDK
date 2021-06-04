package com.healthcarelocator.fragments.profile

import android.graphics.Color
import android.os.Bundle
import android.view.View
import base.fragments.AppFragment
import com.healthcarelocator.R
import com.healthcarelocator.extensions.*
import com.healthcarelocator.fragments.map.MapFragment
import com.healthcarelocator.fragments.map.StarterMapFragment
import com.healthcarelocator.model.activity.OtherActivityObject
import com.healthcarelocator.model.config.HealthCareLocatorCustomObject
import com.healthcarelocator.state.HealthCareLocatorSDK
import com.healthcarelocator.viewmodel.profile.HCLProfileMapViewModel
import kotlinx.android.synthetic.main.fragment_one_key_profile_map.*

class HCLProfileMapFragment : AppFragment<HCLProfileMapFragment,
        HCLProfileMapViewModel>(R.layout.fragment_one_key_profile_map), View.OnClickListener {

    companion object {
        fun newInstance(activity: OtherActivityObject): HCLProfileMapFragment =
                HCLProfileMapFragment().apply {
                    this.activityObject = activity
                }
    }

    private var healthCareLocatorCustomObject: HealthCareLocatorCustomObject = HealthCareLocatorSDK.getInstance().getConfiguration()
    private val mapFragmentTag: String = StarterMapFragment::class.java.name
    private val mapFragment by lazy {
        MapFragment.newInstance(healthCareLocatorCustomObject, arrayListOf(), 0f, true)
    }
    private var activityObject: OtherActivityObject? = null

    override val viewModel = HCLProfileMapViewModel()

    override fun initView(view: View, savedInstanceState: Bundle?) {
        if (savedInstanceState != null) {
            activityObject = savedInstanceState.getParcelable("activity")
        }
        val fm = this@HCLProfileMapFragment.childFragmentManager
        if (fm.findFragmentByTag(mapFragmentTag) == null && savedInstanceState == null) {
            fm.beginTransaction().add(R.id.mapContainer, mapFragment, mapFragmentTag)
                    .commit()
        }
        mapWrapper.setBackgroundWithCorner(Color.WHITE,
                healthCareLocatorCustomObject.colorCardBorder.getColor(), 16f, 3)
        btnClose.setColorFilter(healthCareLocatorCustomObject.colorGreyDark.getColor())
        mapContainer.postDelay({ _ ->
            activityObject?.apply {
                val address = workplace?.address
                if (address.isNotNullable())
                    getRunningMapFragment()?.drawAddressOnMap(arrayListOf(address!!), true)
            }
        }, 500L)
        initView()
        healthCareLocatorCustomObject.apply {
            btnCurrentLocation.setIconFromDrawableId(iconMapGeoLoc)
            btnClose.setIconFromDrawableId(iconCross, true, colorGrey.getColor())
        }
    }

    override fun onSaveInstanceState(outState: Bundle) {
        super.onSaveInstanceState(outState)
        outState.putParcelable("activity", activityObject)
    }

    override fun onClick(v: View?) {
        when (v?.id) {
            R.id.btnClose -> activity?.onBackPressed()
            R.id.btnCurrentLocation -> getRunningMapFragment()?.moveToCurrentLocation()
        }
    }

    private fun initView() {
        btnClose.setOnClickListener(this)
        btnCurrentLocation.setOnClickListener(this)
        activityObject?.apply {
            tvBuilding.text = workplace?.name ?: ""
            tvAddress.text = workplace?.address?.getAddress() ?: ""
            ivLocation.setColorFilter(healthCareLocatorCustomObject.colorMarker.getColor())
        }
    }

    private fun getRunningMapFragment(): MapFragment? {
        return if (isAdded) childFragmentManager.fragments.getFragmentBy {
            it::class.java.simpleName == MapFragment::class.java.simpleName
        } as? MapFragment
        else null

    }
}