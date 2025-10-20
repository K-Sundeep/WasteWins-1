// Test connection to default postgres database first
const { Pool } = require('pg');

async function testConnection() {
    console.log('🔍 Testing connection to default postgres database...');
    
    const pool = new Pool({
        host: 'localhost',
        port: 5432,
        database: 'postgres', // Use default database
        user: 'postgres',
        password: 'sundeep@2007',
        connectionTimeoutMillis: 5000,
    });

    try {
        const client = await pool.connect();
        console.log('✅ Connected successfully!');
        
        // Check if wastewins database exists
        const result = await client.query(
            "SELECT 1 FROM pg_database WHERE datname = 'wastewins'"
        );
        
        if (result.rows.length > 0) {
            console.log('✅ "wastewins" database exists');
        } else {
            console.log('❌ "wastewins" database does NOT exist');
            console.log('\n📝 Create it in pgAdmin4:');
            console.log('1. Right-click "Databases" → Create → Database');
            console.log('2. Name: "wastewins"');
            console.log('3. Owner: "postgres"');
        }
        
        client.release();
        await pool.end();
        
        console.log('\n🎉 Your password "sundeep@2007" is CORRECT!');
        return true;
    } catch (error) {
        await pool.end();
        console.log('❌ Connection failed:', error.message);
        return false;
    }
}

testConnection();
