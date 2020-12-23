package com.ekino.onekeysdk.fragments.profile

import android.graphics.Color
import android.os.Bundle
import android.view.View
import base.fragments.AppFragment
import com.ekino.onekeysdk.R
import com.ekino.onekeysdk.extensions.*
import com.ekino.onekeysdk.fragments.map.MapFragment
import com.ekino.onekeysdk.fragments.map.StarterMapFragment
import com.ekino.onekeysdk.model.activity.ActivityObject
import com.ekino.onekeysdk.model.config.OneKeyViewCustomObject
import com.ekino.onekeysdk.viewmodel.profile.OneKeyProfileMapViewModel
import kotlinx.android.synthetic.main.fragment_one_key_profile_map.*

class OneKeyProfileMapFragment : AppFragment<OneKeyProfileMapFragment,
        OneKeyProfileMapViewModel>(R.layout.fragment_one_key_profile_map), View.OnClickListener {

    companion object {
        fun newInstance(activity: ActivityObject): OneKeyProfileMapFragment =
                OneKeyProfileMapFragment().apply {
                    this.activityObject = activity
                }
    }

    private var oneKeyViewCustomObject: OneKeyViewCustomObject = ThemeExtension.getInstance().getThemeConfiguration()
    private val mapFragmentTag: String = StarterMapFragment::class.java.name
    private val mapFragment by lazy {
        MapFragment.newInstance(oneKeyViewCustomObject, arrayListOf(), 0f, true)
    }
    private var activityObject: ActivityObject? = null

    override val viewModel = OneKeyProfileMapViewModel()

    override fun initView(view: View, savedInstanceState: Bundle?) {
        if (savedInstanceState != null) {
            activityObject = savedInstanceState.getParcelable("activity")
        }
        val fm = this@OneKeyProfileMapFragment.childFragmentManager
        if (fm.findFragmentByTag(mapFragmentTag) == null && savedInstanceState == null) {
            fm.beginTransaction().add(R.id.mapContainer, mapFragment, mapFragmentTag)
                    .commit()
        }
        mapWrapper.setBackgroundWithCorner(Color.WHITE,
                oneKeyViewCustomObject.colorCardBorder.getColor(), 16f, 3)
        btnClose.setColorFilter(oneKeyViewCustomObject.colorGreyDark.getColor())
        mapContainer.postDelay({
            activityObject?.apply {
                getRunningMapFragment()?.drawMarkerOnMap(arrayListOf(activityObject!!), true)
            }
        }, 500L)
        initView()
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
            ivLocation.setColorFilter(oneKeyViewCustomObject.colorMarker.getColor())
        }
    }

    private fun getRunningMapFragment(): MapFragment? {
        return if (isAdded) childFragmentManager.fragments.getFragmentBy {
            it::class.java.simpleName == MapFragment::class.java.simpleName
        } as? MapFragment
        else null

    }
}