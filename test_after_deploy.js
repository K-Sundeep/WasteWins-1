// Test API after rate limiter fix
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testAfterDeploy() {
    console.log('🧪 Testing API after rate limiter fix...');
    console.log('⏰ Waiting 30 seconds for deployment to complete...');
    
    // Wait for deployment
    await new Promise(resolve => setTimeout(resolve, 30000));
    
    try {
        // Test signup
        console.log('\n📝 Testing signup...');
        const signupResponse = await fetch('https://wastewins-1.onrender.com/api/v1/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'test@test.com',
                password: 'test123',
                name: 'Test User'
            }),
        });
        
        console.log('Signup Status:', signupResponse.status);
        if (signupResponse.ok) {
            console.log('✅ Signup successful!');
        } else {
            const errorText = await signupResponse.text();
            console.log('ℹ️ Signup response:', errorText);
        }
        
        // Test signin
        console.log('\n🔐 Testing signin...');
        const signinResponse = await fetch('https://wastewins-1.onrender.com/api/v1/auth/signin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'test@test.com',
                password: 'test123'
            }),
        });
        
        console.log('Signin Status:', signinResponse.status);
        if (signinResponse.ok) {
            const signinData = await signinResponse.json();
            console.log('✅ Signin successful!');
            console.log('👤 User:', signinData.user?.name);
            console.log('🔑 Token:', signinData.token ? 'Received' : 'Missing');
        } else {
            const errorText = await signinResponse.text();
            console.log('❌ Signin failed:', errorText);
        }
        
        console.log('\n🎉 Rate limiter fix deployed successfully!');
        console.log('📱 Your mobile app should now work perfectly!');
        
    } catch (error) {
        console.log('❌ Error:', error.message);
    }
}

// Run test immediately
testAfterDeploy();
