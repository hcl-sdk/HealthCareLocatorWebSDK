package com.ekino.onekeysdk.fragments.map

import android.os.Bundle
import android.view.View
import androidx.recyclerview.widget.LinearLayoutManager
import base.fragments.AppFragment
import com.ekino.onekeysdk.R
import com.ekino.onekeysdk.adapter.sort.OneKeySortAdapter
import com.ekino.onekeysdk.extensions.ThemeExtension
import com.ekino.onekeysdk.extensions.getColor
import com.ekino.onekeysdk.model.config.OneKeyViewCustomObject
import com.ekino.onekeysdk.model.map.OneKeySortObject
import com.ekino.onekeysdk.viewmodel.map.OneKeySortViewModel
import kotlinx.android.synthetic.main.fragment_one_key_sort.*

class OneKeySortFragment : AppFragment<OneKeySortFragment, OneKeySortViewModel>(R.layout.fragment_one_key_sort), View.OnClickListener {
    companion object {
        fun newInstance(theme: OneKeyViewCustomObject) = OneKeySortFragment().apply {
            this.theme = theme
        }
    }

    private val sortList by lazy {
        arrayListOf(OneKeySortObject("0", "Relevance"),
                OneKeySortObject("1", "Distance"), OneKeySortObject("2", "Name"))
    }
    private val sortAdapter by lazy { OneKeySortAdapter() }

    private var theme = ThemeExtension.getInstance().getThemeConfiguration()
    override val viewModel = OneKeySortViewModel()

    override fun initView(view: View, savedInstanceState: Bundle?) {
        retainInstance = true
        var sort = sortList
        var selectedPosition = 0
        if (savedInstanceState != null) {
            sort = savedInstanceState.getParcelableArrayList("sortList") ?: sortList
            selectedPosition = savedInstanceState.getInt("selectedPosition")
        }

        tvSort.setTextColor(theme.colorSecondary.getColor())
        btnApply.setBackgroundColor(theme.colorPrimary.getColor())

        rvSort.apply {
            layoutManager = LinearLayoutManager(context)
            adapter = sortAdapter
        }
        sortAdapter.setData(sort)
        sortAdapter.setSelectedPosition(selectedPosition)

        btnClose.setOnClickListener(this)
        btnReset.setOnClickListener(this)
        btnApply.setOnClickListener(this)
    }

    override fun onSaveInstanceState(outState: Bundle) {
        super.onSaveInstanceState(outState)
        outState.putParcelableArrayList("sortList", sortAdapter.getData())
        outState.putInt("selectedPosition", sortAdapter.getSelectedPosition())
    }

    override fun onClick(v: View?) {
        when (v?.id) {
            R.id.btnClose -> activity?.onBackPressed()
            R.id.btnApply -> activity?.onBackPressed()
        }
    }
}