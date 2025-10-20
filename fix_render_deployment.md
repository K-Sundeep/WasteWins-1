# 🔧 Fix Render Deployment - Deploy Backend Only

## ❌ **Current Issue:**
You deployed the frontend (React app) instead of the backend (Express server).

## ✅ **Solution:**

### **Option 1: Edit Existing Service**
1. **Go to Render Dashboard** → Your service
2. **Settings** → **Build & Deploy**
3. **Root Directory:** Change to `backend`
4. **Build Command:** `npm install && npm run build`
5. **Start Command:** `npm start`
6. **Save Changes** → **Manual Deploy**

### **Option 2: Create New Service**
1. **Delete current service** (it's deploying wrong thing)
2. **New Web Service**
3. **Connect GitHub repo**
4. **Root Directory:** `backend`
5. **Build Command:** `npm install && npm run build`
6. **Start Command:** `npm start`

### **Required Environment Variables:**
```
NODE_ENV=production
PORT=10000
JWT_SECRET=your-super-secret-jwt-key-make-it-very-long-and-random-123456789
CORS_ORIGIN=*
```

### **Add PostgreSQL Database:**
1. **New PostgreSQL** service
2. **Name:** `wastewins-db`
3. **Free tier**
4. **Connect to web service**

### **Expected Result:**
- ✅ Backend server running on port 10000
- ✅ API endpoints accessible
- ✅ Database connected
- ✅ URL like: `https://wastewins-backend.onrender.com`

### **Test Your Deployment:**
Once fixed, test:
```
https://your-render-url.onrender.com/health
```
Should return: "WasteWins Backend is running!"

### **Update Mobile App:**
```env
VITE_API_URL=https://your-render-url.onrender.com/api/v1
```
