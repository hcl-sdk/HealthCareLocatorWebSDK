package com.ekino.onekeysdk.activities

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.ekino.onekeysdk.R
import com.ekino.onekeysdk.extensions.requestGPS
import com.ekino.onekeysdk.utils.OneKeyReceiver

class OneKeyLocationActivity : AppCompatActivity() {
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
        sendBroadcast(Intent(OneKeyReceiver.gpsReceiver).apply {
            val bundle = Bundle()
            bundle.putBoolean("granted", granted)
            putExtras(bundle)
        })
    }
}