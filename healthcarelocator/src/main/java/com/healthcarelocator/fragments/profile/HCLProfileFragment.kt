package com.healthcarelocator.fragments.profile

import android.content.Intent
import android.graphics.Color
import android.net.Uri
import android.os.Bundle
import android.text.SpannableString
import android.text.TextUtils
import android.text.style.UnderlineSpan
import android.view.View
import android.widget.AdapterView
import android.widget.ArrayAdapter
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.Observer
import base.extensions.pushFragment
import base.extensions.share
import base.fragments.AppFragment
import com.healthcarelocator.R
import com.healthcarelocator.extensions.*
import com.healthcarelocator.fragments.map.MapFragment
import com.healthcarelocator.fragments.map.StarterMapFragment
import com.healthcarelocator.model.LabelObject
import com.healthcarelocator.model.HCLLocation
import com.healthcarelocator.model.activity.ActivityObject
import com.healthcarelocator.model.activity.ActivityWorkplaceObject
import com.healthcarelocator.model.activity.OtherActivityObject
import com.healthcarelocator.model.config.HealthCareLocatorCustomObject
import com.healthcarelocator.state.HealthCareLocatorSDK
import com.healthcarelocator.utils.KeyboardUtils
import com.healthcarelocator.viewmodel.profile.HCLProfileViewModel
import kotlinx.android.synthetic.main.fragment_one_key_profile.*


