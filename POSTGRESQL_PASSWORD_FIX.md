# 🔐 PostgreSQL Password Fix Guide

## ✅ **Good News:**
- ✅ PostgreSQL is **installed and running** on port 5432
- ✅ pgAdmin4 is installed
- ✅ Connection test script created

## ❌ **Issue:**
- ❌ Backend can't connect due to **incorrect password**

---

## 🚀 **Solution Methods (Try in Order):**

### **Method 1: Use pgAdmin4 to Find Password** ⭐ **EASIEST**

1. **Open pgAdmin4**
2. **Look at saved connections** - pgAdmin4 might have your password saved
3. **Right-click on PostgreSQL server** → Properties
4. **Check if password is saved/remembered**

### **Method 2: Check Your PostgreSQL Installation**

**Look for these files/locations:**
- Desktop shortcuts with connection info
- Installation folder: `C:\Program Files\PostgreSQL\`
- Installation logs in Downloads folder
- Email confirmations if downloaded from website

### **Method 3: Reset Password Using pgAdmin4**

1. **Open pgAdmin4**
2. **Connect to PostgreSQL** (it might auto-connect)
3. **Right-click on "PostgreSQL" server** → Properties
4. **Go to Connection tab**
5. **Check/update password**
6. **Or create new user:**
   - Right-click **Login/Group Roles** → Create → Login/Group Role
   - **Name:** `wastewins_user`
   - **Password:** `wastewins123`
   - **Privileges:** Can login, Create databases

### **Method 4: Use Windows Authentication**

PostgreSQL might be set up for Windows authentication:

1. **Update backend/.env:**
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=wastewins
DB_USER=your_windows_username
# Remove or comment out DB_PASSWORD
```

### **Method 5: Find PostgreSQL Config**

1. **Open Command Prompt as Administrator**
2. **Find PostgreSQL data directory:**
```cmd
dir "C:\Program Files\PostgreSQL\" /s /b | findstr postgresql.conf
```
3. **Check pg_hba.conf** for authentication method

---

## 🎯 **Quick Test - Try These Passwords:**

**Common PostgreSQL passwords:**
- Your Windows login password
- `postgres`
- `admin`
- `root`
- `123456`
- `password`
- Empty (no password)

**Test each one in pgAdmin4:**
1. Right-click PostgreSQL server → Properties
2. Connection tab → Password field
3. Try each password and click Save

---

## 🔧 **Alternative: Create New Database User**

If you can connect to pgAdmin4 at all:

1. **In pgAdmin4, run this SQL:**
```sql
-- Create new user for WasteWins
CREATE USER wastewins_user WITH PASSWORD 'wastewins123';
ALTER USER wastewins_user CREATEDB;
GRANT ALL PRIVILEGES ON DATABASE postgres TO wastewins_user;
```

2. **Update backend/.env:**
```env
DB_USER=wastewins_user
DB_PASSWORD=wastewins123
```

---

## 🚀 **Once You Find the Password:**

### **Step 1: Update Backend Configuration**
Edit `backend/.env`:
```env
DB_PASSWORD=your_actual_password
```

### **Step 2: Create WasteWins Database**
In pgAdmin4:
1. Right-click **Databases** → Create → Database
2. **Name:** `wastewins`
3. **Owner:** `postgres` (or your user)

### **Step 3: Run Database Setup**
1. **Open Query Tool** in pgAdmin4
2. **Open file:** `backend/database_setup.sql`
3. **Execute** the script

### **Step 4: Restart Backend**
```bash
cd backend
npm run dev
```

---

## 🎯 **What's Most Likely:**

**Most common scenarios:**
1. **Password is your Windows password**
2. **pgAdmin4 has password saved** - check connection properties
3. **Password is "postgres" or "admin"** but there's a connection issue
4. **PostgreSQL uses Windows authentication** - no password needed

---

## 💡 **Next Steps:**

**Can you access pgAdmin4 and connect to PostgreSQL?**
- **YES** → Use Method 3 to check/reset password
- **NO** → Try Method 4 (Windows auth) or Method 5 (find config)

**Once connected, you can:**
1. ✅ Create `wastewins` database
2. ✅ Run `database_setup.sql`
3. ✅ Update backend `.env` file
4. ✅ Test login functionality

**Let me know if you can open pgAdmin4 and I'll guide you through the exact steps!**
