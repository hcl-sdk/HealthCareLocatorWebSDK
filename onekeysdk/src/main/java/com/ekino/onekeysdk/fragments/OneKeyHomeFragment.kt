package com.ekino.onekeysdk.fragments

import android.content.res.Configuration
import android.graphics.Color
import android.os.Bundle
import android.view.View
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.GridLayoutManager
import base.extensions.addFragment
import base.fragments.AppFragment
import com.apollographql.apollo.ApolloCall
import com.apollographql.apollo.ApolloClient
import com.apollographql.apollo.api.Response
import com.apollographql.apollo.exception.ApolloException
import com.ekino.onekeysdk.R
import com.ekino.onekeysdk.adapter.home.OneKeyHomeAdapter
import com.ekino.onekeysdk.extensions.*
import com.ekino.onekeysdk.fragments.map.FullMapFragment
import com.ekino.onekeysdk.fragments.search.SearchFragment
import com.ekino.onekeysdk.model.config.OneKeyViewCustomObject
import com.ekino.onekeysdk.utils.OneKeyLog
import com.ekino.onekeysdk.viewmodel.home.HomeViewModel
import com.iqvia.onekey.GetProfileQuery
import kotlinx.android.synthetic.main.fragment_home.*

class OneKeyHomeFragment :
        AppFragment<OneKeyHomeFragment, HomeViewModel>(R.layout.fragment_home) {
    companion object {
        fun newInstance(
                oneKeyViewCustomObject: OneKeyViewCustomObject =
                        OneKeyViewCustomObject.Builder().build()
        ): OneKeyHomeFragment {
            ThemeExtension.getInstance().setThemeConfiguration(oneKeyViewCustomObject)
            return OneKeyHomeFragment().apply {
                this.oneKeyViewCustomObject = oneKeyViewCustomObject
            }
        }
    }

    private var oneKeyViewCustomObject: OneKeyViewCustomObject =
            ThemeExtension.getInstance().getThemeConfiguration()

    private val homeAdapter by lazy { OneKeyHomeAdapter(oneKeyViewCustomObject) }

    override val viewModel: HomeViewModel = HomeViewModel()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        if (oneKeyViewCustomObject.homeMode == 0) {
            (activity as? AppCompatActivity)?.apply {
                supportFragmentManager.popBackStack()
                addFragment(
                        R.id.fragmentContainer,
                        OneKeyHomeFullFragment.newInstance(oneKeyViewCustomObject),
                        true
                )
            }
        }
    }

    override fun initView(view: View, savedInstanceState: Bundle?) {
        newSearchWrapper.setOnClickListener { startNewSearch() }
        btnStartSearch.setOnClickListener { startNewSearch() }
        oneKeyViewCustomObject.also {
            edtSearch.setBackgroundWithCorner(Color.WHITE, it.colorCardBorder.getColor(), 12f, 3)
            contentWrapper.setBackgroundWithCorner(Color.WHITE, it.colorCardBorder.getColor(), 12f, 3)
            tvHomeHeader.setTextColor(it.colorSecondary.getColor())
            container.setBackgroundColor(it.colorViewBackground.getColor())
            ivSearch.setRippleBackground(it.colorPrimary.getColor(), 12f)
            btnStartSearch.setRippleBackground(it.colorPrimary)
            edtSearch.textSize = it.fontSearchInput.size.toFloat()
        }
        rvHome.postDelay({
            if (rvHome == null) return@postDelay
            rvHome.apply {
                val orientation = resources.configuration.orientation
                layoutManager = GridLayoutManager(
                        context,
                        if (orientation == Configuration.ORIENTATION_PORTRAIT) 1 else 3
                )
                val padding = paddingStart
                setPadding(
                        padding, paddingTop, if (orientation == Configuration.ORIENTATION_LANDSCAPE)
                    0 else padding, paddingBottom
                )
                adapter = homeAdapter
            }
        })
        homeAdapter.setData(getHomeDummy())

        val apolloClient = ApolloClient.builder()
                .serverUrl("https://dev-eastus-onekey-sdk-apim.azure-api.net/api/graphql/query").build()
        apolloClient.query(GetProfileQuery.builder().apiKey("1").id("1").build())
                .enqueue(object : ApolloCall.Callback<GetProfileQuery.Data>() {
                    override fun onFailure(e: ApolloException) {
                        OneKeyLog.e("${e.localizedMessage}")
                    }

                    override fun onResponse(response: Response<GetProfileQuery.Data>) {
                        OneKeyLog.d("${response.data?.individualByID()?.firstName()}")
                    }

                })
    }

    override fun onResume() {
        super.onResume()
        FullMapFragment.clear()
    }

    private fun startNewSearch() {
        oneKeyViewCustomObject?.also {
            (activity as? AppCompatActivity)?.addFragment(
                    R.id.fragmentContainer,
                    SearchFragment.newInstance(it), true
            )
        }
    }
}