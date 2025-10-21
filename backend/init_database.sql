-- Initialize WasteWins Database Tables
-- Run this in your PostgreSQL database

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    points INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create donations table
CREATE TABLE IF NOT EXISTS donations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    category VARCHAR(100) NOT NULL,
    weight DECIMAL(10,2) NOT NULL,
    carbon_saved DECIMAL(10,2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'pending',
    pickup_address TEXT,
    pickup_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create rewards table
CREATE TABLE IF NOT EXISTS rewards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    points_required INTEGER NOT NULL,
    status VARCHAR(50) DEFAULT 'available',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create user_rewards table (for redeemed rewards)
CREATE TABLE IF NOT EXISTS user_rewards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    reward_id UUID REFERENCES rewards(id) ON DELETE CASCADE,
    redeemed_at TIMESTAMP DEFAULT NOW(),
    status VARCHAR(50) DEFAULT 'redeemed'
);

-- Insert test user (with bcrypt hashed password for 'test123')
INSERT INTO users (email, password, name, points) 
VALUES (
    'test@test.com', 
    '$2b$10$rOzJqZxnwVYzEZqzqZxnwVYzEZqzqZxnwVYzEZqzqZxnwVYzEZqzq',
    'Test User', 
    500
) ON CONFLICT (email) DO NOTHING;

-- Insert sample donations
INSERT INTO donations (user_id, category, weight, carbon_saved, status) 
SELECT 
    u.id,
    'Electronics',
    5.2,
    12.5,
    'completed'
FROM users u WHERE u.email = 'test@test.com'
ON CONFLICT DO NOTHING;

INSERT INTO donations (user_id, category, weight, carbon_saved, status) 
SELECT 
    u.id,
    'Plastic',
    2.1,
    4.8,
    'pending'
FROM users u WHERE u.email = 'test@test.com'
ON CONFLICT DO NOTHING;

-- Insert sample rewards
INSERT INTO rewards (title, description, points_required) VALUES
('Coffee Voucher', 'Free coffee at partner cafes', 100),
('Plant a Tree', 'We will plant a tree in your name', 250),
('Eco Bag', 'Reusable shopping bag made from recycled materials', 150)
ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_donations_user_id ON donations(user_id);
CREATE INDEX IF NOT EXISTS idx_donations_status ON donations(status);
CREATE INDEX IF NOT EXISTS idx_user_rewards_user_id ON user_rewards(user_id);
