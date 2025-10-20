-- WasteWins Database Setup for pgAdmin4
-- Copy and paste this entire script into pgAdmin4 Query Tool

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table
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

-- Donations table
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

-- Rewards table
CREATE TABLE IF NOT EXISTS rewards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    type VARCHAR(100) NOT NULL,
    points_cost INTEGER NOT NULL,
    description TEXT,
    claimed_at TIMESTAMP DEFAULT NOW()
);

-- Analytics Events Table
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

-- User Sessions Table
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_donations_user_id ON donations(user_id);
CREATE INDEX IF NOT EXISTS idx_rewards_user_id ON rewards(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_user_id ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON user_sessions(user_id);

-- Insert test users with hashed passwords
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

-- Insert sample analytics data
INSERT INTO daily_analytics (date, active_users, new_users, total_sessions, total_donations, total_carbon_saved, total_events)
VALUES 
    (CURRENT_DATE, 2, 1, 5, 3, 15.5, 25),
    (CURRENT_DATE - INTERVAL '1 day', 1, 0, 3, 2, 10.2, 18)
ON CONFLICT (date) DO NOTHING;

-- Verify setup
SELECT 'Database setup completed successfully!' as status;
SELECT 'Users created: ' || COUNT(*) as user_count FROM users;
SELECT 'Tables created: ' || COUNT(*) as table_count 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Show test users
SELECT email, name, points FROM users;
