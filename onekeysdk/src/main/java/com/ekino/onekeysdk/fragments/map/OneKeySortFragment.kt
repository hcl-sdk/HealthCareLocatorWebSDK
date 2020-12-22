package com.ekino.onekeysdk.fragments.map

import android.graphics.Color
import android.os.Bundle
import android.view.View
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import base.fragments.AppFragment
import com.ekino.onekeysdk.R
import com.ekino.onekeysdk.adapter.sort.OneKeySortAdapter
import com.ekino.onekeysdk.extensions.ThemeExtension
import com.ekino.onekeysdk.extensions.getColor
import com.ekino.onekeysdk.extensions.setBackgroundWithCorner
import com.ekino.onekeysdk.extensions.setRippleBackground
import com.ekino.onekeysdk.model.config.OneKeyViewCustomObject
import com.ekino.onekeysdk.model.map.OneKeySortObject
import com.ekino.onekeysdk.viewmodel.map.OneKeySortViewModel
import kotlinx.android.synthetic.main.fragment_one_key_sort.*

class OneKeySortFragment : AppFragment<OneKeySortFragment, OneKeySortViewModel>(R.layout.fragment_one_key_sort), View.OnClickListener {
    companion object {
        fun newInstance(theme: OneKeyViewCustomObject, sorting: Int) = OneKeySortFragment().apply {
            this.theme = theme
            this.selectedPosition = sorting
        }
    }

    private val sortList by lazy {
        arrayListOf(OneKeySortObject("0", "Relevance"),
                OneKeySortObject("1", "Distance"), OneKeySortObject("2", "Name"))
    }
    private val sortAdapter by lazy { OneKeySortAdapter() }
    private var selectedPosition = 0
    private var theme = ThemeExtension.getInstance().getThemeConfiguration()
    override val viewModel = OneKeySortViewModel()

    override fun initView(view: View, savedInstanceState: Bundle?) {
        var sort = sortList

        if (savedInstanceState != null) {
            sort = savedInstanceState.getParcelableArrayList("sortList") ?: sortList
            selectedPosition = savedInstanceState.getInt("selectedPosition")
        }

        btnApply.setRippleBackground(theme.colorPrimary.getColor(), 8f)
        btnReset.setRippleBackground(theme.colorButtonDiscardBackground.getColor(), 8f)
        contentWrapper.setBackgroundWithCorner(Color.WHITE, theme.colorCardBorder.getColor(), 12f, 3)
        container.setBackgroundColor(theme.colorViewBackground.getColor())
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
            R.id.btnReset -> {
                sortAdapter.setSelectedPosition(0)
                applySorting()
            }
            R.id.btnApply -> applySorting()
        }
    }

    private fun applySorting() {
        val fragment = getFragment(FullMapFragment::class.java.simpleName)
        val nearMeFragment = getFragment(NearMeFragment::class.java.simpleName)
        if (fragment is FullMapFragment) fragment.apply {
            if (isAdded && isVisible) {
                this.applySorting(sortAdapter.getSelectedPosition())
            }
        }
        if (nearMeFragment is NearMeFragment) nearMeFragment.apply {
            if (isAdded && isVisible) {
                this.applySorting(sortAdapter.getSelectedPosition())
            }
        }
        activity?.onBackPressed()
    }

    private fun getFragment(tag: String): Fragment? {
        return activity?.supportFragmentManager?.findFragmentByTag(tag)
    }
}