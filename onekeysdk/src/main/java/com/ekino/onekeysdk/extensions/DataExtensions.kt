package com.ekino.onekeysdk.extensions

import android.content.SharedPreferences
import android.content.res.TypedArray
import android.text.format.DateUtils
import android.view.View
import androidx.core.content.edit
import androidx.fragment.app.Fragment
import com.ekino.onekeysdk.R
import com.ekino.onekeysdk.model.OneKeyLocation
import com.ekino.onekeysdk.model.home.OneKeyHomeObject
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import java.util.*
import kotlin.collections.ArrayList

fun Int.isValidPosition(size: Int) = this in 0..size.minus(1)

/**
 * Boolean
 **/
fun Boolean.getVisibility() = if (this) View.VISIBLE else View.GONE

/**
 * [TypedArray]
 */
inline fun <reified T : Enum<T>> TypedArray.getEnum(index: Int, default: T) =
        getInt(index, -1).let {
            if (it >= 0) enumValues<T>()[it] else default
        }

/**
 * @link [com.ekino.onekeysdk.model.home.OneKeyHomeObject]
 */
fun getHomeDummy(): ArrayList<OneKeyHomeObject> = arrayListOf<OneKeyHomeObject>().apply {
    add(OneKeyHomeObject("0", "Find and Locate other HCP", "Lorem ipsum dolor sit amet, consect adipiscing elit", R.drawable.baseline_search_white_24dp))
    add(OneKeyHomeObject("1", "Consult Profile", "Lorem ipsum dolor sit amet, consect adipiscing elit", R.drawable.ic_profile))
    add(OneKeyHomeObject("0", "Request my Information update", "Lorem ipsum dolor sit amet, consect adipiscing elit", R.drawable.baseline_edit_white_36dp))
}

/**
 * Fragment
 */
fun <T : Fragment> ArrayList<T>.getFragmentBy(filter: () -> Boolean): T? {
    return this.firstOrNull { filter() }
}

fun <T : Fragment> List<T>.getFragmentBy(filter: (fragment: Fragment) -> Boolean): T? {
    return this.firstOrNull { filter(it) }
}

/**
 * [SharedPreferences]
 */
fun SharedPreferences.storeConsultedProfiles(gson: Gson = Gson(), hcp: OneKeyLocation) {
    val profiles = this.getConsultedProfiles(gson)
    profiles.removeIf { it.id == hcp.id }
    profiles.add(hcp)
    profiles.sortWith(Comparator { o1: OneKeyLocation, o2: OneKeyLocation ->
        o2.createdAt.compareTo(o1.createdAt)
    })
    val current = System.currentTimeMillis()
    profiles.map {
        it.createdDate = DateUtils.getRelativeTimeSpanString(it.createdAt, current, DateUtils.MINUTE_IN_MILLIS).toString()
    }
    edit { putString("ConsultedProfiles", gson.toJson(profiles)) }
}

fun SharedPreferences.getConsultedProfiles(gson: Gson = Gson()): ArrayList<OneKeyLocation> {
    return gson.fromJson(this.getString("ConsultedProfiles", "[]") ?: "[]",
            object : TypeToken<ArrayList<OneKeyLocation>>() {}.type)
}

/**
 * [Collections]
 */
fun <T> List<T>.toArrayList() = ArrayList(this)