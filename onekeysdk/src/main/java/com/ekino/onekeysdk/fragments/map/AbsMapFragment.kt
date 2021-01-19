package com.ekino.onekeysdk.fragments.map

import base.fragments.AppFragment
import base.viewmodel.IViewModel
import com.ekino.onekeysdk.model.activity.ActivityObject
import com.ekino.onekeysdk.model.map.OneKeyPlace

abstract class AbsMapFragment<T, VM : IViewModel<T>>(private val layoutId: Int) : AppFragment<T, VM>(layoutId) {
    abstract fun getActivities(): ArrayList<ActivityObject>
    abstract fun getRelaunchState(): Boolean
    abstract fun setRelaunchState(isRelaunch: Boolean)
    abstract fun forceSearch(place: OneKeyPlace)
    abstract fun reverseGeoCoding(place: OneKeyPlace)
}