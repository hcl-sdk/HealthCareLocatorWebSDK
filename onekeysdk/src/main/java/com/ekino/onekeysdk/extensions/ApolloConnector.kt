package com.ekino.onekeysdk.extensions

import com.apollographql.apollo.ApolloClient
import com.ekino.onekeysdk.extensions.ApolloConnector.Instance.apolloClientUrl
import com.ekino.onekeysdk.state.OneKeySDK
import okhttp3.Interceptor
import okhttp3.OkHttpClient
import okhttp3.Response

class ApolloConnector private constructor() {
    private object Instance {
        val instance = ApolloConnector()
        const val apolloClientUrl = "https://apim-dev-eastus-onekey.azure-api.net/api/graphql/query"
    }

    private var apolloClient: ApolloClient? = null

    companion object {
        @JvmStatic
        fun getInstance(): ApolloConnector = ApolloConnector.Instance.instance
    }

    fun getApolloClient(): ApolloClient {
        if (apolloClient == null) {
            apolloClient = ApolloClient.builder()
                    .serverUrl(apolloClientUrl)
                    .okHttpClient(OkHttpClient.Builder()
                            .addInterceptor(AuthorizationInterceptor()).build())
                    .build()
        }
        return apolloClient!!
    }

    fun getApolloClient(builder: () -> ApolloClient.Builder): ApolloClient {
        if (apolloClient == null) {
            apolloClient = builder().serverUrl(apolloClientUrl)
                    .build()
        }
        return apolloClient!!
    }

    fun release() {
        apolloClient?.clearHttpCache()
        apolloClient = null
    }

    class AuthorizationInterceptor() : Interceptor {
        override fun intercept(chain: Interceptor.Chain): Response {
            val config = OneKeySDK.getInstance().getConfiguration()
            val request = chain.request().newBuilder()
                    .addHeader("Ocp-Apim-Subscription-Key", config.apiKey)
                    .build()

            return chain.proceed(request)
        }
    }
}