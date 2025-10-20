// Check who has logged in by querying user data
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function checkLoggedUsers() {
    console.log('👥 Checking Logged In Users...');
    
    try {
        // Sign in to get access
        console.log('🔐 Authenticating...');
        const authResponse = await fetch('https://wastewins-1.onrender.com/api/v1/auth/signin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'test@test.com',
                password: 'test123'
            }),
        });
        
        if (!authResponse.ok) {
            console.log('❌ Authentication failed');
            return;
        }
        
        const authData = await authResponse.json();
        console.log('✅ Successfully authenticated');
        
        // Get community stats (shows total users)
        console.log('\n📊 Checking User Statistics...');
        const statsResponse = await fetch('https://wastewins-1.onrender.com/api/v1/impact/community');
        
        if (statsResponse.ok) {
            const stats = await statsResponse.json();
            console.log('👥 Total Users in Database:', stats.totalUsers || 0);
            console.log('📦 Total Donations Made:', stats.totalDonations || 0);
            console.log('⚖️ Total Weight Donated:', stats.totalWeight || 0, 'kg');
        }
        
        // Show current authenticated user
        console.log('\n👤 Current User Details:');
        console.log('📧 Email:', authData.user.email);
        console.log('👤 Name:', authData.user.name);
        console.log('🆔 User ID:', authData.user.id);
        console.log('⭐ Points:', authData.user.points);
        console.log('📅 Account Type: Test User');
        
        console.log('\n🔍 Login Activity Sources:');
        console.log('1. 📋 Render Logs: Check your Render dashboard → Logs');
        console.log('2. 🗄️ Database: Users table contains all registered users');
        console.log('3. 📱 Mobile App: Users who sign in through the APK');
        console.log('4. 🌐 Web Interface: Any web-based logins');
        
        console.log('\n💡 To see real-time login activity:');
        console.log('- Monitor Render logs for POST /api/v1/auth/signin requests');
        console.log('- Look for 200 status codes (successful logins)');
        console.log('- Check timestamps for when users logged in');
        
    } catch (error) {
        console.log('❌ Error:', error.message);
    }
}

checkLoggedUsers();
