package com.ekino.onekeysdk.adapter

import android.view.ViewGroup
import androidx.databinding.ViewDataBinding
import androidx.recyclerview.widget.RecyclerView
import com.ekino.onekeysdk.extensions.isValidPosition

abstract class OneKeyAdapter<DATA, VH : RecyclerView.ViewHolder>
(protected val layoutIds: ArrayList<Int>) : RecyclerView.Adapter<VH>() {
    abstract fun initViewHolder(parent: ViewGroup, viewType: Int): VH

    private val dataSource by lazy { arrayListOf<DATA>() }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): VH =
            initViewHolder(parent, viewType)

    override fun onBindViewHolder(holder: VH, position: Int) {
        (holder as? OneKeyViewHolder<DATA>)?.let { v ->
            getItemAt(position)?.apply { v.bind(position, this) }
        }
    }

    override fun getItemCount(): Int = dataSource.size

    fun getData(): ArrayList<DATA> = dataSource

    fun setData(items: ArrayList<DATA>) {
        dataSource.clear()
        dataSource.addAll(items)
        notifyDataSetChanged()
    }

    fun getItemAt(position: Int): DATA? =
            if (position.isValidPosition(dataSource.size)) dataSource[position] else null


    open fun add(item: DATA) {
        dataSource.add(item)
        notifyDataSetChanged()

    }

    open fun add(position: Int, item: DATA) {
        if (!position.isValidPosition(dataSource.size)) return
        dataSource.add(position, item)
        notifyDataSetChanged()

    }

    fun clear() {
        dataSource.clear()
        notifyDataSetChanged()
    }
}