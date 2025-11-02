@echo off
echo Starting Mobile Responsiveness Automation...

REM Clean up directory structure
echo Cleaning up directory structure...
if exist "js-challenge-lab" (
    echo Removing js-challenge-lab subdirectory...
    rmdir /s /q "js-challenge-lab" 2>nul
)

REM Check dependencies
echo Checking dependencies...
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
)

REM Build the project
echo Building mobile-optimized version...
npm run build

if %errorlevel% neq 0 (
    echo Build failed. Please check the console output.
    pause
    exit /b 1
)

REM Git operations
echo Committing changes...
git add .
git commit -m "feat: Add Google-level mobile responsiveness - Mobile-first design with touch-friendly UI - PWA-ready configuration - Optimized for mobile devices"

echo Pushing to GitHub...
git push origin main

if %errorlevel% neq 0 (
    echo Push failed. Please check your GitHub credentials.
    pause
    exit /b 1
)

echo.
echo Mobile responsiveness automation completed!
echo Your JS Learning Lab now has Google-level mobile responsiveness.
echo.
echo Site URL: https://syntaxsidekick.github.io/js-learning-lab
echo You can now go to bed! The deployment is automated.
echo.
echo Check deployment status at:
echo https://github.com/SyntaxSidekick/js-learning-lab/actions

REM Open the site
start https://syntaxsidekick.github.io/js-learning-lab

pause