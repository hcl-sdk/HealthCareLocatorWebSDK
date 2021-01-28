package com.ekino.onekeysdk.state

abstract class HealthCareLocatorServiceCallback<DATA> {
    abstract fun onServiceResponse(data: DATA)
    abstract fun onServiceFailed(message: String, e: Throwable)
}