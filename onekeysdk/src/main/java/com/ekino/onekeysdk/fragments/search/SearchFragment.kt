package com.ekino.onekeysdk.fragments.search

import android.content.Context
import android.graphics.Color
import android.location.Location
import android.os.Bundle
import android.view.View
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.lifecycle.Observer
import androidx.recyclerview.widget.LinearLayoutManager
import base.extensions.addFragment
import base.extensions.pushFragment
import base.fragments.AppFragment
import com.ekino.onekeysdk.R
import com.ekino.onekeysdk.adapter.search.IndividualAdapter
import com.ekino.onekeysdk.adapter.search.OneKeyPlaceAdapter
import com.ekino.onekeysdk.extensions.*
import com.ekino.onekeysdk.fragments.map.FullMapFragment
import com.ekino.onekeysdk.fragments.profile.OneKeyProfileFragment
import com.ekino.onekeysdk.model.OneKeySpecialityObject
import com.ekino.onekeysdk.model.SearchObject
import com.ekino.onekeysdk.model.config.OneKeyCustomObject
import com.ekino.onekeysdk.model.map.OneKeyPlace
import com.ekino.onekeysdk.state.OneKeySDK
import com.ekino.onekeysdk.utils.KeyboardUtils
import com.ekino.onekeysdk.viewmodel.search.SearchViewModel
import com.iqvia.onekey.GetIndividualByNameQuery
import kotlinx.android.synthetic.main.fragment_search.*
import org.osmdroid.views.overlay.mylocation.GpsMyLocationProvider
import org.osmdroid.views.overlay.mylocation.IMyLocationConsumer
import org.osmdroid.views.overlay.mylocation.IMyLocationProvider


