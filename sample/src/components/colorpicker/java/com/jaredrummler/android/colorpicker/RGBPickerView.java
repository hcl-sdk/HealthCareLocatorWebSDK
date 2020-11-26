package com.jaredrummler.android.colorpicker;

import android.animation.ObjectAnimator;
import android.annotation.TargetApi;
import android.content.Context;
import android.graphics.Color;
import android.os.Parcelable;
import android.text.InputFilter;
import android.util.AttributeSet;
import android.view.KeyEvent;
import android.view.View;
import android.view.animation.DecelerateInterpolator;
import android.view.inputmethod.EditorInfo;
import android.view.inputmethod.InputMethodManager;
import android.widget.EditText;
import android.widget.SeekBar;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.widget.AppCompatSeekBar;

import com.ekino.onekeysdk.R;
import com.jaredrummler.android.colorpicker.utils.ColorUtils;
import com.jaredrummler.android.colorpicker.utils.InputFilterFloatLimitation;
import com.jaredrummler.android.colorpicker.utils.InputFilterLimitation;
import com.jaredrummler.android.colorpicker.utils.SeekBarUtils;

public class RGBPickerView extends PickerView<PickerView.SavedState> implements
        TextView.OnEditorActionListener, View.OnFocusChangeListener {

    private AppCompatSeekBar red, green, blue, alpha;
    private EditText redInt, greenInt, blueInt, alphaInt;
    private boolean isTrackingTouch;

    public RGBPickerView(Context context) {
        super(context);
    }

    public RGBPickerView(Context context, @Nullable AttributeSet attrs) {
        super(context, attrs);
    }

    public RGBPickerView(Context context, @Nullable AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
    }

    @TargetApi(21)
    public RGBPickerView(Context context, AttributeSet attrs, int defStyleAttr, int defStyleRes) {
        super(context, attrs, defStyleAttr, defStyleRes);
    }

    @Override
    protected void init() {
        inflate(getContext(), R.layout.colorpicker_layout_rgb_picker, this);
        red = findViewById(R.id.red);
        redInt = findViewById(R.id.redInt);
        green = findViewById(R.id.green);
        greenInt = findViewById(R.id.greenInt);
        blue = findViewById(R.id.blue);
        alpha = findViewById(R.id.alpha);
        blueInt = findViewById(R.id.blueInt);
        alphaInt = findViewById(R.id.alphaInt);

        InputFilter[] filters = new InputFilter[]{new InputFilterLimitation(0, 255)};
        InputFilter[] floatFilters = new InputFilter[]{new InputFilterFloatLimitation(0, 1f)};
        redInt.setFilters(filters);
        greenInt.setFilters(filters);
        blueInt.setFilters(filters);
        alphaInt.setFilters(floatFilters);

        SeekBar.OnSeekBarChangeListener listener = new SeekBar.OnSeekBarChangeListener() {
            @Override
            public void onProgressChanged(SeekBar seekBar, int i, boolean b) {
                if (seekBar.getId() == R.id.red) {
                    redInt.setText(String.format("%s", i));
                } else if (seekBar.getId() == R.id.green) {
                    greenInt.setText(String.format("%s", i));
                } else if (seekBar.getId() == R.id.blue) {
                    blueInt.setText(String.format("%s", i));
                }
                onColorPicked();
            }

            @Override
            public void onStartTrackingTouch(SeekBar seekBar) {
                detectTouchAction();
                isTrackingTouch = true;
            }

            @Override
            public void onStopTrackingTouch(SeekBar seekBar) {
                isTrackingTouch = false;
            }
        };

        red.setOnSeekBarChangeListener(listener);
        green.setOnSeekBarChangeListener(listener);
        blue.setOnSeekBarChangeListener(listener);

        SeekBarUtils.setProgressBarColor(
                red,
                ColorUtils.fromAttrRes(getContext(), R.attr.redColor, R.color.cpv_colorPickerDialog_red)
        );

        SeekBarUtils.setProgressBarColor(
                green,
                ColorUtils.fromAttrRes(getContext(), R.attr.greenColor, R.color.cpv_colorPickerDialog_green)
        );

        SeekBarUtils.setProgressBarColor(
                blue,
                ColorUtils.fromAttrRes(getContext(), R.attr.blueColor, R.color.cpv_colorPickerDialog_blue)
        );
        redInt.setOnEditorActionListener(this);
        redInt.setOnFocusChangeListener(this);
        greenInt.setOnEditorActionListener(this);
        greenInt.setOnFocusChangeListener(this);
        blueInt.setOnEditorActionListener(this);
        blueInt.setOnFocusChangeListener(this);
        alphaInt.setOnEditorActionListener(this);
        alphaInt.setOnFocusChangeListener(this);
    }

    @Override
    protected SavedState newState(@Nullable Parcelable parcelable) {
        return new SavedState(parcelable);
    }

    @Override
    public void setColor(int color, boolean animate) {
        super.setColor(color, animate);
        SeekBar[] bars = new SeekBar[]{red, green, blue};
        int[] offsets = new int[]{16, 8, 0};
        for (int i = 0; i < bars.length; i++) {
            int value = (color >> offsets[i]) & 0xFF;
            if (animate && !isTrackingTouch) {
                ObjectAnimator animator = ObjectAnimator.ofInt(bars[i], "progress", value);
                animator.setInterpolator(new DecelerateInterpolator());
                animator.start();
            } else {
                bars[i].setProgress(value);
            }
        }
    }

    @Override
    public int getColor() {
        return Color.argb(getColorAlpha(), red.getProgress(), green.getProgress(), blue.getProgress());
    }

    @NonNull
    @Override
    public String getName() {
        return "RGB";
    }

    @Override
    public boolean isTrackingTouch() {
        return true;
    }

    public void setRgba(int[] rgba) {
        red.setProgress(rgba[1]);
        green.setProgress(rgba[2]);
        blue.setProgress(rgba[3]);
        alpha.setProgress(rgba[0]);
    }

    public void detectTouchAction(View v) {
        if ((v != redInt || v != greenInt || v != blueInt || v != alphaInt)) {
            detectTouchAction();
        }
    }

    public void detectTouchAction() {
        if (redInt.hasFocus()) {
            requestKeyboard(redInt);
        } else if (greenInt.hasFocus()) {
            requestKeyboard(greenInt);
        } else if (blueInt.hasFocus()) {
            requestKeyboard(blueInt);
        } else if (alphaInt.hasFocus()) {
            requestKeyboard(alphaInt);
        }
    }

    private void requestKeyboard(View view) {
        view.clearFocus();
        InputMethodManager imm = (InputMethodManager) getContext().getSystemService(Context.INPUT_METHOD_SERVICE);
        imm.hideSoftInputFromWindow(view.getWindowToken(), 0);
        view.clearFocus();
    }


    private String getHex(int color) {
        return String.format("%06X", (0xFFFFFF & color));
    }

    private int[] getRgbaFromHex(String hex) {
        int[] rgba = new int[4];
        if (hex.length() == 8) { // FF000000
            rgba[0] = Integer.valueOf(hex.substring(0, 2), 16); // alpha
            rgba[1] = Integer.valueOf(hex.substring(2, 4), 16); // red
            rgba[2] = Integer.valueOf(hex.substring(4, 6), 16); // green
            rgba[3] = Integer.valueOf(hex.substring(6), 16); // blue
        } else if (hex.length() == 6) {
            hex += "FF" + hex.substring(1);
            rgba[0] = Integer.valueOf(hex.substring(0, 2), 16); // alpha
            rgba[1] = Integer.valueOf(hex.substring(2, 4), 16); // red
            rgba[2] = Integer.valueOf(hex.substring(4, 6), 16); // green
            rgba[3] = Integer.valueOf(hex.substring(6), 16); // blue
        }
        return rgba;
    }

    @Override
    public boolean onEditorAction(TextView v, int actionId, KeyEvent event) {
        if (actionId == EditorInfo.IME_ACTION_DONE) {
            updateColorFromView(v);
            detectTouchAction();
        }
        return false;
    }

    @Override
    public void onFocusChange(View v, boolean hasFocus) {
        if (!hasFocus && v instanceof EditText) {
            updateColorFromView((EditText) v);
        }
    }

    private void updateColorFromView(TextView v) {
        String s = v.getText().toString();
        if (v.getEditableText() == redInt.getEditableText()) {
            int color = s.isEmpty() ? 0 : Integer.parseInt(s);
            redInt.setSelection(s.toString().length());
            red.setProgress(color);
        } else if (v.getEditableText() == greenInt.getEditableText()) {
            int color = s.isEmpty() ? 0 : Integer.parseInt(s);
            greenInt.setSelection(s.toString().length());
            green.setProgress(color);
        } else if (v.getEditableText() == blueInt.getEditableText()) {
            int color = s.isEmpty() ? 0 : Integer.parseInt(s);
            blueInt.setSelection(s.toString().length());
            blue.setProgress(color);
        } else if (v.getEditableText() == alphaInt.getEditableText()) {
            float a = s.isEmpty() ? 0.00f : Float.parseFloat(s);
            alphaInt.setSelection(s.toString().length());
            alpha.setProgress(Math.round(a * 255));
        }
    }
}
