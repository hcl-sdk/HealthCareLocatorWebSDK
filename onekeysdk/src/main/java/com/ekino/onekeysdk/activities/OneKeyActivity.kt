package com.ekino.onekeysdk.activities

import android.content.Context
import android.content.Intent
import android.os.Bundle
import base.activity.AppActivity
import base.fragments.IFragment
import com.ekino.onekeysdk.R
import com.ekino.onekeysdk.databinding.ActivityOneKeySdkBinding
import com.ekino.onekeysdk.fragments.OneKeyHomeFragment
import org.osmdroid.config.Configuration
import java.util.*

class OneKeyActivity : AppActivity<ActivityOneKeySdkBinding>(R.layout.activity_one_key_sdk) {

    override fun initView(savedInstanceState: Bundle?) {
        Configuration.getInstance().load(this, this.getSharedPreferences("Spacetime", Context.MODE_PRIVATE))

       startActivity(Intent(this, OneKeyActivity::class.java))
    }

    override val stackFragment: ArrayList<IFragment> by lazy { arrayListOf<IFragment>(OneKeyHomeFragment.newInstance()) }
    override val activeStack: Int = 0
}
