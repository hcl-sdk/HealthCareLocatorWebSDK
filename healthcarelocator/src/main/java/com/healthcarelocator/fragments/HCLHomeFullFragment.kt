package com.healthcarelocator.fragments

import android.content.Context
import android.graphics.Color
import android.location.Location
import android.os.Bundle
import android.view.View
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.Observer
import androidx.recyclerview.widget.LinearLayoutManager
import base.extensions.addFragment
import base.extensions.pushFragment
import base.fragments.AppFragment
import com.healthcarelocator.R
import com.healthcarelocator.adapter.home.LastConsultedAdapter
import com.healthcarelocator.adapter.home.LastSearchAdapter
import com.healthcarelocator.extensions.*
import com.healthcarelocator.fragments.map.FullMapFragment
import com.healthcarelocator.fragments.map.MapFragment
import com.healthcarelocator.fragments.map.HCLNearMeFragment
import com.healthcarelocator.fragments.map.StarterMapFragment
import com.healthcarelocator.fragments.profile.HCLProfileFragment
import com.healthcarelocator.model.config.HealthCareLocatorCustomObject
import com.healthcarelocator.model.map.HCLPlace
import com.healthcarelocator.state.HealthCareLocatorSDK
import com.healthcarelocator.viewmodel.home.HCLHomeFullViewModel
import kotlinx.android.synthetic.main.fragment_one_key_home_full.*
import org.osmdroid.views.overlay.mylocation.GpsMyLocationProvider
import org.osmdroid.views.overlay.mylocation.IMyLocationConsumer
import org.osmdroid.views.overlay.mylocation.IMyLocationProvider

