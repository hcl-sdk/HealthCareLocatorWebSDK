package com.ekino.onekeysdk.fragments.search

import android.view.View
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.Observer
import androidx.recyclerview.widget.LinearLayoutManager
import base.extensions.addFragment
import base.fragments.AppFragment
import com.ekino.onekeysdk.R
import com.ekino.onekeysdk.adapter.search.OneKeyPlaceAdapter
import com.ekino.onekeysdk.extensions.getVisibility
import com.ekino.onekeysdk.extensions.setRippleBackground
import com.ekino.onekeysdk.fragments.map.FullMapFragment
import com.ekino.onekeysdk.model.config.OneKeyViewCustomObject
import com.ekino.onekeysdk.model.map.OneKeyPlace
import com.ekino.onekeysdk.utils.KeyboardUtils
import com.ekino.onekeysdk.viewmodel.search.SearchViewModel
import kotlinx.android.synthetic.main.fragment_search.*

class SearchFragment(private val oneKeyViewCustomObject: OneKeyViewCustomObject) :
        AppFragment<SearchFragment, SearchViewModel>(R.layout.fragment_search),
        View.OnClickListener, OneKeyPlaceAdapter.OnOneKeyPlaceClickedListener {

    companion object {
        fun newInstance(oneKeyViewCustomObject: OneKeyViewCustomObject) =
                SearchFragment(oneKeyViewCustomObject)
    }

    private val placeAdapter by lazy { OneKeyPlaceAdapter(oneKeyViewCustomObject, this) }

    override val viewModel: SearchViewModel = SearchViewModel()

    override fun initView(view: View) {
        KeyboardUtils.setUpHideSoftKeyboard(activity, container)
        btnBack.setOnClickListener(this)
        btnSearch.setRippleBackground(oneKeyViewCustomObject.primaryColor)
        ivSpecialityClear.setOnClickListener(this)
        ivAddressClear.setOnClickListener(this)
        btnSearch.setOnClickListener(this)
        viewModel.apply {
            onAddressChanged(edtWhere)
            onSpecialityChanged(edtName)
            places.observe(this@SearchFragment, Observer {
                placeAdapter.setData(it)
            })
            specialityEvent.observe(this@SearchFragment, Observer {
                setSpecialityClearState(it)
            })
            addressEvent.observe(this@SearchFragment, Observer {
                setAddressClearState(it)
            })
        }
        rvAddress.apply {
            layoutManager = LinearLayoutManager(context)
            adapter = placeAdapter
        }
        edtName.requestFocus()
        KeyboardUtils.showSoftKeyboard(activity)
    }

    override fun onClick(v: View?) {
        when (v?.id) {
            R.id.btnBack -> activity?.onBackPressed()
            R.id.ivSpecialityClear -> {
                edtName.setText("")
                setSpecialityClearState(false)
            }
            R.id.ivAddressClear -> {
                edtWhere.setText("")
                setAddressClearState(false)
            }
            R.id.btnSearch -> {
                (activity as? AppCompatActivity)?.addFragment(R.id.fragmentContainer,
                        FullMapFragment.newInstance(oneKeyViewCustomObject), true)
            }
        }
    }

    override fun onPlaceClickedListener(place: OneKeyPlace) {
        edtWhere.setText(place.displayName)
    }

    private fun setSpecialityClearState(state: Boolean) {
        ivSpecialityClear.visibility = state.getVisibility()
    }

    private fun setAddressClearState(state: Boolean) {
        ivAddressClear.visibility = state.getVisibility()
    }
}