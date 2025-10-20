# 🌐 ngrok Setup for WasteWins Backend

## 📥 **Step 1: Download ngrok**

**Manual Download:**
1. Go to **https://ngrok.com/download**
2. **Download Windows (64-bit)** version
3. **Extract** the zip file to your WasteWins folder
4. **Move ngrok.exe** to `c:\Users\sunde\Downloads\WasteWins1\`

## 🔧 **Step 2: Setup ngrok**

### **Create ngrok account (free):**
1. Go to **https://dashboard.ngrok.com/signup**
2. **Sign up** for free account
3. **Copy your authtoken** from dashboard

### **Authenticate ngrok:**
```bash
# In your WasteWins folder, run:
.\ngrok.exe config add-authtoken YOUR_AUTHTOKEN_HERE
```

## 🚀 **Step 3: Create Tunnel**

### **Start your backend:**
```bash
cd backend
npm run dev
```

### **In another terminal, create tunnel:**
```bash
# In WasteWins folder:
.\ngrok.exe http 5000
```

### **You'll see output like:**
```
Session Status                online
Account                       Your Name (Plan: Free)
Version                       3.x.x
Region                        United States (us)
Latency                       -
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://abc123.ngrok-free.app -> http://localhost:5000
```

## 📱 **Step 4: Update Mobile App**

**Copy the https URL** (like `https://abc123.ngrok-free.app`) and update your .env:

```env
VITE_API_URL=https://abc123.ngrok-free.app/api/v1
```

## 🔄 **Step 5: Rebuild APK**

```bash
npm run build
npx cap sync
cd android && .\gradlew clean assembleDebug
```

## ✅ **Benefits of ngrok:**
- ✅ **Instant public URL** for your local backend
- ✅ **HTTPS support** (mobile apps prefer HTTPS)
- ✅ **No code changes** needed
- ✅ **Free tier** available
- ✅ **Works anywhere** in the world

## 🎯 **Quick Commands:**

```bash
# 1. Download ngrok.exe to WasteWins folder
# 2. Get authtoken from ngrok.com dashboard
# 3. Run these commands:

.\ngrok.exe config add-authtoken YOUR_TOKEN
.\ngrok.exe http 5000

# 4. Copy the https URL and update .env
# 5. Rebuild APK
```

**Once you have ngrok.exe downloaded, run these commands and your mobile app will work from anywhere!**
