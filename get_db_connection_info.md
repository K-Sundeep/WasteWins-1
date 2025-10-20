# 🔗 Connect to Render PostgreSQL Database

## 📋 Get Connection Details:

### **Step 1: Get Database URL from Render**
1. Go to **Render Dashboard**
2. Click on your **PostgreSQL database** (wastewins-db)
3. Go to **Connect** tab
4. Copy the **External Database URL**

The URL format will be:
```
postgresql://username:password@host:port/database
```

### **Step 2: Parse Connection Details**
From the URL, extract:
- **Host:** `dpg-xxxxxxxxx.oregon-postgres.render.com`
- **Port:** `5432`
- **Database:** `wastewins`
- **Username:** `wastewins`
- **Password:** `[long random string]`

## 🔧 Configure pgAdmin:

### **Step 3: Add Server in pgAdmin**
1. **Open pgAdmin**
2. **Right-click "Servers"** → **Create** → **Server**
3. **General Tab:**
   - Name: `WasteWins Production DB`
4. **Connection Tab:**
   - Host: `[from URL above]`
   - Port: `5432`
   - Database: `wastewins`
   - Username: `wastewins`
   - Password: `[from URL above]`
5. **Advanced Tab:**
   - SSL Mode: `Require`
6. **Save**

## 📊 Query Users Table:

### **Step 4: Check Users**
Once connected, run these queries:

```sql
-- Count total users
SELECT COUNT(*) as total_users FROM users;

-- See all users
SELECT id, email, name, points, joined_at FROM users;

-- Check recent logins (if you add last_login column)
SELECT email, name, joined_at FROM users ORDER BY joined_at DESC;

-- User statistics
SELECT 
    COUNT(*) as total_users,
    SUM(points) as total_points,
    AVG(points) as avg_points
FROM users;
```

## 🎯 What You'll See:
- **Test User:** test@test.com with 500 points
- **Any new registrations** from mobile app
- **User creation timestamps**
- **Points and activity data**
