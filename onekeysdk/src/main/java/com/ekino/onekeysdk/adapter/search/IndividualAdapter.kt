package com.ekino.onekeysdk.adapter.search

import android.text.SpannableStringBuilder
import android.text.style.ForegroundColorSpan
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.ekino.onekeysdk.R
import com.ekino.onekeysdk.adapter.OneKeyAdapter
import com.ekino.onekeysdk.adapter.OneKeyViewHolder
import com.ekino.onekeysdk.extensions.ThemeExtension
import com.ekino.onekeysdk.extensions.getColor
import com.ekino.onekeysdk.extensions.getVisibility
import com.iqvia.onekey.GetCodeByLabelQuery
import com.iqvia.onekey.GetIndividualByNameQuery
import kotlinx.android.synthetic.main.layout_item_individual.view.*
import kotlinx.android.synthetic.main.layout_one_key_hcp_item.view.*

class IndividualAdapter : OneKeyAdapter<Any,
        RecyclerView.ViewHolder>(arrayListOf(R.layout.layout_item_individual, R.layout.layout_one_key_hcp_item)) {
    private val speciality = 0
    private val hcp = 1
    private var keyword: String = ""
    private val theme = ThemeExtension.getInstance().getThemeConfiguration()
    var onIndividualClickedListener: OnIndividualClickedListener? = null

    override fun initViewHolder(parent: ViewGroup, viewType: Int): RecyclerView.ViewHolder =
            when (viewType) {
                hcp -> HcpVH(LayoutInflater.from(parent.context).inflate(layoutIds[1], parent, false))
                else -> IndividualVH(LayoutInflater.from(parent.context).inflate(layoutIds[0], parent, false))
            }

    override fun getItemViewType(position: Int): Int {
        return if (getData()[position] is GetCodeByLabelQuery.Code) speciality
        else hcp
    }

    inner class IndividualVH(itemView: View) :
            OneKeyViewHolder<GetCodeByLabelQuery.Code>(itemView) {
        override fun bind(position: Int, data: GetCodeByLabelQuery.Code) {
            itemView.apply {
                val name: String = data.longLbl()
                tvSpeciality.text = SpannableStringBuilder(name).apply {
                    val indexOf = name.toLowerCase().indexOf(keyword.toLowerCase())
                    if (indexOf >= 0)
                        setSpan(ForegroundColorSpan(theme.colorPrimary.getColor()), indexOf,
                                indexOf.plus(keyword.length), SpannableStringBuilder.SPAN_EXCLUSIVE_EXCLUSIVE)
                }
                setOnClickListener {
                    onIndividualClickedListener?.onIndividualClickedListener(data)
                }
            }
        }
    }

    inner class HcpVH(itemView: View) :
            OneKeyViewHolder<GetIndividualByNameQuery.Individual>(itemView) {
        override fun bind(position: Int, data: GetIndividualByNameQuery.Individual) {
            itemView.apply {
                val name: String = data.mailingName() ?: ""
                tvName.text = SpannableStringBuilder(name).apply {
                    val indexOf = name.toLowerCase().indexOf(keyword.toLowerCase())
                    if (indexOf >= 0)
                        setSpan(ForegroundColorSpan(theme.colorPrimary.getColor()), indexOf,
                                indexOf.plus(keyword.length), SpannableStringBuilder.SPAN_EXCLUSIVE_EXCLUSIVE)
                }
                val specialty = data.specialties().firstOrNull()?.label() ?: ""
                val address = data.mainActivity().workplace().address()?.run {
                    "${longLabel()}, ${city().label()}, ${county()?.label()}, ${country()}"
                } ?: ""
                tvHCPSpeciality.visibility = specialty.isNotEmpty().getVisibility()
                tvHCPAddress.visibility = address.isNotEmpty().getVisibility()
                tvHCPSpeciality.text = specialty
                tvHCPAddress.text = address
                setOnClickListener {
                    onIndividualClickedListener?.onHCPClickedListener(data)
                }
            }
        }
    }

    fun setKeyword(key: String) {
        this.keyword = key
    }

    interface OnIndividualClickedListener {
        fun onIndividualClickedListener(data: GetCodeByLabelQuery.Code)
        fun onHCPClickedListener(data: GetIndividualByNameQuery.Individual)
    }
}