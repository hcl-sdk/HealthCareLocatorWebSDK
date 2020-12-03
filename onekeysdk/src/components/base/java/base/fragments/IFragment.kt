package base.fragments

import androidx.fragment.app.Fragment

abstract class IFragment : Fragment() {
    open var fragmentTitle = ""

    open fun onUpdateFragment() {}
}
