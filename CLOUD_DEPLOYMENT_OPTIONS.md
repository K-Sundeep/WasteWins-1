# 🌐 Cloud Backend Deployment Options

## 🚀 **Quick Cloud Deployment (5-10 minutes)**

### **Option 1: Railway (Recommended)**
```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login and deploy
railway login
cd backend
railway init
railway up
```
**Result:** Your backend gets a URL like `https://your-app.railway.app`

### **Option 2: Render**
1. Go to render.com
2. Connect your GitHub repo
3. Deploy backend folder
4. Get URL like `https://your-app.onrender.com`

### **Option 3: Heroku**
```bash
# Install Heroku CLI, then:
cd backend
heroku create your-app-name
git push heroku main
```

### **Option 4: Vercel (Serverless)**
```bash
npm install -g vercel
cd backend
vercel
```

## 📱 **Update Mobile App**
Once deployed, update your .env:
```env
VITE_API_URL=https://your-deployed-backend.com/api/v1
```

## 💰 **Cost Comparison**
- **Railway:** Free tier (500 hours/month)
- **Render:** Free tier (750 hours/month)
- **Heroku:** Free tier discontinued, $5/month
- **Vercel:** Free tier (generous limits)

## ⚡ **Fastest Solution: Railway**
1. `npm install -g @railway/cli`
2. `railway login`
3. `cd backend && railway init`
4. `railway up`
5. Copy the generated URL
6. Update VITE_API_URL in .env
7. Rebuild APK
