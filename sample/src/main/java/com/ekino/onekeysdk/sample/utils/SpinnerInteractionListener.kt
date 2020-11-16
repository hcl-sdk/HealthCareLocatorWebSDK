package com.ekino.onekeysdk.sample.utils

import android.util.Log
import android.view.MotionEvent
import android.view.View
import android.widget.AdapterView

class SpinnerInteractionListener(private val listener: OnSpinnerItemSelectedListener) :
    AdapterView.OnItemSelectedListener, View.OnTouchListener {
    private var userInteraction = false

    override fun onTouch(v: View?, event: MotionEvent?): Boolean {
        userInteraction = true
        return false
    }

    override fun onNothingSelected(parent: AdapterView<*>?) {
        Log.d("onNothingSelected", "onNothingSelected")
    }

    override fun onItemSelected(parent: AdapterView<*>?, view: View?, position: Int, id: Long) {
        if (userInteraction) {
            listener.onSpinnerItemSelectedListener(parent, view, position, id)
        }
    }

    interface OnSpinnerItemSelectedListener {
        fun onSpinnerItemSelectedListener(
            parent: AdapterView<*>?,
            view: View?,
            position: Int,
            id: Long
        )
    }
}