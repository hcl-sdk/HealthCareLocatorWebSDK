package com.healthcarelocator.adapter.sort

import android.content.res.ColorStateList
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import com.healthcarelocator.R
import com.healthcarelocator.adapter.HCLAdapter
import com.healthcarelocator.adapter.HCLViewHolder
import com.healthcarelocator.extensions.getColor
import com.healthcarelocator.model.config.HealthCareLocatorCustomObject
import com.healthcarelocator.model.map.HCLSortObject
import com.healthcarelocator.state.HealthCareLocatorSDK
import kotlinx.android.synthetic.main.layout_one_key_sort.view.*

class HCLSortAdapter : HCLAdapter<HCLSortObject, HCLSortAdapter.HCLSortVH>(arrayListOf(R.layout.layout_one_key_sort)) {
    private val theme: HealthCareLocatorCustomObject by lazy { HealthCareLocatorSDK.getInstance().getConfiguration() }
    private var selectedPosition = -1
    override fun initViewHolder(parent: ViewGroup, viewType: Int): HCLSortVH =
            HCLSortVH(LayoutInflater.from(parent.context)
                    .inflate(layoutIds[0], parent, false))

    inner class HCLSortVH(itemView: View) : HCLViewHolder<HCLSortObject>(itemView) {
        override fun bind(position: Int, data: HCLSortObject) {
            itemView.apply {
                tvSortTitle.text = data.title
                data.selected = selectedPosition == position
                cbxSort.isChecked = data.selected
                cbxSort.buttonTintList = ColorStateList(arrayOf(intArrayOf(-android.R.attr.state_checked), intArrayOf(android.R.attr.state_checked)),
                        intArrayOf(theme.colorGreyLight.getColor(), theme.colorPrimary.getColor()))
                setOnClickListener {
                    setSelectedPosition(position)
                }
            }
        }
    }

    fun setSelectedPosition(position: Int) {
        notifyItemChanged(selectedPosition)
        selectedPosition = position
        notifyItemChanged(selectedPosition)
    }

    fun getSelectedPosition() = selectedPosition
}