@echo off
echo ========================================================
echo       Starting RentWise Full-Stack Application
echo ========================================================
echo.

echo [1/2] Launching Spring Boot Backend (Port 8080)...
start "RentWise Backend (Spring Boot :8080)" cmd /k "cd /d %~dp0Backend && mvn spring-boot:run"

timeout /t 5 /nobreak >nul

echo [2/2] Launching Angular Frontend (Port 4200)...
start "RentWise Frontend (Angular :4200)" cmd /k "cd /d %~dp0Frontend && npm run start"

echo.
echo ========================================================
echo Servers are launching:
echo - Frontend App:    http://localhost:4200
echo - Backend API:     http://localhost:8080/api/v1
echo - Swagger UI Docs: http://localhost:8080/swagger-ui/index.html
echo - H2 DB Console:   http://localhost:8080/h2-console
echo ========================================================
echo.
pause
