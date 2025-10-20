// Test exact environment setup as backend uses
require('dotenv').config();
const { Pool } = require('pg');

async function testExactSetup() {
    console.log('🔍 Testing exact backend configuration...');
    console.log('Password length:', process.env.DB_PASSWORD ? process.env.DB_PASSWORD.length : 0);
    console.log('Password chars:', process.env.DB_PASSWORD ? Array.from(process.env.DB_PASSWORD).map(c => c.charCodeAt(0)).join(',') : 'none');
    
    const pool = new Pool({
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        database: process.env.DB_NAME || 'wastewins',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
    });

    try {
        const client = await pool.connect();
        await client.query('SELECT NOW()');
        client.release();
        await pool.end();
        
        console.log('✅ SUCCESS! Backend configuration works!');
        console.log('The backend should start now.');
        
    } catch (error) {
        await pool.end();
        console.log('❌ Failed with exact backend config:', error.message);
        
        // Try with manual password
        console.log('\n🔍 Trying with manual password...');
        const manualPool = new Pool({
            host: 'localhost',
            port: 5432,
            database: 'wastewins',
            user: 'postgres',
            password: 'sundeep@2007',
            connectionTimeoutMillis: 2000,
        });
        
        try {
            const manualClient = await manualPool.connect();
            await manualClient.query('SELECT NOW()');
            manualClient.release();
            await manualPool.end();
            
            console.log('✅ Manual password works!');
            console.log('💡 Issue might be with .env file encoding or special characters');
            
        } catch (manualError) {
            await manualPool.end();
            console.log('❌ Manual password also failed:', manualError.message);
        }
    }
}

testExactSetup();
