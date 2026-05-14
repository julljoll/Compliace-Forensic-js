/**
 * SHA256.US — Peritaje Privado WhatsApp
 * Electron Main Process
 * Enfoque: Civil / Mercantil / Informática — Contratos Digitales
 */
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');
const crypto = require('crypto');
const { initDatabase, authenticateUser, validateSession, logout, getDb } = require('./database');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 680,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, '../public/icon.png'),
    titleBarStyle: 'default',
    title: 'SHA256.US — Peritaje Digital WhatsApp'
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => { mainWindow = null; });
}

app.whenReady().then(() => {
  // Inicializar DB con ruta de datos del usuario
  initDatabase(app.getPath('userData'));
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// ============================================
// IPC — Autenticación
// ============================================

ipcMain.handle('auth:login', async (event, { username, password }) => {
  const result = authenticateUser(username, password);
  if (result) return { success: true, user: result };
  return { success: false, message: 'Usuario o contraseña incorrectos' };
});

ipcMain.handle('auth:validate', async (event, token) => {
  const user = validateSession(token);
  if (user) return { success: true, user };
  return { success: false };
});

ipcMain.handle('auth:logout', async (event, token) => {
  logout(token);
  return { success: true };
});

// ============================================
// IPC — Andriller (Extracción forense Android)
// ============================================

ipcMain.handle('andriller:start', async (event, config) => {
  const { outputPath, extractionType = 'logica', deviceId } = config;
  return new Promise((resolve, reject) => {
    const args = ['--output', outputPath, '--mode', extractionType, '--readonly'];
    if (deviceId) args.push('--device', deviceId);
    const proc = spawn('andriller', args);
    let output = '', errorOutput = '';
    proc.stdout.on('data', d => { output += d.toString(); mainWindow?.webContents.send('andriller:output', d.toString()); });
    proc.stderr.on('data', d => { errorOutput += d.toString(); mainWindow?.webContents.send('andriller:error', d.toString()); });
    proc.on('close', code => resolve({ success: code === 0, exitCode: code, output, error: errorOutput }));
    proc.on('error', err => reject(err));
    if (mainWindow) mainWindow.andrillerProcess = proc;
  });
});

ipcMain.handle('andriller:cancel', async () => {
  if (mainWindow?.andrillerProcess) { mainWindow.andrillerProcess.kill(); mainWindow.andrillerProcess = null; return { success: true }; }
  return { success: false, message: 'No hay proceso activo' };
});

// ============================================
// IPC — ALEAPP (Análisis WhatsApp)
// ============================================

ipcMain.handle('aleapp:start', async (event, config) => {
  const { imagePath, outputPath, analysisType = 'whatsapp' } = config;
  return new Promise((resolve, reject) => {
    const args = ['-i', imagePath, '-o', outputPath, '-t', 'fs'];
    if (analysisType === 'whatsapp') args.push('--filter', 'whatsapp');
    else if (analysisType === 'timeline') args.push('--timeline', '1');
    const proc = spawn('aleapp', args);
    let output = '', errorOutput = '';
    proc.stdout.on('data', d => { output += d.toString(); mainWindow?.webContents.send('aleapp:output', d.toString()); });
    proc.stderr.on('data', d => { errorOutput += d.toString(); mainWindow?.webContents.send('aleapp:error', d.toString()); });
    proc.on('close', code => resolve({ success: code === 0, exitCode: code, output, error: errorOutput }));
    proc.on('error', err => reject(err));
    if (mainWindow) mainWindow.aleappProcess = proc;
  });
});

ipcMain.handle('aleapp:cancel', async () => {
  if (mainWindow?.aleappProcess) { mainWindow.aleappProcess.kill(); mainWindow.aleappProcess = null; return { success: true }; }
  return { success: false, message: 'No hay proceso activo' };
});

// ============================================
// IPC — Sistema de Archivos
// ============================================

ipcMain.handle('dialog:selectFolder', async () => {
  return dialog.showOpenDialog(mainWindow, { properties: ['openDirectory'] });
});

ipcMain.handle('dialog:selectFile', async (event, filters) => {
  return dialog.showOpenDialog(mainWindow, { properties: ['openFile'], filters: filters || [] });
});

ipcMain.handle('file:writeJson', async (event, filePath, data) => {
  try { fs.writeFileSync(filePath, JSON.stringify(data, null, 2)); return { success: true }; }
  catch (error) { return { success: false, error: error.message }; }
});

ipcMain.handle('file:readJson', async (event, filePath) => {
  try { const content = fs.readFileSync(filePath, 'utf-8'); return { success: true, data: JSON.parse(content) }; }
  catch (error) { return { success: false, error: error.message }; }
});

// ============================================
// IPC — Hash Calculation
// ============================================

ipcMain.handle('hash:calculate', async (event, filePath, algorithm = 'sha256') => {
  return new Promise((resolve) => {
    const hash = crypto.createHash(algorithm);
    const stream = fs.createReadStream(filePath);
    stream.on('data', d => hash.update(d));
    stream.on('end', () => resolve({ success: true, hash: hash.digest('hex'), algorithm }));
    stream.on('error', err => resolve({ success: false, error: err.message }));
  });
});

// ============================================
// IPC — Database queries (casos)
// ============================================

ipcMain.handle('db:getCasos', async (event, userId) => {
  const db = getDb();
  if (!db) return [];
  return db.prepare('SELECT * FROM casos WHERE user_id = ? ORDER BY updated_at DESC').all(userId);
});

ipcMain.handle('db:addCaso', async (event, caso) => {
  const db = getDb();
  if (!db) return { success: false };
  try {
    const result = db.prepare(
      `INSERT INTO casos (numero_caso, titulo, descripcion, estado, tipo, solicitante_nombre, solicitante_ci,
       dispositivo_marca, dispositivo_modelo, dispositivo_imei, user_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(caso.numero_caso, caso.titulo, caso.descripcion || '', caso.estado || 'iniciado',
      caso.tipo || 'whatsapp', caso.solicitante_nombre || '', caso.solicitante_ci || '',
      caso.dispositivo_marca || '', caso.dispositivo_modelo || '', caso.dispositivo_imei || '', caso.user_id);
    return { success: true, id: result.lastInsertRowid };
  } catch (e) { return { success: false, error: e.message }; }
});
