package com.ekino.onekeysdk.adapter.search

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import com.ekino.onekeysdk.R
import com.ekino.onekeysdk.adapter.OneKeyAdapter
import com.ekino.onekeysdk.adapter.OneKeyViewHolder
import com.ekino.onekeysdk.extensions.ThemeExtension
import com.ekino.onekeysdk.extensions.getColor
import com.ekino.onekeysdk.extensions.setRippleBackground
import com.ekino.onekeysdk.model.OneKeyLocation
import kotlinx.android.synthetic.main.layout_search_item.view.*

class SearchAdapter(private val screenWidth: Int = -1) : OneKeyAdapter<OneKeyLocation, SearchAdapter.SearchVH>(arrayListOf(R.layout.layout_search_item)) {
    private var selectedPosition = -1
    private val themeConfig by lazy { ThemeExtension.getInstance().getThemeConfiguration() }

    override fun initViewHolder(parent: ViewGroup, viewType: Int): SearchVH =
            SearchVH(LayoutInflater.from(parent.context).inflate(layoutIds[0], parent, false))

    inner class SearchVH(itemView: View) : OneKeyViewHolder<OneKeyLocation>(itemView) {
        override fun bind(position: Int, data: OneKeyLocation) {
            itemView.apply {
                if (screenWidth > 0)
                    itemView.post {
                        val lp = itemView.layoutParams
                        lp.width = (screenWidth * 0.85f).toInt()
                        itemView.layoutParams = lp
                    }
                tvName.text = data.name
                tvName.setTextColor(themeConfig.secondaryColor.getColor())
                tvSpeciality.text = data.speciality
                tvAddress.text = data.address
                tvDistance.text = "${data.distance}m"
                if (selectedPosition == position)
                    borderContainer.setRippleBackground(themeConfig.markerSelectedColor.getColor(), 15f)
                else borderContainer.background = null
            }
        }
    }

    fun setSelectedPosition(selectedPosition: Int) {
        this.selectedPosition = selectedPosition
        notifyDataSetChanged()
    }
}