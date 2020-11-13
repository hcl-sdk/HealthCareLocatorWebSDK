package customization.map

import android.graphics.BitmapFactory
import org.osmdroid.views.MapView
import org.osmdroid.views.overlay.mylocation.IMyLocationProvider
import org.osmdroid.views.overlay.mylocation.MyLocationNewOverlay

class CustomCurrentLocationOverlay : MyLocationNewOverlay {
    constructor(iProvider: IMyLocationProvider, mapView: MapView?, drawableId: Int) : super(iProvider, mapView) {
        mPersonBitmap = null
        mapView?.let { map ->
            mDirectionArrowBitmap = BitmapFactory.decodeResource(map.context.resources, drawableId)
        }
    }
}