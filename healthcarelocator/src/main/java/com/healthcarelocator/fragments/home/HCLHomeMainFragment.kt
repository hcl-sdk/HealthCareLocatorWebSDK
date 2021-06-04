package com.healthcarelocator.fragments.home

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.graphics.Color
import android.os.Bundle
import android.view.View
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.Observer
import base.extensions.addFragment
import base.extensions.unregisterReceiver
import base.fragments.AppFragment
import base.fragments.IFragment
import com.healthcarelocator.R
import com.healthcarelocator.activities.HCLLocationActivity
import com.healthcarelocator.extensions.*
import com.healthcarelocator.fragments.HCLHomeFragment
import com.healthcarelocator.fragments.HCLHomeFullFragment
import com.healthcarelocator.fragments.search.SearchFragment
import com.healthcarelocator.state.HealthCareLocatorSDK
import com.healthcarelocator.utils.HCLReceiver
import com.healthcarelocator.viewmodel.home.HCLHomeMainViewModel
import kotlinx.android.synthetic.main.fragment_one_key_home_main.*

class HCLHomeMainFragment :
        AppFragment<HCLHomeMainFragment, HCLHomeMainViewModel>(R.layout.fragment_one_key_home_main), View.OnClickListener {
    companion object {
        fun newInstance(): HCLHomeMainFragment = HCLHomeMainFragment()
    }

    private val config = HealthCareLocatorSDK.getInstance().getConfiguration()

    override val viewModel = HCLHomeMainViewModel()

    override fun initView(view: View, savedInstanceState: Bundle?) {
        activity?.registerReceiver(gpsReceiver, IntentFilter(HCLReceiver.gpsReceiver))
        viewModel.apply {
            requestPermissions(this@HCLHomeMainFragment)
            permissionGranted.observe(this@HCLHomeMainFragment, Observer { granted ->
                if (childFragmentManager.fragments.size > 1) return@Observer
                if (granted) {
                    activity?.also {
                        it.startActivity(Intent(it, HCLLocationActivity::class.java))
                        it.overridePendingTransition(R.anim.fade_in, R.anim.fade_out)
                    }
                } else {
                    (activity as? AppCompatActivity)?.apply {
                        pushFragment(HCLHomeFragment.newInstance())
                    }
                }
            })
        }
        config.also {
            edtSearch.setBackgroundWithCorner(Color.WHITE, it.colorCardBorder.getColor(), 12f, 3)
            ivSearch.setRippleBackground(it.colorPrimary.getColor(), 15f)
            ivSearch.setIconFromDrawableId(it.searchIcon, true, Color.WHITE)
            edtSearch.textSize = it.fontSearchInput.size.toFloat()
        }

        newSearchWrapper.setOnClickListener(this)
    }

    override fun onDestroyView() {
        super.onDestroyView()
        gpsReceiver.unregisterReceiver(activity)
    }

    private val gpsReceiver by lazy {
        object : BroadcastReceiver() {
            override fun onReceive(context: Context?, intent: Intent?) {
                val bundle = intent?.extras
                if (bundle.isNullable()) {
                    pushFragment(HCLHomeFragment.newInstance())
                    return
                }
                context?.let { HealthCareLocatorSDK.getInstance().reverseGeoCoding(it) }
                if (bundle!!.getBoolean("granted", false)) {
                    viewModel.checkHomeFullPage(context!!) { screen ->
                        pushFragment(if (screen == 1) HCLHomeFullFragment.newInstance()
                        else HCLHomeFragment.newInstance())
                    }
                } else pushFragment(HCLHomeFragment.newInstance())
            }
        }
    }

    private fun pushFragment(fragment: IFragment) {
        addChildFragment(R.id.homeContainer, fragment)
//        (activity as? AppCompatActivity)?.apply {
//            pushFragment(R.id.fragmentContainer, fragment, true)
//        }
    }

    override fun onClick(v: View?) {
        when (v?.id) {
            R.id.newSearchWrapper -> startNewSearch()
        }
    }

    private fun startNewSearch() {
        config.also {
            (activity as? AppCompatActivity)?.addFragment(R.id.fragmentContainer,
                    SearchFragment.newInstance(it), true)
        }
    }
}