package com.ekino.onekeysdk.fragments

import android.view.View
import androidx.appcompat.app.AppCompatActivity
import base.extensions.addFragment
import base.fragments.AppFragment
import com.ekino.onekeysdk.R
import com.ekino.onekeysdk.extensions.ThemeExtension
import com.ekino.onekeysdk.extensions.getColor
import com.ekino.onekeysdk.extensions.setRippleBackground
import com.ekino.onekeysdk.extensions.setRippleCircleBackground
import com.ekino.onekeysdk.fragments.search.SearchFragment
import com.ekino.onekeysdk.model.config.OneKeyViewCustomObject
import com.ekino.onekeysdk.viewmodel.home.HomeViewModel
import kotlinx.android.synthetic.main.fragment_home.*

class OneKeyHomeFragment(private val oneKeyViewCustomObject: OneKeyViewCustomObject) :
        AppFragment<OneKeyHomeFragment, HomeViewModel>(R.layout.fragment_home) {
    companion object {
        fun newInstance(oneKeyViewCustomObject: OneKeyViewCustomObject =
                                OneKeyViewCustomObject.Builder().build()): OneKeyHomeFragment {
            ThemeExtension.getInstance().setThemeConfiguration(oneKeyViewCustomObject)
            return OneKeyHomeFragment(oneKeyViewCustomObject)
        }
    }

    override val viewModel: HomeViewModel = HomeViewModel()

    override fun initView(view: View) {
        newSearchWrapper.setOnClickListener { startNewSearch() }
        btnStartSearch.setOnClickListener { startNewSearch() }
        tvHomeHeader.setTextColor(oneKeyViewCustomObject.primaryColor.getColor())
        ivSearch.setRippleBackground(oneKeyViewCustomObject.primaryColor)
        btnStartSearch.setRippleBackground(oneKeyViewCustomObject.primaryColor)
        ivFind.setRippleCircleBackground(oneKeyViewCustomObject.primaryColor)
        ivFind.setColorFilter(oneKeyViewCustomObject.primaryColor.getColor())
        ivProfile.setRippleCircleBackground(oneKeyViewCustomObject.primaryColor)
        ivProfile.setColorFilter(oneKeyViewCustomObject.primaryColor.getColor())
        ivEdit.setRippleCircleBackground(oneKeyViewCustomObject.primaryColor)
        ivEdit.setColorFilter(oneKeyViewCustomObject.primaryColor.getColor())
    }

    private fun startNewSearch() {
        (activity as? AppCompatActivity)?.addFragment(R.id.fragmentContainer,
                SearchFragment.newInstance(oneKeyViewCustomObject), true)
    }
}