package com.ekino.onekeysdk.extensions

import com.ekino.onekeysdk.model.OneKeyLocation
import org.osmdroid.util.GeoPoint

const val mapZoomInEvent = 0
const val mapZoomOutEvent = 1
fun getDummyHCP(): ArrayList<OneKeyLocation> {
    return ArrayList<OneKeyLocation>(
    ).apply {
        add(OneKeyLocation("0", "Dr. 1", "General practitioner", "184 Le Dai Hanh, W.15, D.11, HCMC", 10, 10.764329, 106.655959, "1 day ago"))
        add(OneKeyLocation("1", "Dr. 2", "General practitioner", "182 Le Dai Hanh, W.15, D.11, HCMC", 100, 10.763676, 106.656367, "1 day ago", "Cabinet Médical Beaujon-Etoile", true))
        add(OneKeyLocation("2", "Dr. 4", "General practitioner", "555, Lanh Binh Thang, W.12, D.11, HCMC", 500, 10.762842, 106.651708, "2 days ago"))
        add(OneKeyLocation("3", "Dr. 3", "General practitioner", "01, Lu Gia, W.15, D.11, HCMC", 750, 10.771141, 106.653514, "3 days ago"))
        add(OneKeyLocation("4", "Dr. Dao Duy Tu", "General practitioner", "Đào Duy Từ, Phường 7, Quận 10, Thành phố Hồ Chí Minh, Việt Nam", 750, 10.759533, 106.6602585, "3 days ago", "Cabinet Médical Beaujon-Etoile", true))
        add(OneKeyLocation("5", "Dr. NCT", "General practitioner", "616, Nguyễn Chí Thanh, Phường 12, Quận 5, Thành phố Hồ Chí Minh, Việt Nam", 750, 10.7579726, 106.6585543, "3 days ago"))
        add(OneKeyLocation("6", "Dr. CLX", "General practitioner", "Lý Thường Kiệt, Phường 7, Quận 5, Thành phố Hồ Chí Minh, Việt Nam", 750, 10.7619478, 106.6600624, "3 days ago", "Cabinet Médical Beaujon-Etoile", true))
        add(OneKeyLocation("7", "Dr. 32", "General practitioner", "Đường 3/2, P14, Quận 10, Thành phố Hồ Chí Minh, Việt Nam", 750, 10.7642785, 106.6597811, "3 days ago", "Cabinet Médical Beaujon-Etoile", true))
        add(OneKeyLocation("8", "Dr. VVStar", "General practitioner", "252/2 Lý Thường Kiệt, Phường 14, Quận 11, Thành phố Hồ Chí Minh, Việt Nam", 750, 10.7667392, 106.6579213, "3 days ago"))
        add(OneKeyLocation("9", "Dr. TCH", "General practitioner", "249 Lý Thường Kiệt, Phường 15, Quận 11, Thành phố Hồ Chí Minh, Việt Nam", 750, 10.7699863, 106.6558073, "3 days ago"))
    }
}

/**
 * Geo point
 */
fun GeoPoint.getLocationString(): String = "$latitude,$longitude"