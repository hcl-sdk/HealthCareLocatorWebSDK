package com.jaredrummler.android.colorpicker.utils;

import android.content.Context;
import android.content.res.Resources;

class DimenUtils {
    public DimenUtils() {
    }

    public static int getStatusBarHeight(Context context) {
        int resId = context.getResources().getIdentifier("status_bar_height", "dimen", "android");
        return resId > 0 ? context.getResources().getDimensionPixelSize(resId) : 0;
    }

    public static int getNavigationBarHeight(Context context) {
        int resId = context.getResources().getIdentifier("navigation_bar_height", "dimen", "android");
        return resId > 0 ? context.getResources().getDimensionPixelSize(resId) : 0;
    }

    public static int dpToPx(float dp) {
        return (int) (Resources.getSystem().getDisplayMetrics().density * dp);
    }

    public static float pxToDp(int pixels) {
        return (float) pixels / Resources.getSystem().getDisplayMetrics().density;
    }

    public static int spToPx(float sp) {
        return (int) (Resources.getSystem().getDisplayMetrics().scaledDensity * sp);
    }

    public static float pxToSp(int pixels) {
        return (float) pixels / Resources.getSystem().getDisplayMetrics().scaledDensity;
    }
}
