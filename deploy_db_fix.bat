@echo off
echo 🗄️ Deploying database initialization fix...
echo.

git commit -m "add-database-init"
git push

echo.
echo ✅ Database fix pushed to GitHub
echo.
echo 🚀 Now go to Render and:
echo 1. Manual Deploy → Deploy latest commit
echo 2. Wait for deployment
echo 3. Check logs for "Database tables initialized"
echo.
echo 📱 After deployment, test your mobile app!
pause
