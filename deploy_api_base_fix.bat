@echo off
echo 🔧 Deploying API base route fix...
echo.

git commit -m "add-api-base-route"
git push

echo.
echo ✅ API base route fix pushed to GitHub
echo.
echo 🚀 Now go to Render and:
echo 1. Manual Deploy → Deploy latest commit
echo 2. Wait for deployment
echo.
echo 📊 After deployment, test:
echo https://wastewins-1.onrender.com/api/v1
echo.
echo Should show API information with all endpoints!
pause
