# 🚀 Correct Render Deployment Settings

## ✅ **Correct Settings for Render:**

### **Service Configuration:**
- **Name:** `wastewins-backend`
- **Root Directory:** `backend/backend`
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`

### **Environment Variables:**
```
NODE_ENV=production
PORT=10000
JWT_SECRET=wastewins-super-secret-jwt-key-production-2024-make-this-very-long
CORS_ORIGIN=*
```

### **Expected Build Output:**
Should show:
```
> wastewins-backend@1.0.0 build
> tsc

> wastewins-backend@1.0.0 start  
> node dist/server.js

Server running on port 10000
Database connected successfully
```

### **NOT:**
```
> vite build (this is frontend!)
```

### **Add PostgreSQL Database:**
1. **New +** → **PostgreSQL**
2. **Name:** `wastewins-db`
3. **Free tier**
4. **Connect to web service**

### **Test Deployment:**
Once deployed, test:
```
https://your-render-url.onrender.com/health
```

Should return:
```
WasteWins Backend is running!
```
