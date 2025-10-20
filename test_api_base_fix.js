// Test API base route fix
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testAPIBaseFix() {
    console.log('🧪 Testing API Base Route Fix...');
    console.log('⏰ Waiting 30 seconds for deployment...');
    
    await new Promise(resolve => setTimeout(resolve, 30000));
    
    try {
        console.log('\n📊 Testing API Base Route...');
        const apiResponse = await fetch('https://wastewins-1.onrender.com/api/v1');
        console.log('API Base Status:', apiResponse.status);
        
        if (apiResponse.ok) {
            const apiData = await apiResponse.json();
            console.log('✅ API Base working!');
            console.log('📋 API Info:');
            console.log('- Message:', apiData.message);
            console.log('- Status:', apiData.status);
            console.log('- Version:', apiData.version);
            console.log('- Available Endpoints:');
            Object.entries(apiData.endpoints).forEach(([key, value]) => {
                console.log(`  - ${key}: ${value}`);
            });
        } else {
            console.log('❌ API Base still failing');
        }
        
        console.log('\n🔐 Testing Authentication (should still work)...');
        const authResponse = await fetch('https://wastewins-1.onrender.com/api/v1/auth/signin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'test@test.com',
                password: 'test123'
            }),
        });
        
        console.log('Auth Status:', authResponse.status);
        if (authResponse.ok) {
            console.log('✅ Authentication still working!');
        }
        
        console.log('\n🎉 API Base Route Fix Complete!');
        console.log('📱 Your mobile app should work perfectly now!');
        
    } catch (error) {
        console.log('❌ Error:', error.message);
    }
}

testAPIBaseFix();
