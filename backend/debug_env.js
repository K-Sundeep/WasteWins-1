// Debug environment variables
require('dotenv').config();

console.log('🔍 Environment Variables Debug:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '***HIDDEN***' : 'NOT SET');
console.log('DB_PASSWORD length:', process.env.DB_PASSWORD ? process.env.DB_PASSWORD.length : 0);

// Test connection with exact same values
const { Pool } = require('pg');

async function testWithEnvVars() {
    console.log('\n🔍 Testing connection with environment variables...');
    
    const pool = new Pool({
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        database: 'postgres', // Test with default database first
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD,
        connectionTimeoutMillis: 5000,
    });

    try {
        const client = await pool.connect();
        console.log('✅ Connection successful with .env variables!');
        client.release();
        await pool.end();
        return true;
    } catch (error) {
        console.log('❌ Connection failed:', error.message);
        await pool.end();
        return false;
    }
}

testWithEnvVars();
