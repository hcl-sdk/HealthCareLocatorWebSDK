package com.ekino.onekeysdk.adapter.home

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import com.ekino.onekeysdk.R
import com.ekino.onekeysdk.adapter.OneKeyAdapter
import com.ekino.onekeysdk.adapter.OneKeyViewHolder
import com.ekino.onekeysdk.extensions.ThemeExtension
import com.ekino.onekeysdk.extensions.getVisibility
import com.ekino.onekeysdk.model.SearchObject
import com.ekino.onekeysdk.model.config.OneKeyCustomObject
import kotlinx.android.synthetic.main.layout_one_key_last_search.view.*

class LastSearchAdapter(private val theme: OneKeyCustomObject =
                                ThemeExtension.getInstance().getThemeConfiguration()) :
        OneKeyAdapter<SearchObject, LastSearchAdapter.LastSearchVH>(arrayListOf(R.layout.layout_one_key_last_search)) {
    var onItemRemovedListener: (data: SearchObject) -> Unit = {}
    var onItemClickedListener: (data: SearchObject) -> Unit = {}
    override fun initViewHolder(parent: ViewGroup, viewType: Int): LastSearchVH =
            LastSearchVH(LayoutInflater.from(parent.context).inflate(layoutIds[0], parent, false))

    inner class LastSearchVH(itemView: View) : OneKeyViewHolder<SearchObject>(itemView) {
        override fun bind(position: Int, data: SearchObject) {
            itemView.apply {
                tvSpeciality.text = data.speciality?.longLbl ?: ""
                if (!data.place?.placeId.isNullOrEmpty()) {
                    tvAddress.visibility = View.VISIBLE
                    tvAddress.text = data.place?.displayName
                } else tvAddress.visibility = View.GONE
                tvCreateAt.text = data.createdDate
                tvCreateAt.textSize = theme.fontSmall.size.toFloat()

                ivClear.setOnClickListener {
                    remove(position)
                    onItemRemovedListener(data)
                }
                setOnClickListener {
                    onItemClickedListener(data)
                }
                bottomLine.visibility = (position != getData().size - 1).getVisibility()
            }
        }
    }
}