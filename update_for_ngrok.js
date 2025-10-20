// Update mobile app for ngrok tunnel
const fs = require('fs');

function updateForNgrok() {
    console.log('🌐 Updating mobile app for ngrok tunnel...');
    
    // Update .env with ngrok URL
    const ngrokEnv = `# ngrok Tunnel Configuration - Your backend is now accessible worldwide!
VITE_API_URL=https://seminasally-sarcolemmous-rona.ngrok-free.dev/api/v1

# Analytics disabled for stability
VITE_ENABLE_ANALYTICS=false

# Performance settings
VITE_DEFAULT_PICKUP_DISTANCE_KM=5
`;

    try {
        fs.writeFileSync('.env', ngrokEnv, 'utf8');
        console.log('✅ Updated .env with ngrok URL');
        console.log('🌐 API URL: https://seminasally-sarcolemmous-rona.ngrok-free.dev/api/v1');
    } catch (error) {
        console.log('❌ Error updating .env:', error.message);
        return;
    }

    console.log('\n🚀 Next steps:');
    console.log('1. npm run build');
    console.log('2. npx cap sync');
    console.log('3. cd android && .\\gradlew clean assembleDebug');
    
    console.log('\n🎉 Benefits of ngrok:');
    console.log('- ✅ Your backend is now accessible from anywhere');
    console.log('- ✅ Mobile app will work on any network');
    console.log('- ✅ No firewall issues');
    console.log('- ✅ HTTPS secure connection');
    console.log('- ✅ Perfect for testing and development');
    
    console.log('\n📱 Your mobile app will now connect to:');
    console.log('https://seminasally-sarcolemmous-rona.ngrok-free.dev/api/v1');
}

updateForNgrok();
