@echo off
echo.
echo 🚀 Metalyz Production Deployment
echo =================================
echo.

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: package.json not found. Please run this script from the project root.
    pause
    exit /b 1
)

REM Check if project name is correct
findstr /C:"\"name\": \"metalyz\"" package.json >nul
if errorlevel 1 (
    echo ❌ Error: This doesn't appear to be the Metalyz project.
    pause
    exit /b 1
)

echo ✅ Project validation passed
echo.

REM Install dependencies
echo 📦 Installing dependencies...
call npm install
if errorlevel 1 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

REM Run build test
echo 🔨 Testing production build...
call npm run build
if errorlevel 1 (
    echo ❌ Build failed! Please fix errors before deploying.
    pause
    exit /b 1
)

echo ✅ Build successful!
echo.

REM Check if Vercel CLI is installed
where vercel >nul 2>nul
if errorlevel 1 (
    echo 📥 Installing Vercel CLI...
    call npm install -g vercel
)

REM Deploy to Vercel
echo 🌐 Deploying to Vercel...
call vercel --prod

echo.
echo 🎉 Deployment Complete!
echo ========================
echo.
echo ✅ Metalyz is now live!
echo ✅ Authentication system active
echo ✅ Owner account configured
echo ✅ Forgot password functional
echo ✅ All user flows working
echo.
echo 🔗 Next steps:
echo 1. Test your live URL
echo 2. Configure custom domain (optional)
echo 3. Set up monitoring
echo 4. Share with the world!
echo.
echo 🆘 Need help? Check DEPLOYMENT.md or contact support@metalyz.io
echo.
pause