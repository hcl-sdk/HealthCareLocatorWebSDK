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
import com.healthcarelocator.activities.OneKeyLocationActivity
import com.healthcarelocator.extensions.*
import com.healthcarelocator.fragments.OneKeyHomeFragment
import com.healthcarelocator.fragments.OneKeyHomeFullFragment
import com.healthcarelocator.fragments.search.SearchFragment
import com.healthcarelocator.state.HealthCareLocatorSDK
import com.healthcarelocator.utils.OneKeyReceiver
import com.healthcarelocator.viewmodel.home.OneKeyHomeMainViewModel
import kotlinx.android.synthetic.main.fragment_one_key_home_main.*

class OneKeyHomeMainFragment :
        AppFragment<OneKeyHomeMainFragment, OneKeyHomeMainViewModel>(R.layout.fragment_one_key_home_main), View.OnClickListener {
    companion object {
        fun newInstance(): OneKeyHomeMainFragment = OneKeyHomeMainFragment()
    }

    private val config = HealthCareLocatorSDK.getInstance().getConfiguration()

    override val viewModel = OneKeyHomeMainViewModel()

    override fun initView(view: View, savedInstanceState: Bundle?) {
        activity?.registerReceiver(gpsReceiver, IntentFilter(OneKeyReceiver.gpsReceiver))
        viewModel.apply {
            requestPermissions(this@OneKeyHomeMainFragment)
            permissionGranted.observe(this@OneKeyHomeMainFragment, Observer { granted ->
                if (childFragmentManager.fragments.size > 1) return@Observer
                if (granted) {
                    activity?.also {
                        it.startActivity(Intent(it, OneKeyLocationActivity::class.java))
                        it.overridePendingTransition(R.anim.fade_in, R.anim.fade_out)
                    }
                } else {
                    (activity as? AppCompatActivity)?.apply {
                        pushFragment(OneKeyHomeFragment.newInstance())
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
                    pushFragment(OneKeyHomeFragment.newInstance())
                    return
                }
                context?.let { HealthCareLocatorSDK.getInstance().reverseGeoCoding(it) }
                if (bundle!!.getBoolean("granted", false)) {
                    viewModel.checkHomeFullPage(context!!) { screen ->
                        pushFragment(if (screen == 1) OneKeyHomeFullFragment.newInstance()
                        else OneKeyHomeFragment.newInstance())
                    }
                } else pushFragment(OneKeyHomeFragment.newInstance())
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