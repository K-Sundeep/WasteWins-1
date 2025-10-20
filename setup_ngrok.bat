@echo off
echo 🌐 Setting up ngrok for WasteWins...
echo.

REM Check if ngrok.exe exists
if not exist "ngrok.exe" (
    echo ❌ ngrok.exe not found in this folder!
    echo Please copy ngrok.exe to: %CD%
    pause
    exit /b 1
)

echo ✅ Found ngrok.exe
echo.

echo 🔑 Please enter your ngrok authtoken from https://dashboard.ngrok.com/get-started/your-authtoken
set /p authtoken="Enter your authtoken: "

echo.
echo 🔧 Configuring ngrok with your authtoken...
ngrok.exe config add-authtoken %authtoken%

echo.
echo ✅ ngrok configured successfully!
echo.

echo 🔍 Checking if backend is running on port 5000...
netstat -an | findstr :5000 > nul
if errorlevel 1 (
    echo ❌ Backend not running on port 5000!
    echo.
    echo Please start your backend first:
    echo   cd backend
    echo   npm run dev
    echo.
    echo Then run this script again or use: ngrok.exe http 5000
    pause
    exit /b 1
)

echo ✅ Backend is running on port 5000
echo.

echo 🚀 Starting ngrok tunnel...
echo You'll get a public URL like: https://abc123.ngrok-free.app
echo.
echo 📋 Next steps after ngrok starts:
echo 1. Copy the https URL from ngrok
echo 2. Update .env: VITE_API_URL=https://your-ngrok-url.ngrok-free.app/api/v1
echo 3. Rebuild APK: npm run build && npx cap sync && cd android && .\gradlew assembleDebug
echo.

REM Start ngrok tunnel
ngrok.exe http 5000
