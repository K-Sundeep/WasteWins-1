-- Analytics Database Schema for WasteWins
-- Run this SQL in your PostgreSQL database

-- Analytics Events Table
CREATE TABLE IF NOT EXISTS analytics_events (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    session_id VARCHAR(255),
    event_type VARCHAR(100) NOT NULL,
    event_data JSONB DEFAULT '{}',
    platform VARCHAR(50) DEFAULT 'web', -- 'web', 'mobile', 'android'
    user_agent TEXT,
    ip_address INET,
    created_at TIMESTAMP DEFAULT NOW(),
    
    -- Indexes for performance
    INDEX idx_analytics_user_id (user_id),
    INDEX idx_analytics_event_type (event_type),
    INDEX idx_analytics_created_at (created_at),
    INDEX idx_analytics_platform (platform)
);

-- User Sessions Table
CREATE TABLE IF NOT EXISTS user_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    session_id VARCHAR(255) UNIQUE NOT NULL,
    platform VARCHAR(50) DEFAULT 'web',
    started_at TIMESTAMP DEFAULT NOW(),
    ended_at TIMESTAMP,
    duration_seconds INTEGER,
    page_views INTEGER DEFAULT 0,
    events_count INTEGER DEFAULT 0,
    
    INDEX idx_sessions_user_id (user_id),
    INDEX idx_sessions_started_at (started_at)
);

-- Daily Analytics Summary (for faster dashboard queries)
CREATE TABLE IF NOT EXISTS daily_analytics (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    active_users INTEGER DEFAULT 0,
    new_users INTEGER DEFAULT 0,
    total_sessions INTEGER DEFAULT 0,
    total_donations INTEGER DEFAULT 0,
    total_carbon_saved DECIMAL(10,2) DEFAULT 0,
    total_events INTEGER DEFAULT 0,
    platform_breakdown JSONB DEFAULT '{}',
    
    UNIQUE(date),
    INDEX idx_daily_analytics_date (date)
);

-- Popular Recycling Centers Analytics
CREATE TABLE IF NOT EXISTS center_analytics (
    id SERIAL PRIMARY KEY,
    center_id VARCHAR(100) NOT NULL,
    center_name VARCHAR(255),
    date DATE NOT NULL,
    views INTEGER DEFAULT 0,
    donations INTEGER DEFAULT 0,
    unique_users INTEGER DEFAULT 0,
    
    UNIQUE(center_id, date),
    INDEX idx_center_analytics_date (date),
    INDEX idx_center_analytics_center_id (center_id)
);

-- Create functions for analytics aggregation
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
CREATE TRIGGER trigger_update_daily_analytics
    AFTER INSERT ON analytics_events
    FOR EACH ROW
    EXECUTE FUNCTION update_daily_analytics();

-- Insert initial data
INSERT INTO daily_analytics (date, active_users, new_users, total_sessions, total_donations, total_carbon_saved)
VALUES (CURRENT_DATE, 0, 0, 0, 0, 0.00)
ON CONFLICT (date) DO NOTHING;
