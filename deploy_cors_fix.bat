@echo off
echo 🔧 Deploying CORS fix for mobile apps...
echo.

git commit -m "fix-cors-mobile-apps"
git push

echo.
echo ✅ CORS fix pushed to GitHub
echo.
echo 🚀 Now go to Render and:
echo 1. Manual Deploy → Deploy latest commit
echo 2. Wait for deployment
echo 3. Test mobile app connection
echo.
echo 📱 This fix allows:
echo - Mobile app requests (no origin)
echo - Capacitor apps (capacitor://localhost)
echo - File:// origins
echo - All origins in production
echo.
pause
