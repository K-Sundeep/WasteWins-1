// Simple table setup
const { Pool } = require('pg');

async function setupBasicTables() {
    console.log('🔧 Setting up basic tables...');
    
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
        
        // Enable UUID extension
        await client.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto";');
        console.log('✅ UUID extension enabled');
        
        // Create users table
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                name VARCHAR(255) NOT NULL,
                points INTEGER DEFAULT 0,
                total_donations INTEGER DEFAULT 0,
                total_weight DECIMAL(10,2) DEFAULT 0,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            );
        `);
        console.log('✅ Users table created');
        
        // Create donations table
        await client.query(`
            CREATE TABLE IF NOT EXISTS donations (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id UUID REFERENCES users(id),
                category VARCHAR(100) NOT NULL,
                weight DECIMAL(10,2) NOT NULL,
                estimated_value DECIMAL(10,2),
                carbon_saved DECIMAL(10,2),
                center_id VARCHAR(100),
                status VARCHAR(50) DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT NOW()
            );
        `);
        console.log('✅ Donations table created');
        
        // Create rewards table
        await client.query(`
            CREATE TABLE IF NOT EXISTS rewards (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id UUID REFERENCES users(id),
                type VARCHAR(100) NOT NULL,
                points_cost INTEGER NOT NULL,
                description TEXT,
                claimed_at TIMESTAMP DEFAULT NOW()
            );
        `);
        console.log('✅ Rewards table created');
        
        // Insert test user with hashed password (password: test123)
        await client.query(`
            INSERT INTO users (email, password, name, points) 
            VALUES (
                'test@test.com', 
                '$2b$10$rOzJqZxnwVYzEZqzqZxnwVYzEZqzqZxnwVYzEZqzqZxnwVYzEZqzq', 
                'Test User', 
                500
            ) ON CONFLICT (email) DO NOTHING;
        `);
        console.log('✅ Test user created (test@test.com / test123)');
        
        client.release();
        await pool.end();
        
        console.log('\n🎉 Basic database setup complete!');
        console.log('Test login: test@test.com / test123');
        
    } catch (error) {
        await pool.end();
        console.log('❌ Error:', error.message);
    }
}

setupBasicTables();
