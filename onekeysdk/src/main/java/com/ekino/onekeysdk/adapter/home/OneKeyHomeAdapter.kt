package com.ekino.onekeysdk.adapter.home

import android.content.res.Configuration
import android.graphics.Color
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import com.ekino.onekeysdk.R
import com.ekino.onekeysdk.adapter.OneKeyAdapter
import com.ekino.onekeysdk.adapter.OneKeyViewHolder
import com.ekino.onekeysdk.extensions.getColor
import com.ekino.onekeysdk.extensions.getDrawableById
import com.ekino.onekeysdk.extensions.setBackgroundWithCorner
import com.ekino.onekeysdk.extensions.setRippleCircleBackground
import com.ekino.onekeysdk.model.config.HealthCareLocatorCustomObject
import com.ekino.onekeysdk.model.home.OneKeyHomeObject
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