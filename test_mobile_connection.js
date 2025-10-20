// Test mobile connection to backend
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testMobileConnection() {
    console.log('📱 Testing mobile connection to backend...');
    
    const mobileApiUrl = 'http://192.168.1.5:5000/api/v1';
    
    try {
        // Test health endpoint
        console.log('🏥 Testing health endpoint...');
        const healthResponse = await fetch(`${mobileApiUrl.replace('/api/v1', '')}/health`);
        console.log('Health check status:', healthResponse.status);
        
        if (healthResponse.ok) {
            const healthData = await healthResponse.text();
            console.log('✅ Backend is accessible from network');
        }
        
        // Test auth endpoint
        console.log('\n🔐 Testing authentication endpoint...');
        const authResponse = await fetch(`${mobileApiUrl}/auth/signin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: 'test@test.com',
                password: 'test123'
            }),
        });
        
        console.log('Auth endpoint status:', authResponse.status);
        
        if (authResponse.ok) {
            const authData = await authResponse.json();
            console.log('✅ Authentication works from network');
            console.log('👤 User:', authData.user.name);
        } else {
            const errorText = await authResponse.text();
            console.log('❌ Auth failed:', errorText);
        }
        
        console.log('\n🎉 Mobile APK should now work!');
        console.log('📱 Install the new APK and test with:');
        console.log('   Email: test@test.com');
        console.log('   Password: test123');
        
    } catch (error) {
        console.log('❌ Connection failed:', error.message);
        console.log('\n💡 Troubleshooting:');
        console.log('1. Make sure backend is running: npm run dev');
        console.log('2. Check Windows Firewall - allow port 5000');
        console.log('3. Ensure mobile device is on same WiFi network');
        console.log('4. Try accessing http://192.168.1.5:5000/health in mobile browser');
    }
}

testMobileConnection();
