package com.healthcarelocator.utils

import android.R
import android.app.Activity
import android.app.Dialog
import android.content.Context
import android.graphics.Rect
import android.view.View
import android.view.ViewGroup
import android.view.inputmethod.InputMethodManager
import android.widget.EditText

object KeyboardUtils {
    fun setUpHideSoftKeyboard(activity: Activity?, view: View) {
        //Set up touch listener for non-text box views to hide keyboard.
        if (view !is EditText) {
            view.setOnTouchListener { v, event ->
                hideSoftKeyboard(activity)
                false
            }
        }

        if (view is ViewGroup) { //If a layout container, iterate over children and seed recursion.
            for (i in 0 until view.childCount) {
                val innerView = view.getChildAt(i)
                setUpHideSoftKeyboard(activity, innerView)
            }
        }
    }

    fun hideSoftKeyboard(activity: Activity?) {
        activity?.run {
            val im = getSystemService(Context.INPUT_METHOD_SERVICE) as InputMethodManager
            im.hideSoftInputFromWindow(window.decorView.windowToken, 0)
        }
    }

    fun hideSoftKeyboard(dialog: Dialog?) {
        dialog?.run {
            val im = context.getSystemService(Context.INPUT_METHOD_SERVICE) as InputMethodManager
            im.hideSoftInputFromWindow(window?.decorView?.windowToken, 0)
        }
    }

    fun showSoftKeyboard(activity: Activity?) {
        activity?.run {
            val inputMethodManager =
                getSystemService(Context.INPUT_METHOD_SERVICE) as InputMethodManager
            inputMethodManager.toggleSoftInputFromWindow(
                window.decorView.windowToken,
                InputMethodManager.SHOW_FORCED, 0
            )
        }
    }

    fun setError(editText: EditText?, error: String) {
        if (editText != null) {
            editText.requestFocus()
            editText.error = error
        }
    }

    fun isKeyboardVisible(activity: Activity, onKeyboardState: (state: Boolean) -> Unit = {}) {
        val r = Rect()
        val contentView: View = activity.findViewById(R.id.content)
        contentView.getWindowVisibleDisplayFrame(r)
        val screenHeight = contentView.rootView.height
        val keypadHeight = screenHeight - r.bottom
        onKeyboardState((keypadHeight > screenHeight * 0.15))
    }
}
