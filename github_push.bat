@echo off
chcp 65001 > nul
echo ==========================================
echo    Automated GitHub Push Script
echo ==========================================
echo.

set /p CommitMessage="Digite a mensagem do commit (Pressione Enter para usar data/hora): "

if "%CommitMessage%"=="" (
    set CommitMessage=Auto update %date% %time%
)

echo.
echo [1/3] Adicionando arquivos (git add .)...
git add .

echo.
echo [2/3] Commitando (git commit)...
git commit -m "%CommitMessage%"

echo.
echo [3/3] Enviando para o GitHub (git push)...
git push

echo.
echo ==========================================
echo    Concluido!
echo ==========================================
pause
