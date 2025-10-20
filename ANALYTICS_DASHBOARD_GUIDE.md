# 📊 WasteWins Analytics Dashboard Guide

## 🎯 **Dashboard Options for User Tracking**

### **Option 1: Built-in Backend Dashboard (Free)**
Create your own analytics using your existing Express.js backend.

#### **What You Can Track:**
- 👥 **Active Users** - Daily/Monthly active users
- 📱 **App Usage** - Sessions, screen views, feature usage
- 🗺️ **Location Data** - Where users are finding recycling centers
- 🌱 **Impact Metrics** - Total donations, carbon savings
- 📊 **User Behavior** - Most used features, conversion rates

#### **Implementation Steps:**

1. **Add Analytics to Backend:**
```javascript
// backend/src/routes/analytics.js
app.post('/api/v1/analytics/track', (req, res) => {
  const { userId, event, data, timestamp } = req.body;
  // Store in database
  // Events: app_open, donation_created, center_viewed, etc.
});

app.get('/api/v1/analytics/dashboard', (req, res) => {
  // Return dashboard data
  res.json({
    activeUsers: 150,
    totalDonations: 1250,
    carbonSaved: 500.5,
    topCenters: [...],
    userGrowth: [...]
  });
});
```

2. **Add Tracking to Frontend:**
```javascript
// Track user events
const trackEvent = (event, data) => {
  fetch('/api/v1/analytics/track', {
    method: 'POST',
    body: JSON.stringify({
      userId: currentUser.id,
      event,
      data,
      timestamp: new Date()
    })
  });
};

// Usage examples
trackEvent('app_open', { platform: 'mobile' });
trackEvent('donation_created', { category: 'plastic', weight: 2.5 });
trackEvent('center_viewed', { centerId: 'center-123' });
```

3. **Create Dashboard Component:**
```jsx
// src/components/AdminDashboard.tsx
const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    fetch('/api/v1/analytics/dashboard')
      .then(res => res.json())
      .then(setAnalytics);
  }, []);

  return (
    <div className="dashboard">
      <div className="stats-grid">
        <StatCard title="Active Users" value={analytics?.activeUsers} />
        <StatCard title="Total Donations" value={analytics?.totalDonations} />
        <StatCard title="Carbon Saved (kg)" value={analytics?.carbonSaved} />
      </div>
      <UserGrowthChart data={analytics?.userGrowth} />
      <TopCentersTable data={analytics?.topCenters} />
    </div>
  );
};
```

---

### **Option 2: Google Analytics (Free)**

#### **Setup:**
1. **Create Google Analytics Account**
2. **Add GA4 to your app**
3. **View dashboard at analytics.google.com**

#### **Implementation:**
```bash
npm install gtag
```

```javascript
// Add to your React app
import { gtag } from 'gtag';

// Track page views
gtag('config', 'GA_MEASUREMENT_ID', {
  page_title: 'Home',
  page_location: window.location.href
});

// Track custom events
gtag('event', 'donation_created', {
  event_category: 'engagement',
  event_label: 'plastic',
  value: 2.5
});
```

---

### **Option 3: Firebase Analytics (Free)**

#### **Setup:**
```bash
npm install firebase
```

#### **Features:**
- 📱 **Real-time users**
- 🌍 **Geographic data**
- 📊 **Custom events**
- 🎯 **User demographics**
- 📈 **Retention analysis**

---

### **Option 4: Mixpanel (Free Tier)**

#### **Features:**
- 🔍 **Event tracking**
- 👥 **User profiles**
- 📊 **Funnels and cohorts**
- 📱 **Mobile analytics**

---

## 🚀 **Quick Implementation: Built-in Dashboard**

### **Step 1: Add Analytics Routes to Backend**
```javascript
// backend/src/routes/analytics.js
const express = require('express');
const router = express.Router();

// Track events
router.post('/track', async (req, res) => {
  try {
    const { userId, event, data } = req.body;
    
    // Store in your PostgreSQL database
    await db.query(`
      INSERT INTO analytics_events (user_id, event_type, event_data, created_at)
      VALUES ($1, $2, $3, NOW())
    `, [userId, event, JSON.stringify(data)]);
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get dashboard data
router.get('/dashboard', async (req, res) => {
  try {
    const stats = await db.query(`
      SELECT 
        COUNT(DISTINCT user_id) as active_users,
        COUNT(*) FILTER (WHERE event_type = 'donation_created') as total_donations,
        SUM((event_data->>'carbon_saved')::float) as carbon_saved
      FROM analytics_events 
      WHERE created_at >= NOW() - INTERVAL '30 days'
    `);
    
    res.json(stats.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

### **Step 2: Create Database Table**
```sql
CREATE TABLE analytics_events (
  id SERIAL PRIMARY KEY,
  user_id INTEGER,
  event_type VARCHAR(100),
  event_data JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### **Step 3: Add Dashboard to Frontend**
```jsx
// src/components/AdminDashboard.tsx
import React, { useState, useEffect } from 'react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetch('/api/v1/analytics/dashboard')
      .then(res => res.json())
      .then(setStats);
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">WasteWins Analytics</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-600">Active Users</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.active_users || 0}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-600">Total Donations</h3>
          <p className="text-3xl font-bold text-green-600">{stats.total_donations || 0}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-600">Carbon Saved (kg)</h3>
          <p className="text-3xl font-bold text-emerald-600">{stats.carbon_saved || 0}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
```

---

## 🎯 **Recommendation**

**Start with Option 1 (Built-in Dashboard)** because:
- ✅ **Complete Control** - Your data stays with you
- ✅ **Custom Metrics** - Track exactly what matters for your app
- ✅ **Free Forever** - No usage limits
- ✅ **Privacy Compliant** - No third-party data sharing
- ✅ **Integrated** - Works with your existing backend

**Add Google Analytics later** for additional insights and industry-standard metrics.

Would you like me to implement the built-in analytics dashboard for your WasteWins app?
