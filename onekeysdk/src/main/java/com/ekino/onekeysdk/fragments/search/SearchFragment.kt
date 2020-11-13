package com.ekino.onekeysdk.fragments.search

import android.view.View
import androidx.appcompat.app.AppCompatActivity
import base.extensions.addFragment
import base.fragments.AppFragment
import com.ekino.onekeysdk.R
import com.ekino.onekeysdk.model.config.OneKeyViewCustomObject
import com.ekino.onekeysdk.fragments.map.FullMapFragment
import com.ekino.onekeysdk.viewmodel.search.SearchViewModel
import kotlinx.android.synthetic.main.fragment_search.*

class SearchFragment(private val oneKeyViewCustomObject: OneKeyViewCustomObject) :
        AppFragment<SearchFragment, SearchViewModel>(R.layout.fragment_search) {
    companion object {
        fun newInstance(oneKeyViewCustomObject: OneKeyViewCustomObject) = SearchFragment(oneKeyViewCustomObject)
    }

    override val viewModel: SearchViewModel = SearchViewModel()

    override fun initView(view: View) {
        btnBack.setOnClickListener { activity?.onBackPressed() }
        btnSearch.setOnClickListener {
            (activity as? AppCompatActivity)?.addFragment(R.id.fragmentContainer,
                    FullMapFragment.newInstance(oneKeyViewCustomObject), true)
        }
    }
}