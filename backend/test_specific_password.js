// Test specific password from .env file
const { Pool } = require('pg');

async function testPassword(password) {
    console.log(`🔍 Testing password: "${password}"`);
    
    const pool = new Pool({
        host: 'localhost',
        port: 5432,
        database: 'wastewins', // Test with wastewins database
        user: 'postgres',
        password: password,
        connectionTimeoutMillis: 5000,
    });

    try {
        const client = await pool.connect();
        await client.query('SELECT NOW()');
        client.release();
        await pool.end();
        console.log('✅ SUCCESS! Connection works!');
        return true;
    } catch (error) {
        await pool.end();
        console.log('❌ Failed:', error.message);
        return false;
    }
}

// Test the password from your .env file
testPassword('sundeep@2007').then(success => {
    if (success) {
        console.log('\n🎉 Your backend should now work!');
        console.log('Try restarting your backend server with: npm run dev');
    } else {
        console.log('\n💡 The password in your .env file is not working.');
        console.log('Check pgAdmin4 connection properties for the correct password.');
    }
});
