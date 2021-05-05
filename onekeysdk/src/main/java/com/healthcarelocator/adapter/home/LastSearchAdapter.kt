package com.healthcarelocator.adapter.home

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import com.healthcarelocator.R
import com.healthcarelocator.adapter.OneKeyAdapter
import com.healthcarelocator.adapter.OneKeyViewHolder
import com.healthcarelocator.extensions.getColor
import com.healthcarelocator.extensions.getVisibility
import com.healthcarelocator.extensions.setIconFromDrawableId
import com.healthcarelocator.model.SearchObject
import com.healthcarelocator.model.config.HealthCareLocatorCustomObject
import com.healthcarelocator.state.HealthCareLocatorSDK
import kotlinx.android.synthetic.main.layout_one_key_last_search.view.*

class LastSearchAdapter(private val theme: HealthCareLocatorCustomObject =
                                HealthCareLocatorSDK.getInstance().getConfiguration()) :
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
                ivClear.setIconFromDrawableId(theme.iconCross, true, theme.colorGrey.getColor())
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