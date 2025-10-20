@echo off
echo 🧹 Building APK from clean...
echo.

echo 1️⃣ Building web assets...
npm run build

echo.
echo 2️⃣ Syncing with Capacitor...
npx cap sync

echo.
echo 3️⃣ Building Android APK...
cd android
.\gradlew clean assembleDebug

echo.
echo ✅ Clean APK build complete!
echo 📱 APK Location: android\app\build\outputs\apk\debug\app-debug.apk
echo.
echo 🎯 Changes in this APK:
echo - ❌ Removed "Trying to connect..." alerts
echo - ❌ Removed debugging popup messages
echo - ✅ Clean sign-in experience
echo - ✅ Professional user interface
echo.
pause