class HCLProfileFragment :
        AppFragment<HCLProfileFragment, HCLProfileViewModel>(R.layout.fragment_one_key_profile),
        View.OnClickListener, AdapterView.OnItemSelectedListener {
    companion object {
        fun newInstance(
            theme: HealthCareLocatorCustomObject = HealthCareLocatorCustomObject.Builder().build(),
            HCLLocation: HCLLocation?, activityId: String = ""
        ) =
                HCLProfileFragment().apply {
                    this.healthCareLocatorCustomObject = theme
                    this.HCLLocation = HCLLocation
                    this.activityId = activityId
                }

    }

    private var HCLLocation: HCLLocation? = null
    private var healthCareLocatorCustomObject: HealthCareLocatorCustomObject =
            HealthCareLocatorSDK.getInstance().getConfiguration()
    private val mapFragmentTag: String = StarterMapFragment::class.java.name
    private var mapFragment: MapFragment? = null
    private var activityDetail: ActivityObject = ActivityObject()
    private var activityId: String = ""
    private var vote: Int = -1
    private var phone: String = ""
    override val viewModel = HCLProfileViewModel()

    override fun initView(view: View, savedInstanceState: Bundle?) {
        KeyboardUtils.hideSoftKeyboard(activity)
        contentWrapper.setBackgroundWithCorner(
                Color.WHITE,
                healthCareLocatorCustomObject.colorCardBorder.getColor(),
                12f,
                3
        )
        if (savedInstanceState != null) {
            activityDetail = savedInstanceState.getParcelable("activityDetail") ?: ActivityObject()
            activityId = savedInstanceState.getString("activityId", "") ?: ""
            vote = savedInstanceState.getInt("vote", -1)
            phone = savedInstanceState.getString("phone", "")
        }
        if (activityDetail.id.isEmpty()) {
            viewModel.getDetailActivity(activityId)
            viewModel.activity.observe(this, Observer {
                activityDetail = it
                fillData(savedInstanceState)
                context?.getSharedPref()?.apply {
                    viewModel.storeConsultedProfile(this, it)
                }
            })
        } else {
            fillData(savedInstanceState)
            viewModel.loading.postValue(false)
        }
        viewModel.getVoteById(context, activityId)
        viewModel.voteState.observe(this, Observer { vote ->
            if (vote == 0) {
                cbxYes.isEnabled = false
                cbxYes.isChecked = true
            } else if (vote == 1) {
                cbxNo.isEnabled = false
                cbxNo.isChecked = true
            }
        })
        viewModel.loading.observe(this, Observer {
            showLoading(it)
        })
        btnBack.setOnClickListener { activity?.onBackPressed() }
        healthCareLocatorCustomObject.apply {
            modificationWrapper.visibility = showModificationForm.getVisibility()
            container.setBackgroundColor(colorViewBackground.getColor())
            ivLocationOutLine.setIconFromDrawableId(
                    iconLocation,
                    true,
                    colorMarkerSelected.getColor()
            )
            ivPhone.setIconFromDrawableId(iconPhone, true, colorGrey.getColor())
            ivFax.setIconFromDrawableId(iconFax, true, colorGrey.getColor())
            ivBrowser.setIconFromDrawableId(iconWebsite, true, colorGrey.getColor())
            cbxYes.setLayerListFromDrawable(
                    Color.WHITE,
                    colorPrimary.getColor(),
                    colorGreyLight.getColor(),
                    3,
                    context!!.getDrawableFilledIcon(iconVoteUp, colorGreyLight.getColor()),
                    context!!.getDrawableFilledIcon(iconVoteUp, Color.WHITE)
            )
            cbxNo.setLayerListFromDrawable(
                    Color.WHITE,
                    colorVoteDown.getColor(),
                    colorGreyLight.getColor(),
                    3,
                    context!!.getDrawableFilledIcon(iconVoteDown, colorGreyLight.getColor()),
                    context!!.getDrawableFilledIcon(iconVoteDown, Color.WHITE)
            )
        }
    }

    private fun fillData(savedInstanceState: Bundle?) {
        if (mapFragment == null)
            mapFragment =
                    MapFragment.newInstance(
                            healthCareLocatorCustomObject,
                            arrayListOf(),
                            2f
                    )
        val fm = this@HCLProfileFragment.childFragmentManager
        if (fm.findFragmentByTag(mapFragmentTag) == null && savedInstanceState == null) {
            fm.beginTransaction().add(R.id.viewHCPMap, mapFragment!!, mapFragmentTag)
                    .commit()
        }
        initProfile(savedInstanceState)
    }

    override fun onSaveInstanceState(outState: Bundle) {
        super.onSaveInstanceState(outState)
        outState.putInt("selectedAddress", addressSpinner.selectedItemPosition)
        outState.putParcelable("selectedLocation", HCLLocation)
        outState.putString("activityId", activityId)
        outState.putParcelable("activityDetail", activityDetail)
        outState.putInt("vote", vote)
    }

    private fun initProfile(savedInstanceState: Bundle?) {
        var selectedAddress = 0
        if (savedInstanceState != null) {
            selectedAddress = savedInstanceState.getInt("selectedAddress", 0)
            HCLLocation = savedInstanceState.getParcelable("selectedLocation")
        }
        val secondaryColor = healthCareLocatorCustomObject.colorSecondary.getColor()
        ivDirection.setColorFilter(secondaryColor)
        ivDirection.setBackgroundWithCorner(
                Color.WHITE,
                healthCareLocatorCustomObject.colorButtonBorder.getColor(),
                100f,
                3
        )
        ivCall.setBackgroundWithCorner(
                Color.WHITE,
                healthCareLocatorCustomObject.colorButtonBorder.getColor(),
                100f,
                3
        )
        ivCall.setColorFilter(secondaryColor)
        ivEdit.setColorFilter(secondaryColor)
        ivLocationOutLine.setColorFilter(healthCareLocatorCustomObject.colorMarker.getColor())
        btnSuggestModification.setBackgroundWithCorner(
                healthCareLocatorCustomObject.colorButtonBackground.getColor(),
                healthCareLocatorCustomObject.colorButtonBorder.getColor(), 8f, 3
        )

        activityDetail.apply {
            this@HCLProfileFragment.phone = phone
            tvDoctorName.text = individual?.mailingName ?: ""
            tvSpeciality.text = individual?.professionalType?.label ?: ""

            tvSpecialities.text = TextUtils.join(
                    ",", individual?.specialties
                    ?: arrayListOf<LabelObject>()
            )
            tvRateRefund.text = "Conventionned Sector 1\n\n25€"
        }

        val activities = activityDetail.individual?.otherActivities ?: arrayListOf()
        if (activities.size > 1) {
            spinnerWrapper.setBackgroundWithCorner(
                    Color.WHITE,
                    healthCareLocatorCustomObject.colorButtonBorder.getColor(),
                    10f,
                    2
            )
            spinnerWrapper.visibility = View.VISIBLE
            ArrayAdapter<OtherActivityObject>(
                    context!!,
                    R.layout.layout_one_key_spinner_item,
                    activities
            ).also {
                it.setDropDownViewResource(R.layout.layout_one_key_drop_down)
                addressSpinner.adapter = it
            }
            addressSpinner.setSelection(selectedAddress)
            addressSpinner.onItemSelectedListener = this
        } else {
            activities.firstOrNull()?.apply { changeAddress(this) }
        }

        applyStyles()

        mapOverlay.setOnClickListener(this)
        phoneWrapper.setOnClickListener(this)
        btnShare.setOnClickListener(this)
        tvWebsite.setOnClickListener(this)
        ivDirection.setOnClickListener(this)
        ivCall.setOnClickListener(this)
        btnSuggestModification.setOnClickListener(this)
        cbxYes.setOnClickListener(this)
        cbxNo.setOnClickListener(this)
    }

    override fun onClick(v: View?) {
        when (v?.id) {
            R.id.ivCall -> callToPhone()
            R.id.phoneWrapper -> callToPhone()
            R.id.ivDirection -> {
                val activities = activityDetail.individual?.otherActivities ?: arrayListOf()
                val obj =
                        (if (activities.size > 1) (addressSpinner.selectedItem as? OtherActivityObject)
                        else activities.firstOrNull()) ?: return
                if (obj.workplace?.address?.location.isNotNullable()) {
                    val location = obj.workplace?.address?.location!!
                    val lastLocation = getRunningMapFragment()?.getLastLocation()
                            ?.getLocationString() ?: ""
                    val uri =
                            "http://maps.google.com/maps?saddr=${lastLocation}&daddr=${location.getLocationByString()}"
                    val intent = Intent(Intent.ACTION_VIEW, Uri.parse(uri))
                    startActivity(intent)
                }
            }
            R.id.btnSuggestModification -> {
                with(healthCareLocatorCustomObject) {
                    val url = String.format((HealthCareLocatorSDK.getInstance() as HealthCareLocatorSDK)
                            .getModificationUrl(), this.locale, HealthCareLocatorSDK.getInstance().getApiKey(),
                            activityDetail.individual?.id ?: "")
                    val browserIntent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
                    startActivity(browserIntent)
                }
            }
            R.id.tvWebsite -> {
                val activities = activityDetail.individual?.otherActivities ?: arrayListOf()
                val obj = (if (activities.size > 1) (addressSpinner.selectedItem as? OtherActivityObject)
                else activities.firstOrNull()) ?: return
                val browserIntent = Intent(Intent.ACTION_VIEW, Uri.parse(obj.webAddress))
                startActivity(browserIntent)
            }

            R.id.btnShare -> {
                val obj = addressSpinner.selectedItem as? OtherActivityObject
                val address = obj?.workplace?.run {
                    var string = "$name"
                    if (!address?.buildingLabel.isNullOrEmpty())
                        string += "\n${address?.buildingLabel}"
                    if (!address?.longLabel.isNullOrEmpty())
                        string += "\n${address?.longLabel}"
                    string
                } ?: ""
                val link = with(HealthCareLocatorSDK.getInstance().getAppDownloadLink()) {
                    if (this.isEmpty()) ""
                    " - ${HealthCareLocatorSDK.getInstance().getAppDownloadLink()}"
                }
                val name = with(activityDetail.individual) {
                    if (this == null) ""
                    else {
                        "$firstName $middleName $lastName"
                    }
                }
                val shareString = "Here is a healthcare professional that I recommend:\n" +
                        "\n" +
                        "$name\n" + "${activityDetail.individual?.professionalType?.label}\n\n" +
                        "$address\n\n" +
                        "${obj?.phone}\n" +
                        "\n" +
                        "I found it on ${HealthCareLocatorSDK.getInstance().getAppName()}$link."
                activity?.share(shareString, "Share HCP")
            }
            R.id.mapOverlay -> {
                val activities = activityDetail.individual?.otherActivities ?: arrayListOf()
                val obj =
                        (if (activities.size > 1) (addressSpinner.selectedItem as? OtherActivityObject)
                        else activities.firstOrNull()) ?: return
                (activity as? AppCompatActivity)?.pushFragment(
                        R.id.fragmentContainer,
                        HCLProfileMapFragment.newInstance(obj), true
                )
            }
            R.id.cbxYes -> {
                cbxYes.isChecked = true
                cbxNo.isChecked = false
                cbxYes.isEnabled = false
                cbxNo.isEnabled = true
                viewModel.storeVote(context, activityId, 0)
            }
            R.id.cbxNo -> {
                cbxYes.isChecked = false
                cbxNo.isChecked = true
                cbxYes.isEnabled = true
                cbxNo.isEnabled = false
                viewModel.storeVote(context, activityId, 1)
            }
        }
    }

    override fun onNothingSelected(parent: AdapterView<*>?) {
        //Do nothing
    }

    override fun onItemSelected(parent: AdapterView<*>?, view: View?, position: Int, id: Long) {
        (addressSpinner.selectedItem as? OtherActivityObject)?.also {
            changeAddress(it)
        }
    }

    private fun changeAddress(it: OtherActivityObject) {
        setAddress(it.workplace, it.webAddress, it.phone, it.fax)
        this.phone = it.phone
        tvAddress.postDelay({ _ ->
            val address = it.workplace?.address
            if (address.isNotNullable())
                getRunningMapFragment()?.drawAddressOnMap(arrayListOf(address!!), true)
        }, 1000L)
    }

    private fun callToPhone() {
        if (phone.isEmpty()) return
        val intent = Intent(Intent.ACTION_DIAL)
        intent.data = Uri.parse("tel:${this.phone}")
        startActivity(intent)
    }

    private fun applyStyles() {
        btnShare.setColorFilter(healthCareLocatorCustomObject.colorGrey.getColor())
    }

    private fun getRunningMapFragment(): MapFragment? = try {
        childFragmentManager.fragments.firstOrNull {
            it::class.java.name == MapFragment::class.java.name
        } as? MapFragment
    } catch (e: Exception) {
        null
    }

    private fun showLoading(state: Boolean) {
        viewContainer.visibility = activityDetail.id.isNotEmpty().getVisibility()
        profileProgressBar.visibility = state.getVisibility()
    }

    private fun setAddress(
            workplace: ActivityWorkplaceObject?, webAddress: String,
            phone: String, fax: String
    ) {
        tvAddress.text = workplace?.run {
            var string = "$name"
            if (!address?.buildingLabel.isNullOrEmpty())
                string += "\n${address?.buildingLabel}"
            if (!address?.longLabel.isNullOrEmpty())
                string += "\n${address?.longLabel}"
            string
        } ?: ""
        websiteWrapper.visibility = webAddress.isNotEmpty().getVisibility()
        phoneWrapper.visibility = phone.isNotEmpty().getVisibility()
        this@HCLProfileFragment.fax.visibility = fax.isNotEmpty().getVisibility()
        if (webAddress.isNotEmpty())
            tvWebsite.text = SpannableString(webAddress).apply {
                setSpan(
                        UnderlineSpan(), 0, webAddress.length,
                        SpannableString.SPAN_EXCLUSIVE_EXCLUSIVE
                )
            }
        tvTelephone.text = phone
        tvFax.text = fax
    }
}