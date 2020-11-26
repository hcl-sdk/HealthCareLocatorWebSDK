package com.jaredrummler.android.colorpicker.utils;

import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.ColorFilter;
import android.graphics.Paint;
import android.graphics.Rect;
import android.graphics.drawable.Drawable;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

class SeekBarBackgroundDrawable extends Drawable {
    private Drawable drawable;
    private float height;
    private Paint paint;

    public SeekBarBackgroundDrawable(Drawable drawable) {
        this.drawable = drawable;
        this.height = (float) DimenUtils.dpToPx(2.0F);
        this.paint = new Paint();
    }

    public void draw(@NonNull Canvas canvas) {
        Bitmap bitmap = Bitmap.createBitmap(canvas.getWidth(), canvas.getHeight(), Bitmap.Config.RGB_565);
        this.drawable.setBounds(0, 0, canvas.getWidth(), canvas.getHeight());
        this.drawable.draw(new Canvas(bitmap));
        Rect bounds = this.getBounds();
        canvas.clipRect(new Rect(bounds.left, (int)((float)bounds.centerY() - this.height / 2.0F), bounds.right, (int)((float)bounds.centerY() + this.height / 2.0F)));
        canvas.drawBitmap(bitmap, 0.0F, 0.0F, this.paint);
    }

    public void setAlpha(int alpha) {
        this.paint.setAlpha(alpha);
    }

    public void setColorFilter(@Nullable ColorFilter colorFilter) {
    }

    public int getOpacity() {
        return -2;
    }
}