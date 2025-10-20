// Setup database tables automatically
const { Pool } = require('pg');
const fs = require('fs');

async function setupTables() {
    console.log('🔧 Setting up database tables...');
    
    const pool = new Pool({
        host: 'localhost',
        port: 5432,
        database: 'wastewins',
        user: 'postgres',
        password: 'sundeep@2007',
        connectionTimeoutMillis: 5000,
    });

    try {
        const client = await pool.connect();
        
        // Read and execute the database setup script
        const sqlScript = fs.readFileSync('database_setup_fixed.sql', 'utf8');
        
        console.log('📋 Executing database setup script...');
        await client.query(sqlScript);
        
        console.log('✅ Database tables created successfully!');
        
        // Verify tables were created
        const tablesResult = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name;
        `);
        
        console.log('\n📋 Tables created:');
        tablesResult.rows.forEach((row, index) => {
            console.log(`${index + 1}. ${row.table_name}`);
        });
        
        client.release();
        await pool.end();
        
        console.log('\n🎉 Database setup complete!');
        console.log('Your backend should now start successfully.');
        
    } catch (error) {
        await pool.end();
        console.log('❌ Error setting up tables:', error.message);
    }
}

setupTables();
