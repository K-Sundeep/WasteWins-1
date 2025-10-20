// Simple direct test
const { Pool } = require('pg');

// Test with the exact password from your .env
const testPassword = 'sundeep@2007';

async function simpleTest() {
    console.log('🔍 Testing direct connection...');
    
    const pool = new Pool({
        host: 'localhost',
        port: 5432,
        database: 'postgres',
        user: 'postgres',
        password: testPassword,
        connectionTimeoutMillis: 5000,
    });

    try {
        const client = await pool.connect();
        console.log('✅ SUCCESS! Password works!');
        
        // Now test with wastewins database
        client.release();
        await pool.end();
        
        // Test wastewins database
        const wastePool = new Pool({
            host: 'localhost',
            port: 5432,
            database: 'wastewins',
            user: 'postgres',
            password: testPassword,
            connectionTimeoutMillis: 5000,
        });
        
        try {
            const wasteClient = await wastePool.connect();
            console.log('✅ SUCCESS! wastewins database connection works!');
            wasteClient.release();
            await wastePool.end();
            
            console.log('\n🎉 Everything should work now!');
            console.log('Your backend should start successfully.');
            
        } catch (wasteError) {
            await wastePool.end();
            if (wasteError.message.includes('does not exist')) {
                console.log('❌ wastewins database does not exist - create it in pgAdmin4');
            } else {
                console.log('❌ wastewins database error:', wasteError.message);
            }
        }
        
    } catch (error) {
        await pool.end();
        console.log('❌ Connection failed:', error.message);
        console.log('\n💡 Possible solutions:');
        console.log('1. Check if PostgreSQL service is running');
        console.log('2. Verify password in pgAdmin4');
        console.log('3. Try resetting PostgreSQL password');
    }
}

simpleTest();
