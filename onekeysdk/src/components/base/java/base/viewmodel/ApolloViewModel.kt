package base.viewmodel

import android.content.SharedPreferences
import base.extensions.runOnUiThread
import com.apollographql.apollo.ApolloCall
import com.apollographql.apollo.api.Operation
import com.apollographql.apollo.api.Query
import com.apollographql.apollo.api.Response
import com.apollographql.apollo.exception.ApolloException
import com.ekino.onekeysdk.extensions.ApolloConnector
import com.ekino.onekeysdk.extensions.removeConsultedProfile
import com.ekino.onekeysdk.extensions.storeConsultedProfiles
import com.ekino.onekeysdk.model.activity.ActivityObject
import com.google.gson.Gson
import io.reactivex.Flowable

abstract class ApolloViewModel<T> : AppViewModel<T>() {

    protected fun <D : Operation.Data, T, V : Operation.Variables>
            query(query: () -> Query<D, T, V>, success: (response: Response<T>) -> Unit,
                  error: (e: Exception) -> Unit, runOnThread: Boolean = false) {
        ApolloConnector.getInstance().getApolloClient().query(query())
                .enqueue(object : ApolloCall.Callback<T>() {
                    override fun onFailure(e: ApolloException) {
                        runOnUiThread(Runnable { error(e) })
                    }

                    override fun onResponse(response: Response<T>) {
                        if (!runOnThread)
                            runOnUiThread(Runnable {
                                if (response.hasErrors()) error(Exception(response.errors?.toString()))
                                else success(response)
                            })
                        else {
                            if (response.hasErrors()) error(Exception(response.errors?.toString()))
                            else success(response)
                        }
                    }
                })
    }


    fun storeConsultedProfile(pref: SharedPreferences, activity: ActivityObject) {
        disposable?.add(Flowable.just(0)
                .map {
                    activity.createdAt = System.currentTimeMillis()
                    pref.storeConsultedProfiles(Gson(), activity)
                }
                .compose(compose())
                .subscribe({}, {}))
    }

    fun removeConsultedProfile(pref: SharedPreferences, activity: ActivityObject) {
        disposable?.add(Flowable.just(activity)
                .map {
                    pref.removeConsultedProfile(Gson(), activity)
                }
                .compose(compose())
                .subscribe({}, {}))
    }
}