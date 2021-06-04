package com.healthcarelocator.adapter.search

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import com.healthcarelocator.R
import com.healthcarelocator.adapter.HCLAdapter
import com.healthcarelocator.adapter.HCLViewHolder
import com.healthcarelocator.extensions.getColor
import com.healthcarelocator.extensions.setIconFromDrawableId
import com.healthcarelocator.extensions.setRippleCircleBackground
import com.healthcarelocator.model.config.HealthCareLocatorCustomObject
import com.healthcarelocator.model.map.HCLPlace
import kotlinx.android.synthetic.main.layout_one_key_place.view.*

class HCLPlaceAdapter(private val healthCareLocatorCustomObject: HealthCareLocatorCustomObject?,
                      private val onPlaceClickedListener: OnHCLPlaceClickedListener) :
        HCLAdapter<HCLPlace, HCLPlaceAdapter.HCLPlaceViewHolder>(
                arrayListOf(R.layout.layout_one_key_place)) {

    override fun initViewHolder(parent: ViewGroup, viewType: Int): HCLPlaceViewHolder =
            HCLPlaceViewHolder(LayoutInflater.from(parent.context).inflate(layoutIds[0], parent, false))

    inner class HCLPlaceViewHolder(itemView: View) : HCLViewHolder<HCLPlace>(itemView) {
        override fun bind(position: Int, data: HCLPlace) {
            healthCareLocatorCustomObject?.also {
                itemView.apply {
                    tvAddress.text = data.displayName
                    ivLocation.setIconFromDrawableId(healthCareLocatorCustomObject.iconMarkerMin)
                    ivLocation.setRippleCircleBackground(healthCareLocatorCustomObject.colorPrimary)
                    ivLocation.setColorFilter(healthCareLocatorCustomObject.colorPrimary.getColor())
                    setOnClickListener { onPlaceClickedListener.onPlaceClickedListener(data) }
                }
            }
        }
    }

    interface OnHCLPlaceClickedListener {
        fun onPlaceClickedListener(place: HCLPlace)
    }
}