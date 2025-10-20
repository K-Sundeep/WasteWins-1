# ☕ Java Update Guide for APK Building

## 🔍 **Current Issue:**
- **Your Java Version:** Java 24 (too new)
- **Required Version:** Java 17 or 20
- **Problem:** Gradle 8.11.1 doesn't support Java 24

## 📥 **Step 1: Download Java 17**

### **Option A: Automatic Download (Recommended)**
```bash
# Download Java 17 using winget (Windows Package Manager)
winget install Eclipse.Temurin.17.JDK
```

### **Option B: Manual Download**
1. **Go to:** https://adoptium.net/temurin/releases/?version=17
2. **Select:** Windows x64 JDK
3. **Download:** `.msi` installer
4. **Run installer** with default settings

## ⚙️ **Step 2: Set Java 17 as Default**

### **Method 1: Environment Variables**
1. **Open:** System Properties → Environment Variables
2. **Set JAVA_HOME:** `C:\Program Files\Eclipse Adoptium\jdk-17.x.x-hotspot`
3. **Update PATH:** Add `%JAVA_HOME%\bin` to the beginning

### **Method 2: Command Line**
```bash
# Set JAVA_HOME for current session
set JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-17.0.13.11-hotspot
set PATH=%JAVA_HOME%\bin;%PATH%
```

## ✅ **Step 3: Verify Installation**
```bash
java -version
# Should show: openjdk version "17.x.x"
```

## 🔄 **Step 4: Clean and Rebuild**
```bash
# Navigate to android folder
cd android

# Clean previous build
./gradlew clean

# Build APK
./gradlew assembleDebug
```

## 🎯 **Expected Result:**
- APK will be created at: `android/app/build/outputs/apk/debug/app-debug.apk`
- Build time: 5-10 minutes
- File size: ~10-20 MB
