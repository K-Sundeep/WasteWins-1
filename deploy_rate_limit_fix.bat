@echo off
echo 🔧 Deploying rate limiter fix...
echo.

echo 📝 Committing changes...
git add .
git commit -m "fix-rate-limiter"
git push

echo.
echo ✅ Changes pushed to GitHub
echo.
echo 🚀 Now go to Render and:
echo 1. Manual Deploy → Deploy latest commit
echo 2. Wait for deployment to complete
echo 3. Test API again
echo.
echo 📱 After deployment, your API will allow more requests for testing!
pause
