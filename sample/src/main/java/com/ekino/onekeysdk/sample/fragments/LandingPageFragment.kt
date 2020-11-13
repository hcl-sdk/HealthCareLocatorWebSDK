package com.ekino.onekeysdk.sample.fragments

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import base.fragments.IFragment
import com.bumptech.glide.Glide
import com.ekino.onekeysdk.R
import kotlinx.android.synthetic.main.fragment_landing_page.*

class LandingPageFragment : IFragment() {
    companion object {
        fun newInstance() = LandingPageFragment()
    }

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        return inflater.inflate(R.layout.fragment_landing_page, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        Glide.with(this).load(R.drawable.logo_iqvia).into(ivLogo)
    }
}