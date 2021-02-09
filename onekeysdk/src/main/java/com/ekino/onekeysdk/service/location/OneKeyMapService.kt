package com.ekino.onekeysdk.service.location

import com.jakewharton.retrofit2.adapter.rxjava2.RxJava2CallAdapterFactory
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

class OneKeyMapService<T> private constructor() {
    private var baseUrl: String = ""
    fun build(baseUrl: String, cls: Class<T>): T {
        this.baseUrl = baseUrl
        return Retrofit.Builder().baseUrl(baseUrl)
            .addCallAdapterFactory(RxJava2CallAdapterFactory.create())
            .addConverterFactory(GsonConverterFactory.create())
            .client(OkHttpClient.Builder().run {
                addInterceptor(HttpLoggingInterceptor(HttpLoggingInterceptor.Logger {
                    println(it)
                }).setLevel(HttpLoggingInterceptor.Level.BODY))
                build()
            })
            .build().create(cls)
    }

    class Builder<T>(var baseUrl: String, var cls: Class<T>) {
        fun baseUrl(baseUrl: String) = apply { this.baseUrl = baseUrl }
        fun cls(cls: Class<T>) = apply { this.cls = cls }
        fun build(): T = OneKeyMapService<T>().build(baseUrl, cls)
    }
}