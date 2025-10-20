// Add missing analytics tables
const { Pool } = require('pg');

async function addAnalyticsTables() {
    console.log('📊 Adding analytics tables...');
    
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
        
        // Analytics Events Table
        await client.query(`
            CREATE TABLE IF NOT EXISTS analytics_events (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id UUID REFERENCES users(id),
                session_id VARCHAR(255),
                event_type VARCHAR(100) NOT NULL,
                event_data JSONB DEFAULT '{}',
                platform VARCHAR(50) DEFAULT 'web',
                user_agent TEXT,
                ip_address INET,
                created_at TIMESTAMP DEFAULT NOW()
            );
        `);
        console.log('✅ Analytics events table created');
        
        // User Sessions Table
        await client.query(`
            CREATE TABLE IF NOT EXISTS user_sessions (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id UUID REFERENCES users(id),
                session_id VARCHAR(255) UNIQUE NOT NULL,
                platform VARCHAR(50) DEFAULT 'web',
                started_at TIMESTAMP DEFAULT NOW(),
                ended_at TIMESTAMP,
                duration_seconds INTEGER,
                page_views INTEGER DEFAULT 0,
                events_count INTEGER DEFAULT 0
            );
        `);
        console.log('✅ User sessions table created');
        
        // Daily Analytics Summary
        await client.query(`
            CREATE TABLE IF NOT EXISTS daily_analytics (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                date DATE NOT NULL UNIQUE,
                active_users INTEGER DEFAULT 0,
                new_users INTEGER DEFAULT 0,
                total_sessions INTEGER DEFAULT 0,
                total_donations INTEGER DEFAULT 0,
                total_carbon_saved DECIMAL(10,2) DEFAULT 0,
                total_events INTEGER DEFAULT 0,
                platform_breakdown JSONB DEFAULT '{}'
            );
        `);
        console.log('✅ Daily analytics table created');
        
        // Create indexes for better performance
        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_analytics_user_id ON analytics_events(user_id);
            CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics_events(event_type);
            CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics_events(created_at);
            CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON user_sessions(user_id);
        `);
        console.log('✅ Analytics indexes created');
        
        // Insert sample data
        await client.query(`
            INSERT INTO daily_analytics (date, active_users, new_users, total_sessions, total_donations, total_carbon_saved, total_events)
            VALUES 
                (CURRENT_DATE, 2, 1, 5, 3, 15.5, 25),
                (CURRENT_DATE - INTERVAL '1 day', 1, 0, 3, 2, 10.2, 18)
            ON CONFLICT (date) DO NOTHING;
        `);
        console.log('✅ Sample analytics data inserted');
        
        client.release();
        await pool.end();
        
        console.log('\n🎉 Analytics tables setup complete!');
        console.log('📊 Your app now supports:');
        console.log('- User activity tracking');
        console.log('- Session management'); 
        console.log('- Analytics dashboard');
        console.log('- Performance metrics');
        
    } catch (error) {
        await pool.end();
        console.log('❌ Error:', error.message);
    }
}

addAnalyticsTables();
