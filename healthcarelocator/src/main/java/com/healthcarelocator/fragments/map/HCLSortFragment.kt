package com.healthcarelocator.fragments.map

import android.graphics.Color
import android.os.Bundle
import android.view.View
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import base.fragments.AppFragment
import com.healthcarelocator.R
import com.healthcarelocator.adapter.sort.HCLSortAdapter
import com.healthcarelocator.state.HealthCareLocatorSDK
import com.healthcarelocator.extensions.getColor
import com.healthcarelocator.extensions.setBackgroundWithCorner
import com.healthcarelocator.extensions.setIconFromDrawableId
import com.healthcarelocator.extensions.setRippleBackground
import com.healthcarelocator.model.config.HealthCareLocatorCustomObject
import com.healthcarelocator.model.map.HCLSortObject
import com.healthcarelocator.viewmodel.map.HCLSortViewModel
import kotlinx.android.synthetic.main.fragment_one_key_sort.*

class HCLSortFragment : AppFragment<HCLSortFragment, HCLSortViewModel>(R.layout.fragment_one_key_sort), View.OnClickListener {
    companion object {
        fun newInstance(theme: HealthCareLocatorCustomObject, sorting: Int) = HCLSortFragment().apply {
            this.theme = theme
            this.selectedPosition = sorting
        }
    }

    private val sortList by lazy { arrayListOf<HCLSortObject>() }
    private val sortAdapter by lazy { HCLSortAdapter() }
    private var selectedPosition = 0
    private var theme = HealthCareLocatorSDK.getInstance().getConfiguration()
    override val viewModel = HCLSortViewModel()

    override fun initView(view: View, savedInstanceState: Bundle?) {
        sortList.clear()
        sortList.addAll(arrayListOf(HCLSortObject("0", getString(R.string.hcl_relevance_item)),
                HCLSortObject("1", getString(R.string.hcl_distance_item)),
                HCLSortObject("2", getString(R.string.hcl_name_item))))
        var sort = sortList

        if (savedInstanceState != null) {
            sort = savedInstanceState.getParcelableArrayList("sortList") ?: sortList
            selectedPosition = savedInstanceState.getInt("selectedPosition")
        }

        btnApply.setRippleBackground(theme.colorPrimary.getColor(), 8f)
        btnReset.setRippleBackground(theme.colorButtonDiscardBackground.getColor(), 8f)
        btnClose.setIconFromDrawableId(theme.iconCross, true, theme.colorGrey.getColor())
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
        val nearMeFragment = getFragment(HCLNearMeFragment::class.java.simpleName)
        if (fragment is FullMapFragment) fragment.apply {
            if (isAdded && isVisible) {
                this.applySorting(sortAdapter.getSelectedPosition())
            }
        }
        if (nearMeFragment is HCLNearMeFragment) nearMeFragment.apply {
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