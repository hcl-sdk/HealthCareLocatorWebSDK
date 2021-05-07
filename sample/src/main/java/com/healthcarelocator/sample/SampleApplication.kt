package com.healthcarelocator.sample

import android.app.Application
import android.content.Context
import android.content.SharedPreferences

class SampleApplication : Application() {
    companion object {
        lateinit var sharedPreferences: SharedPreferences
    }

    override fun onCreate() {
        super.onCreate()
        sharedPreferences = this.getSharedPreferences("SampleOneKeySDK", Context.MODE_PRIVATE)
    }
}