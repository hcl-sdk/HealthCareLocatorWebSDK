package com.healthcarelocator.adapter.home

import android.content.res.Configuration
import android.graphics.Color
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import com.healthcarelocator.R
import com.healthcarelocator.adapter.OneKeyAdapter
import com.healthcarelocator.adapter.OneKeyViewHolder
import com.healthcarelocator.extensions.getColor
import com.healthcarelocator.extensions.getDrawableById
import com.healthcarelocator.extensions.setBackgroundWithCorner
import com.healthcarelocator.extensions.setRippleCircleBackground
import com.healthcarelocator.model.config.HealthCareLocatorCustomObject
import com.healthcarelocator.model.home.OneKeyHomeObject
import kotlinx.android.synthetic.main.layout_one_key_home.view.*

class OneKeyHomeAdapter(private val healthCareLocatorCustomObject: HealthCareLocatorCustomObject?) : OneKeyAdapter<OneKeyHomeObject,
        OneKeyHomeAdapter.OneKeyHomeVH>(arrayListOf(R.layout.layout_one_key_home)) {


    override fun initViewHolder(parent: ViewGroup, viewType: Int): OneKeyHomeVH =
            OneKeyHomeVH(LayoutInflater.from(parent.context).inflate(layoutIds[0], parent, false))


    inner class OneKeyHomeVH(itemView: View) : OneKeyViewHolder<OneKeyHomeObject>(itemView) {
        override fun bind(position: Int, data: OneKeyHomeObject) {
            healthCareLocatorCustomObject?.also {
                itemView.apply {
                    if (resources.configuration.orientation == Configuration.ORIENTATION_LANDSCAPE) {
                        setBackgroundWithCorner(Color.WHITE, it.colorCardBorder.getColor(), 12f, 3)
                    } else
                        setBackgroundColor(Color.WHITE)
                    ivFind.setImageDrawable(context.getDrawableById(data.drawableId))
                    ivFind.setRippleCircleBackground(healthCareLocatorCustomObject.colorPrimary.getColor(), 26)
                    ivFind.setColorFilter(healthCareLocatorCustomObject.colorPrimary.getColor())
                    tvTitle.text = data.title
                    tvDescription.text = data.description
                }
            }
        }
    }
}