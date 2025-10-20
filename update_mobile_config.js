// Update mobile app configuration for working backend
const fs = require('fs');
const path = require('path');

function updateMobileConfig() {
    console.log('📱 Updating mobile app configuration...');
    
    // 1. Create/update frontend .env file
    const frontendEnv = `# Frontend Environment Variables
VITE_API_URL=http://localhost:5000/api/v1

# Optional API keys (can be added later)
VITE_CLIMATIQ_API_KEY=YOUR_CLIMATIQ_API_KEY_HERE
VITE_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY
VITE_MAPBOX_TOKEN=YOUR_MAPBOX_TOKEN_HERE

# Default settings
VITE_DEFAULT_PICKUP_DISTANCE_KM=5
`;

    try {
        fs.writeFileSync('.env', frontendEnv, 'utf8');
        console.log('✅ Frontend .env file created/updated');
    } catch (error) {
        console.log('❌ Error creating frontend .env:', error.message);
    }

    // 2. Update Capacitor config for better mobile experience
    const capacitorConfig = `import type { CapacitorConfig } from '@capacitor/cli';

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
    }
  }
};

export default config;
`;

    try {
        fs.writeFileSync('capacitor.config.ts', capacitorConfig, 'utf8');
        console.log('✅ Capacitor config updated');
    } catch (error) {
        console.log('❌ Error updating capacitor config:', error.message);
    }

    console.log('\n🚀 Next steps to rebuild APK:');
    console.log('1. npm run build');
    console.log('2. npx cap sync');
    console.log('3. npx cap run android');
    console.log('   OR');
    console.log('3. cd android && .\\gradlew assembleDebug');
}

updateMobileConfig();
