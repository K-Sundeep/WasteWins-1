@echo off
echo 🌐 Starting ngrok tunnel for WasteWins...
echo.

echo 🔑 First, you need to add your authtoken
echo Go to: https://dashboard.ngrok.com/get-started/your-authtoken
echo Copy your authtoken and run: ngrok config add-authtoken YOUR_TOKEN_HERE
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
    echo Then run this script again
    pause
    exit /b 1
)

echo ✅ Backend is running on port 5000
echo.

echo 🚀 Starting ngrok tunnel...
echo You'll get a public URL like: https://abc123.ngrok-free.app
echo.
echo 📋 After ngrok starts:
echo 1. Copy the https URL from ngrok output
echo 2. Update .env: VITE_API_URL=https://your-ngrok-url.ngrok-free.app/api/v1
echo 3. Rebuild APK: npm run build && npx cap sync && cd android && .\gradlew assembleDebug
echo.

REM Start ngrok tunnel
ngrok http 5000
