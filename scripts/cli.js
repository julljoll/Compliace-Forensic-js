#!/usr/bin/env node

/**
 * SHA256.US — Compliance Officer CMS Forense Digital
 * CLI de Lanzamiento y Gestión del Entorno (Node.js)
 */

const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const net = require('net');

const ROOT_DIR = path.resolve(__dirname, '..');
const PORT = 3000;
const LOCAL_URL = `http://localhost:${PORT}`;

// Colores ANSI oficial Cyber-Legal Blueprint
const VERDE = '\x1b[38;2;0;255;65m';      // #00FF41
const AMARILLO = '\x1b[38;2;254;207;6m';   // #FECF06
const LIMA = '\x1b[38;2;157;255;0m';      // #9DFF00
const ROJO = '\x1b[38;2;255;69;0m';
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const DIM = '\x1b[2m';

const BANNER = `
${AMARILLO}${BOLD}   _____ _    _   ___  _____  ______     _   _  _____ 
  / ____| |  | | / _ \\|  __ \\|  ____|   | | | |/ ____|
 | (___ | |__| || |_| | |__) | |__      | | | | (___  
  \\___ \\|  __  ||  _  |  ___/|  __|     | | | |\\___ \\ 
  ____) | |  | || | | | |    | |____ _| |_| |____) |
 |_____/|_|  |_||_| |_|_|    |______|\\___/\\___/_____/ 
${VERDE}       COMPLIANCE OFFICER CMS FORENSE DIGITAL v3.0.0
${LIMA}         [ Node.js Environment Launcher ]${RESET}
`;

function checkPort(port = PORT) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(400);
    socket.on('connect', () => {
      socket.destroy();
      resolve(true);
    });
    socket.on('timeout', () => {
      socket.destroy();
      resolve(false);
    });
    socket.on('error', () => {
      resolve(false);
    });
    socket.connect(port, '127.0.0.1');
  });
}

function openBrowser(url = LOCAL_URL) {
  const startCmd = process.platform === 'win32' ? `start "" "${url}"` :
                   process.platform === 'darwin' ? `open "${url}"` :
                   `xdg-open "${url}"`;
  exec(startCmd, (err) => {
    if (err) {
      console.log(`${ROJO}[!] No se pudo abrir el navegador automáticamente: ${err.message}${RESET}`);
    }
  });
}

async function waitAndOpenBrowser(url = LOCAL_URL, timeoutMs = 30000) {
  console.log(`${LIMA}[+] Esperando disponibilidad de servidor en ${url}...${RESET}`);
  const startTime = Date.now();
  while (Date.now() - startTime < timeoutMs) {
    const isUp = await checkPort(PORT);
    if (isUp) {
      console.log(`${VERDE}[✓] Servidor detectado en ${url}. Abriendo navegador...${RESET}\n`);
      setTimeout(() => openBrowser(url), 1000);
      return;
    }
    await new Promise((r) => setTimeout(r, 800));
  }
  console.log(`${AMARILLO}[!] El servidor no respondió a tiempo. Abre ${url} manualmente.${RESET}`);
}

async function checkEnvironment() {
  console.log(`\n${AMARILLO}${BOLD}=== DIAGNÓSTICO DEL ENTORNO FORENSE (NODE) ===${RESET}\n`);
  
  console.log(`${VERDE}[✓] Node.js:${RESET} ${process.version}`);
  
  const modulesExist = fs.existsSync(path.join(ROOT_DIR, 'node_modules'));
  if (modulesExist) {
    console.log(`${VERDE}[✓] Dependencias (node_modules):${RESET} Instaladas`);
  } else {
    console.log(`${AMARILLO}[!] Dependencias no instaladas. Ejecute 'npm install'${RESET}`);
  }

  const envPath = path.join(ROOT_DIR, '.env');
  const envExamplePath = path.join(ROOT_DIR, '.env.example');
  if (fs.existsSync(envPath)) {
    console.log(`${VERDE}[✓] Archivo .env:${RESET} Presente`);
  } else {
    console.log(`${AMARILLO}[!] Archivo .env no encontrado.${RESET}`);
    if (fs.existsSync(envExamplePath)) {
      try {
        fs.copyFileSync(envExamplePath, envPath);
        console.log(`${VERDE}[✓] Creado .env a partir de .env.example${RESET}`);
      } catch (err) {
        console.log(`${ROJO}[✗] Error copiando .env.example: ${err.message}${RESET}`);
      }
    }
  }

  const portActive = await checkPort(PORT);
  if (portActive) {
    console.log(`${AMARILLO}[!] Puerto ${PORT} actualmente en uso.${RESET}`);
  } else {
    console.log(`${VERDE}[✓] Puerto ${PORT}:${RESET} Disponible`);
  }

  console.log(`\n${LIMA}Directorio raíz:${RESET} ${ROOT_DIR}\n`);
}

