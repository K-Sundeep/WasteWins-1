// Create wastewins database automatically
const { Pool } = require('pg');

async function createDatabase() {
    console.log('🔧 Creating wastewins database...');
    
    const pool = new Pool({
        host: 'localhost',
        port: 5432,
        database: 'postgres',
        user: 'postgres',
        password: 'sundeep@2007',
        connectionTimeoutMillis: 5000,
    });

    try {
        const client = await pool.connect();
        
        // Create the database
        await client.query('CREATE DATABASE wastewins;');
        console.log('✅ Database "wastewins" created successfully!');
        
        client.release();
        await pool.end();
        
        console.log('\n🎉 Now your backend should work!');
        console.log('Try running: npm run dev');
        
    } catch (error) {
        await pool.end();
        if (error.message.includes('already exists')) {
            console.log('✅ Database "wastewins" already exists!');
        } else {
            console.log('❌ Error creating database:', error.message);
        }
    }
}

createDatabase();
