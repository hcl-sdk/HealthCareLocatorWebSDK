package com.jaredrummler.android.colorpicker.utils;

import android.graphics.Canvas;
import android.graphics.PixelFormat;
import android.graphics.Rect;
import android.graphics.drawable.ClipDrawable;
import android.graphics.drawable.Drawable;

class SeekBarDrawable extends ClipDrawable {
    private float height = (float)DimenUtils.dpToPx(2.0F);
    private Rect rect;

    public SeekBarDrawable(Drawable drawable) {
        super(drawable, 8388611, 1);
    }

    public void draw(Canvas canvas) {
        if (this.rect == null) {
            Rect bounds = this.getBounds();
            this.setBounds(this.rect = new Rect(bounds.left, (int)((float)bounds.centerY() - this.height / 2.0F), bounds.right, (int)((float)bounds.centerY() + this.height / 2.0F)));
        }

        super.draw(canvas);
    }

    public int getOpacity() {
        return PixelFormat.TRANSLUCENT;
    }
}
