@echo off
echo ========================================================
echo   Kloudspot Employee Management System (EMS)
echo ========================================================
echo.
echo Starting Spring Boot Backend and Integrated Web UI...
echo Web UI will be available at: http://localhost:8080
echo Swagger API Docs at:         http://localhost:8080/swagger-ui.html
echo H2 In-Memory Console at:     http://localhost:8080/h2-console
echo.
echo Press Ctrl+C in this terminal to stop the application.
echo.

cd /d "%~dp0backend"
if exist "target\employee-management-system-1.0.0.jar" (
    java -jar target\employee-management-system-1.0.0.jar
) else (
    mvn spring-boot:run
)
pause
