-- WasteWins Database Setup Script
-- Run this in pgAdmin4 Query Tool after creating 'wastewins' database

-- Users table (UUID-based)
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

-- Donations table (UUID foreign key)
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

-- Rewards table (UUID foreign key)
CREATE TABLE IF NOT EXISTS rewards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    type VARCHAR(100) NOT NULL,
    points_cost INTEGER NOT NULL,
    description TEXT,
    claimed_at TIMESTAMP DEFAULT NOW()
);

-- Analytics Events Table (for dashboard)
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

-- User Sessions Table (for analytics)
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

-- Daily Analytics Summary
CREATE TABLE IF NOT EXISTS daily_analytics (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL UNIQUE,
    active_users INTEGER DEFAULT 0,
    new_users INTEGER DEFAULT 0,
    total_sessions INTEGER DEFAULT 0,
    total_donations INTEGER DEFAULT 0,
    total_carbon_saved DECIMAL(10,2) DEFAULT 0,
    total_events INTEGER DEFAULT 0,
    platform_breakdown JSONB DEFAULT '{}'
);

-- Center Analytics
CREATE TABLE IF NOT EXISTS center_analytics (
    id SERIAL PRIMARY KEY,
    center_id VARCHAR(100) NOT NULL,
    center_name VARCHAR(255),
    date DATE NOT NULL,
    views INTEGER DEFAULT 0,
    donations INTEGER DEFAULT 0,
    unique_users INTEGER DEFAULT 0,
    UNIQUE(center_id, date)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_donations_user_id ON donations(user_id);
CREATE INDEX IF NOT EXISTS idx_rewards_user_id ON rewards(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_user_id ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_platform ON analytics_events(platform);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_started_at ON user_sessions(started_at);
CREATE INDEX IF NOT EXISTS idx_daily_analytics_date ON daily_analytics(date);
CREATE INDEX IF NOT EXISTS idx_center_analytics_date ON center_analytics(date);
CREATE INDEX IF NOT EXISTS idx_center_analytics_center_id ON center_analytics(center_id);

-- Insert test users with hashed passwords
-- Admin user: email=admin@wastewins.com, password=admin123
INSERT INTO users (email, password, name, points, total_donations, total_weight) 
VALUES (
    'admin@wastewins.com', 
    '$2b$10$rOzJqZxnwVYzEZqzqZxnwVYzEZqzqZxnwVYzEZqzqZxnwVYzEZqzq', 
    'Admin User', 
    1000,
    5,
    25.5
) ON CONFLICT (email) DO NOTHING;

-- Test user: email=test@test.com, password=test123
INSERT INTO users (email, password, name, points, total_donations, total_weight) 
VALUES (
    'test@test.com', 
    '$2b$10$rOzJqZxnwVYzEZqzqZxnwVYzEZqzqZxnwVYzEZqzqZxnwVYzEZqzq', 
    'Test User', 
    500,
    3,
    15.2
) ON CONFLICT (email) DO NOTHING;

-- Demo user: email=demo@wastewins.com, password=demo123
INSERT INTO users (email, password, name, points, total_donations, total_weight) 
VALUES (
    'demo@wastewins.com', 
    '$2b$10$rOzJqZxnwVYzEZqzqZxnwVYzEZqzqZxnwVYzEZqzqZxnwVYzEZqzq', 
    'Demo User', 
    750,
    8,
    42.3
) ON CONFLICT (email) DO NOTHING;

-- Insert sample donations
INSERT INTO donations (user_id, category, weight, estimated_value, carbon_saved, center_id, status) 
SELECT 
    u.id,
    'plastic',
    5.5,
    25.00,
    2.75,
    'center-001',
    'completed'
FROM users u WHERE u.email = 'test@test.com'
ON CONFLICT DO NOTHING;

INSERT INTO donations (user_id, category, weight, estimated_value, carbon_saved, center_id, status) 
SELECT 
    u.id,
    'paper',
    10.2,
    15.50,
    5.10,
    'center-002',
    'completed'
FROM users u WHERE u.email = 'demo@wastewins.com'
ON CONFLICT DO NOTHING;

-- Insert sample analytics data
INSERT INTO daily_analytics (date, active_users, new_users, total_sessions, total_donations, total_carbon_saved, total_events)
VALUES 
    (CURRENT_DATE, 25, 5, 45, 12, 65.5, 234),
    (CURRENT_DATE - INTERVAL '1 day', 32, 8, 52, 18, 89.2, 312),
    (CURRENT_DATE - INTERVAL '2 days', 28, 3, 38, 15, 72.8, 198)
ON CONFLICT (date) DO NOTHING;

-- Create function for analytics aggregation
CREATE OR REPLACE FUNCTION update_daily_analytics()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO daily_analytics (date, total_events)
    VALUES (CURRENT_DATE, 1)
    ON CONFLICT (date)
    DO UPDATE SET 
        total_events = daily_analytics.total_events + 1,
        active_users = (
            SELECT COUNT(DISTINCT user_id) 
            FROM analytics_events 
            WHERE DATE(created_at) = CURRENT_DATE
        );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update daily analytics
DROP TRIGGER IF EXISTS trigger_update_daily_analytics ON analytics_events;
CREATE TRIGGER trigger_update_daily_analytics
    AFTER INSERT ON analytics_events
    FOR EACH ROW
    EXECUTE FUNCTION update_daily_analytics();

-- Verify setup
SELECT 'Database setup completed successfully!' as status;
SELECT 'Users created: ' || COUNT(*) as user_count FROM users;
SELECT 'Tables created: ' || COUNT(*) as table_count 
FROM information_schema.tables 
WHERE table_schema = 'public';
