package com.ekino.onekeysdk.fragments.profile

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.text.SpannableString
import android.text.TextUtils
import android.text.style.UnderlineSpan
import android.view.View
import android.widget.AdapterView
import android.widget.ArrayAdapter
import android.widget.CompoundButton
import androidx.lifecycle.Observer
import base.fragments.AppFragment
import com.ekino.onekeysdk.R
import com.ekino.onekeysdk.extensions.*
import com.ekino.onekeysdk.fragments.map.MapFragment
import com.ekino.onekeysdk.fragments.map.StarterMapFragment
import com.ekino.onekeysdk.model.LabelObject
import com.ekino.onekeysdk.model.OneKeyLocation
import com.ekino.onekeysdk.model.activity.ActivityObject
import com.ekino.onekeysdk.model.config.OneKeyViewCustomObject
import com.ekino.onekeysdk.utils.KeyboardUtils
import com.ekino.onekeysdk.viewmodel.profile.OneKeyProfileViewModel
import kotlinx.android.synthetic.main.fragment_one_key_profile.*


class OneKeyProfileFragment : AppFragment<OneKeyProfileFragment, OneKeyProfileViewModel>(R.layout.fragment_one_key_profile), View.OnClickListener, CompoundButton.OnCheckedChangeListener, AdapterView.OnItemSelectedListener {
    companion object {
        fun newInstance(theme: OneKeyViewCustomObject = OneKeyViewCustomObject.Builder().build(),
                        oneKeyLocation: OneKeyLocation?, activityId: String = "") =
                OneKeyProfileFragment().apply {
                    this.oneKeyViewCustomObject = theme
                    this.oneKeyLocation = oneKeyLocation
                    this.activityId = activityId
                }

    }

    private val locations by lazy { getDummyHCP() }
    private var oneKeyLocation: OneKeyLocation? = null
    private var oneKeyViewCustomObject: OneKeyViewCustomObject = ThemeExtension.getInstance().getThemeConfiguration()
    private val mapFragmentTag: String = StarterMapFragment::class.java.name
    private val mapFragment by lazy { MapFragment.newInstance(oneKeyViewCustomObject, ArrayList(locations.take(1))) }
    private var activityDetail: ActivityObject? = null
    private var activityId: String = ""
    override val viewModel = OneKeyProfileViewModel()

    override fun initView(view: View, savedInstanceState: Bundle?) {
        KeyboardUtils.hideSoftKeyboard(activity)
        if (savedInstanceState != null) {
            activityDetail = savedInstanceState.getParcelable("activityDetail")
            activityId = savedInstanceState.getString("activityId", "") ?: ""
        }
        if (activityDetail == null) {
            viewModel.getDetailActivity(activityId)
            viewModel.activity.observe(this, Observer {
                activityDetail = it
                fillData(savedInstanceState)
            })
        } else {
            fillData(savedInstanceState)
            viewModel.loading.postValue(false)
        }
        viewModel.loading.observe(this, Observer {
            showLoading(it)
        })
    }

    private fun fillData(savedInstanceState: Bundle?) {
        val fm = this@OneKeyProfileFragment.childFragmentManager
        if (fm.findFragmentByTag(mapFragmentTag) == null && savedInstanceState == null) {
            fm.beginTransaction().add(R.id.viewHCPMap, mapFragment, mapFragmentTag)
                    .commit()
        }
        initProfile(savedInstanceState)
    }

    override fun onSaveInstanceState(outState: Bundle) {
        super.onSaveInstanceState(outState)
        outState.putInt("selectedAddress", addressSpinner.selectedItemPosition)
        outState.putParcelable("selectedLocation", oneKeyLocation)
        outState.putString("activityId", activityId)
        outState.putParcelable("activityDetail", activityDetail)
    }

