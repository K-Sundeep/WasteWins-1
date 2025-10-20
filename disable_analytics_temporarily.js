// Temporarily disable analytics to prevent APK errors
const fs = require('fs');

function disableAnalytics() {
    console.log('🔧 Temporarily disabling analytics for stable APK...');
    
    // Update .env to disable analytics
    const envContent = `# Mobile APK Configuration - Analytics disabled for stability
VITE_API_URL=http://192.168.1.5:5000/api/v1

# Analytics disabled temporarily
VITE_ENABLE_ANALYTICS=false

# Optional API keys
VITE_CLIMATIQ_API_KEY=YOUR_CLIMATIQ_API_KEY_HERE
VITE_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY
VITE_MAPBOX_TOKEN=YOUR_MAPBOX_TOKEN_HERE

# Performance settings
VITE_DEFAULT_PICKUP_DISTANCE_KM=5
`;

    try {
        fs.writeFileSync('.env', envContent, 'utf8');
        console.log('✅ Analytics temporarily disabled in .env');
    } catch (error) {
        console.log('❌ Error updating .env:', error.message);
        return;
    }

    console.log('\n🚀 Now rebuild APK for stable mobile experience:');
    console.log('1. npm run build');
    console.log('2. npx cap sync');
    console.log('3. cd android && .\\gradlew assembleDebug');
    console.log('\n📱 This APK will focus on core features:');
    console.log('- User authentication ✅');
    console.log('- Donations management ✅');
    console.log('- Rewards system ✅');
    console.log('- Basic functionality ✅');
    console.log('- No analytics errors ✅');
}

disableAnalytics();
