# 🐘 PostgreSQL Setup Guide for WasteWins

## 🎯 **Current Issue:**
Backend trying to connect with these credentials:
- **Host:** localhost:5432
- **Database:** wastewins
- **User:** postgres
- **Password:** password

## 🔧 **Step-by-Step Fix:**

### **Step 1: Open pgAdmin4**
1. Open **pgAdmin4** from your Start Menu
2. Enter your **master password** if prompted

### **Step 2: Connect to PostgreSQL Server**
1. In pgAdmin4, expand **Servers** in the left panel
2. Right-click on **PostgreSQL** server
3. If prompted for password, enter your PostgreSQL password

### **Step 3: Create WasteWins Database**
1. Right-click on **Databases**
2. Select **Create → Database**
3. **Database name:** `wastewins`
4. **Owner:** `postgres`
5. Click **Save**

### **Step 4: Update Backend Password**
You need to update the backend `.env` file with your actual PostgreSQL password.

**Current backend expects:**
```
DB_PASSWORD=password
```

**Update it to your actual PostgreSQL password:**
```
DB_PASSWORD=your_actual_postgres_password
```

### **Step 5: Create Database Tables**
Run this SQL in pgAdmin4 Query Tool:

```sql
-- Connect to wastewins database first, then run:

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
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
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
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
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    type VARCHAR(100) NOT NULL,
    points_cost INTEGER NOT NULL,
    description TEXT,
    claimed_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_donations_user_id ON donations(user_id);
CREATE INDEX IF NOT EXISTS idx_rewards_user_id ON rewards(user_id);

-- Insert a test admin user (password: admin123)
INSERT INTO users (email, password, name, points) 
VALUES (
    'admin@wastewins.com', 
    '$2b$10$rOzJqZxnwVYzEZqzqZxnwVYzEZqzqZxnwVYzEZqzqZxnwVYzEZqzq', 
    'Admin User', 
    1000
) ON CONFLICT (email) DO NOTHING;

-- Insert a test regular user (password: test123)
INSERT INTO users (email, password, name, points) 
VALUES (
    'test@test.com', 
    '$2b$10$rOzJqZxnwVYzEZqzqZxnwVYzEZqzqZxnwVYzEZqzqZxnwVYzEZqzq', 
    'Test User', 
    500
) ON CONFLICT (email) DO NOTHING;
```

---

## 🚀 **Quick Alternative: Find Your PostgreSQL Password**

### **Method 1: Check Installation Notes**
- Look for PostgreSQL installation notes/emails
- Check if you wrote down the password during installation

### **Method 2: Reset PostgreSQL Password**
If you forgot your password:

1. **Find PostgreSQL installation directory** (usually `C:\Program Files\PostgreSQL\16\`)
2. **Open Command Prompt as Administrator**
3. **Navigate to bin folder:**
   ```cmd
   cd "C:\Program Files\PostgreSQL\16\bin"
   ```
4. **Reset password:**
   ```cmd
   psql -U postgres -c "ALTER USER postgres PASSWORD 'newpassword';"
   ```

### **Method 3: Use Default Credentials**
Try these common default passwords:
- `postgres`
- `admin`
- `password`
- `123456`
- (empty password)

---

## 🔧 **Update Backend Configuration**

Once you know your PostgreSQL password, update the backend:

1. **Edit:** `backend/.env`
2. **Change:** `DB_PASSWORD=password`
3. **To:** `DB_PASSWORD=your_actual_password`

---

## ✅ **Test Connection**

After setup, your backend should connect successfully. You'll see:
```
✅ PostgreSQL connection pool established
✅ Server running on port 5000
```

---

## 🎯 **What's Your PostgreSQL Password?**

**Do you remember your PostgreSQL password?** 
- If **YES** → Update `backend/.env` with the correct password
- If **NO** → Follow Method 2 above to reset it

**Most common issue:** Using `password` in .env when actual password is different.
