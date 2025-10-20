// Test PostgreSQL Connection Script
// Run with: node test_connection.js

const { Pool } = require('pg');

// Common PostgreSQL passwords to try
const commonPasswords = [
    'postgres',
    'admin', 
    'password',
    '123456',
    'root',
    '', // empty password
    'wastewins'
];

async function testConnection(password) {
    const pool = new Pool({
        host: 'localhost',
        port: 5432,
        database: 'postgres', // Connect to default database first
        user: 'postgres',
        password: password,
        connectionTimeoutMillis: 3000,
    });

    try {
        const client = await pool.connect();
        await client.query('SELECT NOW()');
        client.release();
        await pool.end();
        return true;
    } catch (error) {
        await pool.end();
        return false;
    }
}

async function findWorkingPassword() {
    console.log('🔍 Testing PostgreSQL connection with common passwords...\n');
    
    for (const password of commonPasswords) {
        const passwordDisplay = password === '' ? '(empty)' : password;
        process.stdout.write(`Testing password: "${passwordDisplay}"... `);
        
        const works = await testConnection(password);
        if (works) {
            console.log('✅ SUCCESS!');
            console.log(`\n🎉 Found working password: "${passwordDisplay}"`);
            console.log('\n📝 Update your backend/.env file:');
            console.log(`DB_PASSWORD=${password}`);
            
            // Test if wastewins database exists
            await testWasteWinsDatabase(password);
            return password;
        } else {
            console.log('❌ Failed');
        }
    }
    
    console.log('\n❌ None of the common passwords worked.');
    console.log('\n💡 Try these solutions:');
    console.log('1. Check your PostgreSQL installation notes for the password');
    console.log('2. Reset PostgreSQL password using pgAdmin4');
    console.log('3. Reinstall PostgreSQL and note down the password');
    return null;
}

async function testWasteWinsDatabase(password) {
    console.log('\n🔍 Checking if "wastewins" database exists...');
    
    const pool = new Pool({
        host: 'localhost',
        port: 5432,
        database: 'postgres',
        user: 'postgres',
        password: password,
    });

    try {
        const client = await pool.connect();
        const result = await client.query(
            "SELECT 1 FROM pg_database WHERE datname = 'wastewins'"
        );
        
        if (result.rows.length > 0) {
            console.log('✅ "wastewins" database exists');
        } else {
            console.log('❌ "wastewins" database does not exist');
            console.log('\n📝 Create it using pgAdmin4:');
            console.log('1. Open pgAdmin4');
            console.log('2. Right-click "Databases" → Create → Database');
            console.log('3. Name: "wastewins"');
            console.log('4. Owner: "postgres"');
        }
        
        client.release();
    } catch (error) {
        console.log('❌ Error checking database:', error.message);
    }
    
    await pool.end();
}

// Run the test
findWorkingPassword().then(() => {
    console.log('\n🚀 Next steps:');
    console.log('1. Update backend/.env with the working password');
    console.log('2. Create "wastewins" database if it doesn\'t exist');
    console.log('3. Run database_setup.sql in pgAdmin4');
    console.log('4. Restart your backend server');
}).catch(error => {
    console.error('Error:', error);
});
