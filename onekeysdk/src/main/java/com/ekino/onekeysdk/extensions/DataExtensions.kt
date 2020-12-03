package com.ekino.onekeysdk.extensions

import android.view.View
import androidx.fragment.app.Fragment
import com.ekino.onekeysdk.R
import com.ekino.onekeysdk.model.home.OneKeyHomeObject

fun Int.isValidPosition(size: Int) = this in 0..size.minus(1)

/**
 * Boolean
 **/
fun Boolean.getVisibility() = if (this) View.VISIBLE else View.GONE

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
fun <T:Fragment>ArrayList<T>.getFragmentBy(filter:()->Boolean):T?{
    return this.firstOrNull { filter() }
}
fun <T:Fragment>List<T>.getFragmentBy(filter:(fragment:Fragment)->Boolean):T?{
    return this.firstOrNull { filter(it) }
}