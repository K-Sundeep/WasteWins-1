# 🔐 Admin Dashboard Access

## 🎯 How to Access Admin Analytics

### **Step 1: Navigate to Admin Login**
```
http://localhost:3000/admin
```
Or in your deployed app:
```
https://your-app-url.com/admin
```

### **Step 2: Enter Admin Access Key**
```
wastewins-admin-2024
```

### **Step 3: View Analytics Dashboard**
Once authenticated, you'll see:
- 📊 Real-time user statistics
- 📈 Event tracking data
- 👥 User activity metrics
- 📱 App usage analytics

## 🔒 Security Features

✅ **Separate admin login** - No visible buttons in main app
✅ **Access key required** - Only authorized users can access
✅ **Session-based** - Authentication persists during session
✅ **Hidden from regular users** - No way to discover admin panel

## 🎯 Admin Access Key

**Current Key:** `wastewins-admin-2024`

**To Change Key:**
1. Edit `src/components/AdminLogin.tsx`
2. Update `ADMIN_ACCESS_KEY` constant
3. Rebuild and deploy

## 📊 What You Can See

**Real-time Stats:**
- Active sessions
- Events per hour
- Unique users

**Dashboard Analytics:**
- Total events
- Event breakdown
- Daily activity charts
- User engagement metrics

**Event Tracking:**
- Donation events
- Page views
- User actions
- App usage patterns
