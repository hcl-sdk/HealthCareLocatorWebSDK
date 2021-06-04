package com.healthcarelocator.extensions

import android.content.Context
import android.content.SharedPreferences
import android.content.pm.PackageManager
import android.content.res.TypedArray
import android.text.format.DateUtils
import android.view.View
import androidx.core.content.edit
import androidx.fragment.app.Fragment
import com.healthcarelocator.R
import com.healthcarelocator.error.HCLException
import com.healthcarelocator.model.SearchObject
import com.healthcarelocator.model.activity.ActivityObject
import com.healthcarelocator.model.home.HCLHomeObject
import com.healthcarelocator.utils.HCLLog
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import java.util.*
import kotlin.collections.ArrayList

fun Int.isValidPosition(size: Int) = this in 0..size.minus(1)

/**
 * String
 */
fun Context?.getMetaDataFromManifest(name: String): String {
    return try {
        this?.run {
            val applicationInfo = packageManager.getApplicationInfo(packageName, PackageManager.GET_META_DATA)
            applicationInfo.metaData.getString(name)
        } ?: ""
    } catch (e: Exception) {
        HCLLog.e(HCLException(ErrorReference.DATA_INVALID, "Can not get Google map API Key.").toString())
        ""
    }
}

/**
 * Boolean
 **/
fun Boolean.getVisibility() = if (this) View.VISIBLE else View.GONE
fun <T> T?.isNullable(): Boolean = this == null
fun <T> T?.isNotNullable(): Boolean = !this.isNullable()
fun String?.isNotNullAndEmpty(): Boolean = !this.isNullable() && this!!.isNotEmpty()

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
fun getHomeDummy(context: Context, icon1: Int = R.drawable.baseline_search_white_24dp, icon2: Int = R.drawable.icon_profile,
                 icon3: Int = R.drawable.baseline_share_black_36dp): ArrayList<HCLHomeObject> = arrayListOf<HCLHomeObject>().apply {
    add(HCLHomeObject("0", context.getString(R.string.hcl_home_feat_find_hcp_title),
            context.getString(R.string.hcl_home_feat_find_hcp_text), icon1))
    add(HCLHomeObject("1", context.getString(R.string.hcl_home_feat_consult_profile_title),
            context.getString(R.string.hcl_home_feat_consult_profile_text), icon2))
    add(HCLHomeObject("0", context.getString(R.string.hcl_home_feat_request_info_update_title),
            context.getString(R.string.hcl_home_feat_request_info_update_text), icon3))
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
fun SharedPreferences.storeConsultedProfiles(gson: Gson = Gson(), hcp: ActivityObject) {
    val profiles = this.getConsultedProfiles(gson)
    profiles.removeIf { it.id == hcp.id }
    profiles.add(hcp)
    profiles.sortWith(Comparator { o1: ActivityObject, o2: ActivityObject ->
        o2.createdAt.compareTo(o1.createdAt)
    })
    val current = System.currentTimeMillis()
    profiles.map {
        it.createdDate = DateUtils.getRelativeTimeSpanString(it.createdAt, current, DateUtils.MINUTE_IN_MILLIS).toString()
    }
    edit { putString("ConsultedProfiles", gson.toJson(profiles)) }
}

fun SharedPreferences.removeConsultedProfile(gson: Gson = Gson(), hcp: ActivityObject) {
    val profiles = this.getConsultedProfiles(gson)
    profiles.removeIf { it.id == hcp.id }
    edit { putString("ConsultedProfiles", gson.toJson(profiles)) }
}

fun SharedPreferences.getConsultedProfiles(gson: Gson = Gson()): ArrayList<ActivityObject> {
    return gson.fromJson(this.getString("ConsultedProfiles", "[]") ?: "[]",
            object : TypeToken<ArrayList<ActivityObject>>() {}.type)
}

fun SharedPreferences.storeLastSearch(gson: Gson = Gson(), obj: SearchObject) {
    val searches = this.getLastSearches(gson)
    searches.removeIf { it.createdAt == obj.createdAt }
    searches.add(obj)
    searches.sortWith(Comparator { o1: SearchObject, o2: SearchObject ->
        o2.createdAt.compareTo(o1.createdAt)
    })
    val current = System.currentTimeMillis()
    searches.map {
        it.createdDate = DateUtils.getRelativeTimeSpanString(it.createdAt, current, DateUtils.MINUTE_IN_MILLIS).toString()
    }
    edit { putString("LastSearches", gson.toJson(searches)) }
}

fun SharedPreferences.removeConsultedProfile(gson: Gson = Gson(), obj: SearchObject) {
    val searches = this.getLastSearches(gson)
    searches.removeIf { it.createdAt == obj.createdAt }
    edit { putString("LastSearches", gson.toJson(searches)) }
}

fun SharedPreferences.getLastSearches(gson: Gson = Gson()): ArrayList<SearchObject> {
    return gson.fromJson(this.getString("LastSearches", "[]") ?: "[]",
            object : TypeToken<ArrayList<SearchObject>>() {}.type)
}

fun SharedPreferences.getVoteById(gson: Gson = Gson(), id: String): Int {
    return getVotes(gson)[id] ?: -1
}

fun SharedPreferences.getVotes(gson: Gson = Gson()): HashMap<String, Int> {
    return gson.fromJson(getString("ActivityVotes", "{}") ?: "{}",
            object : TypeToken<HashMap<String, Int>>() {}.type)
}

fun SharedPreferences.storeVote(gson: Gson = Gson(), id: String, vote: Int) {
    val votes = getVotes(gson)
    votes[id] = vote
    edit { putString("ActivityVotes", gson.toJson(votes)) }
}

/**
 * [Collections]
 */
fun <T> List<T>.toArrayList() = ArrayList(this)
fun Array<Double>.getLocation(): String = "${this[0]},${this[1]}"
fun <T> ArrayList<T>.getIndexes(condition: (t: T) -> Boolean): ArrayList<Int> {
    val indexes = arrayListOf<Int>()
    forEachIndexed { index, t ->
        if (condition(t)) {
            indexes.add(index)
        }
    }
    return indexes
}