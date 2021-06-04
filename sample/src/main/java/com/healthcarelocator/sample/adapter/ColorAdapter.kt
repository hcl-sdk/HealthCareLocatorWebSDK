package com.healthcarelocator.sample.adapter

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import com.healthcarelocator.adapter.HCLAdapter
import com.healthcarelocator.adapter.HCLViewHolder
import com.healthcarelocator.extensions.getColor
import com.healthcarelocator.sample.model.ColorObject
import com.ekino.sample.onekeysdk.R
import kotlinx.android.synthetic.main.layout_item_color.view.*

class ColorAdapter : HCLAdapter<ColorObject, ColorAdapter.ColorVH>(arrayListOf(R.layout.layout_item_color)) {
    var onColorSelected: (data: ColorObject, position: Int) -> Unit = { _, _ -> }

    override fun initViewHolder(parent: ViewGroup, viewType: Int): ColorVH =
            ColorVH(LayoutInflater.from(parent.context).inflate(layoutIds[0], parent, false))

    inner class ColorVH(itemView: View) : HCLViewHolder<ColorObject>(itemView) {
        override fun bind(position: Int, data: ColorObject) {
            itemView.apply {
                tvColorName.text = data.title
                colorPreview.setBackgroundColor(data.color.getColor())
                setOnClickListener { onColorSelected(data, position) }
            }
        }
    }
}