import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';

export function useMobile() {
  const [isMobile, setIsMobile] = useState(false);
  const [isCapacitor, setIsCapacitor] = useState(false);

  const exitApp = async () => {
    if (isCapacitor) {
      try {
        // Use Capacitor's native exit functionality
        if ((window as any).Capacitor?.Plugins?.App) {
          await (window as any).Capacitor.Plugins.App.exitApp();
        } else {
          // Alternative method for Capacitor
          if (confirm('Are you sure you want to exit the app?')) {
            window.close();
          }
        }
      } catch (error) {
        console.warn('Could not exit app:', error);
        // Fallback for web or if exit fails
        if (confirm('Are you sure you want to close the app?')) {
          window.close();
        }
      }
    } else {
      // Web fallback
      if (confirm('Are you sure you want to close the app?')) {
        window.close();
      }
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
    
    // Handle Android hardware back button
    const handleBackButton = () => {
      if (isCapacitor) {
        // Show exit confirmation on back button press
        if (confirm('Do you want to exit the app?')) {
          exitApp();
        }
      }
    };

    // Listen for hardware back button on Android
    if (isCapacitor) {
      document.addEventListener('backbutton', handleBackButton, false);
    }
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      if (isCapacitor) {
        document.removeEventListener('backbutton', handleBackButton, false);
      }
    };
  }, [isCapacitor, exitApp]);

  const minimizeApp = async () => {
    if (isCapacitor) {
      try {
        // Use Capacitor's native minimize functionality
        if ((window as any).Capacitor?.Plugins?.App) {
          await (window as any).Capacitor.Plugins.App.minimizeApp();
        }
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
