package com.healthcarelocator.activities

import android.content.Context
import android.os.Bundle
import base.activity.AppActivity
import base.extensions.changeLocale
import base.fragments.IFragment
import com.healthcarelocator.R
import com.healthcarelocator.databinding.ActivityOneKeySdkBinding
import com.healthcarelocator.error.OneKeyException
import com.healthcarelocator.extensions.ErrorReference
import com.healthcarelocator.extensions.ScreenReference
import com.healthcarelocator.fragments.OneKeyHomeFragment
import com.healthcarelocator.fragments.OneKeyHomeFullFragment
import com.healthcarelocator.fragments.map.OneKeyNearMeFragment
import com.healthcarelocator.model.map.OneKeyPlace
import com.healthcarelocator.state.HealthCareLocatorSDK
import org.osmdroid.config.Configuration
import java.util.*

class OneKeyActivity : AppActivity<ActivityOneKeySdkBinding>(R.layout.activity_one_key_sdk) {

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
                    throw OneKeyException(ErrorReference.DATA_INVALID,
                            "In SEARCH_NEAR_ME mode, the specialities must NOT be empty.")
                this.changeLocale(config.locale)
                OneKeyNearMeFragment.newInstance(config, "", null,
                        OneKeyPlace(placeId = "near_me", displayName = getString(R.string.hcl_near_me)),
                        config.specialities)
            }
            ScreenReference.HOME_FULL -> OneKeyHomeFragment.newInstance()
            else -> OneKeyHomeFullFragment.newInstance()
        }
        arrayListOf(fragment)
    }
    override val activeStack: Int = 0

    override fun onBackPressed() {
        super.onBackPressed()
    }
}
