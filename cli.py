#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
SHA256.US — Compliance Officer CMS Forense Digital
CLI de Lanzamiento y Gestión del Entorno
"""

import os
import sys
import time
import subprocess
import webbrowser
import threading
import socket
from pathlib import Path

# Activar soporte de colores ANSI y UTF-8 en terminales de Windows
if sys.platform == "win32":
    os.system("color")
    if hasattr(sys.stdout, "reconfigure"):
        try:
            sys.stdout.reconfigure(encoding="utf-8")
        except Exception:
            pass
    if hasattr(sys.stderr, "reconfigure"):
        try:
            sys.stderr.reconfigure(encoding="utf-8")
        except Exception:
            pass

# Iconos seguros
OK_ICON = "[OK]" if sys.platform == "win32" and getattr(sys.stdout, "encoding", "").lower() not in ["utf-8", "utf8"] else "[✓]"
ERR_ICON = "[X]" if sys.platform == "win32" and getattr(sys.stdout, "encoding", "").lower() not in ["utf-8", "utf8"] else "[✗]"
WARN_ICON = "[!]"

# Estilos de consola y paleta de colores oficial (Cyber-Legal Blueprint)
VERDE = "\033[38;2;0;255;65m"      # #00FF41 - Verde Terminal
AMARILLO = "\033[38;2;254;207;6m"   # #FECF06 - Amarillo Oro
LIMA = "\033[38;2;157;255;0m"      # #9DFF00 - Lima/Chartreuse Neón
ROJO = "\033[38;2;255;69;0m"       # Alertas de error
RESET = "\033[0m"
BOLD = "\033[1m"
DIM = "\033[2m"

ROOT_DIR = Path(__file__).parent.resolve()
DEFAULT_PORT = 3000
LOCAL_URL = f"http://localhost:{DEFAULT_PORT}"
NPM_CMD = "npm.cmd" if sys.platform == "win32" else "npm"

BANNER = f"""{AMARILLO}{BOLD}
   _____ _    _   ___  _____  ______     _   _  _____ 
  / ____| |  | | / _ \\|  __ \\|  ____|   | | | |/ ____|
 | (___ | |__| || |_| | |__) | |__      | | | | (___  
  \\___ \\|  __  ||  _  |  ___/|  __|     | | | |\\___ \\ 
  ____) | |  | || | | | |    | |____ _| |_| |____) |
 |_____/|_|  |_||_| |_|_|    |______|\\___/\\___/_____/ 
{VERDE}       COMPLIANCE OFFICER CMS FORENSE DIGITAL v3.0.0
{LIMA}         [ Laboratorio de Informática Forense ]{RESET}
"""

def print_banner():
    """Muestra el banner principal en la consola."""
    print(BANNER)

def check_port(host="127.0.0.1", port=DEFAULT_PORT):
    """Verifica si un puerto específico está ocupado."""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.settimeout(0.5)
        return s.connect_ex((host, port)) == 0

def wait_and_open_browser(url=LOCAL_URL, timeout=30):
    """Espera a que el servidor web responda y abre el navegador automáticamente."""
    print(f"{LIMA}[+] Esperando disponibilidad de servidor en {url}...{RESET}")
    start_time = time.time()
    while time.time() - start_time < timeout:
        if check_port(port=DEFAULT_PORT):
            time.sleep(1.2)  # Pequeña pausa para asegurar renderizado inicial
            print(f"{VERDE}{OK_ICON} Servidor activo en {url}. Abriendo navegador...{RESET}\n")
            try:
                webbrowser.open(url)
            except Exception as e:
                print(f"{ROJO}[!] No se pudo abrir el navegador automáticamente: {e}{RESET}")
            return
        time.sleep(0.8)
    print(f"{AMARILLO}[!] El servidor no respondió a tiempo en {url}. Abre el navegador manualmente.{RESET}")

def check_environment():
    """Diagnóstico completo del entorno de desarrollo."""
    print(f"\n{AMARILLO}{BOLD}=== DIAGNÓSTICO DEL ENTORNO FORENSE ==={RESET}\n")
    
    # 1. Node.js
    try:
        res_node = subprocess.run(["node", "-v"], capture_output=True, text=True, check=True)
        print(f"{VERDE}{OK_ICON} Node.js detectado:{RESET} {res_node.stdout.strip()}")
    except Exception:
        print(f"{ROJO}{ERR_ICON} Node.js no encontrado. Por favor instale Node.js 18+{RESET}")

    # 2. npm
    try:
        res_npm = subprocess.run([NPM_CMD, "-v"], capture_output=True, text=True, check=True)
        print(f"{VERDE}{OK_ICON} npm detectado:{RESET} v{res_npm.stdout.strip()}")
    except Exception:
        print(f"{ROJO}{ERR_ICON} npm no encontrado.{RESET}")

    # 3. node_modules
    modules_dir = ROOT_DIR / "node_modules"
    if modules_dir.exists() and modules_dir.is_dir():
        print(f"{VERDE}{OK_ICON} Dependencias (node_modules):{RESET} Instaladas")
    else:
        print(f"{AMARILLO}[!] Dependencias no instaladas. Ejecute 'npm install'{RESET}")

    # 4. .env
    env_file = ROOT_DIR / ".env"
    env_example = ROOT_DIR / ".env.example"
    if env_file.exists():
        print(f"{VERDE}{OK_ICON} Archivo de entorno (.env):{RESET} Presente")
    else:
        print(f"{AMARILLO}[!] Archivo .env no encontrado.{RESET}")
        if env_example.exists():
            try:
                env_file.write_bytes(env_example.read_bytes())
                print(f"{VERDE}{OK_ICON} Creado .env a partir de .env.example{RESET}")
            except Exception as e:
                print(f"{ROJO}{ERR_ICON} Error al copiar .env.example: {e}{RESET}")

    # 5. Estado del Puerto 3000
    if check_port():
        print(f"{AMARILLO}[!] Puerto {DEFAULT_PORT} actualmente en uso.{RESET}")
    else:
        print(f"{VERDE}{OK_ICON} Puerto {DEFAULT_PORT}:{RESET} Disponible")

    print(f"\n{LIMA}Ubicación de trabajo:{RESET} {ROOT_DIR}\n")

def ensure_dependencies():
    """Asegura que node_modules exista antes de arrancar."""
    modules_dir = ROOT_DIR / "node_modules"
    if not modules_dir.exists():
        print(f"\n{AMARILLO}[!] node_modules no encontrado. Instalando dependencias necesarias...{RESET}\n")
        try:
            subprocess.run([NPM_CMD, "install"], cwd=ROOT_DIR, check=True)
            print(f"{VERDE}{OK_ICON} Dependencias instaladas exitosamente.{RESET}\n")
        except subprocess.CalledProcessError as e:
            print(f"{ROJO}{ERR_ICON} Error durante npm install: {e}{RESET}")
            sys.exit(1)

def run_dev(open_browser=True):
    """Inicia el servidor Next.js en modo desarrollo."""
    ensure_dependencies()
    print(f"\n{VERDE}{BOLD}[▶] Iniciando Servidor de Desarrollo (Next.js 16 + React 19)...{RESET}")
    print(f"{DIM}Presiona Ctrl+C para detener el servidor.{RESET}\n")

    if open_browser:
        t = threading.Thread(target=wait_and_open_browser, daemon=True)
        t.start()

    try:
        subprocess.run([NPM_CMD, "run", "dev"], cwd=ROOT_DIR, check=True)
    except KeyboardInterrupt:
        print(f"\n{AMARILLO}[!] Servidor detenido por el usuario.{RESET}\n")
    except subprocess.CalledProcessError as e:
        print(f"\n{ROJO}{ERR_ICON} El servidor falló con código {e.returncode}{RESET}\n")

def run_build():
    """Ejecuta el proceso de build."""
    ensure_dependencies()
    print(f"\n{AMARILLO}{BOLD}[🛠] Compilando CMS Forense para Producción...{RESET}\n")
    try:
        subprocess.run([NPM_CMD, "run", "build"], cwd=ROOT_DIR, check=True)
        print(f"\n{VERDE}{OK_ICON} Build completado con éxito.{RESET}\n")
    except subprocess.CalledProcessError as e:
        print(f"\n{ROJO}{ERR_ICON} Error durante la compilación: {e}{RESET}\n")

def run_start(open_browser=True):
    """Inicia el servidor de producción."""
    ensure_dependencies()
    print(f"\n{VERDE}{BOLD}[▶] Iniciando Servidor de Producción...{RESET}")
    print(f"{DIM}Presiona Ctrl+C para detener el servidor.{RESET}\n")

    if open_browser:
        t = threading.Thread(target=wait_and_open_browser, daemon=True)
        t.start()

    try:
        subprocess.run([NPM_CMD, "run", "start"], cwd=ROOT_DIR, check=True)
    except KeyboardInterrupt:
        print(f"\n{AMARILLO}[!] Servidor detenido por el usuario.{RESET}\n")
    except subprocess.CalledProcessError as e:
        print(f"\n{ROJO}{ERR_ICON} Error en servidor de producción: {e}{RESET}\n")

def run_lint():
    """Ejecuta el linter de Next.js."""
    print(f"\n{AMARILLO}{BOLD}[🔍] Ejecutando análisis estático (Linting)...{RESET}\n")
    try:
        subprocess.run([NPM_CMD, "run", "lint"], cwd=ROOT_DIR, check=True)
        print(f"\n{VERDE}{OK_ICON} Código validado sin errores de sintaxis.{RESET}\n")
    except subprocess.CalledProcessError:
        print(f"\n{ROJO}{ERR_ICON} Se encontraron observaciones durante el linting.{RESET}\n")

def run_update_agent():
    """Actualiza las instrucciones y metadatos de los agentes."""
    print(f"\n{AMARILLO}{BOLD}[🤖] Sincronizando Metadatos de Agentes Periciales...{RESET}\n")
    try:
        subprocess.run([NPM_CMD, "run", "update-agent"], cwd=ROOT_DIR, check=True)
        print(f"\n{VERDE}{OK_ICON} Agentes sincronizados correctamente.{RESET}\n")
    except subprocess.CalledProcessError as e:
        print(f"\n{ROJO}{ERR_ICON} Error actualizando agentes: {e}{RESET}\n")

def interactive_menu():
    """Menú interactivo de opciones."""
    while True:
        print(f"\n{AMARILLO}{BOLD}=== OPCIONES DISPONIBLES ==={RESET}")
        print(f" {VERDE}1.{RESET} Iniciar Servidor Dev + Navegador {DIM}(npm run dev){RESET}")
        print(f" {VERDE}2.{RESET} Diagnóstico de Entorno {DIM}(verificar Node/modules/.env){RESET}")
        print(f" {VERDE}3.{RESET} Compilar Proyecto {DIM}(npm run build){RESET}")
        print(f" {VERDE}4.{RESET} Iniciar Servidor Producción {DIM}(npm run start){RESET}")
        print(f" {VERDE}5.{RESET} Verificar Código {DIM}(npm run lint){RESET}")
        print(f" {VERDE}6.{RESET} Sincronizar Agentes {DIM}(npm run update-agent){RESET}")
        print(f" {AMARILLO}0.{RESET} Salir")

        try:
            choice = input(f"\n{LIMA}Selecciona una opción [0-6]: {RESET}").strip()
            if choice == "1" or choice.lower() == "dev":
                run_dev(open_browser=True)
            elif choice == "2" or choice.lower() == "check":
                check_environment()
            elif choice == "3" or choice.lower() == "build":
                run_build()
            elif choice == "4" or choice.lower() == "start":
                run_start(open_browser=True)
            elif choice == "5" or choice.lower() == "lint":
                run_lint()
            elif choice == "6" or choice.lower() == "agent":
                run_update_agent()
            elif choice == "0" or choice.lower() in ["exit", "q", "salir"]:
                print(f"\n{VERDE}¡Hasta luego! Entorno finalizado.{RESET}\n")
                break
            else:
                print(f"{ROJO}Opción no válida. Intenta de nuevo.{RESET}")
        except (KeyboardInterrupt, EOFError):
            print(f"\n\n{VERDE}¡Hasta luego! Entorno finalizado.{RESET}\n")
            break

def main():
    print_banner()
    if len(sys.argv) > 1:
        arg = sys.argv[1].lower()
        if arg in ["dev", "start-dev", "1"]:
            run_dev(open_browser=True)
        elif arg in ["check", "status", "2"]:
            check_environment()
        elif arg in ["build", "compile", "3"]:
            run_build()
        elif arg in ["start", "prod", "4"]:
            run_start(open_browser=True)
        elif arg in ["lint", "5"]:
            run_lint()
        elif arg in ["update-agent", "agent", "6"]:
            run_update_agent()
        elif arg in ["--help", "-h", "help"]:
            print(f"{AMARILLO}Uso:{RESET} python cli.py [dev|check|build|start|lint|update-agent]")
        else:
            print(f"{ROJO}Comando desconocido: {arg}{RESET}")
            print(f"{AMARILLO}Uso:{RESET} python cli.py [dev|check|build|start|lint|update-agent]")
    else:
        interactive_menu()

if __name__ == "__main__":
    main()
