@echo off
echo 🚀 Auto-starting WasteWins development environment...
echo.

REM Create new terminal windows for each service
echo 📊 Starting PostgreSQL database...
start "PostgreSQL" cmd /k "echo PostgreSQL should be running as a service"

echo.
echo 🖥️ Starting backend server...
start "Backend Server" cmd /k "cd /d %~dp0backend && npm run dev"

echo.
echo 🌐 Starting ngrok tunnel...
timeout /t 5 /nobreak > nul
start "ngrok Tunnel" cmd /k "cd /d %~dp0 && ngrok http 5000"

echo.
echo ✅ All services starting...
echo.
echo 📋 Services running in separate windows:
echo - Backend Server (localhost:5000)
echo - ngrok Tunnel (public URL)
echo - PostgreSQL Database
echo.
echo 🔍 Check ngrok window for public URL
echo 📱 Use that URL in your mobile app
echo.
echo ⚠️ Keep all windows open while using mobile app
echo.
pause
