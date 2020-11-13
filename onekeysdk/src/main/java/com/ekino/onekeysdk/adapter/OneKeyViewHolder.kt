package com.ekino.onekeysdk.adapter

import androidx.databinding.ViewDataBinding
import androidx.recyclerview.widget.RecyclerView

abstract class OneKeyViewHolder<DATA, BINDING : ViewDataBinding>(data: DATA, binding: BINDING) :
        RecyclerView.ViewHolder(binding.root) {
    abstract fun bind(position: Int, data: DATA)
}