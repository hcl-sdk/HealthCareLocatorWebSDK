package com.healthcarelocator.activities

import android.content.Context
import android.os.Bundle
import base.activity.AppActivity
import base.extensions.changeLocale
import base.fragments.IFragment
import com.healthcarelocator.R
import com.healthcarelocator.databinding.ActivityOneKeySdkBinding
import com.healthcarelocator.error.HCLException
import com.healthcarelocator.extensions.ErrorReference
import com.healthcarelocator.extensions.ScreenReference
import com.healthcarelocator.fragments.HCLHomeFragment
import com.healthcarelocator.fragments.HCLHomeFullFragment
import com.healthcarelocator.fragments.map.HCLNearMeFragment
import com.healthcarelocator.model.map.HCLPlace
import com.healthcarelocator.state.HealthCareLocatorSDK
import org.osmdroid.config.Configuration
import java.util.*

class HCLActivity : AppActivity<ActivityOneKeySdkBinding>(R.layout.activity_one_key_sdk) {

    override fun initView(savedInstanceState: Bundle?) {
        try {
            Configuration.getInstance().load(this, this.getSharedPreferences("OneKeySDK", Context.MODE_PRIVATE))
        } catch (e: Exception) {
        }
    }

    override val stackFragment: ArrayList<IFragment> by lazy {
        val config = HealthCareLocatorSDK.getInstance().getConfiguration()
        val fragment: IFragment = when (config.screenReference) {
            ScreenReference.SEARCH_NEAR_ME -> {
                if (config.specialities.isEmpty())
                    throw HCLException(ErrorReference.DATA_INVALID,
                            "In SEARCH_NEAR_ME mode, the specialities must NOT be empty.")
                this.changeLocale(config.locale)
                HCLNearMeFragment.newInstance(config, "", null,
                        HCLPlace(placeId = "near_me", displayName = getString(R.string.hcl_near_me)),
                        config.specialities)
            }
            ScreenReference.HOME_FULL -> HCLHomeFragment.newInstance()
            else -> HCLHomeFullFragment.newInstance()
        }
        arrayListOf(fragment)
    }
    override val activeStack: Int = 0

    override fun onBackPressed() {
        super.onBackPressed()
    }
}
