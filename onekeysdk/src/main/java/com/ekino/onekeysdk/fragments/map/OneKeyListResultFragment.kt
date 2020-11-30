package com.ekino.onekeysdk.fragments.map

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import base.extensions.addFragment
import base.fragments.IFragment
import com.ekino.onekeysdk.R
import com.ekino.onekeysdk.adapter.search.SearchAdapter
import com.ekino.onekeysdk.extensions.ThemeExtension
import com.ekino.onekeysdk.fragments.profile.OneKeyProfileFragment
import com.ekino.onekeysdk.model.OneKeyLocation
import com.ekino.onekeysdk.model.config.OneKeyViewCustomObject
import kotlinx.android.synthetic.main.fragment_one_key_list_result.*

class OneKeyListResultFragment : IFragment() {
    companion object {
        fun newInstance(oneKeyViewCustomObject: OneKeyViewCustomObject,
                        locations: ArrayList<OneKeyLocation>) = OneKeyListResultFragment().apply {
            this.oneKeyViewCustomObject = oneKeyViewCustomObject
            this.locations = locations
        }
    }

    private var oneKeyViewCustomObject: OneKeyViewCustomObject = ThemeExtension.getInstance().getThemeConfiguration()
    private var locations: ArrayList<OneKeyLocation> = arrayListOf()
    private val searchAdapter by lazy { SearchAdapter() }

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        return inflater.inflate(R.layout.fragment_one_key_list_result, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        rvResult.apply {
            layoutManager = LinearLayoutManager(context)
            adapter = searchAdapter
            searchAdapter.setData(locations)
        }
        searchAdapter.onHCPCardClickedListener = { oneKeyLocation ->
           (parentFragment as? FullMapFragment)?.navigateToHCPProfile(oneKeyLocation)
        }
    }
}