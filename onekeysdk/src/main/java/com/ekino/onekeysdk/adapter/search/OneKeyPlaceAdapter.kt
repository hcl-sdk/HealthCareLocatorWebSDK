package com.ekino.onekeysdk.adapter.search

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import com.ekino.onekeysdk.R
import com.ekino.onekeysdk.adapter.OneKeyAdapter
import com.ekino.onekeysdk.adapter.OneKeyViewHolder
import com.ekino.onekeysdk.extensions.getColor
import com.ekino.onekeysdk.extensions.setIconFromDrawableId
import com.ekino.onekeysdk.extensions.setRippleCircleBackground
import com.ekino.onekeysdk.model.config.HealthCareLocatorCustomObject
import com.ekino.onekeysdk.model.map.OneKeyPlace
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