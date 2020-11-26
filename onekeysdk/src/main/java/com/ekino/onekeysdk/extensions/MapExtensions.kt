package com.ekino.onekeysdk.extensions

import com.ekino.onekeysdk.model.OneKeyLocation

const val mapZoomInEvent = 0
const val mapZoomOutEvent = 1
fun getDummyHCP(): ArrayList<OneKeyLocation> {
    return ArrayList<OneKeyLocation>(
    ).apply {
        add(OneKeyLocation("0", "Dr. 1", "General practitioner", "184 Le Dai Hanh, W.15, D.11, HCMC", 10, 10.764329, 106.655959, "1 day ago"))
        add(OneKeyLocation("1", "Dr. 2", "General practitioner", "182 Le Dai Hanh, W.15, D.11, HCMC", 100, 10.763676, 106.656367, "1 day ago"))
        add(OneKeyLocation("2", "Dr. 4", "General practitioner", "555, Lanh Binh Thang, W.12, D.11, HCMC", 500, 10.762842, 106.651708, "2 days ago"))
        add(OneKeyLocation("3", "Dr. 3", "General practitioner", "01, Lu Gia, W.15, D.11, HCMC", 750, 10.771141, 106.653514, "3 days ago"))
    }
}