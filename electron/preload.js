const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Autenticación
  auth: {
    login: (credentials) => ipcRenderer.invoke('auth:login', credentials),
    validate: (token) => ipcRenderer.invoke('auth:validate', token),
    logout: (token) => ipcRenderer.invoke('auth:logout', token),
    changePassword: (userId, newPassword) => ipcRenderer.invoke('auth:changePassword', { userId, newPassword }),
  },

  // Andriller
  andriller: {
    start: (config) => ipcRenderer.invoke('andriller:start', config),
    cancel: () => ipcRenderer.invoke('andriller:cancel'),
    onOutput: (cb) => ipcRenderer.on('andriller:output', (_, data) => cb(data)),
    onError: (cb) => ipcRenderer.on('andriller:error', (_, data) => cb(data)),
  },

  // ALEAPP
  aleapp: {
    start: (config) => ipcRenderer.invoke('aleapp:start', config),
    cancel: () => ipcRenderer.invoke('aleapp:cancel'),
    onOutput: (cb) => ipcRenderer.on('aleapp:output', (_, data) => cb(data)),
    onError: (cb) => ipcRenderer.on('aleapp:error', (_, data) => cb(data)),
  },

  // Diálogos
  dialog: {
    selectFolder: () => ipcRenderer.invoke('dialog:selectFolder'),
    selectFile: (filters) => ipcRenderer.invoke('dialog:selectFile', filters),
  },

  // Archivos
  file: {
    writeJson: (filePath, data) => ipcRenderer.invoke('file:writeJson', filePath, data),
    readJson: (filePath) => ipcRenderer.invoke('file:readJson', filePath),
  },

  // Hash
  hash: {
    calculate: (filePath, algorithm) => ipcRenderer.invoke('hash:calculate', filePath, algorithm),
  },

  // Database
  db: {
    getCasos: (userId) => ipcRenderer.invoke('db:getCasos', userId),
    addCaso: (caso) => ipcRenderer.invoke('db:addCaso', caso),
    saveState: (userId, state) => ipcRenderer.invoke('db:saveState', userId, state),
    loadState: (userId) => ipcRenderer.invoke('db:loadState', userId),
  },

  // Platform
  platform: process.platform,
});
