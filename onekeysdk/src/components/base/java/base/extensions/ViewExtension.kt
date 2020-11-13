package base.extensions

import androidx.appcompat.app.AppCompatActivity
import androidx.fragment.app.Fragment

fun AppCompatActivity.addFragment(containerId: Int, fragment: Fragment, addBackStack: Boolean = false) {
    with(supportFragmentManager) {
        val transaction = beginTransaction()
        if (addBackStack)
            transaction.replace(containerId, fragment, fragment::class.java.simpleName)
                    .addToBackStack(fragment::class.java.simpleName)
                    .commitAllowingStateLoss()
        else
            transaction.replace(containerId, fragment, fragment::class.java.simpleName)
                    .commitAllowingStateLoss()
    }
}

fun Fragment.addChildFragment(containerId: Int, fragment: Fragment) {
    with(childFragmentManager) {
        val transaction = beginTransaction()
        transaction.replace(containerId, fragment, fragment::class.java.simpleName)
                .commitAllowingStateLoss()
    }
}