// Final test for mobile app connection
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function finalMobileTest() {
    console.log('📱 Final Mobile App Connection Test...');
    console.log('⏰ Waiting for deployment to complete...');
    
    // Wait for deployment
    await new Promise(resolve => setTimeout(resolve, 45000));
    
    try {
        console.log('\n1️⃣ Testing Health Check...');
        const healthResponse = await fetch('https://wastewins-1.onrender.com/health');
        console.log('Health Status:', healthResponse.status);
        
        if (healthResponse.ok) {
            console.log('✅ Backend is running');
        }
        
        console.log('\n2️⃣ Testing Authentication (Mobile App Endpoint)...');
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
            console.log('👤 User:', authData.user?.name);
            console.log('🔑 Token:', authData.token ? 'Received' : 'Missing');
            console.log('📧 Email:', authData.user?.email);
            console.log('⭐ Points:', authData.user?.points);
        } else {
            const errorText = await authResponse.text();
            console.log('❌ Authentication failed:', authText);
        }
        
        console.log('\n🎉 Mobile App Connection Test Complete!');
        console.log('\n📱 Your mobile app should now work with:');
        console.log('- Email: test@test.com');
        console.log('- Password: test123');
        console.log('- API URL: https://wastewins-1.onrender.com/api/v1');
        
        console.log('\n🚀 Install your APK and test sign-in!');
        console.log('APK Location: android/app/build/outputs/apk/debug/app-debug.apk');
        
    } catch (error) {
        console.log('❌ Connection Error:', error.message);
        console.log('💡 Try again in a few minutes - backend might still be starting up');
    }
}

finalMobileTest();
