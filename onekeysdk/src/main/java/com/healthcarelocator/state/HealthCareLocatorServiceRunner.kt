package com.healthcarelocator.state

import android.content.Context
import base.viewmodel.ApolloViewModel
import com.healthcarelocator.extensions.StatusReference
import com.healthcarelocator.extensions.isNullable
import com.healthcarelocator.model.config.HCLQueryObject
import com.iqvia.onekey.GetActivitiesQuery
import com.iqvia.onekey.GetActivityByIdQuery
import com.iqvia.onekey.GetCodeByLabelQuery
import com.iqvia.onekey.GetIndividualByNameQuery
import com.iqvia.onekey.type.GeopointQuery

class HealthCareLocatorServiceRunner : ApolloViewModel<HealthCareLocatorService>() {
    fun getCodeByLabel(
        service: HealthCareLocatorService, params: HCLQueryObject, context: Context?,
        callback: HealthCareLocatorServiceCallback<ArrayList<GetCodeByLabelQuery.Code>>
    ) {
        rxQuery({
            GetCodeByLabelQuery.builder().criteria(params.criteria).first(params.first)
                .locale(params.locale)
                .offset(params.offset).codeTypes(params.codeTypes).build()
        }, { response ->
            if (response.data?.codesByLabel()?.codes().isNullable())
                arrayListOf<GetCodeByLabelQuery.Code>()
            else {
                ArrayList(response.data!!.codesByLabel()!!.codes()!!)
            }
        }, {
            callback.onServiceResponse(it)
            service.unbindRunner()
        }, {
            callback.onServiceFailed("${StatusReference.ERROR}:: ${it.localizedMessage}", it)
            service.unbindRunner()
        }, context)
    }

    fun getIndividualByName(
        service: HealthCareLocatorService, params: HCLQueryObject, context: Context?,
        callback: HealthCareLocatorServiceCallback<ArrayList<GetIndividualByNameQuery.Individual>>
    ) {
        rxQuery({
            GetIndividualByNameQuery.builder().criteria(params.criteria).first(params.first)
                .offset(params.offset).locale(params.locale).build()
        },
            { response ->
                if (response.data?.individualsByName()?.individuals().isNullable())
                    arrayListOf<GetIndividualByNameQuery.Individual>()
                else
                    ArrayList(response.data?.individualsByName()?.individuals()!!)
            },
            {
                callback.onServiceResponse(it)
                service.unbindRunner()
            },
            {
                callback.onServiceFailed("${StatusReference.ERROR}:: ${it.localizedMessage}", it)
                service.unbindRunner()
            }, context
        )
    }

    fun getActivities(
        service: HealthCareLocatorService, params: HCLQueryObject, context: Context?,
        callback: HealthCareLocatorServiceCallback<ArrayList<GetActivitiesQuery.Activity>>
    ) {
        if (params.criteria.isEmpty() && params.specialities.isEmpty() &&
            params.latitude == 0.0 && params.longitude == 0.0
        ) {
            callback.onServiceFailed(
                "${StatusReference.ERROR}:: Parameters are invalid",
                Exception("Parameters are invalid")
            )
            return
        }
        rxQuery({
            val builder = GetActivitiesQuery.builder()
                .locale(params.locale).first(params.first).offset(params.offset)
            if (params.specialities.isNotEmpty()) {
                builder.specialties(params.specialities)
            } else {
                if (params.criteria.isNotEmpty())
                    builder.criteria(params.criteria)
            }
            if (params.latitude != 0.0 && params.longitude != 0.0) {
                builder.location(
                    GeopointQuery.builder().lat(params.latitude).lon(params.longitude)
                        .distanceMeter(5000.0).build()
                )
            }
            builder.build()
        }, { response ->
            response.data?.activities()?.run { ArrayList(this) }
                ?: arrayListOf<GetActivitiesQuery.Activity>()
        }, {
            callback.onServiceResponse(it)
            service.unbindRunner()
        }, {
            callback.onServiceFailed("${StatusReference.ERROR}:: ${it.localizedMessage}", it)
            service.unbindRunner()
        }, context)
    }

    fun getDetailActivity(
        service: HealthCareLocatorService, params: HCLQueryObject, context: Context?,
        callback: HealthCareLocatorServiceCallback<GetActivityByIdQuery.ActivityByID>
    ) {
        if (params.id.isEmpty()) {
            callback.onServiceFailed(
                "${StatusReference.ERROR}:: Activity ID is invalid",
                Exception("Activity ID is invalid.")
            )
            return
        }
        rxQuery({ GetActivityByIdQuery.builder().id(params.id).locale(params.locale).build() },
            { response ->
                response.data?.activityByID()?.run { arrayListOf(this) }
                    ?: arrayListOf<GetActivityByIdQuery.ActivityByID>()
            },
            { list ->
                list.firstOrNull()?.also { callback.onServiceResponse(it) }
                service.unbindRunner()
            },
            {
                callback.onServiceFailed("${StatusReference.ERROR}:: ${it.localizedMessage}", it)
                service.unbindRunner()
            }, context
        )
    }
}