package com.ekino.onekeysdk.fragments.search

import android.content.Context
import android.os.Bundle
import android.view.View
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.lifecycle.Observer
import androidx.recyclerview.widget.LinearLayoutManager
import base.extensions.addFragment
import base.fragments.AppFragment
import com.ekino.onekeysdk.R
import com.ekino.onekeysdk.adapter.search.OneKeyPlaceAdapter
import com.ekino.onekeysdk.extensions.ThemeExtension
import com.ekino.onekeysdk.extensions.getDummyHCP
import com.ekino.onekeysdk.extensions.getVisibility
import com.ekino.onekeysdk.extensions.setRippleBackground
import com.ekino.onekeysdk.fragments.map.FullMapFragment
import com.ekino.onekeysdk.model.config.OneKeyViewCustomObject
import com.ekino.onekeysdk.model.map.OneKeyPlace
import com.ekino.onekeysdk.utils.KeyboardUtils
import com.ekino.onekeysdk.viewmodel.search.SearchViewModel
import kotlinx.android.synthetic.main.fragment_search.*

class SearchFragment :
        AppFragment<SearchFragment, SearchViewModel>(R.layout.fragment_search),
        View.OnClickListener, OneKeyPlaceAdapter.OnOneKeyPlaceClickedListener {

    companion object {
        fun newInstance(oneKeyViewCustomObject: OneKeyViewCustomObject) =
                SearchFragment().apply { this.oneKeyViewCustomObject = oneKeyViewCustomObject }
    }

    private var oneKeyViewCustomObject: OneKeyViewCustomObject = ThemeExtension.getInstance().getThemeConfiguration()
    private val placeAdapter by lazy { OneKeyPlaceAdapter(oneKeyViewCustomObject, this) }
    private var selectedPlace: OneKeyPlace? = null

    override val viewModel: SearchViewModel = SearchViewModel()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        org.osmdroid.config.Configuration.getInstance().load(
                context, context!!.getSharedPreferences("OneKeySDK", Context.MODE_PRIVATE))
    }

    override fun initView(view: View, savedInstanceState: Bundle?) {
        KeyboardUtils.setUpHideSoftKeyboard(activity, container)
        oneKeyViewCustomObject?.also {
            btnSearch.setRippleBackground(it.colorPrimary)
            edtName.textSize = it.fontSearchInputSize.size.toFloat()
            edtWhere.textSize = it.fontSearchInputSize.size.toFloat()
        }
        btnBack.setOnClickListener(this)
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
                setError(specialityWrapper)
            })
            addressEvent.observe(this@SearchFragment, Observer {
                setAddressClearState(it)
                setError(addressWrapper)
            })
        }
        rvAddress.apply {
            layoutManager = LinearLayoutManager(context)
            adapter = placeAdapter
        }
        edtName.requestFocus()
        KeyboardUtils.showSoftKeyboard(activity)
    }

    override fun onResume() {
        super.onResume()
        FullMapFragment.clear()
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
                if (edtName.text.toString().isEmpty()) {
                    setError(specialityWrapper, R.color.colorOneKeyRed)
                    return
                }
                if (edtWhere.text.toString().isEmpty()) {
                    setError(addressWrapper, R.color.colorOneKeyRed)
                    return
                }
                oneKeyViewCustomObject?.also {
                    (activity as? AppCompatActivity)?.addFragment(R.id.fragmentContainer,
                            FullMapFragment.newInstance(it, edtName.text.toString(),
                                    selectedPlace ?: OneKeyPlace().apply {
                                        displayName = edtWhere.text.toString()
                                    }, getDummyHCP()), true)
                }
            }
        }
    }

    override fun onPlaceClickedListener(place: OneKeyPlace) {
        edtWhere.setText(place.displayName)
        this.selectedPlace = place
    }

    private fun setSpecialityClearState(state: Boolean) {
        ivSpecialityClear.visibility = state.getVisibility()
    }

    private fun setAddressClearState(state: Boolean) {
        ivAddressClear.visibility = state.getVisibility()
    }

    private fun setError(view: View, color: Int = R.color.grayLight) {
        view.setRippleBackground(ContextCompat.getColor(context!!, color), 20f)
    }
}