class HCLHomeFullFragment : AppFragment<HCLHomeFullFragment,
        HCLHomeFullViewModel>(R.layout.fragment_one_key_home_full), View.OnClickListener, IMyLocationConsumer {
    companion object {
        fun newInstance() = HCLHomeFullFragment()
    }

    private var locationProvider: GpsMyLocationProvider? = null
    private var currentLocation: Location? = null

    private var searchTag = 0
    private var consultedTag = 0

    private val mapFragmentTag: String = StarterMapFragment::class.java.name
    private val mapFragment by lazy { MapFragment.newInstance(healthCareLocatorCustomObject, arrayListOf()) }

    private var healthCareLocatorCustomObject: HealthCareLocatorCustomObject = HealthCareLocatorSDK.getInstance().getConfiguration()
    private val lastSearchAdapter by lazy { LastSearchAdapter(healthCareLocatorCustomObject) }
    private val lastConsultedAdapter by lazy { LastConsultedAdapter(healthCareLocatorCustomObject) }

    override val viewModel = HCLHomeFullViewModel()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        try {
            org.osmdroid.config.Configuration.getInstance().load(
                    context, context!!.getSharedPreferences("OneKeySDK", Context.MODE_PRIVATE))
        } catch (e: Exception) {
        }
    }

    override fun initView(view: View, savedInstanceState: Bundle?) {
        if (savedInstanceState != null) {
            searchTag = savedInstanceState.getInt("lastSearchTag", 0)
            consultedTag = savedInstanceState.getInt("lastConsultedTag", 0)
        }
        viewModel.apply {
            requestPermissions(this@HCLHomeFullFragment)
            permissionGranted.observe(this@HCLHomeFullFragment, Observer { granted ->
                if (granted) {
                    val fm = this@HCLHomeFullFragment.childFragmentManager
                    if (fm.findFragmentByTag(mapFragmentTag) == null && savedInstanceState == null) {
                        fm.beginTransaction().add(R.id.nearMeMap, mapFragment, mapFragmentTag)
                                .commit()
                    }
                    if (locationProvider == null) {
                        locationProvider = GpsMyLocationProvider(context)
                    }
                    locationProvider?.startLocationProvider(this@HCLHomeFullFragment)
                }
            })
            activities.observe(this@HCLHomeFullFragment, Observer { list ->
                getRunningMapFragment()?.drawMarkerOnMap(list, true, true)
            })
            loading.observe(this@HCLHomeFullFragment, Observer { state ->
                showNearMeLoading(state)
            })
        }

        viewMoreSearches.text = getViewTagText(searchTag)
        viewMoreConsulted.text = getViewTagText(consultedTag)

        healthCareLocatorCustomObject.also {
            nearMeWrapper.setBackgroundWithCorner(Color.WHITE, it.colorCardBorder.getColor(), 12f, 3)
            lastSearchWrapper.setBackgroundWithCorner(Color.WHITE, it.colorCardBorder.getColor(), 12f, 3)
            lastConsultedWrapper.setBackgroundWithCorner(Color.WHITE, it.colorCardBorder.getColor(), 12f, 3)
            contentWrapper.setBackgroundColor(it.colorViewBackground.getColor())
            viewMoreSearches.setTextColor(it.colorPrimary.getColor())
            viewMoreConsulted.setTextColor(it.colorPrimary.getColor())
        }

        viewMoreSearches.setOnClickListener(this)
        viewMoreConsulted.setOnClickListener(this)
        mapOverlay.setOnClickListener(this)
        initLastSearch()

        context?.getSharedPreferences("OneKeySDK", Context.MODE_PRIVATE)?.also { pref ->
            viewModel.apply {
                getConsultedProfiles(pref)
                getLastSearches(pref)
                consultedProfiles.observe(this@HCLHomeFullFragment, Observer {
                    if (it.isEmpty()) {
                        lastConsultedWrapper.visibility = View.GONE
                        return@Observer
                    }
                    checkViewMoreConsulted(it.size, viewMoreConsulted)
                    lastConsultedAdapter.setData(it.take(if (consultedTag == 0) 3 else 10).toArrayList())
                })
                this.lastSearches.observe(this@HCLHomeFullFragment, Observer {
                    if (it.isEmpty()) {
                        lastSearchWrapper.visibility = View.GONE
                        return@Observer
                    }
                    checkViewMoreConsulted(it.size, viewMoreSearches)
                    lastSearchAdapter.setData(it.take(if (searchTag == 0) 3 else 10).toArrayList())
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

    override fun onResume() {
        super.onResume()
        FullMapFragment.clear()
//        NearMeFragment.clear()
    }

    override fun onClick(v: View?) {
        when (v?.id) {
            R.id.viewMoreSearches -> {
                if (searchTag == 0) {
                    val list = viewModel.lastSearches.value ?: arrayListOf()
                    lastSearchAdapter.addList(lastSearchAdapter.itemCount,
                            ArrayList(if (list.size >= 10) list.takeLast(7) else list.takeLast(list.size - 3)))
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
            R.id.mapOverlay -> {
                currentLocation?.also {
                    (activity as? AppCompatActivity)?.addFragment(R.id.fragmentContainer,
                            HCLNearMeFragment.newInstance(healthCareLocatorCustomObject, "", null,
                                    HCLPlace(placeId = "near_me", latitude = "${it.latitude}",
                                            longitude = "${it.longitude}", displayName = getString(R.string.hcl_near_me)),
                                    arrayListOf(), currentLocation), true)
                }
            }
        }
    }

    private fun initLastSearch() {
        rvLastSearch.apply {
            layoutManager = LinearLayoutManager(context)
            adapter = lastSearchAdapter
        }
        lastSearchAdapter.onItemRemovedListener = { data ->
            context?.getSharedPreferences("OneKeySDK", Context.MODE_PRIVATE)?.apply {
                viewModel.removeSearch(this, data)
            }
            val list = viewModel.lastSearches.value ?: arrayListOf()
            val indexed = list.indexOfFirst { it.createdAt == data.createdAt }
            if (indexed >= 0) list.removeAt(indexed)
            checkViewMoreConsulted(list.size, viewMoreSearches)
            if (lastSearchAdapter.getData().isEmpty())
                lastSearchWrapper.visibility = View.GONE
            else {
                lastSearchAdapter.setData(list.take(if (searchTag == 0) 3 else 10).toArrayList())
            }
        }
        lastSearchAdapter.onItemClickedListener = { obj ->
            (activity as? AppCompatActivity)?.pushFragment(R.id.fragmentContainer,
                    FullMapFragment.newInstance(healthCareLocatorCustomObject,
                            obj.speciality?.longLbl ?: "", obj.speciality, obj.place), true
            )
        }
        lastConsultedAdapter.onItemRemovedListener = { data, _ ->
            context?.getSharedPreferences("OneKeySDK", Context.MODE_PRIVATE)?.apply {
                viewModel.removeConsultedProfile(this, data)
            }
            val list = viewModel.consultedProfiles.value ?: arrayListOf()
            val indexed = list.indexOfFirst { it.id == data.id }
            if (indexed >= 0) list.removeAt(indexed)
            checkViewMoreConsulted(list.size, viewMoreConsulted)
            if (lastConsultedAdapter.getData().isEmpty())
                lastConsultedWrapper.visibility = View.GONE
            else {
                lastConsultedAdapter.setData(list.take(if (consultedTag == 0) 3 else 10).toArrayList())
            }
        }
        lastConsultedAdapter.onItemClickedListener = { obj ->
            healthCareLocatorCustomObject.also {
                (activity as? AppCompatActivity)?.pushFragment(R.id.fragmentContainer,
                        HCLProfileFragment.newInstance(it, null, obj.id), true)
            }
        }
        rvLastConsulted.apply {
            layoutManager = LinearLayoutManager(context)
            adapter = lastConsultedAdapter
        }
    }

    private fun showNearMeLoading(state: Boolean) {
        nearMeLoading.visibility = state.getVisibility()
    }

    private fun getRunningMapFragment(): MapFragment? {
        return try {
            childFragmentManager.fragments.firstOrNull {
                it::class.java.name == MapFragment::class.java.name
            } as? MapFragment
        } catch (e: Exception) {
            null
        }
    }

    private fun getViewTagText(tag: Int): String = if (tag == 0)
        getString(R.string.hcl_view_more) else getString(R.string.hcl_view_less)

    private fun checkViewMoreConsulted(size: Int, view: View) {
        view.visibility = (size > 3).getVisibility()
    }

    override fun onLocationChanged(location: Location?, source: IMyLocationProvider?) {
//        val l= Location.convert()
        currentLocation = location?.getCurrentLocation(currentLocation)
        locationProvider?.stopLocationProvider()
        currentLocation?.also {
            viewModel.getNearMeHCP(it) {
//                getRunningMapFragment()?.moveToPosition(GeoPoint(it.latitude, it.longitude))
            }
        }
    }
}