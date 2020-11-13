package com.ekino.onekeysdk.viewmodel.home

import androidx.databinding.Bindable
import androidx.databinding.ObservableField
import base.viewmodel.AppViewModel
import com.ekino.onekeysdk.fragments.OneKeyHomeFragment

class HomeViewModel : AppViewModel<OneKeyHomeFragment>() {
    @Bindable
    val title = ObservableField("Find and Locate\\nHealthcare Professional")

    fun onSearchClicked() {

    }

    fun onStartNewSearchClicked() {

    }
}