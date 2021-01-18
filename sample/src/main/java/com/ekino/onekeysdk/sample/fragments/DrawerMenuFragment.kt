package com.ekino.onekeysdk.sample.fragments

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import base.fragments.IFragment
import com.ekino.sample.onekeysdk.R
import com.ekino.onekeysdk.sample.SampleOneKeySDKActivity
import kotlinx.android.synthetic.main.fragment_drawer_menu.*

class DrawerMenuFragment : IFragment() {
    companion object {
        fun newInstance() = DrawerMenuFragment()
    }

    override fun shouldInterceptBackPress(): Boolean = false
    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        return inflater.inflate(R.layout.fragment_drawer_menu, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        btnClose.setOnClickListener { closeDrawer() }
        btnNewSearch.setOnClickListener {
            closeDrawer()
            (activity as? SampleOneKeySDKActivity)?.launchOneKeySDK()
        }
        btnSettings.setOnClickListener {
            closeDrawer()
            (activity as? SampleOneKeySDKActivity)?.openSettingsPage()
        }
        btnNearMeSearch.setOnClickListener {
            closeDrawer()
            (activity as? SampleOneKeySDKActivity)?.launchOneKeySDK(true, false)
        }
    }

    private fun closeDrawer() {
        (activity as? SampleOneKeySDKActivity)?.closeDrawer()
    }
}