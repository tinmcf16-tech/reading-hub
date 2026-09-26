@echo off
title Push Reading HUB to GitHub (tinmcf16-tech)
color 0b
echo ========================================================
echo        PUSHING READING HUB TO YOUR GITHUB ACCOUNT
echo              Repository: tinmcf16-tech/reading-hub
echo ========================================================
echo.
echo Connecting to GitHub repository...
"C:\Users\Admin\MinGit\cmd\git.exe" remote remove origin 2>nul
"C:\Users\Admin\MinGit\cmd\git.exe" remote add origin https://github.com/tinmcf16-tech/reading-hub.git

echo.
echo Uploading all learning files, activities, and database to GitHub...
echo (If prompted, please enter your GitHub username and password/token, or sign in)
echo.
"C:\Users\Admin\MinGit\cmd\git.exe" push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ========================================================
    echo   SUCCESS! Everything is now uploaded to GitHub!
    echo ========================================================
    echo.
    echo Render is now automatically building your live site!
    echo Check your live site in 1-2 minutes:
    echo   https://reading-hub-p5y0.onrender.com/
    echo.
) else (
    echo.
    echo ========================================================
    echo [NOTE ON GITHUB PASSWORD]
    echo GitHub requires a Personal Access Token instead of your regular password.
    echo.
    echo To get your quick token (1 minute):
    echo 1. Open: https://github.com/settings/tokens
    echo 2. Click "Generate new token (classic)"
    echo 3. Check the "repo" box and click "Generate token"
    echo 4. Copy the token and paste it here as your password!
    echo ========================================================
)

echo.
pause
