package com.ekino.onekeysdk.fragments.map

import android.content.Context
import android.graphics.Color
import android.location.Location
import android.os.Bundle
import android.text.SpannableStringBuilder
import android.text.style.ForegroundColorSpan
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.forEach
import androidx.lifecycle.Observer
import base.extensions.pushFragment
import base.fragments.AppFragment
import base.fragments.FragmentState
import base.fragments.IFragment
import base.fragments.IFragmentState
import com.ekino.onekeysdk.R
import com.ekino.onekeysdk.custom.text.OneKeyTextView
import com.ekino.onekeysdk.extensions.*
import com.ekino.onekeysdk.fragments.profile.OneKeyProfileFragment
import com.ekino.onekeysdk.fragments.search.SearchFragment
import com.ekino.onekeysdk.model.OneKeySpecialityObject
import com.ekino.onekeysdk.model.activity.ActivityObject
import com.ekino.onekeysdk.model.config.OneKeyViewCustomObject
import com.ekino.onekeysdk.model.map.OneKeyPlace
import com.ekino.onekeysdk.utils.KeyboardUtils
import com.ekino.onekeysdk.utils.OneKeyConstant
import com.ekino.onekeysdk.utils.OneKeyLog
import com.ekino.onekeysdk.viewmodel.map.NearMeViewModel
import kotlinx.android.synthetic.main.fragment_full_map.*

