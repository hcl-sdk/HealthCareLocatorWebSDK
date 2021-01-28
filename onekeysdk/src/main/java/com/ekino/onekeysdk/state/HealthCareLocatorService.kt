package com.ekino.onekeysdk.state

import androidx.annotation.NonNull
import com.ekino.onekeysdk.model.config.HCLQueryObject
import com.iqvia.onekey.GetActivitiesQuery
import com.iqvia.onekey.GetActivityByIdQuery
import com.iqvia.onekey.GetCodeByLabelQuery
import com.iqvia.onekey.GetIndividualByNameQuery

class HealthCareLocatorService {
    private object Instance {
        val instance: HealthCareLocatorService = HealthCareLocatorService()
    }

    private val runner by lazy { HealthCareLocatorServiceRunner() }

    companion object {
        @JvmStatic
        fun getInstance(): HealthCareLocatorService = Instance.instance
    }

    fun getCodeByLabel(parameters: HCLQueryObject, @NonNull callback: HealthCareLocatorServiceCallback<ArrayList<GetCodeByLabelQuery.Code>>) {
        runner.bindView(this)
        runner.getCodeByLabel(this, parameters, callback)
    }

    fun getIndividualByName(parameters: HCLQueryObject,
                            @NonNull callback: HealthCareLocatorServiceCallback<ArrayList<GetIndividualByNameQuery.Individual>>) {
        runner.bindView(this)
        runner.getIndividualByName(this, parameters, callback)
    }

    fun getActivities(parameters: HCLQueryObject,
                            @NonNull callback: HealthCareLocatorServiceCallback<ArrayList<GetActivitiesQuery.Activity>>) {
        runner.bindView(this)
        runner.getActivities(this, parameters, callback)
    }

    fun getDetailActivity(parameters: HCLQueryObject,
                            @NonNull callback: HealthCareLocatorServiceCallback<GetActivityByIdQuery.ActivityByID>) {
        runner.bindView(this)
        runner.getDetailActivity(this, parameters, callback)
    }

    fun unbindRunner() {
        runner.unbindView()
    }
}