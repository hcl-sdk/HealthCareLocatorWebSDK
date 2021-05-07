package base.extensions

import android.app.Activity
import android.content.BroadcastReceiver
import android.content.Intent
import android.os.Handler
import android.os.Looper
import androidx.appcompat.app.AppCompatActivity
import androidx.fragment.app.Fragment
import com.healthcarelocator.R
import java.util.*

fun AppCompatActivity.addFragment(
    containerId: Int,
    fragment: Fragment,
    addBackStack: Boolean = false
) {
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

fun AppCompatActivity.pushFragment(
    containerId: Int,
    fragment: Fragment,
    addBackStack: Boolean = false
) {
    with(supportFragmentManager) {
        val transaction = beginTransaction()
        if (addBackStack)
            transaction
                .setCustomAnimations(
                    R.anim.one_key_slide_from_right,
                    0,
                    0,
                    R.anim.one_key_exit_from_left
                )
                .add(containerId, fragment, fragment::class.java.simpleName)
                .addToBackStack(fragment::class.java.simpleName)
                .commitAllowingStateLoss()
        else
            transaction.add(containerId, fragment, fragment::class.java.simpleName)
                .commitAllowingStateLoss()
    }
}

fun AppCompatActivity.popFragment(fragment: Fragment) {
    with(supportFragmentManager) {
        val ft = beginTransaction()
        ft.remove(fragment)
        ft.commit()
        popBackStack()
    }
}

fun Activity.changeLocale(language: String) {
    try {
        var l = language
        if (l.isEmpty())
            l = "en"
        val locale = Locale(l)
        Locale.setDefault(locale)
        val config = baseContext.resources.configuration
        config.setLocale(locale)
        resources.updateConfiguration(config, resources.displayMetrics)
    } finally {
    }
}

fun Fragment.addChildFragment(containerId: Int, fragment: Fragment) {
    with(childFragmentManager) {
        val transaction = beginTransaction()
        transaction.replace(containerId, fragment, fragment::class.java.simpleName)
            .commitAllowingStateLoss()
    }
}

fun Activity.share(data: String, title: String) {
    val sharedIntent = Intent().apply {
        action = Intent.ACTION_SEND
        putExtra(Intent.EXTRA_TEXT, data)
        type = "text/plain"
    }
    startActivity(Intent.createChooser(sharedIntent, title))
}

fun BroadcastReceiver.unregisterReceiver(activity: Activity?) {
    try {
        activity?.unregisterReceiver(this)
    } catch (e: Exception) {
    }
}

/**
 * Run a runnable on the Main (UI) Thread.
 * @param runnable the runnable
 */
fun runOnUiThread(runnable: Runnable) {
    if (Looper.myLooper() != Looper.getMainLooper()) {
        Handler(Looper.getMainLooper()).post(runnable)
    } else {
        runnable.run()
    }
}