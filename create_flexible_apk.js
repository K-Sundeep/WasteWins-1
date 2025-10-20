// Create APK with flexible connection options
const fs = require('fs');

function createFlexibleAPK() {
    console.log('🔧 Creating flexible APK configuration...');
    
    // Update .env with fallback options
    const flexibleEnv = `# Flexible Mobile APK Configuration
VITE_API_URL=http://192.168.1.5:5000/api/v1

# Fallback URLs (app will try these in order)
VITE_API_FALLBACK_1=http://localhost:5000/api/v1
VITE_API_FALLBACK_2=http://127.0.0.1:5000/api/v1

# Analytics disabled for stability
VITE_ENABLE_ANALYTICS=false

# Performance settings
VITE_DEFAULT_PICKUP_DISTANCE_KM=5
`;

    try {
        fs.writeFileSync('.env', flexibleEnv, 'utf8');
        console.log('✅ Updated .env with flexible configuration');
    } catch (error) {
        console.log('❌ Error updating .env:', error.message);
        return;
    }

    console.log('\n🚀 Steps to create flexible APK:');
    console.log('1. npm run build');
    console.log('2. npx cap sync');  
    console.log('3. cd android && .\\gradlew clean assembleDebug');
    
    console.log('\n📱 This APK will:');
    console.log('- Try 192.168.1.5:5000 first (network)');
    console.log('- Fall back to localhost if network fails');
    console.log('- Show clear error messages');
    console.log('- Work with USB debugging if needed');
    
    console.log('\n💡 Alternative: Test mobile browser first:');
    console.log('http://192.168.1.5:5000/health');
    console.log('If this works → APK should work');
    console.log('If this fails → Need firewall fix');
}

createFlexibleAPK();
