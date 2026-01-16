@echo off
echo Iniciando o servidor na porta 4003...
echo Pressione Ctrl+C para parar o servidor.
call npm run dev:4003
if %errorlevel% neq 0 (
    echo.
    echo Ocorreu um erro ao iniciar via npm. Tentando metodo alternativo direto...
    "C:\Program Files\nodejs\node.exe" "C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js" run dev -- -p 4003
)
pause
