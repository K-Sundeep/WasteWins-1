// List all databases to see what exists
const { Pool } = require('pg');

async function listDatabases() {
    console.log('🔍 Listing all databases...');
    
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
        
        // List all databases
        const result = await client.query(
            'SELECT datname FROM pg_database WHERE datistemplate = false ORDER BY datname;'
        );
        
        console.log('📋 Available databases:');
        result.rows.forEach((row, index) => {
            console.log(`${index + 1}. "${row.datname}"`);
        });
        
        // Check specifically for wastewins variations
        const wasteCheck = await client.query(
            "SELECT datname FROM pg_database WHERE datname ILIKE '%waste%' OR datname ILIKE '%wins%';"
        );
        
        if (wasteCheck.rows.length > 0) {
            console.log('\n🎯 WasteWins-related databases found:');
            wasteCheck.rows.forEach(row => {
                console.log(`- "${row.datname}"`);
            });
        } else {
            console.log('\n❌ No WasteWins-related databases found');
            console.log('💡 You need to create the "wastewins" database in pgAdmin4');
        }
        
        client.release();
        await pool.end();
        
    } catch (error) {
        await pool.end();
        console.log('❌ Error:', error.message);
    }
}

listDatabases();
