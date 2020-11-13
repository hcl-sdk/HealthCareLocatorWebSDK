package com.ekino.onekeysdk.extensions

import androidx.fragment.app.Fragment
import com.tbruyelle.rxpermissions2.RxPermissions

fun Fragment.requestPermission(granted: (granted: Boolean) -> Unit, vararg permissions: String) {
    RxPermissions(this).request(*permissions)
        .subscribe({ granted(it) }, { granted(false) })
}