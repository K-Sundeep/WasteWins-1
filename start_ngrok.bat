@echo off
echo 🌐 Starting ngrok tunnel for WasteWins backend...
echo.

REM Check if ngrok.exe exists
if not exist "ngrok.exe" (
    echo ❌ ngrok.exe not found!
    echo.
    echo Please download ngrok:
    echo 1. Go to https://ngrok.com/download
    echo 2. Download Windows version
    echo 3. Extract ngrok.exe to this folder
    echo 4. Run this script again
    pause
    exit /b 1
)

echo ✅ Found ngrok.exe
echo.

REM Check if backend is running
echo 🔍 Checking if backend is running on port 5000...
netstat -an | findstr :5000 > nul
if errorlevel 1 (
    echo ❌ Backend not running on port 5000!
    echo.
    echo Please start your backend first:
    echo   cd backend
    echo   npm run dev
    echo.
    pause
    exit /b 1
)

echo ✅ Backend is running on port 5000
echo.

echo 🚀 Starting ngrok tunnel...
echo You'll get a public URL like: https://abc123.ngrok-free.app
echo.
echo Copy the https URL and update your .env file:
echo   VITE_API_URL=https://your-ngrok-url.ngrok-free.app/api/v1
echo.
echo Then rebuild your APK:
echo   npm run build
echo   npx cap sync
echo   cd android && .\gradlew clean assembleDebug
echo.

REM Start ngrok
ngrok.exe http 5000
