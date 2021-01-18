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
import com.ekino.onekeysdk.model.config.OneKeyCustomObject
import com.ekino.onekeysdk.state.OneKeySDK
import com.ekino.onekeysdk.viewmodel.home.HomeViewModel
import kotlinx.android.synthetic.main.fragment_home.*

class OneKeyHomeFragment :
        AppFragment<OneKeyHomeFragment, HomeViewModel>(R.layout.fragment_home) {
    companion object {
        fun newInstance(): OneKeyHomeFragment = OneKeyHomeFragment()
    }

    private var oneKeyCustomObject: OneKeyCustomObject = OneKeySDK.getInstance().getConfiguration()

    private val homeAdapter by lazy { OneKeyHomeAdapter(oneKeyCustomObject) }

    override val viewModel: HomeViewModel = HomeViewModel()

    override fun initView(view: View, savedInstanceState: Bundle?) {
        btnStartSearch.setOnClickListener { startNewSearch() }
        oneKeyCustomObject.also {
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
        homeAdapter.setData(getHomeDummy(context!!, oneKeyCustomObject.searchIcon, oneKeyCustomObject.iconProfile))
    }

    override fun onResume() {
        super.onResume()
        FullMapFragment.clear()
    }

    private fun startNewSearch() {
        oneKeyCustomObject?.also {
            (activity as? AppCompatActivity)?.addFragment(
                    R.id.fragmentContainer,
                    SearchFragment.newInstance(it), true
            )
        }
    }
}