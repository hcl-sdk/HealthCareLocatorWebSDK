package com.ekino.onekeysdk

import com.apollographql.apollo.ApolloCall
import com.apollographql.apollo.ApolloClient
import com.apollographql.apollo.api.Response
import com.apollographql.apollo.rx2.Rx2Apollo
import com.ekino.onekeysdk.extensions.ApolloConnector
import com.ekino.onekeysdk.extensions.isNullable
import com.ekino.onekeysdk.service.location.LocationAPI
import com.ekino.onekeysdk.service.location.OneKeyMapService
import com.google.common.truth.Truth.assertThat
import com.iqvia.onekey.GetActivitiesQuery
import com.iqvia.onekey.GetActivityByIdQuery
import com.iqvia.onekey.GetCodeByLabelQuery
import com.iqvia.onekey.GetIndividualByNameQuery
import com.iqvia.onekey.type.GeopointQuery
import io.reactivex.functions.Predicate
import org.junit.Assert
import org.junit.Before
import org.junit.Test
import java.net.URLEncoder
import java.util.*

class ApolloIntegrationTest {
    private lateinit var apolloClient: ApolloClient

    @Before
    fun setUp() {
        apolloClient = ApolloConnector.getInstance().getApolloClient()
//        apolloClient = ApolloConnector.getInstance().getApolloClient {
//            val builder = ApolloClient.builder()
//            builder.okHttpClient(OkHttpClient.Builder()
//                    .addInterceptor(ApolloConnector.AuthorizationInterceptor())
//                    .dispatcher(Dispatcher(Utils.immediateExecutorService())).build())
//                    .normalizedCache(LruNormalizedCacheFactory(EvictionPolicy.NO_EVICTION),
//                            CacheKeyResolver.DEFAULT)
//                    .defaultResponseFetcher(ApolloResponseFetchers.NETWORK_ONLY)
//                    .dispatcher(Utils.immediateExecutor())
//            builder
//        }
    }

    @Test
    fun searchLocationByName() {
        val executor: LocationAPI =
                OneKeyMapService.Builder(LocationAPI.mapUrl, LocationAPI::class.java).build()
        val params = hashMapOf<String, String>()
        params["format"] = "json"
        params["accept-language"] = Locale.getDefault().language
        params["addressdetails"] = "1"
        params["limit"] = "10"
        params["q"] = URLEncoder.encode("Ho Chi Minh", "UTF-8")
        executor.searchAddress(params).subscribe({
            assertThat(it.size).isGreaterThan(0)
            println("searchLocationByName() has passed.")
        }, {
            println("searchLocationByName() has failed with error: ${it.localizedMessage}.")
        })
    }

    @Test
    fun getActivitiesWithLocation() {
        val builder = GetActivitiesQuery.builder()
                .locale(Locale.getDefault().language).first(50).offset(0)
        builder.specialties(arrayListOf("SP.WCA.08", "SP.WCA.N2"))
        builder.location(GeopointQuery.builder().lat(45.6309).lon(-72.9830).build())
        assertResponse(apolloClient.query(builder.build()),
                Predicate<Response<GetActivitiesQuery.Data>> { response ->
                    val data = response.data?.activities()
                    Assert.assertNotNull(data)
                    assertThat(response.hasErrors()).isFalse()
                    assertThat(data).isNotEmpty()
                    assertThat(data!!.filter { it.distance() == 0.0 }).isEmpty()
                    println("getActivitiesWithLocation() has passed.")
                    true
                })
    }

    @Test
    fun getActivitiesWithoutLocation() {
        val builder = GetActivitiesQuery.builder()
                .locale(Locale.getDefault().language).first(50).offset(0)
        builder.specialties(arrayListOf("SP.WCA.08", "SP.WCA.N2"))
        assertResponse(apolloClient.query(builder.build()),
                Predicate<Response<GetActivitiesQuery.Data>> { response ->
                    val data = response.data?.activities()
                    Assert.assertNotNull(data)
                    assertThat(response.hasErrors()).isFalse()
                    assertThat(data).isNotEmpty()
                    assertThat(data!!.filter { it.distance() == 0.0 }).isNotEmpty()
                    println("getActivitiesWithoutLocation() has passed.")
                    true
                })
    }

    @Test
    fun getActivitiesWithoutSpecialities() {
        val builder = GetActivitiesQuery.builder()
                .locale(Locale.getDefault().language).first(50).offset(0)
        builder.location(GeopointQuery.builder().lat(45.6309).lon(-72.9830).build())
        assertResponse(apolloClient.query(builder.build()),
                Predicate<Response<GetActivitiesQuery.Data>> { response ->
                    val data = response.data?.activities()
                    Assert.assertNotNull(data)
                    assertThat(response.hasErrors()).isFalse()
                    assertThat(data).isNotEmpty()
                    assertThat(data!!.filter { it.distance() == 0.0 }).isEmpty()
                    println("getActivitiesWithoutSpecialities() has passed.")
                    true
                })
    }

    @Test
    fun getActivitiesById() {
        val builder = GetActivityByIdQuery.builder().id("WCAP0004386201")
                .locale(Locale.getDefault().language)
        assertResponse(apolloClient.query(builder.build()),
                Predicate<Response<GetActivityByIdQuery.Data>> { response ->
                    val data = response.data?.activityByID()
                    assertThat(data).isNotNull()
                    assertThat(response.hasErrors()).isFalse()
                    assertThat(data!!.individual()).isNotNull()
                    assertThat(data.workplace()).isNotNull()
                    println("getActivitiesById() has passed.")
                    true
                })
    }

    @Test
    fun getIndividualByName() {
        assertResponse(apolloClient.query(GetIndividualByNameQuery.builder()
                .criteria("gen").first(5).offset(0).locale(Locale.getDefault().language).build()),
                Predicate<Response<GetIndividualByNameQuery.Data>> { response ->
                    val data = response.data?.individualsByName()?.individuals()
                    Assert.assertNotNull(data)
                    assertThat(response.hasErrors()).isFalse()
                    assertThat(data).isNotEmpty()
                    assertThat(data!!.filter { it.firstName().isNullOrEmpty() }.size).isEqualTo(0)
                    assertThat(data.filter {
                        it.mainActivity().isNullable() || it.mainActivity().workplace().isNullable() ||
                                it.mainActivity().workplace().address().isNullable()
                    }.size).isEqualTo(0)
                    println("getIndividualByName() has passed.")
                    true
                })
    }

    @Test
    fun getSpecialities() {
        assertResponse(apolloClient.query(GetCodeByLabelQuery.builder().criteria("gen")
                .first(5).offset(0).codeTypes(listOf("SP")).build()),
                Predicate<Response<GetCodeByLabelQuery.Data>> { response ->
                    val data = response.data?.codesByLabel()?.codes()
                    Assert.assertNotNull(data)
                    assertThat(response.hasErrors()).isFalse()
                    assertThat(data).isNotEmpty()
                    println("getSpecialities() has passed.")
                    true
                })
    }

    private fun <T> assertResponse(call: ApolloCall<T>, predicate: Predicate<Response<T>>) =
            Rx2Apollo.from(call).test().assertValue(predicate)
}