@echo off
TITLE SHA256.US — Compliance Officer CMS Forense Digital CLI
cls
echo =======================================================
echo SHA256.US - Compliance Officer CMS Forense Digital CLI
echo =======================================================
echo.

where python >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    python cli.py %*
) else (
    where node >nul 2>nul
    if %ERRORLEVEL% EQU 0 (
        node scripts/cli.js %*
    ) else (
        echo [ERROR] No se encontro Python ni Node.js en el sistema.
        pause
    )
)
