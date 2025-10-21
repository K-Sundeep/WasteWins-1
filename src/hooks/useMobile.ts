import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';

export function useMobile() {
  const [isMobile, setIsMobile] = useState(false);
  const [isCapacitor, setIsCapacitor] = useState(false);

  const exitApp = async () => {
    // Show confirmation first
    const shouldExit = confirm('Are you sure you want to exit the app?');
    if (!shouldExit) return;

    if (isCapacitor) {
      try {
        console.log('Attempting to exit Capacitor app...');
        await App.exitApp();
        console.log('App.exitApp() called successfully');
      } catch (error) {
        console.error('Capacitor App.exitApp() failed:', error);
        
        // Fallback methods
        try {
          // Try legacy methods
          if ((window as any).navigator?.app?.exitApp) {
            console.log('Using navigator.app.exitApp() fallback');
            (window as any).navigator.app.exitApp();
            return;
          }

          // Try Android specific method
          if ((window as any).device?.exitApp) {
            console.log('Using device.exitApp() fallback');
            (window as any).device.exitApp();
            return;
          }

          console.warn('All Capacitor exit methods failed, using window.close()');
          window.close();
        } catch (fallbackError) {
          console.error('All exit methods failed:', fallbackError);
          window.close();
        }
      }
    } else {
      // Web browser fallback
      console.log('Web browser - using window.close()');
      window.close();
    }
  };

  useEffect(() => {
    // Check if running in Capacitor (mobile app)
    setIsCapacitor(Capacitor.isNativePlatform());
    
    // Check if mobile device (for responsive design)
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
      setIsMobile(mobileRegex.test(userAgent.toLowerCase()) || window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Handle Android hardware back button with Capacitor
    let backButtonListener: any = null;
    
    if (isCapacitor) {
      const setupBackButtonListener = async () => {
        try {
          backButtonListener = await App.addListener('backButton', ({ canGoBack }) => {
            console.log('Hardware back button pressed, canGoBack:', canGoBack);
            
            if (!canGoBack) {
              // At root level, show exit confirmation
              if (confirm('Do you want to exit the app?')) {
                exitApp();
              }
            } else {
              // Let the default back navigation happen
              window.history.back();
            }
          });
          console.log('Back button listener registered');
        } catch (error) {
          console.error('Failed to register back button listener:', error);
        }
      };
      
      setupBackButtonListener();
    }
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      if (backButtonListener) {
        backButtonListener.remove();
      }
    };
  }, [isCapacitor, exitApp]);

  const minimizeApp = async () => {
    if (isCapacitor) {
      try {
        console.log('Attempting to minimize Capacitor app...');
        await App.minimizeApp();
        console.log('App.minimizeApp() called successfully');
      } catch (error) {
        console.warn('Could not minimize app:', error);
      }
    }
  };

  return {
    isMobile,
    isCapacitor,
    exitApp,
    minimizeApp
  };
}
