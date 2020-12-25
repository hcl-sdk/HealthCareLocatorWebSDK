package base.fragments

import android.os.Bundle
import android.widget.Toast
import androidx.activity.OnBackPressedCallback
import androidx.fragment.app.Fragment

abstract class IFragment : Fragment() {
    open var fragmentTitle = ""

    open fun onUpdateFragment() {}

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        activity?.onBackPressedDispatcher?.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
//                if (shouldInterceptBackPress()) {
//                    Toast.makeText(requireContext(), "Back press intercepted in:${this}", Toast.LENGTH_SHORT).show()
////                    if (requireActivity().supportFragmentManager.backStackEntryCount)
//                } else {
//                    isEnabled = false
//                    activity?.onBackPressed()
//                }
                isEnabled = false
                activity?.onBackPressed()
            }

        })
    }

    open fun shouldInterceptBackPress(): Boolean = true
}
