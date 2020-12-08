package com.ekino.onekeysdk.adapter.home

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.core.content.ContextCompat
import com.ekino.onekeysdk.R
import com.ekino.onekeysdk.adapter.OneKeyAdapter
import com.ekino.onekeysdk.adapter.OneKeyViewHolder
import com.ekino.onekeysdk.extensions.ThemeExtension
import com.ekino.onekeysdk.extensions.getColor
import com.ekino.onekeysdk.extensions.getVisibility
import com.ekino.onekeysdk.model.OneKeyLocation
import com.ekino.onekeysdk.model.config.OneKeyViewCustomObject
import kotlinx.android.synthetic.main.layout_one_key_last_search.view.*

class LastSearchAdapter(private val theme: OneKeyViewCustomObject =
                                ThemeExtension.getInstance().getThemeConfiguration()) :
        OneKeyAdapter<OneKeyLocation, LastSearchAdapter.LastSearchVH>(arrayListOf(R.layout.layout_one_key_last_search)) {
    var onItemRemovedListener: () -> Unit = {}
    var onItemClickedListener: (data: OneKeyLocation) -> Unit = {}
    override fun initViewHolder(parent: ViewGroup, viewType: Int): LastSearchVH =
            LastSearchVH(LayoutInflater.from(parent.context).inflate(layoutIds[0], parent, false))

    inner class LastSearchVH(itemView: View) : OneKeyViewHolder<OneKeyLocation>(itemView) {
        override fun bind(position: Int, data: OneKeyLocation) {
            itemView.apply {
                tvSpeciality.text = data.speciality
                tvAddress.text = data.address
                tvCreateAt.text = data.createdDate
                tvCreateAt.textSize = theme.fontSmall.size.toFloat()
                tvDoctorName.visibility = data.isHCP.getVisibility()
                tvTitle.visibility = data.isHCP.getVisibility()
                if (data.isHCP) {
                    tvDoctorName.setTextColor(theme.colorSecondary.getColor())
                    tvDoctorName.text = data.name
                    tvSpeciality.setTextColor(ContextCompat.getColor(context, R.color.colorOneKeyText))
                    tvSpeciality.setFont(theme.fontDefault, false)
                    tvTitle.text = data.title
                } else {
                    tvSpeciality.setFont(theme.fontResultTitle, false)
                    tvSpeciality.setTextColor(theme.colorSecondary.getColor())
                }
                ivClear.setOnClickListener {
                    remove(position)
                    onItemRemovedListener()
                }
                setOnClickListener {
                    onItemClickedListener(data)
                }
                bottomLine.visibility = (position != getData().size - 1).getVisibility()
            }
        }
    }
}