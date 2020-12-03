package com.jaredrummler.android.colorpicker.utils;

import android.graphics.PorterDuff;
import android.graphics.drawable.Drawable;
import android.graphics.drawable.LayerDrawable;
import android.os.Build;

import androidx.annotation.ColorInt;
import androidx.annotation.NonNull;
import androidx.appcompat.widget.AppCompatSeekBar;

public class SeekBarUtils {
    public SeekBarUtils() {
    }

    public static void setProgressBarColor(AppCompatSeekBar seekbar, @ColorInt int color) {
        seekbar.getProgressDrawable().setColorFilter(color, PorterDuff.Mode.SRC_IN);
        if (Build.VERSION.SDK_INT >= 16) {
            seekbar.getThumb().setColorFilter(color, PorterDuff.Mode.SRC_IN);
        }

    }

    public static void setProgressBarDrawable(AppCompatSeekBar seekbar, @NonNull Drawable drawable, @ColorInt int handleColor) {
        Drawable background = new SeekBarBackgroundDrawable(drawable.mutate().getConstantState().newDrawable());
        background.setAlpha(127);
        LayerDrawable layers = new LayerDrawable(new Drawable[]{new SeekBarDrawable(drawable), background});
        layers.setId(0, 16908301);
        layers.setId(1, 16908288);
        seekbar.setProgressDrawable(layers);
        if (Build.VERSION.SDK_INT >= 16) {
            seekbar.getThumb().setColorFilter(handleColor, PorterDuff.Mode.SRC_IN);
        }

    }
}
