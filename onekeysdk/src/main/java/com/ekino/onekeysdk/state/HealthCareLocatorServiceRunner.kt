package com.ekino.onekeysdk.state

import base.viewmodel.ApolloViewModel
import com.ekino.onekeysdk.extensions.isNullable
import com.ekino.onekeysdk.model.OneKeySpecialityObject
import com.ekino.onekeysdk.model.config.HCLQueryObject
import com.iqvia.onekey.GetCodeByLabelQuery

class HealthCareLocatorServiceRunner : ApolloViewModel<HealthCareLocatorService>() {
    fun getCodeByLabel(params: HCLQueryObject, callback: (ArrayList<OneKeySpecialityObject>) -> Unit) {
        rxQuery({
            GetCodeByLabelQuery.builder().criteria(params.criteria).first(params.first)
                    .offset(params.offset).codeTypes(params.codeTypes).build()
        }, { response ->
            if (response.data?.codesByLabel()?.codes().isNullable())
                arrayListOf<OneKeySpecialityObject>()
            else {
                val list = arrayListOf<OneKeySpecialityObject>()
                response.data!!.codesByLabel()!!.codes()!!.forEach {
                    list.add(OneKeySpecialityObject().parse(it))
                }
                list
            }
        }, {
            callback(it)
        }, {
            callback(arrayListOf())
        })
    }
}