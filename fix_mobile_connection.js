// Fix mobile APK connection issue
const fs = require('fs');

function fixMobileConnection() {
    console.log('📱 Fixing mobile APK connection...');
    
    // Update .env to use computer's IP address instead of localhost
    const mobileEnv = `# Mobile APK Configuration - Updated for network access
VITE_API_URL=http://192.168.1.5:5000/api/v1

# Optional API keys
VITE_CLIMATIQ_API_KEY=YOUR_CLIMATIQ_API_KEY_HERE
VITE_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY
VITE_MAPBOX_TOKEN=YOUR_MAPBOX_TOKEN_HERE

# Performance settings
VITE_DEFAULT_PICKUP_DISTANCE_KM=5
VITE_ENABLE_ANALYTICS=true
`;

    try {
        fs.writeFileSync('.env', mobileEnv, 'utf8');
        console.log('✅ Updated .env with network-accessible API URL');
        console.log('📡 API URL: http://192.168.1.5:5000/api/v1');
    } catch (error) {
        console.log('❌ Error updating .env:', error.message);
        return;
    }

    console.log('\n🚀 Next steps to fix mobile sign-in:');
    console.log('1. npm run build');
    console.log('2. npx cap sync');
    console.log('3. cd android && .\\gradlew assembleDebug');
    console.log('4. Install new APK on mobile device');
    console.log('5. Make sure both devices are on same WiFi network');
    console.log('6. Test login with: test@test.com / test123');
}

fixMobileConnection();