class NearMeFragment : AppFragment<NearMeFragment, NearMeViewModel>(R.layout.fragment_full_map),
        View.OnClickListener {
    companion object {
        fun newInstance(oneKeyViewCustomObject: OneKeyViewCustomObject, c: String, s: OneKeySpecialityObject?,
                        p: OneKeyPlace?, listIds: ArrayList<String> = arrayListOf(), cLocation: Location? = null) =
                NearMeFragment().apply {
                    this.oneKeyViewCustomObject = oneKeyViewCustomObject
                    speciality = s
                    criteria = c
                    specialities = listIds
                    place = p
                    currentLocation = cLocation
                    if (p?.placeId == "near_me") activeScreen = 1
                }

        private var navigateToProfile = false
        private var currentLocation: Location? = null
        private var specialities = arrayListOf<String>()

        fun clear() {
            navigateToProfile = false
            currentLocation = null
        }
    }

    private var oneKeyViewCustomObject: OneKeyViewCustomObject = ThemeExtension.getInstance().getThemeConfiguration()
    private val fragmentState: IFragmentState by lazy { FragmentState(childFragmentManager, R.id.resultContainer) }
    private var resultFragments: ArrayList<IFragment> = arrayListOf()
    private var activities = arrayListOf<ActivityObject>()
    private var sorting: Int = 0
    private var place: OneKeyPlace? = null
    private var criteria: String = ""
    private var activeScreen = 0
    private var speciality: OneKeySpecialityObject? = null
    override val viewModel: NearMeViewModel = NearMeViewModel()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
    }

    override fun initView(view: View, savedInstanceState: Bundle?) {
        KeyboardUtils.setUpHideSoftKeyboard(activity, container)
        if (savedInstanceState != null) {
            speciality = savedInstanceState.getParcelable(OneKeyConstant.speciality)
            specialities = savedInstanceState.getStringArrayList("specialities") ?: arrayListOf()
            criteria = savedInstanceState.getString(criteria, "")
            place = savedInstanceState.getParcelable(OneKeyConstant.place)
            navigateToProfile = savedInstanceState.getBoolean(OneKeyConstant.navigateToProfile)
            activities = savedInstanceState.getParcelableArrayList("activities") ?: arrayListOf()
            sorting = savedInstanceState.getInt("sorting", 0)
            activeScreen = savedInstanceState.getInt("activeScreen", 0)
        }
        if (!navigateToProfile)
            childFragmentManager.fragments.filter {
                it::class.java.name == OneKeyMapResultFragment::class.java.name
                        || it::class.java.name == OneKeyListResultFragment::class.java.name
            }.map { childFragmentManager.beginTransaction().remove(it).commit() }
        else navigateToProfile = false

        labelWrapper.visibility = View.GONE
        newSearchWrapper.visibility = View.VISIBLE
        oneKeyViewCustomObject.apply {
            newSearchWrapper.setBackgroundWithCorner(Color.WHITE, colorCardBorder.getColor(), 12f, 3)
            ivSearch.setRippleBackground(colorPrimary.getColor(), 15f)
            sortWrapper.setBackgroundWithCorner(Color.WHITE, colorCardBorder.getColor(), 50f, 3)
        }

        initHeader()
        btnBack.setOnClickListener(this)

        viewModel.apply {
            requestPermissions(this@NearMeFragment)
            permissionRequested.observe(this@NearMeFragment, Observer { granted ->
                if (!granted) {
                    showLoading(false)
                    return@Observer
                }
                if (this@NearMeFragment.activities.isEmpty())
                    getActivities(criteria, if (speciality.isNotNullable())
                        arrayListOf(speciality!!.id) else specialities, place)
                else {
                    setModeButtons(activeScreen)
                    showLoading(false)
                    initTabs()
                    setResult()
                }
                loading.observe(this@NearMeFragment, Observer {
                    showLoading(it)
                })
                activities.observe(this@NearMeFragment, Observer {
                    this@NearMeFragment.activities = it
                    setModeButtons(activeScreen)
                    initTabs()
                    setResult()
                })
            })
        }
        listViewMode.setOnClickListener(this)
        mapViewMode.setOnClickListener(this)
        newSearchWrapper.setOnClickListener(this)
    }

    private fun initTabs() {
        viewModel.sortActivities(ArrayList(activities), sorting) {
            resultFragments = arrayListOf(OneKeyListResultFragment.newInstance(oneKeyViewCustomObject, it),
                    OneKeyMapResultFragment.newInstance(oneKeyViewCustomObject, it))
            fragmentState.apply {
                enableAnim(false)
                setStacksRootFragment(resultFragments)
                if (resultFragments.isNotEmpty() && activeScreen < resultFragments.size)
                    showStack(activeScreen)
            }
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
        outState.putStringArrayList("specialities", specialities)
        outState.putString("criteria", criteria)
        outState.putBoolean(OneKeyConstant.navigateToProfile, navigateToProfile)
        outState.putParcelableArrayList("activities", activities)
        outState.putInt("sorting", sorting)
        outState.putInt("activeScreen", activeScreen)
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
                (activity as? AppCompatActivity)?.pushFragment(R.id.fragmentContainer,
                        OneKeySortFragment.newInstance(oneKeyViewCustomObject, sorting), true)
            }
            R.id.newSearchWrapper -> {
                (activity as? AppCompatActivity)?.pushFragment(R.id.fragmentContainer,
                        SearchFragment.newInstance(oneKeyViewCustomObject,
                                true, currentLocation), true)
            }
        }
    }

    private fun initHeader() {
        tvSpeciality.text = speciality?.longLbl ?: criteria
        tvAddress.text = place?.displayName ?: ""
        mapViewMode.setRippleBackground(oneKeyViewCustomObject.colorPrimary.getColor(), 50f)
        sortWrapper.setBackgroundWithCorner(Color.WHITE, oneKeyViewCustomObject.colorCardBorder.getColor(), 50f, 3)
        modeWrapper.setBackgroundWithCorner(Color.WHITE, oneKeyViewCustomObject.colorCardBorder.getColor(), 50f, 3)
        ivSort.setRippleCircleBackground(oneKeyViewCustomObject.colorSecondary.getColor(), 255)
        resultContainer.setBackgroundColor(oneKeyViewCustomObject.colorListBackground.getColor())
        tvAddress.textSize = oneKeyViewCustomObject.fontSmall.size.toFloat()
        ivSort.setOnClickListener(this)
    }

    private fun setResult() {
        val result = "${activities.size}"
        tvResult.text = SpannableStringBuilder(result).apply {
            setSpan(ForegroundColorSpan(oneKeyViewCustomObject.colorPrimary.getColor()),
                    0, result.length, SpannableStringBuilder.SPAN_EXCLUSIVE_EXCLUSIVE)
        }
    }

    private fun setModeButtons(active: Int) {
        if (active == 0) {
            listViewMode.postDelay({
                val color = context!!.getColor(R.color.white)
                it.setRippleCircleBackground(oneKeyViewCustomObject.colorPrimary.getColor(), 255)
                setViewModeColor(listViewMode, color)
            })
            mapViewMode.postDelay({
                val color = context!!.getColor(R.color.colorOneKeyUnselected)
                it.background = null
                setViewModeColor(mapViewMode, color)
            })
        } else {
            mapViewMode.postDelay({
                val color = context!!.getColor(R.color.white)
                it.setRippleCircleBackground(oneKeyViewCustomObject.colorPrimary.getColor(), 255)
                setViewModeColor(mapViewMode, color)
            })
            listViewMode.postDelay({
                val color = context!!.getColor(R.color.colorOneKeyUnselected)
                it.background = null
                setViewModeColor(listViewMode, color)
            })
        }
    }

    fun navigateToHCPProfile(obj: ActivityObject) {
        navigateToProfile = true
        oneKeyViewCustomObject.also {
            (activity as? AppCompatActivity)?.pushFragment(R.id.fragmentContainer,
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

    private fun setViewModeColor(group: ViewGroup, color: Int) {
        group.forEach { view ->
            if (view is ImageView) {
                view.setColorFilter(color)
            } else if (view is OneKeyTextView) {
                view.setTextColor(color)
            }
        }
    }

    fun applySorting(sort: Int) {
        this.sorting = sort
        viewModel.sortActivities(ArrayList(activities), sorting) {
            (fragmentState.getRootFragments()?.firstOrNull { fragment ->
                fragment::class.java == OneKeyListResultFragment::class.java
            } as? OneKeyListResultFragment)?.updateActivities(it)
            (fragmentState.getRootFragments()?.firstOrNull { fragment ->
                fragment::class.java == OneKeyMapResultFragment::class.java
            } as? OneKeyMapResultFragment)?.updateActivities(it)
        }
    }
}