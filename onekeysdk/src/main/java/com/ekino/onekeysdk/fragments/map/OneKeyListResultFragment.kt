package com.ekino.onekeysdk.fragments.map

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.LinearLayoutManager
import base.fragments.IFragment
import com.ekino.onekeysdk.R
import com.ekino.onekeysdk.adapter.search.SearchAdapter
import com.ekino.onekeysdk.state.OneKeySDK
import com.ekino.onekeysdk.extensions.getColor
import com.ekino.onekeysdk.model.activity.ActivityObject
import com.ekino.onekeysdk.model.config.OneKeyCustomObject
import kotlinx.android.synthetic.main.fragment_one_key_list_result.*

class OneKeyListResultFragment : IFragment() {
    companion object {
        fun newInstance(oneKeyCustomObject: OneKeyCustomObject,
                        activities: ArrayList<ActivityObject>) = OneKeyListResultFragment().apply {
            this.oneKeyCustomObject = oneKeyCustomObject
            this.activities = activities
        }
    }

    private var oneKeyCustomObject: OneKeyCustomObject = OneKeySDK.getInstance().getConfiguration()
    private var activities: ArrayList<ActivityObject> = arrayListOf()
    private val searchAdapter by lazy { SearchAdapter() }

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        return inflater.inflate(R.layout.fragment_one_key_list_result, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        listContainer.setBackgroundColor(oneKeyCustomObject.colorListBackground.getColor())
        rvResult.apply {
            layoutManager = LinearLayoutManager(context)
            adapter = searchAdapter
            searchAdapter.setData(activities)
        }
        searchAdapter.onHCPCardClickedListener = { oneKeyLocation ->
            if (parentFragment is FullMapFragment) (parentFragment as FullMapFragment).navigateToHCPProfile(oneKeyLocation)
            else if (parentFragment is OneKeyNearMeFragment) (parentFragment as OneKeyNearMeFragment).navigateToHCPProfile(oneKeyLocation)
        }
    }

    fun updateActivities(activities: ArrayList<ActivityObject>) {
        this.activities = activities
        searchAdapter.setData(activities)
    }
}