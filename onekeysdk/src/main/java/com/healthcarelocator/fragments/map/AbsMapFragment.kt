package com.healthcarelocator.fragments.map

import base.fragments.AppFragment
import base.viewmodel.IViewModel
import com.healthcarelocator.model.activity.ActivityObject
import com.healthcarelocator.model.map.OneKeyPlace

abstract class AbsMapFragment<T, VM : IViewModel<T>>(layoutId: Int) : AppFragment<T, VM>(layoutId) {
    abstract fun getActivities(): ArrayList<ActivityObject>
    abstract fun getRelaunchState(): Boolean
    abstract fun setRelaunchState(isRelaunch: Boolean)
    abstract fun forceSearch(place: OneKeyPlace, distance:Double)
    abstract fun reverseGeoCoding(place: OneKeyPlace, distance:Double)
    abstract fun isNearMe(): Boolean
    abstract fun setNearMeState(state: Boolean)
    abstract fun getPlaceDetail(): OneKeyPlace?
}