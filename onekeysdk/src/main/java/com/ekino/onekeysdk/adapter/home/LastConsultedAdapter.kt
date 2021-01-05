package com.ekino.onekeysdk.adapter.home

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import com.ekino.onekeysdk.R
import com.ekino.onekeysdk.adapter.OneKeyAdapter
import com.ekino.onekeysdk.adapter.OneKeyViewHolder
import com.ekino.onekeysdk.extensions.getColor
import com.ekino.onekeysdk.extensions.getVisibility
import com.ekino.onekeysdk.extensions.setIconFromDrawableId
import com.ekino.onekeysdk.model.activity.ActivityObject
import com.ekino.onekeysdk.model.config.OneKeyCustomObject
import com.ekino.onekeysdk.state.OneKeySDK
import kotlinx.android.synthetic.main.layout_one_key_last_consulted.view.*

class LastConsultedAdapter(private val theme: OneKeyCustomObject =
                                   OneKeySDK.getInstance().getConfiguration()) :
        OneKeyAdapter<ActivityObject, LastConsultedAdapter.LastSearchVH>(arrayListOf(R.layout.layout_one_key_last_consulted)) {
    var onItemRemovedListener: (data: ActivityObject, position: Int) -> Unit = { _, _ -> }
    var onItemClickedListener: (data: ActivityObject) -> Unit = {}
    override fun initViewHolder(parent: ViewGroup, viewType: Int): LastSearchVH =
            LastSearchVH(LayoutInflater.from(parent.context).inflate(layoutIds[0], parent, false))

    inner class LastSearchVH(itemView: View) : OneKeyViewHolder<ActivityObject>(itemView) {
        override fun bind(position: Int, data: ActivityObject) {
            itemView.apply {
                tvDoctorName.text = data.individual?.mailingName
                tvSpeciality.text = data.individual?.professionalType?.label ?: ""
                tvAddress.text = data.workplace?.address?.getAddress() ?: ""
                tvCreateAt.text = data.createdDate
                tvCreateAt.textSize = theme.fontSmall.size.toFloat()

                ivClear.setIconFromDrawableId(theme.iconCross, true, theme.colorGrey.getColor())
                ivClear.setOnClickListener {
                    remove(position)
                    onItemRemovedListener(data, position)
                }
                setOnClickListener {
                    onItemClickedListener(data)
                }
                bottomLine.visibility = (position != getData().size - 1).getVisibility()
            }
        }
    }
}