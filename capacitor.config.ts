import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.wastewins.com',
  appName: 'WasteWins',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#22c55e",
      showSpinner: false
    },
    StatusBar: {
      style: "dark"
    },
    App: {
      handleBackButton: true
    }
  }
};

export default config;
