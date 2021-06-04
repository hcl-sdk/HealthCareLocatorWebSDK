package com.healthcarelocator.adapter

import android.view.View
import androidx.recyclerview.widget.RecyclerView

abstract class HCLViewHolder<DATA>(val view: View) :
        RecyclerView.ViewHolder(view) {
    abstract fun bind(position: Int, data: DATA)
}