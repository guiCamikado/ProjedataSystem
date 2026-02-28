@echo off
setlocal

set "SCRIPT_DIR=%~dp0"

:: Back-end (Maven)
start "Back-end" cmd /k "cd /d "%SCRIPT_DIR%back-end\demo" && mvn spring-boot:run"

:: Front-end (npm)
start "Front-end" cmd /k "cd /d "%SCRIPT_DIR%front-end" && npm i && npm run dev"

:: Aguarda alguns segundos para os serviços iniciarem (opcional)
timeout /t 5 /nobreak >nul

:: Abre o navegador
start http://localhost:5173

endlocal