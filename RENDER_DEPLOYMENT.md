# 🌐 Deploy to Render (Free Alternative)

## 🚀 **Quick Render Deployment**

### **Step 1: Prepare for Render**
1. Go to **render.com**
2. Sign up with GitHub account
3. Connect your repository

### **Step 2: Create Web Service**
1. Click **"New +"** → **Web Service**
2. Connect your GitHub repo
3. **Root Directory:** `backend`
4. **Build Command:** `npm install && npm run build`
5. **Start Command:** `npm start`

### **Step 3: Add PostgreSQL Database**
1. Click **"New +"** → **PostgreSQL**
2. **Name:** `wastewins-db`
3. **Free tier selected**
4. Click **Create Database**

### **Step 4: Configure Environment Variables**
In your web service settings, add:
```
NODE_ENV=production
PORT=10000
DATABASE_URL=[Auto-filled by Render]
JWT_SECRET=your-production-jwt-secret-here
CORS_ORIGIN=*
```

### **Step 5: Deploy**
- Render will automatically deploy
- You'll get a URL like: `https://your-app.onrender.com`

## ⚡ **Even Faster: Use Netlify Functions**
Alternative serverless approach with zero configuration needed.
