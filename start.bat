@echo off
echo ========================================================
echo   Kloudspot Employee Management System (EMS)
echo ========================================================
echo.
echo Starting Spring Boot Backend with MySQL Database...
echo Web UI will be available at: http://localhost:8080
echo Swagger API Docs at:         http://localhost:8080/swagger-ui.html
echo Database:                    MySQL (localhost:3306 / ems_db)
echo.
echo Press Ctrl+C in this terminal to stop the application.
echo.

cd /d "%~dp0backend"
if exist "target\employee-management-system-1.0.0.jar" (
    java -jar target\employee-management-system-1.0.0.jar
) else (
    call mvnw.cmd spring-boot:run
)
pause
