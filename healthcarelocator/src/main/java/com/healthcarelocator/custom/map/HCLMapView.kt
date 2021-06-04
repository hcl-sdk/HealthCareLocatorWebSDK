package com.healthcarelocator.custom.map

import android.content.Context
import android.view.MotionEvent
import org.osmdroid.views.MapView


class HCLMapView(context: Context) : MapView(context) {
    override fun dispatchTouchEvent(event: MotionEvent?): Boolean {
        when (event?.action) {
            MotionEvent.ACTION_DOWN -> {
                parent?.requestDisallowInterceptTouchEvent(true)
            }
            MotionEvent.ACTION_UP -> {
                parent?.requestDisallowInterceptTouchEvent(false)
            }
        }
        return super.dispatchTouchEvent(event)
    }
}