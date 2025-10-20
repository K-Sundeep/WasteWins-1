@echo off
echo 🗺️ Deploying location APIs fix...
echo.

git commit -m "add-location-apis"
git push

echo.
echo ✅ Location APIs pushed to GitHub
echo.
echo 🚀 Now go to Render and:
echo 1. Manual Deploy → Deploy latest commit
echo 2. Wait for deployment
echo.
echo 🎯 This adds backend APIs for:
echo - Distance calculation (replaces OSRM)
echo - Pickup site locations (replaces Overpass API)
echo - Address geocoding (replaces Nominatim)
echo.
echo 📱 After deployment, rebuild mobile app:
echo npm run build
echo npx cap sync  
echo cd android && .\gradlew assembleDebug
echo.
pause
