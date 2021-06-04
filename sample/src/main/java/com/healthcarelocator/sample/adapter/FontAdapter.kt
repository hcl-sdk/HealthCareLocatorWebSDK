package com.healthcarelocator.sample.adapter

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import com.ekino.sample.onekeysdk.R
import com.healthcarelocator.adapter.HCLAdapter
import com.healthcarelocator.adapter.HCLViewHolder
import com.healthcarelocator.model.config.HeathCareLocatorViewFontObject
import kotlinx.android.synthetic.main.layout_item_font.view.*

class FontAdapter : HCLAdapter<HeathCareLocatorViewFontObject, FontAdapter.FontVH>(arrayListOf(R.layout.layout_item_font)) {
    var onItemSelectedListener: (data: HeathCareLocatorViewFontObject, position: Int) -> Unit = { _, _ -> }
    override fun initViewHolder(parent: ViewGroup, viewType: Int): FontVH =
            FontVH(LayoutInflater.from(parent.context).inflate(layoutIds[0], parent, false))

    inner class FontVH(itemView: View) : HCLViewHolder<HeathCareLocatorViewFontObject>(itemView) {
        override fun bind(position: Int, data: HeathCareLocatorViewFontObject) {
            itemView.apply {
                tvFontName.text = data.title
                setOnClickListener { onItemSelectedListener(data, position) }
            }
        }
    }
}