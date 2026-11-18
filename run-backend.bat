@echo off
echo Starting RentWise Spring Boot Backend on Port 8080...
cd /d %~dp0Backend
mvn spring-boot:run
pause
