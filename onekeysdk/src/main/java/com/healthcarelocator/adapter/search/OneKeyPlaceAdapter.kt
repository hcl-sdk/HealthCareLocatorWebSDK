package com.healthcarelocator.adapter.search

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import com.healthcarelocator.R
import com.healthcarelocator.adapter.OneKeyAdapter
import com.healthcarelocator.adapter.OneKeyViewHolder
import com.healthcarelocator.extensions.getColor
import com.healthcarelocator.extensions.setIconFromDrawableId
import com.healthcarelocator.extensions.setRippleCircleBackground
import com.healthcarelocator.model.config.HealthCareLocatorCustomObject
import com.healthcarelocator.model.map.OneKeyPlace
import kotlinx.android.synthetic.main.layout_one_key_place.view.*

class OneKeyPlaceAdapter(private val healthCareLocatorCustomObject: HealthCareLocatorCustomObject?,
                         private val onPlaceClickedListener: OnOneKeyPlaceClickedListener) :
        OneKeyAdapter<OneKeyPlace, OneKeyPlaceAdapter.OneKeyPlaceViewHolder>(
                arrayListOf(R.layout.layout_one_key_place)) {

    override fun initViewHolder(parent: ViewGroup, viewType: Int): OneKeyPlaceViewHolder =
            OneKeyPlaceViewHolder(LayoutInflater.from(parent.context).inflate(layoutIds[0], parent, false))

    inner class OneKeyPlaceViewHolder(itemView: View) : OneKeyViewHolder<OneKeyPlace>(itemView) {
        override fun bind(position: Int, data: OneKeyPlace) {
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

    interface OnOneKeyPlaceClickedListener {
        fun onPlaceClickedListener(place: OneKeyPlace)
    }
}