package com.healthcarelocator.fragments

import android.content.res.Configuration
import android.graphics.Color
import android.os.Bundle
import android.view.View
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.GridLayoutManager
import base.extensions.addFragment
import base.fragments.AppFragment
import com.healthcarelocator.R
import com.healthcarelocator.adapter.home.HCLHomeAdapter
import com.healthcarelocator.extensions.*
import com.healthcarelocator.fragments.map.FullMapFragment
import com.healthcarelocator.fragments.search.SearchFragment
import com.healthcarelocator.model.config.HealthCareLocatorCustomObject
import com.healthcarelocator.state.HealthCareLocatorSDK
import com.healthcarelocator.viewmodel.home.HomeViewModel
import kotlinx.android.synthetic.main.fragment_home.*

class HCLHomeFragment :
        AppFragment<HCLHomeFragment, HomeViewModel>(R.layout.fragment_home) {
    companion object {
        fun newInstance(): HCLHomeFragment = HCLHomeFragment()
    }

    private var healthCareLocatorCustomObject: HealthCareLocatorCustomObject = HealthCareLocatorSDK.getInstance().getConfiguration()

    private val homeAdapter by lazy { HCLHomeAdapter(healthCareLocatorCustomObject) }

    override val viewModel: HomeViewModel = HomeViewModel()

    override fun initView(view: View, savedInstanceState: Bundle?) {
        btnStartSearch.setOnClickListener { startNewSearch() }
        healthCareLocatorCustomObject.also {
            contentWrapper.setBackgroundWithCorner(Color.WHITE, it.colorCardBorder.getColor(), 15f, 3)
            tvHomeHeader.setTextColor(it.colorSecondary.getColor())
            container.setBackgroundColor(it.colorViewBackground.getColor())
            btnStartSearch.setRippleBackground(it.colorPrimary)
        }

        rvHome.postDelay({
            if (rvHome == null) return@postDelay
            rvHome.apply {
                val orientation = resources.configuration.orientation
                layoutManager = GridLayoutManager(
                        context,
                        if (orientation == Configuration.ORIENTATION_PORTRAIT) 1 else 3
                )
                val padding = paddingStart
                setPadding(
                        padding, paddingTop, if (orientation == Configuration.ORIENTATION_LANDSCAPE)
                    0 else padding, paddingBottom
                )
                adapter = homeAdapter
            }
        })
        homeAdapter.setData(getHomeDummy(context!!, healthCareLocatorCustomObject.searchIcon, healthCareLocatorCustomObject.iconProfile))
    }

    override fun onResume() {
        super.onResume()
        FullMapFragment.clear()
    }

    private fun startNewSearch() {
        healthCareLocatorCustomObject?.also {
            (activity as? AppCompatActivity)?.addFragment(
                    R.id.fragmentContainer,
                    SearchFragment.newInstance(it), true
            )
        }
    }
}