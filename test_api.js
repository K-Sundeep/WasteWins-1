// Test the production API
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testAPI() {
    console.log('🧪 Testing WasteWins Production API...');
    console.log('🌐 API Base: https://wastewins-1.onrender.com');
    
    try {
        // Test 1: Health Check
        console.log('\n1️⃣ Testing Health Check...');
        const healthResponse = await fetch('https://wastewins-1.onrender.com/health');
        console.log('Status:', healthResponse.status);
        
        if (healthResponse.ok) {
            const healthData = await healthResponse.text();
            console.log('✅ Health Check:', healthData);
        } else {
            console.log('❌ Health check failed');
        }
        
        // Test 2: API Base
        console.log('\n2️⃣ Testing API Base...');
        const apiResponse = await fetch('https://wastewins-1.onrender.com/api/v1');
        console.log('Status:', apiResponse.status);
        
        if (apiResponse.ok) {
            const apiData = await apiResponse.text();
            console.log('✅ API Base:', apiData);
        } else {
            console.log('❌ API base failed');
        }
        
        // Test 3: Authentication
        console.log('\n3️⃣ Testing Authentication...');
        const authResponse = await fetch('https://wastewins-1.onrender.com/api/v1/auth/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: 'test@test.com',
                password: 'test123'
            }),
        });
        
        console.log('Auth Status:', authResponse.status);
        
        if (authResponse.ok) {
            const authData = await authResponse.json();
            console.log('✅ Authentication successful!');
            console.log('👤 User:', authData.user?.name || 'Unknown');
            console.log('🔑 Token received:', authData.token ? 'Yes' : 'No');
        } else {
            const errorText = await authResponse.text();
            console.log('❌ Authentication failed:', errorText);
        }
        
        console.log('\n🎉 API Test Complete!');
        console.log('📱 Your mobile app should work with these endpoints.');
        
    } catch (error) {
        console.log('❌ Network Error:', error.message);
        console.log('\n💡 Possible issues:');
        console.log('- Check internet connection');
        console.log('- Backend might be starting up (wait 30 seconds)');
        console.log('- Try again in a moment');
    }
}

testAPI();