    private fun initProfile(savedInstanceState: Bundle?) {
        var selectedAddress = 0
        if (savedInstanceState != null) {
            selectedAddress = savedInstanceState.getInt("selectedAddress", 0)
            oneKeyLocation = savedInstanceState.getParcelable("selectedLocation")
        }
        val secondaryColor = oneKeyViewCustomObject.colorSecondary.getColor()
//        tvDoctorName.setTextColor(secondaryColor)
//        tvMainInformation.setTextColor(secondaryColor)
//        tvSpecialitiesLabel.setTextColor(secondaryColor)
//        tvRateRefundLabel.setTextColor(secondaryColor)
//        tvInformationLabel.setTextColor(secondaryColor)
//        tvModificationLabel.setTextColor(secondaryColor)
        ivDirection.setColorFilter(secondaryColor)
        ivCall.setColorFilter(secondaryColor)
        ivEdit.setColorFilter(secondaryColor)
        ivLocationOutLine.setColorFilter(oneKeyViewCustomObject.colorMarker.getColor())

        activityDetail?.apply {
            tvDoctorName.text = "Dr ${individual?.firstName} ${individual?.lastName}"
            tvSpeciality.text = individual?.specialties?.firstOrNull()?.label ?: ""
            tvAddress.text = workplace?.address?.run {
                "${longLabel}, ${city?.label}, ${county?.label}, ${country}"
            } ?: ""
            websiteWrapper.visibility = webAddress.isNotEmpty().getVisibility()
            phoneWrapper.visibility = phone.isNotEmpty().getVisibility()
            this@OneKeyProfileFragment.fax.visibility = fax.isNotEmpty().getVisibility()
            if (webAddress.isNotEmpty())
                tvWebsite.text = SpannableString(webAddress).apply {
                    setSpan(UnderlineSpan(), 0, webAddress.length, SpannableString.SPAN_EXCLUSIVE_EXCLUSIVE)
                }
            tvTelephone.text = phone
            tvFax.text = fax
            tvSpecialities.text = TextUtils.join(",",
                    individual?.specialties ?: arrayListOf<LabelObject>())
            tvRateRefund.text = "Conventionned Sector 1\n\n25€"
            tvModification.text = "Lorem ipsum dolor sit amet, consectetur adipis elit. Vivamus pretium auctor accumsan."
        }

        ArrayAdapter<OneKeyLocation>(context!!, R.layout.layout_one_key_spinner_item, locations).also {
            it.setDropDownViewResource(R.layout.layout_one_key_drop_down)
            addressSpinner.adapter = it
        }
        addressSpinner.setSelection(selectedAddress)
        addressSpinner.onItemSelectedListener = this

        applyStyles()

        btnBack.setOnClickListener(this)
        tvWebsite.setOnClickListener(this)
        ivDirection.setOnClickListener(this)
        ivCall.setOnClickListener(this)
        btnSuggestModification.setOnClickListener(this)
        cbxYes.setOnCheckedChangeListener(this)
        cbxNo.setOnCheckedChangeListener(this)
    }

    override fun onClick(v: View?) {
        when (v?.id) {
            R.id.ivCall -> {
                activityDetail?.also {
                    val intent = Intent(Intent.ACTION_DIAL)
                    intent.data = Uri.parse("tel:${it.phone}")
                    startActivity(intent)
                }
            }
            R.id.ivDirection -> {
                oneKeyLocation?.also {
                    val lastLocation = getRunningMapFragment()?.getLastLocation()
                            ?.getLocationString() ?: ""
                    val uri = "http://maps.google.com/maps?saddr=${lastLocation}&daddr=${it.getLocationByString()}"
                    val intent = Intent(Intent.ACTION_VIEW, Uri.parse(uri))
                    startActivity(intent)
                }
            }
            R.id.btnSuggestModification -> {
                val browserIntent = Intent(Intent.ACTION_VIEW, Uri.parse("http://www.google.com"))
                startActivity(browserIntent)
            }
            R.id.tvWebsite -> {
                val browserIntent = Intent(Intent.ACTION_VIEW, Uri.parse("http://www.google.com"))
                startActivity(browserIntent)
            }
            R.id.btnBack -> activity?.onBackPressed()
        }
    }

    override fun onCheckedChanged(buttonView: CompoundButton?, isChecked: Boolean) {
        if (buttonView?.id == cbxYes.id) {
            if (isChecked && cbxNo.isChecked)
                cbxNo.isChecked = false
        } else if (buttonView?.id == cbxNo.id) {
            if (isChecked && cbxYes.isChecked)
                cbxYes.isChecked = false
        }
    }

    override fun onNothingSelected(parent: AdapterView<*>?) {
        //Do nothing
    }

    override fun onItemSelected(parent: AdapterView<*>?, view: View?, position: Int, id: Long) {
        locations.getOrNull(position)?.also {
            oneKeyLocation = it
            getRunningMapFragment()?.drawMarkerOnMap(arrayListOf(it), true)
        }
    }

    private fun applyStyles() {
        btnShare.setColorFilter(oneKeyViewCustomObject.colorGrey.getColor())
    }

    private fun getRunningMapFragment(): MapFragment? = childFragmentManager.fragments.firstOrNull {
        it::class.java.name == MapFragment::class.java.name
    } as? MapFragment

    private fun showLoading(state: Boolean) {
        profileProgressBar.visibility = state.getVisibility()
    }
}