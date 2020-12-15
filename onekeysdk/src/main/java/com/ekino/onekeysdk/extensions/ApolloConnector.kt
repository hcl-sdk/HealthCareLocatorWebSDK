package com.ekino.onekeysdk.extensions

import com.apollographql.apollo.ApolloClient

class ApolloConnector private constructor() {
    private object Instance {
        val instance = ApolloConnector()
    }

    private var apolloClient: ApolloClient? = null

    companion object {
        @JvmStatic
        fun getInstance(): ApolloConnector = ApolloConnector.Instance.instance
    }

    fun getApolloClient(): ApolloClient {
        if (apolloClient == null) {
            apolloClient = ApolloClient.builder()
                .serverUrl("https://apim-dev-eastus-onekey.azure-api.net/api/graphql/query")
                .build()
        }
        return apolloClient!!
    }

    fun release() {
        apolloClient?.clearHttpCache()
        apolloClient = null
    }
}