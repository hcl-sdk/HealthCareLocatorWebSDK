package com.ekino.onekeysdk.sample.adapter

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import com.ekino.onekeysdk.adapter.OneKeyAdapter
import com.ekino.onekeysdk.adapter.OneKeyViewHolder
import com.ekino.onekeysdk.extensions.getColor
import com.ekino.onekeysdk.sample.model.ColorObject
import com.ekino.sample.onekeysdk.R
import kotlinx.android.synthetic.main.layout_item_color.view.*

class ColorAdapter : OneKeyAdapter<ColorObject, ColorAdapter.ColorVH>(arrayListOf(R.layout.layout_item_color)) {
    var onColorSelected: (data: ColorObject, position: Int) -> Unit = { _, _ -> }

    override fun initViewHolder(parent: ViewGroup, viewType: Int): ColorVH =
            ColorVH(LayoutInflater.from(parent.context).inflate(layoutIds[0], parent, false))

    inner class ColorVH(itemView: View) : OneKeyViewHolder<ColorObject>(itemView) {
        override fun bind(position: Int, data: ColorObject) {
            itemView.apply {
                tvColorName.text = data.title
                colorPreview.setBackgroundColor(data.color.getColor())
                setOnClickListener { onColorSelected(data, position) }
            }
        }
    }
}