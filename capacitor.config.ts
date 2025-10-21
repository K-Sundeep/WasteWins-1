import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.wastewins.com',
  appName: 'WasteWins',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
      backgroundColor: "#ffffff",
      showSpinner: false,
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      splashFullScreen: false,
      splashImmersive: false
    },
    StatusBar: {
      style: "dark",
      backgroundColor: "#ffffff",
      overlaysWebView: false,
      androidStatusBarColor: "#ffffff"
    },
    App: {
      handleBackButton: true
    }
  }
};

export default config;
