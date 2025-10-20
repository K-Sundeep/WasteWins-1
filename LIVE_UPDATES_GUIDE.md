# 📱 Live Updates for WasteWins Mobile App

## 🚀 **Method 1: Capacitor Live Reload (Development)**

### **Setup Live Reload:**
```bash
# 1. Start your frontend dev server
npm run dev

# 2. In another terminal, run with live reload
npx cap run android --livereload --external

# OR specify your IP address
npx cap run android --livereload --host=192.168.1.100
```

### **What This Does:**
- ✅ **Instant updates** - Changes appear immediately on device
- ✅ **No APK rebuild** needed
- ✅ **Hot module replacement** - React components update live
- ✅ **Debug console** access from Chrome DevTools

### **Requirements:**
- Mobile device and computer on **same WiFi network**
- **Development server running** (npm run dev)

---

## 🌐 **Method 2: Over-the-Air (OTA) Updates**

### **Using Capacitor Live Updates:**
```bash
# Install Capacitor Live Updates
npm install @capacitor/live-updates

# Configure in capacitor.config.ts
```

### **Configuration:**
```typescript
// capacitor.config.ts
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.wastewins.com',
  appName: 'WasteWins',
  webDir: 'dist',
  server: {
    url: 'http://192.168.1.100:3000', // Your dev server IP
    cleartext: true
  },
  plugins: {
    LiveUpdates: {
      appId: 'your-app-id',
      channel: 'development',
      autoUpdateMethod: 'background'
    }
  }
};
```

---

## 🔧 **Method 3: Development Server Connection**

### **Update Capacitor Config for Live Connection:**
```typescript
// capacitor.config.ts - Development mode
const config: CapacitorConfig = {
  appId: 'com.wastewins.com',
  appName: 'WasteWins',
  webDir: 'dist',
  server: {
    url: 'http://YOUR_COMPUTER_IP:3000',
    cleartext: true
  }
};
```

### **Find Your Computer's IP:**
```bash
# Windows
ipconfig | findstr IPv4

# Result example: 192.168.1.100
```

### **Update and Sync:**
```bash
# 1. Update config with your IP
# 2. Sync changes
npx cap sync

# 3. Install updated APK once
cd android && .\gradlew assembleDebug

# 4. Start dev server
npm run dev
```

**Now your mobile app will connect directly to your dev server!**

---

## 🎯 **Method 4: Hot Code Push (Production)**

### **Using Ionic Appflow or Similar:**
- **Ionic Appflow** - Official Capacitor solution
- **CodePush** - Microsoft's solution
- **Custom solution** using service workers

### **Benefits:**
- ✅ **Instant updates** to published apps
- ✅ **No app store approval** needed
- ✅ **Rollback capability**
- ✅ **A/B testing** support

---

## 🛠️ **Quick Setup for Live Development:**

### **Step 1: Find Your IP Address**
```bash
ipconfig
# Look for IPv4 Address: 192.168.1.XXX
```

### **Step 2: Update Capacitor Config**
```typescript
// capacitor.config.ts
server: {
  url: 'http://192.168.1.XXX:3000', // Replace XXX with your IP
  cleartext: true
}
```

### **Step 3: Sync and Install Once**
```bash
npx cap sync
cd android && .\gradlew assembleDebug
# Install this APK on your device
```

### **Step 4: Start Live Development**
```bash
# Start frontend dev server
npm run dev

# Your mobile app now updates automatically!
```

---

## 🔄 **Automatic Update Workflow:**

### **For Development:**
1. **Make changes** to your React code
2. **Save files** - Vite hot reloads
3. **Mobile app updates** automatically
4. **No APK rebuild** needed

### **For Production:**
1. **Build new version** - `npm run build`
2. **Deploy to server** - Upload dist folder
3. **Users get updates** automatically
4. **No app store** submission needed

---

## 💡 **Best Practices:**

### **Development:**
- Use **live reload** for instant feedback
- Keep **backend running** (npm run dev in backend folder)
- Use **same WiFi network** for device and computer

### **Production:**
- Implement **OTA updates** for non-breaking changes
- Use **version control** for update management
- Test updates on **staging environment** first

---

## 🎯 **Recommended Approach:**

**For Your WasteWins App:**
1. **Use Method 3** (Development Server Connection)
2. **Set up live reload** for development
3. **Plan OTA updates** for production later

This gives you the best of both worlds - instant development updates and future production flexibility!
