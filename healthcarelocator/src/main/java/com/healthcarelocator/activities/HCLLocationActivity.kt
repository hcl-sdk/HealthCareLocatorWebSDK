package com.healthcarelocator.activities

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.healthcarelocator.R
import com.healthcarelocator.extensions.requestGPS
import com.healthcarelocator.utils.HCLReceiver

class HCLLocationActivity : AppCompatActivity() {
    private val gpsRequestCode = 11001
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_one_key_location)
        requestGPS(gpsRequestCode, {
            commitGPSGranted()
            finish()
        }, {})
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (resultCode == Activity.RESULT_OK && requestCode == gpsRequestCode) {
            commitGPSGranted()
            finish()
        } else {
            commitGPSGranted(false)
            finish()
        }
    }

    private fun commitGPSGranted(granted: Boolean = true) {
        sendBroadcast(Intent(HCLReceiver.gpsReceiver).apply {
            val bundle = Bundle()
            bundle.putBoolean("granted", granted)
            putExtras(bundle)
        })
    }
}