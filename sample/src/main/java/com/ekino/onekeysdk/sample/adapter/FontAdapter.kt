package com.ekino.onekeysdk.sample.adapter

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import com.ekino.onekeysdk.R
import com.ekino.onekeysdk.adapter.OneKeyAdapter
import com.ekino.onekeysdk.adapter.OneKeyViewHolder
import com.ekino.onekeysdk.model.config.OneKeyViewFontObject
import kotlinx.android.synthetic.main.layout_item_font.view.*

class FontAdapter : OneKeyAdapter<OneKeyViewFontObject, FontAdapter.FontVH>(arrayListOf(R.layout.layout_item_font)) {
    var onItemSelectedListener: (data: OneKeyViewFontObject, position: Int) -> Unit = { _, _ -> }
    override fun initViewHolder(parent: ViewGroup, viewType: Int): FontVH =
            FontVH(LayoutInflater.from(parent.context).inflate(layoutIds[0], parent, false))

    inner class FontVH(itemView: View) : OneKeyViewHolder<OneKeyViewFontObject>(itemView) {
        override fun bind(position: Int, data: OneKeyViewFontObject) {
            itemView.apply {
                tvFontName.text = data.title
                setOnClickListener { onItemSelectedListener(data, position) }
            }
        }
    }
}