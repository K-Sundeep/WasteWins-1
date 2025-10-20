-- WasteWins Database User Queries

-- 1. Count total users
SELECT COUNT(*) as total_users FROM users;

-- 2. List all users with details
SELECT 
    id,
    email,
    name,
    points,
    total_donations,
    total_weight,
    joined_at,
    updated_at
FROM users 
ORDER BY joined_at DESC;

-- 3. User statistics summary
SELECT 
    COUNT(*) as total_users,
    SUM(points) as total_points,
    AVG(points) as avg_points,
    SUM(total_donations) as total_donations,
    SUM(total_weight) as total_weight_kg
FROM users;

-- 4. Recent activity (users created in last 7 days)
SELECT 
    email,
    name,
    points,
    joined_at
FROM users 
WHERE joined_at >= NOW() - INTERVAL '7 days'
ORDER BY joined_at DESC;

-- 5. Top users by points
SELECT 
    email,
    name,
    points,
    total_donations
FROM users 
ORDER BY points DESC
LIMIT 10;

-- 6. Check all table structures
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- 7. Check donations table (if exists)
SELECT COUNT(*) as total_donations FROM donations;

-- 8. Check rewards table (if exists)
SELECT COUNT(*) as total_rewards FROM rewards;
