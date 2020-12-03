package com.ekino.onekeysdk.fragments.map

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.LinearLayoutManager
import base.fragments.IFragment
import com.ekino.onekeysdk.R
import com.ekino.onekeysdk.adapter.search.SearchAdapter
import com.ekino.onekeysdk.custom.CenterLayoutManager
import com.ekino.onekeysdk.extensions.ThemeExtension
import com.ekino.onekeysdk.extensions.getFragmentBy
import com.ekino.onekeysdk.extensions.getScreenWidth
import com.ekino.onekeysdk.extensions.postDelay
import com.ekino.onekeysdk.model.OneKeyLocation
import com.ekino.onekeysdk.model.config.OneKeyViewCustomObject
import kotlinx.android.synthetic.main.fragment_map_result.*

class OneKeyMapResultFragment : IFragment(), View.OnClickListener {

    companion object {
        fun newInstance(oneKeyViewCustomObject: OneKeyViewCustomObject,
                        locations: ArrayList<OneKeyLocation>) = OneKeyMapResultFragment().apply {
            this.locations = locations
            this.oneKeyViewCustomObject = oneKeyViewCustomObject
        }
    }

    private var oneKeyViewCustomObject: OneKeyViewCustomObject = ThemeExtension.getInstance().getThemeConfiguration()
    private val mapFragmentTag: String = StarterMapFragment::class.java.name
    private val mapFragment by lazy { MapFragment.newInstance(oneKeyViewCustomObject, locations) }
    private var locations: ArrayList<OneKeyLocation> = arrayListOf()
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
        rvLocations.apply {
            layoutManager = CenterLayoutManager(context, LinearLayoutManager.HORIZONTAL, false)
            adapter = searchAdapter
            searchAdapter.setData(locations)
        }
        rvLocations.postDelay({
            getRunningMapFragment()?.onMarkerSelectionChanged = { id ->
                val selectedPosition = locations.indexOfFirst { it.id == id }
                if (selectedPosition >= 0) {
                    rvLocations.smoothScrollToPosition(selectedPosition)
                    searchAdapter.setSelectedPosition(selectedPosition)
                }
            }
        }, 1000L)

        searchAdapter.onHCPCardClickedListener = { oneKeyLocation ->
            (parentFragment as? FullMapFragment)?.navigateToHCPProfile(oneKeyLocation)
        }
        btnCurrentLocation.setOnClickListener(this)
    }

    override fun onClick(v: View?) {
        when (v?.id) {
            R.id.btnCurrentLocation -> getRunningMapFragment()?.moveToCurrentLocation()
        }
    }

    private fun getRunningMapFragment(): MapFragment? {
        return if (isAdded) childFragmentManager.fragments.getFragmentBy {
            it::class.java.simpleName == MapFragment::class.java.simpleName
        } as? MapFragment
        else null

    }
}