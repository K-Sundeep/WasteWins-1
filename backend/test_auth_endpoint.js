// Test authentication endpoint directly
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testAuthEndpoint() {
    console.log('🧪 Testing authentication endpoint...');
    
    const testCredentials = {
        email: 'test@test.com',
        password: 'test123'
    };
    
    try {
        console.log('📡 Sending POST to http://localhost:5000/api/v1/auth/signin');
        console.log('📋 Credentials:', testCredentials);
        
        const response = await fetch('http://localhost:5000/api/v1/auth/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testCredentials),
        });
        
        console.log('📊 Response status:', response.status);
        console.log('📊 Response headers:', Object.fromEntries(response.headers));
        
        const responseText = await response.text();
        console.log('📄 Response body:', responseText);
        
        if (response.ok) {
            console.log('✅ Authentication successful!');
            try {
                const data = JSON.parse(responseText);
                console.log('🎉 User data:', data.user);
                console.log('🔑 Token received:', data.token ? 'YES' : 'NO');
            } catch (e) {
                console.log('⚠️ Could not parse JSON response');
            }
        } else {
            console.log('❌ Authentication failed');
            if (response.status === 401) {
                console.log('💡 This means invalid credentials or user not found');
            }
        }
        
    } catch (error) {
        console.log('❌ Network error:', error.message);
        console.log('💡 Make sure backend is running: npm run dev');
    }
}

testAuthEndpoint();