function runNpmScript(scriptName, autoOpen = false) {
  console.log(`\n${VERDE}${BOLD}[▶] Ejecutando: npm run ${scriptName}...${RESET}`);
  console.log(`${DIM}Presiona Ctrl+C para detener el proceso.${RESET}\n`);

  if (autoOpen) {
    waitAndOpenBrowser();
  }

  const child = spawn('npm', ['run', scriptName], {
    cwd: ROOT_DIR,
    stdio: 'inherit',
    shell: true
  });

  child.on('error', (err) => {
    console.log(`\n${ROJO}[✗] Error ejecutando comando: ${err.message}${RESET}\n`);
  });

  child.on('exit', (code) => {
    if (code !== 0 && code !== null) {
      console.log(`\n${ROJO}[✗] El proceso finalizó con código ${code}${RESET}\n`);
    } else {
      console.log(`\n${VERDE}[✓] Proceso finalizado correctamente.${RESET}\n`);
    }
  });
}

function showInteractiveMenu() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const promptMenu = () => {
    console.log(`\n${AMARILLO}${BOLD}=== OPCIONES DISPONIBLES ==={RESET}`);
    console.log(` ${VERDE}1.${RESET} Iniciar Servidor Dev + Navegador ${DIM}(npm run dev)${RESET}`);
    console.log(` ${VERDE}2.${RESET} Diagnóstico de Entorno ${DIM}(check)${RESET}`);
    console.log(` ${VERDE}3.${RESET} Compilar Proyecto ${DIM}(npm run build)${RESET}`);
    console.log(` ${VERDE}4.${RESET} Iniciar Servidor Producción ${DIM}(npm run start)${RESET}`);
    console.log(` ${VERDE}5.${RESET} Verificar Código ${DIM}(npm run lint)${RESET}`);
    console.log(` ${VERDE}6.${RESET} Sincronizar Agentes ${DIM}(npm run update-agent)${RESET}`);
    console.log(` ${AMARILLO}0.${RESET} Salir`);

    rl.question(`\n${LIMA}Selecciona una opción [0-6]: ${RESET}`, async (answer) => {
      const choice = answer.trim().toLowerCase();
      if (choice === '1' || choice === 'dev') {
        rl.close();
        runNpmScript('dev', true);
      } else if (choice === '2' || choice === 'check') {
        await checkEnvironment();
        promptMenu();
      } else if (choice === '3' || choice === 'build') {
        rl.close();
        runNpmScript('build', false);
      } else if (choice === '4' || choice === 'start') {
        rl.close();
        runNpmScript('start', true);
      } else if (choice === '5' || choice === 'lint') {
        rl.close();
        runNpmScript('lint', false);
      } else if (choice === '6' || choice === 'agent') {
        rl.close();
        runNpmScript('update-agent', false);
      } else if (choice === '0' || choice === 'exit' || choice === 'salir') {
        console.log(`\n${VERDE}¡Hasta luego! Entorno finalizado.${RESET}\n`);
        rl.close();
        process.exit(0);
      } else {
        console.log(`${ROJO}Opción no válida. Intenta de nuevo.${RESET}`);
        promptMenu();
      }
    });
  };

  promptMenu();
}

async function main() {
  console.log(BANNER);
  const arg = process.argv[2] ? process.argv[2].toLowerCase() : null;

  if (arg === 'dev' || arg === '1') {
    runNpmScript('dev', true);
  } else if (arg === 'check' || arg === '2') {
    await checkEnvironment();
  } else if (arg === 'build' || arg === '3') {
    runNpmScript('build', false);
  } else if (arg === 'start' || arg === '4') {
    runNpmScript('start', true);
  } else if (arg === 'lint' || arg === '5') {
    runNpmScript('lint', false);
  } else if (arg === 'update-agent' || arg === 'agent' || arg === '6') {
    runNpmScript('update-agent', false);
  } else if (arg === '--help' || arg === '-h' || arg === 'help') {
    console.log(`${AMARILLO}Uso:${RESET} node scripts/cli.js [dev|check|build|start|lint|update-agent]`);
  } else if (arg) {
    console.log(`${ROJO}Comando desconocido: ${arg}${RESET}`);
    console.log(`${AMARILLO}Uso:${RESET} node scripts/cli.js [dev|check|build|start|lint|update-agent]`);
  } else {
    showInteractiveMenu();
  }
}

main();
