package com.ekino.onekeysdk.fragments.map

import android.view.View
import androidx.lifecycle.Observer
import base.fragments.AppFragment
import com.ekino.onekeysdk.R
import com.ekino.onekeysdk.extensions.getDummyHCP
import com.ekino.onekeysdk.model.config.OneKeyViewCustomObject
import com.ekino.onekeysdk.viewmodel.map.FullMapViewModel

class FullMapFragment(private val oneKeyViewCustomObject: OneKeyViewCustomObject) :
        AppFragment<FullMapFragment, FullMapViewModel>(R.layout.fragment_full_map) {
    companion object {
        fun newInstance(oneKeyViewCustomObject: OneKeyViewCustomObject) =
                FullMapFragment(oneKeyViewCustomObject)
    }

    private val mapFragmentTag: String = StarterMapFragment::class.java.name
    private val mapFragment by lazy { MapFragment.newInstance(oneKeyViewCustomObject, getDummyHCP()) }

    override val viewModel: FullMapViewModel = FullMapViewModel()

    override fun initView(view: View) {
        viewModel.apply {
            requestPermissions(this@FullMapFragment)
            permissionRequested.observe(this@FullMapFragment, Observer { granted ->
                if (!granted) return@Observer
                val fm = this@FullMapFragment.childFragmentManager
                if (fm.findFragmentByTag(mapFragmentTag) == null) {
                    fm.beginTransaction().add(R.id.mapContainer, mapFragment, mapFragmentTag)
                            .commit()
                }
            })
        }
    }

    override val onPassingEventListener: (data: Any) -> Unit = {
        super.onPassingEventListener
    }
}