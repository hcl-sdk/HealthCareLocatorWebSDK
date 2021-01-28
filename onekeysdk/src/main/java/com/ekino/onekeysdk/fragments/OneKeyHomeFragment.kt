package com.ekino.onekeysdk.fragments

import android.content.res.Configuration
import android.graphics.Color
import android.os.Bundle
import android.view.View
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.GridLayoutManager
import base.extensions.addFragment
import base.fragments.AppFragment
import com.ekino.onekeysdk.R
import com.ekino.onekeysdk.adapter.home.OneKeyHomeAdapter
import com.ekino.onekeysdk.extensions.*
import com.ekino.onekeysdk.fragments.map.FullMapFragment
import com.ekino.onekeysdk.fragments.search.SearchFragment
import com.ekino.onekeysdk.model.config.HealthCareLocatorCustomObject
import com.ekino.onekeysdk.state.HealthCareLocatorSDK
import com.ekino.onekeysdk.viewmodel.home.HomeViewModel
import kotlinx.android.synthetic.main.fragment_home.*

class OneKeyHomeFragment :
        AppFragment<OneKeyHomeFragment, HomeViewModel>(R.layout.fragment_home) {
    companion object {
        fun newInstance(): OneKeyHomeFragment = OneKeyHomeFragment()
    }

    private var healthCareLocatorCustomObject: HealthCareLocatorCustomObject = HealthCareLocatorSDK.getInstance().getConfiguration()

    private val homeAdapter by lazy { OneKeyHomeAdapter(healthCareLocatorCustomObject) }

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