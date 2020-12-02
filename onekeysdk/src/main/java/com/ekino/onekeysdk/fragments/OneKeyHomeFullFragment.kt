package com.ekino.onekeysdk.fragments

import android.content.Context
import android.os.Bundle
import android.view.View
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import base.extensions.addFragment
import base.fragments.AppFragment
import com.ekino.onekeysdk.R
import com.ekino.onekeysdk.adapter.home.LastSearchAdapter
import com.ekino.onekeysdk.extensions.ThemeExtension
import com.ekino.onekeysdk.extensions.getColor
import com.ekino.onekeysdk.extensions.getDummyHCP
import com.ekino.onekeysdk.extensions.setRippleBackground
import com.ekino.onekeysdk.fragments.map.MapFragment
import com.ekino.onekeysdk.fragments.map.StarterMapFragment
import com.ekino.onekeysdk.fragments.search.SearchFragment
import com.ekino.onekeysdk.model.config.OneKeyViewCustomObject
import com.ekino.onekeysdk.viewmodel.home.OneKeyHomFullViewModel
import kotlinx.android.synthetic.main.fragment_one_key_home_full.*

class OneKeyHomeFullFragment : AppFragment<OneKeyHomeFullFragment,
        OneKeyHomFullViewModel>(R.layout.fragment_one_key_home_full), View.OnClickListener {
    companion object {
        fun newInstance(oneKeyViewCustomObject: OneKeyViewCustomObject = OneKeyViewCustomObject.Builder().build()) =
                OneKeyHomeFullFragment().apply {
                    this.oneKeyViewCustomObject = oneKeyViewCustomObject
                }
    }

    private val locations by lazy { getDummyHCP() }

    private val mapFragmentTag: String = StarterMapFragment::class.java.name
    private val mapFragment by lazy { MapFragment.newInstance(oneKeyViewCustomObject, locations) }

    private var oneKeyViewCustomObject: OneKeyViewCustomObject = ThemeExtension.getInstance().getThemeConfiguration()
    private val lastSearchAdapter by lazy { LastSearchAdapter(oneKeyViewCustomObject) }
    private val lastConsultedAdapter by lazy { LastSearchAdapter(oneKeyViewCustomObject) }

    override val viewModel = OneKeyHomFullViewModel()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        org.osmdroid.config.Configuration.getInstance().load(
                context, context!!.getSharedPreferences("OneKeySDK", Context.MODE_PRIVATE))
    }

    override fun initView(view: View, savedInstanceState: Bundle?) {
        val fm = this@OneKeyHomeFullFragment.childFragmentManager
        if (fm.findFragmentByTag(mapFragmentTag) == null && savedInstanceState == null) {
            fm.beginTransaction().add(R.id.nearMeMap, mapFragment, mapFragmentTag)
                    .commit()
        }
        oneKeyViewCustomObject.also {
            ivSearch.setRippleBackground(it.colorPrimary)
            viewMoreSearches.setTextColor(it.colorPrimary.getColor())
            viewMoreConsulted.setTextColor(it.colorPrimary.getColor())
            edtSearch.textSize = it.fontSearchInputSize.size.toFloat()
        }

        newSearchWrapper.setOnClickListener(this)
        viewMoreSearches.setOnClickListener(this)
        viewMoreConsulted.setOnClickListener(this)
        initLastSearch()
    }

    override fun onClick(v: View?) {
        when (v?.id) {
            R.id.viewMoreSearches -> {
            }
            R.id.newSearchWrapper -> startNewSearch()
        }
    }

    private fun initLastSearch() {
        rvLastSearch.apply {
            layoutManager = LinearLayoutManager(context)
            adapter = lastSearchAdapter
            lastSearchAdapter.setData(ArrayList(locations.take(3)))
        }
        rvLastConsulted.apply {
            layoutManager = LinearLayoutManager(context)
            adapter = lastConsultedAdapter
            lastConsultedAdapter.setData(ArrayList(locations.take(3)))
        }
    }


    private fun startNewSearch() {
        oneKeyViewCustomObject.also {
            (activity as? AppCompatActivity)?.addFragment(R.id.fragmentContainer,
                    SearchFragment.newInstance(it), true)
        }
    }
}