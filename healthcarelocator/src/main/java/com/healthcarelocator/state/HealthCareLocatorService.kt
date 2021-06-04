package com.healthcarelocator.state

import android.content.Context
import androidx.annotation.NonNull
import com.healthcarelocator.model.config.HCLQueryObject
import com.iqvia.onekey.GetActivitiesQuery
import com.iqvia.onekey.GetActivityByIdQuery
import com.iqvia.onekey.GetCodeByLabelQuery
import com.iqvia.onekey.GetIndividualByNameQuery

class HealthCareLocatorService {
    private object Instance {
        val instance: HealthCareLocatorService = HealthCareLocatorService()
    }

    private val runner by lazy { HealthCareLocatorServiceRunner() }
    private var context: Context? = null

    companion object {
        @JvmStatic
        fun getInstance(context: Context): HealthCareLocatorService = Instance.instance.apply {
            this.context = context
        }
    }

    fun getCodeByLabel(parameters: HCLQueryObject, @NonNull callback: HealthCareLocatorServiceCallback<ArrayList<GetCodeByLabelQuery.Code>>) {
        runner.bindView(this)
        runner.getCodeByLabel(this, parameters, context, callback)
    }

    fun getIndividualByName(parameters: HCLQueryObject,
                            @NonNull callback: HealthCareLocatorServiceCallback<ArrayList<GetIndividualByNameQuery.Individual>>) {
        runner.bindView(this)
        runner.getIndividualByName(this, parameters, context, callback)
    }

    fun getActivities(parameters: HCLQueryObject,
                      @NonNull callback: HealthCareLocatorServiceCallback<ArrayList<GetActivitiesQuery.Activity>>) {
        runner.bindView(this)
        runner.getActivities(this, parameters, context, callback)
    }

    fun getDetailActivity(parameters: HCLQueryObject,
                          @NonNull callback: HealthCareLocatorServiceCallback<GetActivityByIdQuery.ActivityByID>) {
        runner.bindView(this)
        runner.getDetailActivity(this, parameters, context, callback)
    }

    fun unbindRunner() {
        runner.unbindView()
    }
}