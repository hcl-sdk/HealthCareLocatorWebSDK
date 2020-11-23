package com.ekino.onekeysdk.adapter.home

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import com.ekino.onekeysdk.R
import com.ekino.onekeysdk.adapter.OneKeyAdapter
import com.ekino.onekeysdk.adapter.OneKeyViewHolder
import com.ekino.onekeysdk.extensions.getColor
import com.ekino.onekeysdk.extensions.getDrawableById
import com.ekino.onekeysdk.extensions.setRippleCircleBackground
import com.ekino.onekeysdk.model.config.OneKeyViewCustomObject
import com.ekino.onekeysdk.model.home.OneKeyHomeObject
import kotlinx.android.synthetic.main.layout_one_key_home.view.*

class OneKeyHomeAdapter(private val oneKeyViewCustomObject: OneKeyViewCustomObject?) : OneKeyAdapter<OneKeyHomeObject,
        OneKeyHomeAdapter.OneKeyHomeVH>(arrayListOf(R.layout.layout_one_key_home)) {


    override fun initViewHolder(parent: ViewGroup, viewType: Int): OneKeyHomeVH =
            OneKeyHomeVH(LayoutInflater.from(parent.context).inflate(layoutIds[0], parent, false))


    inner class OneKeyHomeVH(itemView: View) : OneKeyViewHolder<OneKeyHomeObject>(itemView) {
        override fun bind(position: Int, data: OneKeyHomeObject) {
            oneKeyViewCustomObject?.also {
                itemView.apply {
                    ivFind.setImageDrawable(context.getDrawableById(data.drawableId))
                    ivFind.setRippleCircleBackground(oneKeyViewCustomObject.primaryColor)
                    ivFind.setColorFilter(oneKeyViewCustomObject.primaryColor.getColor())
                    tvTitle.text = data.title
                    tvDescription.text = data.description
                }
            }
        }
    }
}