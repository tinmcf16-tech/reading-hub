@echo off
title Reading HUB - Grade 3 Online Learning Platform
echo ========================================================
echo   STARTING GRADE 3 ONLINE LEARNING HUB (Reading HUB)
echo   San Vicente Elementary School - Section Masinadyahon
echo ========================================================
echo.
cd /d "%~dp0"

echo [1/2] Checking backend server...
start /b node server/index.js

echo [2/2] Launching platform in default browser...
timeout /t 2 /nobreak >nul
start http://localhost:5000

echo.
echo ========================================================
echo   Platform is LIVE!
echo   Local Address:   http://localhost:5000
echo   Classroom Wi-Fi: http://172.16.0.10:5000
echo.
echo   Teacher Login:   teacher / teacher123
echo   Student Login:   juan.delacruz / student123
echo ========================================================
echo.
echo Leave this window open while using the application.
cmd /k
