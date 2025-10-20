// Fix test user password
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

async function fixTestUser() {
    console.log('🔧 Fixing test user password...');
    
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
        
        // Check existing users
        const existingUsers = await client.query('SELECT id, email, name FROM users');
        console.log('📋 Existing users:');
        existingUsers.rows.forEach(user => {
            console.log(`- ${user.email} (${user.name})`);
        });
        
        // Hash the correct password for test123
        const hashedPassword = await bcrypt.hash('test123', 10);
        console.log('🔐 Generated password hash for "test123"');
        
        // Update or insert test user with correct password
        await client.query(`
            INSERT INTO users (email, password, name, points, total_donations, total_weight) 
            VALUES ($1, $2, $3, $4, $5, $6)
            ON CONFLICT (email) 
            DO UPDATE SET 
                password = EXCLUDED.password,
                name = EXCLUDED.name,
                points = EXCLUDED.points
        `, ['test@test.com', hashedPassword, 'Test User', 500, 3, 15.2]);
        
        console.log('✅ Test user updated with correct password');
        
        // Also create admin user
        const adminHashedPassword = await bcrypt.hash('admin123', 10);
        await client.query(`
            INSERT INTO users (email, password, name, points, total_donations, total_weight) 
            VALUES ($1, $2, $3, $4, $5, $6)
            ON CONFLICT (email) 
            DO UPDATE SET 
                password = EXCLUDED.password,
                name = EXCLUDED.name,
                points = EXCLUDED.points
        `, ['admin@wastewins.com', adminHashedPassword, 'Admin User', 1000, 5, 25.5]);
        
        console.log('✅ Admin user updated with correct password');
        
        // Test the password
        const testUser = await client.query('SELECT * FROM users WHERE email = $1', ['test@test.com']);
        if (testUser.rows.length > 0) {
            const user = testUser.rows[0];
            const isValid = await bcrypt.compare('test123', user.password);
            console.log('🧪 Password test result:', isValid ? '✅ VALID' : '❌ INVALID');
        }
        
        client.release();
        await pool.end();
        
        console.log('\n🎉 User credentials fixed!');
        console.log('Test login: test@test.com / test123');
        console.log('Admin login: admin@wastewins.com / admin123');
        
    } catch (error) {
        await pool.end();
        console.log('❌ Error:', error.message);
    }
}

fixTestUser();
