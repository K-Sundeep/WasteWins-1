# 🗄️ Render Database Setup Guide

## 🚀 **Quick Setup Steps:**

### **1. Create PostgreSQL Database**
- **Render Dashboard** → **New +** → **PostgreSQL**
- **Name:** `wastewins-db`
- **Database:** `wastewins`
- **User:** `wastewins`
- **Plan:** Free
- **Create Database**

### **2. Connect to Web Service**
- **Go to your web service** → **Environment**
- **Add New Variable:**
  - **Key:** `DATABASE_URL`
  - **Value:** Select "Add from database" → `wastewins-db`

### **3. Add Required Environment Variables**
```
NODE_ENV=production
PORT=10000
DATABASE_URL=[Auto-filled from database]
JWT_SECRET=wastewins-production-jwt-secret-2024-make-this-very-long-and-random
CORS_ORIGIN=*
```

### **4. Manual Deploy**
- **Manual Deploy** to restart with database

### **5. Setup Database Tables**
Once connected, you'll need to create tables. The backend should auto-create them, or you can run:

```sql
-- Connect to your Render PostgreSQL database and run:
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    points INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Add test user
INSERT INTO users (email, password, name, points) 
VALUES ('test@test.com', '$2b$10$rOzJqZxnwVYzEZqzqZxnwVYzEZqzqZxnwVYzEZqzqZxnwVYzEZqzq', 'Test User', 500)
ON CONFLICT (email) DO NOTHING;
```

### **6. Test Your API**
Once deployed successfully:
```
https://your-render-url.onrender.com/health
https://your-render-url.onrender.com/api/v1/auth/signin
```

### **7. Update Mobile App**
```env
VITE_API_URL=https://your-render-url.onrender.com/api/v1
```
