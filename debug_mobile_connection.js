// Debug mobile connection issues
const { Pool } = require('pg');

async function debugMobileConnection() {
    console.log('🔍 Debugging mobile connection issues...');
    
    // 1. Check current IP addresses
    console.log('\n📡 Network Information:');
    console.log('Backend should be accessible at: http://192.168.1.5:5000');
    console.log('API endpoint: http://192.168.1.5:5000/api/v1/auth/signin');
    
    // 2. Test database connection
    console.log('\n🗄️ Testing database connection...');
    const pool = new Pool({
        host: 'localhost',
        port: 5432,
        database: 'wastewins',
        user: 'postgres',
        password: 'sundeep@2007',
    });

    try {
        const client = await pool.connect();
        
        // Check if test user exists with correct password
        const userResult = await client.query('SELECT id, email, name FROM users WHERE email = $1', ['test@test.com']);
        
        if (userResult.rows.length > 0) {
            console.log('✅ Test user exists:', userResult.rows[0]);
        } else {
            console.log('❌ Test user not found in database');
        }
        
        client.release();
        await pool.end();
        
    } catch (error) {
        console.log('❌ Database connection failed:', error.message);
        await pool.end();
    }
    
    // 3. Check current .env configuration
    console.log('\n⚙️ Current frontend configuration:');
    try {
        const fs = require('fs');
        const envContent = fs.readFileSync('.env', 'utf8');
        console.log(envContent);
    } catch (error) {
        console.log('❌ Could not read .env file');
    }
    
    console.log('\n🔧 Troubleshooting Steps:');
    console.log('1. 📱 Test in mobile browser: http://192.168.1.5:5000/health');
    console.log('2. 🔥 Check Windows Firewall - allow port 5000');
    console.log('3. 📶 Ensure same WiFi network for both devices');
    console.log('4. 🖥️ Try different IP if 192.168.1.5 is wrong');
    
    console.log('\n💡 Quick Tests:');
    console.log('- Mobile browser → http://192.168.1.5:5000/health (should show JSON)');
    console.log('- Mobile browser → http://192.168.1.5:5000/api/v1/auth/signin (should show 405 Method Not Allowed)');
    console.log('- If both fail → Network/Firewall issue');
    console.log('- If both work → APK configuration issue');
}

debugMobileConnection();
