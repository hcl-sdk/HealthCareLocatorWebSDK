package base.fragments

import android.os.Bundle
import androidx.fragment.app.Fragment

abstract class IFragment : Fragment() {
    open var fragmentTitle = ""

    open fun onUpdateFragment() {}

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
//        activity?.onBackPressedDispatcher?.addCallback(activity!!, object : OnBackPressedCallback(true) {
//            override fun handleOnBackPressed() {
//                isEnabled = false
//                activity?.onBackPressed()
//            }
//
//        })
    }

    open fun shouldInterceptBackPress(): Boolean = false
}
