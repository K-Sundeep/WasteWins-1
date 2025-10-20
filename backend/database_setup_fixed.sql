-- WasteWins Database Setup Script (UUID Compatible)
-- Run this in pgAdmin4 Query Tool after creating 'wastewins' database

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Rewards table (UUID foreign key) - Create this first since it was failing
DROP TABLE IF EXISTS rewards CASCADE;
CREATE TABLE rewards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    type VARCHAR(100) NOT NULL,
    points_cost INTEGER NOT NULL,
    description TEXT,
    claimed_at TIMESTAMP DEFAULT NOW()
);

-- Analytics Events Table (for dashboard)
DROP TABLE IF EXISTS analytics_events CASCADE;
CREATE TABLE analytics_events (
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
DROP TABLE IF EXISTS user_sessions CASCADE;
CREATE TABLE user_sessions (
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
DROP TABLE IF EXISTS daily_analytics CASCADE;
CREATE TABLE daily_analytics (
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

-- Center Analytics
DROP TABLE IF EXISTS center_analytics CASCADE;
CREATE TABLE center_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    center_id VARCHAR(100) NOT NULL,
    center_name VARCHAR(255),
    date DATE NOT NULL,
    views INTEGER DEFAULT 0,
    donations INTEGER DEFAULT 0,
    unique_users INTEGER DEFAULT 0,
    UNIQUE(center_id, date)
);

-- Create indexes for better performance
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
SELECT 'Users table exists: ' || CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users') THEN 'YES' ELSE 'NO' END as users_table;
SELECT 'New tables created: ' || COUNT(*) as new_tables_count 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('rewards', 'analytics_events', 'user_sessions', 'daily_analytics', 'center_analytics');
