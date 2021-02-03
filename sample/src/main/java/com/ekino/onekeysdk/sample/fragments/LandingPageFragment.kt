package com.ekino.onekeysdk.sample.fragments

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import base.fragments.IFragment
import com.bumptech.glide.Glide
import com.ekino.onekeysdk.model.config.HCLQueryObject
import com.ekino.onekeysdk.sample.SampleOneKeySDKActivity
import com.ekino.onekeysdk.state.HealthCareLocatorSDK
import com.ekino.onekeysdk.state.HealthCareLocatorServiceCallback
import com.ekino.sample.onekeysdk.R
import com.iqvia.onekey.GetCodeByLabelQuery
import kotlinx.android.synthetic.main.fragment_landing_page.*

class LandingPageFragment : IFragment(), View.OnClickListener {
    companion object {
        fun newInstance() = LandingPageFragment()
    }

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        return inflater.inflate(R.layout.fragment_landing_page, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        Glide.with(this).load(R.drawable.logo).into(ivLogo)
        btnSearchNearMe.setOnClickListener(this)
        btnSearch.setOnClickListener(this)
    }

    override fun onClick(v: View?) {
        when (v?.id) {
            R.id.btnSearchNearMe ->{}
//                (activity as? SampleOneKeySDKActivity)?.launchOneKeySDK(true)
            R.id.btnSearch -> {
                val builder = HCLQueryObject.Builder(criteria = "gen", codeTypes = arrayListOf("SP"))
                val service = HealthCareLocatorSDK.init("200002c2aaf5b168").getServices()
                service.getCodeByLabel(builder.build(),
                        object : HealthCareLocatorServiceCallback<ArrayList<GetCodeByLabelQuery.Code>>() {
                            override fun onServiceFailed(message: String, e: Throwable) {
                                //TODO: Handle error
                            }

                            override fun onServiceResponse(data: ArrayList<GetCodeByLabelQuery.Code>) {
                                //TODO: Handle response
                                tvResult.text = data.toString()
                            }
                        })
            }
        }
    }
}