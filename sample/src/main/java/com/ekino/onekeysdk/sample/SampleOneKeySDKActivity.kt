package com.ekino.onekeysdk.sample

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.GravityCompat
import base.extensions.addFragment
import com.ekino.onekeysdk.R
import com.ekino.onekeysdk.fragments.OneKeyHomeFragment
import com.ekino.onekeysdk.model.config.OneKeyViewCustomObject
import com.ekino.onekeysdk.sample.fragments.DrawerMenuFragment
import com.ekino.onekeysdk.sample.fragments.LandingPageFragment
import kotlinx.android.synthetic.main.activity_sample.*

class SampleOneKeySDKActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_sample)
        this.addFragment(R.id.drawerMenuContainer, DrawerMenuFragment.newInstance())
        this.addFragment(R.id.fragmentContainer, LandingPageFragment.newInstance(), true)
        btnMenu.setOnClickListener {
            if (drawer.isDrawerOpen(GravityCompat.START))
                drawer.closeDrawer(GravityCompat.START)
            else drawer.openDrawer(GravityCompat.START)
        }
    }

    override fun onBackPressed() {
        if (this.supportFragmentManager.backStackEntryCount == 1)
            finish()
        else
            super.onBackPressed()
    }

    fun closeDrawer() {
        if (drawer.isDrawerOpen(GravityCompat.START))
            drawer.closeDrawer(GravityCompat.START)
    }

    fun launchOneKeySDK() {
        this.addFragment(R.id.fragmentContainer, OneKeyHomeFragment.newInstance(
                OneKeyViewCustomObject.Builder().build()), true)
    }
}