class SearchFragment : AppFragment<SearchFragment, SearchViewModel>(R.layout.fragment_search),
        View.OnClickListener, OneKeyPlaceAdapter.OnOneKeyPlaceClickedListener, IMyLocationConsumer,
        View.OnFocusChangeListener, IndividualAdapter.OnIndividualClickedListener {

    companion object {
        fun newInstance(oneKeyCustomObject: OneKeyCustomObject, isUseNearMe: Boolean = false,
                        currentLocation: Location? = null) =
                SearchFragment().apply {
                    this.oneKeyCustomObject = oneKeyCustomObject
                    this.currentLocation = currentLocation
                    useNearMe = isUseNearMe
                }

        private var useNearMe: Boolean = false
    }

    private var oneKeyCustomObject: OneKeyCustomObject =
            OneKeySDK.getInstance().getConfiguration()
    private val placeAdapter by lazy { OneKeyPlaceAdapter(oneKeyCustomObject, this) }
    private val individualAdapter by lazy { IndividualAdapter() }
    private var selectedPlace: OneKeyPlace? = null
    private var locationProvider: GpsMyLocationProvider? = null
    private var currentLocation: Location? = null
    private var selectedSpeciality: OneKeySpecialityObject? = null
    private var isExpand = false
    var onItemClicked = false

    override val viewModel: SearchViewModel = SearchViewModel()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        try {
            org.osmdroid.config.Configuration.getInstance().load(
                    context, context!!.getSharedPreferences("OneKeySDK", Context.MODE_PRIVATE)
            )
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    override fun initView(view: View, savedInstanceState: Bundle?) {
        KeyboardUtils.setUpHideSoftKeyboard(activity, container)
        if (savedInstanceState != null) {
            selectedSpeciality = savedInstanceState.getParcelable("selectedSpeciality")
            selectedPlace = savedInstanceState.getParcelable("selectedPlace")
            isExpand = savedInstanceState.getBoolean("expand", false)
            if (isExpand) selectionWrapper.expand(true)
            else selectionWrapper.collapse(true)
        }
        viewModel.requestPermission(this)
        viewModel.permissionGranted.observe(this, Observer {
            if (it) {
                if (locationProvider == null) {
                    locationProvider = GpsMyLocationProvider(context)
                }
                locationProvider?.startLocationProvider(this)
            }
        })

        if (currentLocation != null && useNearMe) {
            setNearMeText()
        }

        oneKeyCustomObject?.also {
            val primaryColor = it.colorPrimary.getColor()
            btnSearch.setRippleBackground(primaryColor, 20f)
            edtName.textSize = it.fontSearchInput.size.toFloat()
            edtWhere.textSize = it.fontSearchInput.size.toFloat()
            ivNearMe.setColorFilter(primaryColor)
            ivLocationSelected.setColorFilter(primaryColor)
            tvLocationSelected.setTextColor(primaryColor)
            ivNearMe.setRippleCircleBackground(primaryColor, 26)
            ivLocationSelected.setRippleCircleBackground(primaryColor, 26)
            selectionLine.setBackgroundColor(primaryColor)
            ivSpecialityClear.setIconFromDrawableId(it.iconCross, true, it.colorGrey.getColor())
            ivAddressClear.setIconFromDrawableId(it.iconCross, true, it.colorGrey.getColor())
            btnSearch.setIconFromDrawableId(it.searchIcon, true, Color.WHITE)
            ivNearMe.setIconFromDrawableId(it.iconGeoLoc, true, it.colorPrimary.getColor())
            ivLocationSelected.setIconFromDrawableId(it.iconMarkerMin, true, it.colorPrimary.getColor())
        }
        btnBack.setOnClickListener(this)
        ivSpecialityClear.setOnClickListener(this)
        ivAddressClear.setOnClickListener(this)
        btnSearch.setOnClickListener(this)
        nearMeWrapper.setOnClickListener(this)

        viewModel.apply {
            onAddressChanged(edtWhere)
            onSpecialityChanged(this@SearchFragment, edtName)
            places.observe(this@SearchFragment, Observer {
                placeAdapter.setData(it)
            })
            specialityEvent.observe(this@SearchFragment, Observer {
                setSpecialityClearState(it)
                setError(specialityWrapper)
                if (edtName.hasFocus())
                    rvSpeciality.visibility = it.getVisibility()
            })
            addressEvent.observe(this@SearchFragment, Observer {
                setAddressClearState(it)
                setError(addressWrapper)
                if (edtWhere.text.toString() == "Near me") {
                    isExpand = false
                    selectionWrapper.collapse(true)
                }
            })
        }
        rvAddress.apply {
            layoutManager = LinearLayoutManager(context)
            adapter = placeAdapter
        }
        edtName.onFocusChangeListener = this
        edtName.requestFocus()
        initIndividual()
        initAddress()
        KeyboardUtils.showSoftKeyboard(activity)
    }

    override fun onResume() {
        super.onResume()
        FullMapFragment.clear()
    }

    override fun onSaveInstanceState(outState: Bundle) {
        super.onSaveInstanceState(outState)
        outState.putBoolean("expand", isExpand)
        outState.putParcelable("selectedSpeciality", selectedSpeciality)
        outState.putParcelable("selectedPlace", selectedPlace)
    }

    override fun onDestroyView() {
        super.onDestroyView()
        locationProvider?.stopLocationProvider()
    }

    override fun onClick(v: View?) {
        when (v?.id) {
            R.id.btnBack -> activity?.onBackPressed()
            R.id.ivSpecialityClear -> {
                edtName.setText("")
                setSpecialityClearState(false)
                selectedSpeciality = null
            }
            R.id.ivAddressClear -> {
                edtWhere.setText("")
                locationSelectedWrapper.visibility = View.GONE
                setAddressClearState(false)
                selectedPlace = null
            }
            R.id.btnSearch -> {
                if (edtName.text.toString().isEmpty()) {
                    setError(specialityWrapper, ContextCompat.getColor(context!!, R.color.colorOneKeyRed))
                    return
                }
                setFocusable(false)
                oneKeyCustomObject?.also {
                    onItemClicked = true
                    context?.getSharedPreferences("OneKeySDK", Context.MODE_PRIVATE)?.apply {
                        viewModel.storeSearch(this, SearchObject(selectedSpeciality
                                ?: OneKeySpecialityObject(longLbl = edtName.text.toString()), selectedPlace
                                ?: OneKeyPlace().apply {
                                    displayName = edtWhere.text.toString()
                                }))
                    }
                    (activity as? AppCompatActivity)?.pushFragment(R.id.fragmentContainer,
                            FullMapFragment.newInstance(it, edtName.text.toString(), selectedSpeciality,
                                    selectedPlace ?: OneKeyPlace().apply {
                                        displayName = edtWhere.text.toString()
                                    }), true
                    )
                }
            }
            R.id.nearMeWrapper -> {
                setNearMeText()
            }
        }
    }

    override fun onPlaceClickedListener(place: OneKeyPlace) {
        edtWhere.setText(place.displayName)
        locationSelectedWrapper.visibility = View.VISIBLE
        tvLocationSelected.text = place.displayName
        this.selectedPlace = place
    }

    private fun initIndividual() {
        rvSpeciality.apply {
            layoutManager = LinearLayoutManager(context)
            adapter = individualAdapter
        }
        individualAdapter.setData(viewModel.individuals.value ?: arrayListOf())
        individualAdapter.onIndividualClickedListener = this
        viewModel.individualsState.observe(this, Observer {
            showNameProgressBar(it)
        })
        viewModel.individuals.observe(this, Observer {
            individualAdapter.setKeyword(edtName.text.toString())
            individualAdapter.setData(it)
        })
    }

    private fun initAddress() {
        viewModel.addressState.observe(this, Observer {
            showAddressLoading(it)
        })
    }

    private fun setNearMeText() {
        currentLocation?.apply {
            selectedPlace = OneKeyPlace(placeId = "near_me", latitude = "$latitude",
                    longitude = "$longitude", displayName = getString(R.string.onekey_sdk_near_me))
            edtWhere.setText(selectedPlace?.displayName ?: "")
        }
    }

    private fun setSpecialityClearState(state: Boolean) {
        ivSpecialityClear.visibility = state.getVisibility()
    }

    private fun setAddressClearState(state: Boolean) {
        ivAddressClear.visibility = state.getVisibility()
    }

    private fun setError(view: View, strokeColor: Int = oneKeyCustomObject.colorCardBorder.getColor()) {
        view.setBackgroundWithCorner(Color.WHITE, strokeColor, 12f, 3)
    }

    override fun onLocationChanged(location: Location?, source: IMyLocationProvider?) {
        currentLocation = location?.getCurrentLocation(currentLocation)
        if (currentLocation != null && ((edtWhere.hasFocus()) ||
                        (edtName.hasFocus() && edtName.text.toString().isEmpty()))
                && edtWhere.text.toString() != "Near me") {
            isExpand = true
            selectionWrapper.expand(true)
        } else {
            isExpand = false
            selectionWrapper.collapse(true)
        }
    }

    override fun onIndividualClickedListener(data: OneKeySpecialityObject) {
        this.selectedSpeciality = data
        onItemClicked = true
        edtName.setText(data.longLbl)
        edtWhere.requestFocus()
    }

    override fun onHCPClickedListener(data: GetIndividualByNameQuery.Individual) {
        onItemClicked = true
        (activity as? AppCompatActivity)?.addFragment(R.id.fragmentContainer,
                OneKeyProfileFragment.newInstance(oneKeyCustomObject, null, data.mainActivity().id()), true)
    }

    override fun onFocusChange(v: View?, hasFocus: Boolean) {
        if (v?.id == edtName.id && edtName.text.toString().isNotEmpty()) {
            rvSpeciality.visibility = hasFocus.getVisibility()
        } else {
            rvSpeciality.visibility = View.GONE
        }
    }

    private fun showNameProgressBar(state: Boolean) {
        nameBar.visibility = state.getVisibility()
        setSpecialityClearState(!state)
    }

    private fun showAddressLoading(state: Boolean) {
        addressLoading.visibility = state.getVisibility()
        setAddressClearState(!state)
    }

    fun clearIndividualData() {
        individualAdapter.clear()
    }

    fun setFocusable(isFocusable:Boolean){
        edtName.isFocusableInTouchMode = isFocusable
        edtName.isFocusable = isFocusable
        edtWhere.isFocusableInTouchMode = isFocusable
        edtWhere.isFocusable = isFocusable
        if (isFocusable){
            edtName.requestFocus()
        }
    }
}