package com.ekino.onekeysdk.fragments.search

import android.view.View
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.Observer
import androidx.recyclerview.widget.LinearLayoutManager
import base.extensions.addFragment
import base.fragments.AppFragment
import com.ekino.onekeysdk.R
import com.ekino.onekeysdk.adapter.search.OneKeyPlaceAdapter
import com.ekino.onekeysdk.extensions.setRippleBackground
import com.ekino.onekeysdk.fragments.map.FullMapFragment
import com.ekino.onekeysdk.model.config.OneKeyViewCustomObject
import com.ekino.onekeysdk.viewmodel.search.SearchViewModel
import kotlinx.android.synthetic.main.fragment_search.*

class SearchFragment(private val oneKeyViewCustomObject: OneKeyViewCustomObject) :
        AppFragment<SearchFragment, SearchViewModel>(R.layout.fragment_search) {

    private val placeAdapter by lazy { OneKeyPlaceAdapter() }

    companion object {
        fun newInstance(oneKeyViewCustomObject: OneKeyViewCustomObject) =
                SearchFragment(oneKeyViewCustomObject)
    }

    override val viewModel: SearchViewModel = SearchViewModel()

    override fun initView(view: View) {
        btnBack.setOnClickListener { activity?.onBackPressed() }
        btnSearch.setRippleBackground(oneKeyViewCustomObject.primaryColor)
        btnSearch.setOnClickListener {
            (activity as? AppCompatActivity)?.addFragment(
                    R.id.fragmentContainer,
                    FullMapFragment.newInstance(oneKeyViewCustomObject), true
            )
        }
        viewModel.apply {
            onAddressChanged(edtWhere)
            places.observe(this@SearchFragment, Observer {
                placeAdapter.setData(it)
            })
        }
        rvAddress.apply {
            layoutManager = LinearLayoutManager(context)
            adapter = placeAdapter
        }
    }
}