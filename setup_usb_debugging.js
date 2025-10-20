// Setup USB debugging approach for mobile backend access
const fs = require('fs');

function setupUSBDebugging() {
    console.log('📱 Setting up USB debugging approach...');
    
    // Update .env to use localhost (will work with USB debugging)
    const usbEnv = `# USB Debugging Configuration - Use localhost with port forwarding
VITE_API_URL=http://localhost:5000/api/v1

# Analytics disabled for stability
VITE_ENABLE_ANALYTICS=false

# Performance settings
VITE_DEFAULT_PICKUP_DISTANCE_KM=5
`;

    try {
        fs.writeFileSync('.env', usbEnv, 'utf8');
        console.log('✅ Updated .env for USB debugging');
    } catch (error) {
        console.log('❌ Error updating .env:', error.message);
        return;
    }

    console.log('\n📱 USB Debugging Setup Steps:');
    console.log('1. Enable Developer Options on your Android device');
    console.log('2. Enable USB Debugging');
    console.log('3. Connect phone to computer via USB');
    console.log('4. Run: adb reverse tcp:5000 tcp:5000');
    console.log('5. Install APK and test');
    
    console.log('\n🔧 Commands to run:');
    console.log('# Enable port forwarding:');
    console.log('adb reverse tcp:5000 tcp:5000');
    console.log('');
    console.log('# Rebuild APK:');
    console.log('npm run build');
    console.log('npx cap sync');
    console.log('cd android && .\\gradlew clean assembleDebug');
    
    console.log('\n✅ Benefits of USB approach:');
    console.log('- No network/WiFi issues');
    console.log('- No firewall problems');
    console.log('- Direct connection to your computer');
    console.log('- Works with localhost');
}

setupUSBDebugging();
