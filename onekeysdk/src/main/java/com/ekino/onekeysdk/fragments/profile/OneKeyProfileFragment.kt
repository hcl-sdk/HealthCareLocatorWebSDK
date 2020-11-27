package com.ekino.onekeysdk.fragments.profile

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.text.SpannableString
import android.text.style.UnderlineSpan
import android.view.View
import android.widget.ArrayAdapter
import android.widget.CompoundButton
import base.fragments.AppFragment
import com.ekino.onekeysdk.R
import com.ekino.onekeysdk.extensions.ThemeExtension
import com.ekino.onekeysdk.extensions.getColor
import com.ekino.onekeysdk.extensions.getDummyHCP
import com.ekino.onekeysdk.fragments.map.MapFragment
import com.ekino.onekeysdk.fragments.map.StarterMapFragment
import com.ekino.onekeysdk.model.OneKeyLocation
import com.ekino.onekeysdk.model.config.OneKeyViewCustomObject
import com.ekino.onekeysdk.viewmodel.profile.OneKeyProfileViewModel
import kotlinx.android.synthetic.main.fragment_one_key_profile.*


class OneKeyProfileFragment : AppFragment<OneKeyProfileFragment, OneKeyProfileViewModel>(R.layout.fragment_one_key_profile), View.OnClickListener, CompoundButton.OnCheckedChangeListener {
    companion object {
        fun newInstance(theme: OneKeyViewCustomObject = OneKeyViewCustomObject.Builder().build(),
                        oneKeyLocation: OneKeyLocation) =
                OneKeyProfileFragment().apply {
                    this.oneKeyViewCustomObject = theme
                    this.oneKeyLocation = oneKeyLocation
                }

    }

    private val locations by lazy { getDummyHCP() }
    private var oneKeyLocation: OneKeyLocation? = null
    private var oneKeyViewCustomObject: OneKeyViewCustomObject = ThemeExtension.getInstance().getThemeConfiguration()
    private val mapFragmentTag: String = StarterMapFragment::class.java.name
    private val mapFragment by lazy { MapFragment.newInstance(oneKeyViewCustomObject, locations) }
    override val viewModel = OneKeyProfileViewModel()

    override fun initView(view: View, savedInstanceState: Bundle?) {
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
    }

    private fun initProfile(savedInstanceState: Bundle?) {
        var selectedAddress = 0
        if (savedInstanceState != null) {
            selectedAddress = savedInstanceState.getInt("selectedAddress", 0)
            oneKeyLocation = savedInstanceState.getParcelable("selectedLocation")
        }
        val secondaryColor = oneKeyViewCustomObject.secondaryColor.getColor()
        tvDoctorName.setTextColor(secondaryColor)
        tvMainInformation.setTextColor(secondaryColor)
        tvSpecialitiesLabel.setTextColor(secondaryColor)
        tvRateRefundLabel.setTextColor(secondaryColor)
        tvInformationLabel.setTextColor(secondaryColor)
        tvModificationLabel.setTextColor(secondaryColor)
        ivDirection.setColorFilter(secondaryColor)
        ivCall.setColorFilter(secondaryColor)
        ivEdit.setColorFilter(secondaryColor)
        ivLocationOutLine.setColorFilter(oneKeyViewCustomObject.markerColor.getColor())

        tvDoctorName.text = oneKeyLocation?.name ?: ""
        tvSpeciality.text = oneKeyLocation?.speciality ?: ""
        tvAddress.text = "Centre Médical de Soins\nService Médecine Génarale\n${oneKeyLocation?.address ?: ""}"
        val website = "www.medicalsoinsparis.com"
        tvWebsite.text = SpannableString(website).apply {
            setSpan(UnderlineSpan(), 0, website.length, SpannableString.SPAN_EXCLUSIVE_EXCLUSIVE)
        }
        tvTelephone.text = "01 44 58 56 58"
        tvFax.text = "01 44 56 56 56"
        tvSpecialities.text = "Generalist, Cardiology, Neurologist"
        tvRateRefund.text = "Conventionned Sector 1\n\n25€"
        tvModification.text = "Lorem ipsum dolor sit amet, consectetur adipis elit. Vivamus pretium auctor accumsan."

        ArrayAdapter<OneKeyLocation>(context!!, R.layout.layout_one_key_spinner_item, locations).also {
            it.setDropDownViewResource(R.layout.layout_one_key_drop_down)
            addressSpinner.adapter = it
        }
        addressSpinner.setSelection(selectedAddress)

        ivDirection.setOnClickListener(this)
        ivCall.setOnClickListener(this)
        btnSuggestModification.setOnClickListener(this)
        cbxYes.setOnCheckedChangeListener(this)
        cbxNo.setOnCheckedChangeListener(this)
    }

    override fun onClick(v: View?) {
        when (v?.id) {
            R.id.ivCall -> {
                val intent = Intent(Intent.ACTION_DIAL)
                intent.data = Uri.parse("tel:0123456789")
                startActivity(intent)
            }
            R.id.ivDirection -> {
                oneKeyLocation?.also {
                    val uri = "http://maps.google.com/maps?q=loc:${it.getLocationByString()}"
                    val intent = Intent(Intent.ACTION_VIEW, Uri.parse(uri))
                    startActivity(intent)
                }
            }
            R.id.btnSuggestModification -> {
            }
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
}