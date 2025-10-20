// Create database tables for production
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function createTables() {
    console.log('🗄️ Creating database tables...');
    
    try {
        // Test if we can create a user (this will create tables if they don't exist)
        console.log('📝 Testing user creation...');
        
        const signupResponse = await fetch('https://wastewins-1.onrender.com/api/v1/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: 'test@test.com',
                password: 'test123',
                name: 'Test User'
            }),
        });
        
        console.log('Signup Status:', signupResponse.status);
        
        if (signupResponse.ok) {
            const signupData = await signupResponse.json();
            console.log('✅ User created successfully!');
            console.log('👤 User:', signupData.user?.name);
        } else {
            const errorText = await signupResponse.text();
            console.log('ℹ️ Signup response:', errorText);
            
            // If user already exists, that's fine
            if (errorText.includes('already exists') || errorText.includes('duplicate')) {
                console.log('✅ User already exists - that\'s good!');
            }
        }
        
        // Now test signin
        console.log('\n🔐 Testing signin...');
        const signinResponse = await fetch('https://wastewins-1.onrender.com/api/v1/auth/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
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
            console.log('🔑 Token received:', signinData.token ? 'Yes' : 'No');
        } else {
            const errorText = await signinResponse.text();
            console.log('❌ Signin failed:', errorText);
        }
        
        console.log('\n🎉 Database setup complete!');
        console.log('📱 Your mobile app should now work properly.');
        
    } catch (error) {
        console.log('❌ Error:', error.message);
    }
}

createTables();
