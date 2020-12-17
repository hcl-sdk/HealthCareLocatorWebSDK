package com.ekino.onekeysdk.fragments.map

import android.content.Context
import android.os.Bundle
import android.text.SpannableStringBuilder
import android.text.style.ForegroundColorSpan
import android.view.View
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.Observer
import base.extensions.addFragment
import base.fragments.AppFragment
import base.fragments.FragmentState
import base.fragments.IFragment
import base.fragments.IFragmentState
import com.ekino.onekeysdk.R
import com.ekino.onekeysdk.extensions.*
import com.ekino.onekeysdk.fragments.profile.OneKeyProfileFragment
import com.ekino.onekeysdk.model.OneKeySpecialityObject
import com.ekino.onekeysdk.model.activity.ActivityObject
import com.ekino.onekeysdk.model.config.OneKeyViewCustomObject
import com.ekino.onekeysdk.model.map.OneKeyPlace
import com.ekino.onekeysdk.utils.OneKeyConstant
import com.ekino.onekeysdk.utils.OneKeyLog
import com.ekino.onekeysdk.viewmodel.map.FullMapViewModel
import kotlinx.android.synthetic.main.fragment_full_map.*

class FullMapFragment : AppFragment<FullMapFragment, FullMapViewModel>(R.layout.fragment_full_map),
        View.OnClickListener {
    companion object {
        fun newInstance(oneKeyViewCustomObject: OneKeyViewCustomObject, c: String, s: OneKeySpecialityObject?,
                        p: OneKeyPlace?) =
                FullMapFragment().apply {
                    this.oneKeyViewCustomObject = oneKeyViewCustomObject
                    speciality = s
                    criteria = c
                    place = p
                    if (p?.placeId == "near_me") activeScreen = 1
                }

        private var criteria: String = ""
        private var speciality: OneKeySpecialityObject? = null
        private var place: OneKeyPlace? = null
        private var navigateToProfile = false
        private var activeScreen = 0

        fun clear() {
            criteria = ""
            speciality = null
            place = null
            navigateToProfile = false
            activeScreen = 0
        }
    }

    private var oneKeyViewCustomObject: OneKeyViewCustomObject = ThemeExtension.getInstance().getThemeConfiguration()
    private val fragmentState: IFragmentState by lazy { FragmentState(childFragmentManager, R.id.resultContainer) }
    private var resultFragments: ArrayList<IFragment> = arrayListOf()
    private var activities = arrayListOf<ActivityObject>()
    override val viewModel: FullMapViewModel = FullMapViewModel()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
    }

    override fun initView(view: View, savedInstanceState: Bundle?) {
        if (savedInstanceState != null) {
            speciality = savedInstanceState.getParcelable(OneKeyConstant.speciality)
            criteria = savedInstanceState.getString(criteria, "")
            place = savedInstanceState.getParcelable(OneKeyConstant.place)
            navigateToProfile = savedInstanceState.getBoolean(OneKeyConstant.navigateToProfile)
            activities = savedInstanceState.getParcelableArrayList("activities") ?: arrayListOf()
        }
        if (!navigateToProfile)
            childFragmentManager.fragments.filter {
                it::class.java.name == OneKeyMapResultFragment::class.java.name
                        || it::class.java.name == OneKeyListResultFragment::class.java.name
            }.map { childFragmentManager.beginTransaction().remove(it).commit() }
        else navigateToProfile = false

        btnBack.setOnClickListener(this)
        viewModel.apply {
            requestPermissions(this@FullMapFragment)
            permissionRequested.observe(this@FullMapFragment, Observer { granted ->
                if (!granted) {
                    showLoading(false)
                    return@Observer
                }
                if (this@FullMapFragment.activities.isEmpty())
                    getActivities(criteria, speciality, place)
                else {
                    setModeButtons(activeScreen)
                    initHeader()
                    showLoading(false)
                    initTabs()
                }
                loading.observe(this@FullMapFragment, Observer {
                    showLoading(it)
                })
                activities.observe(this@FullMapFragment, Observer {
                    this@FullMapFragment.activities = it
                    setModeButtons(activeScreen)
                    initHeader()
                    initTabs()
                })
            })
        }
        listViewMode.setOnClickListener(this)
        mapViewMode.setOnClickListener(this)
    }

    private fun initTabs() {
        resultFragments = arrayListOf(OneKeyListResultFragment.newInstance(oneKeyViewCustomObject, this@FullMapFragment.activities),
                OneKeyMapResultFragment.newInstance(oneKeyViewCustomObject, this@FullMapFragment.activities))
        fragmentState.apply {
            enableAnim(false)
            setStacksRootFragment(resultFragments)
            if (resultFragments.isNotEmpty() && activeScreen < resultFragments.size)
                showStack(activeScreen)
        }
    }

    override val onPassingEventListener: (data: Any) -> Unit = {
        super.onPassingEventListener
    }

    override fun onSaveInstanceState(outState: Bundle) {
        super.onSaveInstanceState(outState)
        if (!isVisible) return
        outState.putParcelable(OneKeyConstant.place, place)
        outState.putParcelable(OneKeyConstant.speciality, speciality)
        outState.putString("criteria", criteria)
        outState.putBoolean(OneKeyConstant.navigateToProfile, navigateToProfile)
        outState.putParcelableArrayList("activities", activities)
    }

    override fun onClick(v: View?) {
        when (v?.id) {
            R.id.btnBack -> activity?.onBackPressed()
            R.id.listViewMode -> {
                setModeButtons(0)
                activeScreen = 0
                fragmentState.showStack(0)
            }
            R.id.mapViewMode -> {
                setModeButtons(1)
                activeScreen = 1
                fragmentState.showStack(1)
            }
            R.id.ivSort -> {
                navigateToProfile = true
                (activity as? AppCompatActivity)?.addFragment(R.id.fragmentContainer,
                        OneKeySortFragment.newInstance(oneKeyViewCustomObject), true)
            }
        }
    }

    private fun initHeader() {
        tvSpeciality.text = speciality?.longLbl ?: criteria
        tvAddress.text = place?.displayName ?: ""
        val result = "${activities.size}"
        tvResult.text = SpannableStringBuilder(result).apply {
            setSpan(ForegroundColorSpan(oneKeyViewCustomObject.colorPrimary.getColor()),
                    0, result.length, SpannableStringBuilder.SPAN_EXCLUSIVE_EXCLUSIVE)
        }
        mapViewMode.setRippleBackground(oneKeyViewCustomObject.colorPrimary.getColor(), 50f)
        ivSort.setRippleCircleBackground(oneKeyViewCustomObject.colorSecondary.getColor(), 255)
        tvAddress.textSize = oneKeyViewCustomObject.fontSmall.size.toFloat()
        ivSort.setOnClickListener(this)
    }

    private fun setModeButtons(active: Int) {
        if (active == 0) {
            listViewMode.postDelay({
                val color = context!!.getColor(R.color.white)
                it.setRippleCircleBackground(oneKeyViewCustomObject.colorPrimary.getColor(), 255)
                it.setTextColor(color)
                it.compoundDrawables.firstOrNull()?.setTint(color)
            })
            mapViewMode.postDelay({
                val color = context!!.getColor(R.color.colorOneKeyText)
                it.background = null
                it.setTextColor(color)
                it.compoundDrawables.firstOrNull()?.setTint(color)
            })
        } else {
            mapViewMode.postDelay({
                val color = context!!.getColor(R.color.white)
                it.setRippleCircleBackground(oneKeyViewCustomObject.colorPrimary.getColor(), 255)
                it.setTextColor(color)
                it.compoundDrawables.firstOrNull()?.setTint(color)
            })
            listViewMode.postDelay({
                val color = context!!.getColor(R.color.colorOneKeyText)
                it.background = null
                it.setTextColor(color)
                it.compoundDrawables.firstOrNull()?.setTint(color)
            })
        }
    }

    fun navigateToHCPProfile(obj: ActivityObject) {
        context?.getSharedPreferences("OneKeySDK", Context.MODE_PRIVATE)?.apply {
            viewModel.storeConsultedProfile(this, obj)
        }
        navigateToProfile = true
        oneKeyViewCustomObject.also {
            (activity as? AppCompatActivity)?.addFragment(R.id.fragmentContainer,
                    OneKeyProfileFragment.newInstance(it, null, obj.id), true)
        }
    }

    override fun onAttach(context: Context) {
        super.onAttach(context)
        OneKeyLog.d("LifeCycle: onAttach")
    }

    override fun onDetach() {
        super.onDetach()
        OneKeyLog.d("LifeCycle: onDetach")
    }

    private fun showLoading(state: Boolean) {
        loadingWrapper.visibility = state.getVisibility()
    }
}