// Rename WasteWins to wastewins
const { Pool } = require('pg');

async function renameDatabase() {
    console.log('🔧 Renaming database from "WasteWins" to "wastewins"...');
    
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
        
        // First, terminate other connections to WasteWins database
        console.log('🔌 Terminating other connections...');
        await client.query(`
            SELECT pg_terminate_backend(pid)
            FROM pg_stat_activity
            WHERE datname = 'WasteWins' AND pid <> pg_backend_pid();
        `);
        
        // Wait a moment for connections to close
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Rename the database
        console.log('📝 Renaming database...');
        await client.query('ALTER DATABASE "WasteWins" RENAME TO wastewins;');
        
        console.log('✅ Database renamed successfully!');
        console.log('   "WasteWins" → "wastewins"');
        
        client.release();
        await pool.end();
        
        console.log('\n🎉 Your backend should now work!');
        console.log('Try running: npm run dev');
        
    } catch (error) {
        await pool.end();
        console.log('❌ Error:', error.message);
        
        if (error.message.includes('being accessed by other users')) {
            console.log('\n💡 Solution: Close other connections first');
            console.log('1. Close pgAdmin4 completely');
            console.log('2. Close any other database connections');
            console.log('3. Run this script again');
        }
    }
}

renameDatabase();
