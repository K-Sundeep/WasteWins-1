# 🔧 Mobile Sign-in Troubleshooting Guide

## 🎯 **Current Configuration:**
- **API URL:** `http://192.168.1.5:5000/api/v1`
- **Test Credentials:** test@test.com / test123
- **APK Updated:** 20:53 (latest build)

## 🔍 **Step-by-Step Debugging:**

### **Step 1: Test Backend Accessibility from Mobile**
**On your mobile device browser, try these URLs:**

1. **Health Check:**
   ```
   http://192.168.1.5:5000/health
   ```
   **Expected:** JSON response with server status
   **If fails:** Network/Firewall issue

2. **API Endpoint:**
   ```
   http://192.168.1.5:5000/api/v1/auth/signin
   ```
   **Expected:** "405 Method Not Allowed" (this is correct - means endpoint exists)
   **If fails:** API routing issue

### **Step 2: Fix Windows Firewall (Most Common Issue)**
**Run this command as Administrator:**
```cmd
netsh advfirewall firewall add rule name="WasteWins Backend" dir=in action=allow protocol=TCP localport=5000
```

**Or manually:**
1. Open **Windows Defender Firewall**
2. Click **Advanced settings**
3. **Inbound Rules** → **New Rule**
4. **Port** → **TCP** → **5000**
5. **Allow the connection**
6. Name: "WasteWins Backend"

### **Step 3: Verify IP Address**
**Check if your computer's IP is actually 192.168.1.5:**
```cmd
ipconfig | findstr IPv4
```

**If different IP (e.g., 192.168.1.10):**
1. Update `.env` file: `VITE_API_URL=http://192.168.1.10:5000/api/v1`
2. Rebuild APK: `npm run build && npx cap sync && cd android && .\gradlew assembleDebug`

### **Step 4: Network Requirements**
- ✅ **Same WiFi network** - Both devices connected to same router
- ❌ **Guest network** - Don't use guest WiFi
- ❌ **VPN active** - Disable VPN on both devices
- ❌ **Mobile hotspot** - Use proper WiFi router

### **Step 5: Test with Localhost (Alternative)**
**If network access fails, try localhost approach:**

1. **Update .env:**
   ```
   VITE_API_URL=http://localhost:5000/api/v1
   ```

2. **Use USB debugging:**
   ```cmd
   adb reverse tcp:5000 tcp:5000
   ```

3. **Rebuild APK**

## 🚨 **Common Error Messages & Solutions:**

### **"Sign in failed: Unknown error"**
- **Cause:** Cannot reach backend server
- **Solution:** Fix firewall or network connectivity

### **"Cannot connect to server"**
- **Cause:** Wrong IP address or backend not running
- **Solution:** Verify IP and ensure `npm run dev` is running

### **"Invalid credentials"**
- **Cause:** Wrong email/password or user doesn't exist
- **Solution:** Use test@test.com / test123 exactly

### **"Network request failed"**
- **Cause:** Mobile device can't reach computer
- **Solution:** Check WiFi, firewall, IP address

## 🔧 **Quick Fix Commands:**

### **Allow Firewall (Run as Admin):**
```cmd
netsh advfirewall firewall add rule name="Node.js" dir=in action=allow program="C:\Program Files\nodejs\node.exe"
netsh advfirewall firewall add rule name="WasteWins Port" dir=in action=allow protocol=TCP localport=5000
```

### **Check Backend Status:**
```cmd
netstat -an | findstr 5000
```
**Should show:** `0.0.0.0:5000` or `:::5000` LISTENING

### **Test from Computer:**
```cmd
curl http://192.168.1.5:5000/health
```

## 🎯 **Most Likely Issues (in order):**

1. **🔥 Windows Firewall** (90% of cases)
2. **📶 Wrong WiFi network** (5% of cases)
3. **🖥️ Wrong IP address** (3% of cases)
4. **⚙️ Backend not running** (2% of cases)

## 💡 **Immediate Action Plan:**

1. **First:** Test `http://192.168.1.5:5000/health` in mobile browser
2. **If fails:** Fix Windows Firewall (commands above)
3. **If works:** Check APK installation and credentials
4. **Still failing:** Try localhost approach with USB debugging

**Most mobile sign-in issues are Windows Firewall blocking port 5000!**
