package com.ekino.onekeysdk.fragments

import android.content.Context
import android.os.Bundle
import android.view.View
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.Observer
import androidx.recyclerview.widget.LinearLayoutManager
import base.extensions.addFragment
import base.fragments.AppFragment
import com.ekino.onekeysdk.R
import com.ekino.onekeysdk.adapter.home.LastSearchAdapter
import com.ekino.onekeysdk.extensions.*
import com.ekino.onekeysdk.fragments.map.MapFragment
import com.ekino.onekeysdk.fragments.map.StarterMapFragment
import com.ekino.onekeysdk.fragments.profile.OneKeyProfileFragment
import com.ekino.onekeysdk.fragments.search.SearchFragment
import com.ekino.onekeysdk.model.OneKeyLocation
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

    private var searchTag = 0
    private var consultedTag = 0

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
        var lastSearches = ArrayList(locations.take(3))
        var lastConsulted = ArrayList(locations.take(3))
        if (savedInstanceState != null) {
            searchTag = savedInstanceState.getInt("lastSearchTag", 0)
            consultedTag = savedInstanceState.getInt("lastConsultedTag", 0)
            lastSearches = savedInstanceState.getParcelableArrayList("lastSearches")
                    ?: ArrayList()
            lastConsulted = savedInstanceState.getParcelableArrayList("lastConsulted")
                    ?: ArrayList()
        }
        val fm = this@OneKeyHomeFullFragment.childFragmentManager
        if (fm.findFragmentByTag(mapFragmentTag) == null && savedInstanceState == null) {
            fm.beginTransaction().add(R.id.nearMeMap, mapFragment, mapFragmentTag)
                    .commit()
        }
        viewMoreSearches.text = getViewTagText(searchTag)
        viewMoreConsulted.text = getViewTagText(consultedTag)

        oneKeyViewCustomObject.also {
            ivSearch.setRippleBackground(it.colorPrimary)
            viewMoreSearches.setTextColor(it.colorPrimary.getColor())
            viewMoreConsulted.setTextColor(it.colorPrimary.getColor())
            edtSearch.textSize = it.fontSearchInput.size.toFloat()
        }

        newSearchWrapper.setOnClickListener(this)
        viewMoreSearches.setOnClickListener(this)
        viewMoreConsulted.setOnClickListener(this)
        initLastSearch(lastSearches, lastConsulted)

        context?.getSharedPreferences("OneKeySDK", Context.MODE_PRIVATE)?.also { pref ->
            viewModel.apply {
                getConsultedProfiles(pref)
                consultedProfiles.observe(this@OneKeyHomeFullFragment, Observer {
                    checkViewMoreConsulted(it.size)
                    lastConsultedAdapter.setData(it.take(if (consultedTag == 0) 3 else 10).toArrayList())
                })
            }
        }
    }

    override fun onSaveInstanceState(outState: Bundle) {
        super.onSaveInstanceState(outState)
        outState.putParcelableArrayList("lastSearches", lastSearchAdapter.getData())
        outState.putParcelableArrayList("lastConsulted", lastSearchAdapter.getData())
        outState.putInt("lastSearchTag", searchTag)
        outState.putInt("lastConsultedTag", consultedTag)
    }

    override fun onClick(v: View?) {
        when (v?.id) {
            R.id.viewMoreSearches -> {
                if (searchTag == 0) {
                    lastSearchAdapter.addList(lastSearchAdapter.itemCount, ArrayList(locations.takeLast(7)))
                    searchTag = 1
                    viewMoreSearches.text = getViewTagText(1)
                } else {
                    lastSearchAdapter.removeRange(3, lastSearchAdapter.itemCount)
                    searchTag = 0
                    viewMoreSearches.text = getViewTagText(0)
                }
            }
            R.id.viewMoreConsulted -> {
                if (consultedTag == 0) {
                    val list = viewModel.consultedProfiles.value ?: arrayListOf()
                    lastConsultedAdapter.addList(lastConsultedAdapter.itemCount,
                            ArrayList(if (list.size >= 10) list.takeLast(7) else list.takeLast(list.size - 3)))
                    consultedTag = 1
                    viewMoreConsulted.text = getViewTagText(1)
                } else {
                    lastConsultedAdapter.removeRange(3, lastConsultedAdapter.itemCount)
                    consultedTag = 0
                    viewMoreConsulted.text = getViewTagText(0)
                }
            }
            R.id.newSearchWrapper -> startNewSearch()
        }
    }

    private fun initLastSearch(lastSearches: ArrayList<OneKeyLocation>, lastConsulted: ArrayList<OneKeyLocation>) {
        rvLastSearch.apply {
            layoutManager = LinearLayoutManager(context)
            adapter = lastSearchAdapter
            lastSearchAdapter.setData(lastSearches)
        }
        lastSearchAdapter.onItemRemovedListener = {
            if (lastSearchAdapter.getData().isEmpty())
                lastSearchWrapper.visibility = View.GONE
        }
        lastSearchAdapter.onItemClickedListener = { location ->
            if (location.isHCP)
                oneKeyViewCustomObject.also {
                    (activity as? AppCompatActivity)?.addFragment(R.id.fragmentContainer,
                            OneKeyProfileFragment.newInstance(it, location), true)
                }
        }
        lastConsultedAdapter.onItemRemovedListener = {
            checkViewMoreConsulted(lastConsultedAdapter.getData().size)
            if (lastConsultedAdapter.getData().isEmpty())
                lastConsultedWrapper.visibility = View.GONE
        }
        lastConsultedAdapter.onItemClickedListener = { location ->
            if (location.isHCP)
                oneKeyViewCustomObject.also {
                    (activity as? AppCompatActivity)?.addFragment(R.id.fragmentContainer,
                            OneKeyProfileFragment.newInstance(it, location), true)
                }
        }
        rvLastConsulted.apply {
            layoutManager = LinearLayoutManager(context)
            adapter = lastConsultedAdapter
        }
    }


    private fun startNewSearch() {
        oneKeyViewCustomObject.also {
            (activity as? AppCompatActivity)?.addFragment(R.id.fragmentContainer,
                    SearchFragment.newInstance(it), true)
        }
    }

    private fun getViewTagText(tag: Int): String = if (tag == 0) "View more" else "View less"
    private fun checkViewMoreConsulted(size: Int) {
        if (size <= 3) viewMoreConsulted.visibility = View.GONE
    }
}