package com.wastewins.com;

import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsControllerCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    
    @Override
    public void onCreate(Bundle savedInstanceState) {
        // FORCE STATUS BAR BEFORE CALLING SUPER
        forceStatusBarBeforeCapacitor();
        
        super.onCreate(savedInstanceState);
        
        // FORCE AGAIN AFTER CAPACITOR INITIALIZATION
        forceStatusBarAfterCapacitor();
    }
    
    @Override
    public void onResume() {
        super.onResume();
        forceStatusBarAfterCapacitor();
    }
    
    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) {
            forceStatusBarAfterCapacitor();
        }
    }
    
    private void forceStatusBarBeforeCapacitor() {
        // Set theme and window flags BEFORE Capacitor takes control
        Window window = getWindow();
        
        // Clear any existing fullscreen flags
        window.clearFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN);
        window.clearFlags(WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS);
        
        // Force status bar visible
        window.addFlags(WindowManager.LayoutParams.FLAG_FORCE_NOT_FULLSCREEN);
        
        // Set status bar color and make it visible
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
            window.setStatusBarColor(Color.WHITE);
        }
    }
    
    private void forceStatusBarAfterCapacitor() {
        Window window = getWindow();
        
        // NUCLEAR OPTION: Override any Capacitor settings
        window.clearFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN);
        window.clearFlags(WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS);
        window.clearFlags(WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN);
        
        // Force status bar visible with multiple methods
        window.addFlags(WindowManager.LayoutParams.FLAG_FORCE_NOT_FULLSCREEN);
        
        // Directly manipulate window attributes
        WindowManager.LayoutParams params = window.getAttributes();
        params.flags &= ~WindowManager.LayoutParams.FLAG_FULLSCREEN;
        params.flags &= ~WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS;
        window.setAttributes(params);
        
        // Modern Android approach
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            WindowCompat.setDecorFitsSystemWindows(window, true);
            WindowInsetsControllerCompat controller = WindowCompat.getInsetsController(window, window.getDecorView());
            if (controller != null) {
                controller.show(android.view.WindowInsets.Type.statusBars());
                controller.show(android.view.WindowInsets.Type.systemBars());
            }
        } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            // For Android 5.0+
            window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
            window.setStatusBarColor(Color.WHITE);
            
            View decorView = window.getDecorView();
            decorView.setSystemUiVisibility(
                View.SYSTEM_UI_FLAG_LAYOUT_STABLE |
                View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR
            );
        }
    }
}
