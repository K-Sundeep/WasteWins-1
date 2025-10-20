@echo off
echo 📥 Downloading ngrok...
echo.

echo Please follow these steps:
echo.
echo 1. Open your browser and go to: https://ngrok.com/download
echo 2. Click "Windows (64-bit)" to download ngrok-v3-stable-windows-amd64.zip
echo 3. Extract the zip file
echo 4. Copy ngrok.exe to this folder: %CD%
echo 5. Run this script again to verify
echo.

if exist "ngrok.exe" (
    echo ✅ Found ngrok.exe!
    echo.
    echo 🔑 Now get your authtoken:
    echo 1. Go to: https://dashboard.ngrok.com/get-started/your-authtoken
    echo 2. Copy your authtoken
    echo 3. Run: ngrok.exe config add-authtoken YOUR_TOKEN_HERE
    echo 4. Start tunnel: ngrok.exe http 5000
    echo.
    pause
) else (
    echo ❌ ngrok.exe not found yet
    echo Please download and extract it first
    echo.
    pause
    start https://ngrok.com/download
)
