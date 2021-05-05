package com.healthcarelocator.error

import com.healthcarelocator.extensions.ErrorReference

class OneKeyException(@ErrorReference var code: String = ErrorReference.UNKNOWN,
                      override var message: String = "") : Exception() {
    override fun toString(): String {
        return "OneKeyException:: {code: $code, message: $message}"
    }
}