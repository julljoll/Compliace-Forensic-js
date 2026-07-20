@echo off
TITLE SHA256.US — LAB FORENSE CLI
cls

where node >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    node scripts/cli.js %*
    goto end
)

where python >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    python cli.py %*
    goto end
)

echo =======================================================
echo              SHA256.US — LAB FORENSE
echo        Compliance Officer CMS Forense Digital
echo =======================================================
echo.
echo [ERROR] No se encontro Node.js ni Python en esta computadora.
echo.
echo === REQUISITOS TECNOLOGICOS NECESARIOS PARA EJECUTAR EL PROYECTO ===
echo.
echo  1. Node.js (v18.0.0 o superior - Recomendado LTS 20+ o v26)
echo     Descarga oficial: https://nodejs.org/
echo.
echo  2. npm (Gestor de Paquetes - Incluido con Node.js)
echo.
echo  3. Base de Datos SQLite Local (Incluida automaticamente via @libsql/client)
echo.
echo  4. Navegador Web Moderno (Google Chrome, Microsoft Edge, Brave)
echo     Para visualizacion CMS, PWA e impresion de planillas Oficio (216x330mm)
echo.
echo Instrucciones de instalacion inicial en una computadora nueva:
echo   1. Instala Node.js desde https://nodejs.org/
echo   2. Abre la terminal en la carpeta del proyecto
echo   3. Ejecuta: npm install
echo   4. Ejecuta: npm run dev  (o ejecuta cli.bat nuevamente)
echo.
pause

:end
