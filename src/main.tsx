import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { ToastProvider } from './components/atoms/Toast';
import {
  initDatabase,
  getCasosDB,
  addCasoDB,
  updateCasoDB,
  deleteCasoDB,
  getAuditLogsDB,
  addAuditLogDB
} from './db/neonClient';

// Inicializar la base de datos de Neon Serverless
initDatabase().catch(err => console.error('Error al inicializar la base de datos Neon:', err));

// Declaración de tipos para el modo PWA
declare global {
  interface Window {
    electronAPI: {
      dialog: {
        selectFile: (filters?: any) => Promise<any>;
      };
      file: {
        writeJson: (filePath: string, data: any) => Promise<any>;
        readJson: (filePath: string) => Promise<any>;
      };
      hash: {
        calculate: (filePath: string, algorithm?: string) => Promise<any>;
      };
      db: {
        getCasos: (userId: number) => Promise<any>;
        addCaso: (caso: any) => Promise<any>;
        updateCaso: (id: string, data: any) => Promise<boolean>;
        deleteCaso: (id: string) => Promise<boolean>;
        saveState: (userId: number, state: string) => Promise<any>;
        loadState: (userId: number) => Promise<any>;
        getUsers: () => Promise<any>;
        addUser: (userIdMaker: number, user: any) => Promise<any>;
        updateUser: (userIdMaker: number, userId: number, data: any) => Promise<any>;
        getAuditLogs: () => Promise<any>;
        addAuditLog: (log: any) => Promise<boolean>;
      };
      auth: {
        login: (credentials: any) => Promise<any>;
        validate: (token: string) => Promise<any>;
        logout: (token: string) => Promise<any>;
        changePassword: (userId: number, newPassword: string) => Promise<any>;
      };
      platform: string;
      operationMode: 'production' | 'simulation';
    };
  }
}

// ─── WEB BROWSER PWA API LAYER ───────────────────────────────────────────────
async function sha256Local(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const buffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

if (typeof window !== 'undefined' && !window.electronAPI) {
  const getStorage = <T,>(key: string, defaultValue: T): T => {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : defaultValue;
  };
  const setStorage = <T,>(key: string, value: T): void => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  // ── Migración de datos entre versiones ──
  const DATA_VERSION = 3;
  const storedVersion = getStorage<number>('sha256_data_version', 0);
  if (storedVersion < DATA_VERSION) {
    // De v1 a v2: reset completo (destructivo)
    if (storedVersion < 2) {
      const keysToRemove = [
        'sha256_pwa_casos', 'sha256_pwa_audit_logs', 'sha256_pwa_state_1',
        'sha256_completed_steps', 'sha256_completed_steps_metadata',
        'cms-neon-storage', 'sha256-auth', 'sha256-forense-storage'
      ];
      keysToRemove.forEach(k => localStorage.removeItem(k));
      try {
        const req = indexedDB.deleteDatabase('sha256_forense');
        req.onsuccess = () => console.log('IndexedDB limpiada');
        req.onerror = () => console.warn('No se pudo limpiar IndexedDB');
      } catch {}
    }
    // De v2 a v3: la migración de completed_steps → steps se hace en cmsStore.migrateStepsData()
    // No destructivo — preserva datos existentes
    
    setStorage('sha256_data_version', DATA_VERSION);
  }

  async function seedInitialUsers() {
    const existing = getStorage<any[]>('sha256_pwa_users', []);
    if (existing.length > 0) return;
    const adminHash = await sha256Local('admin');
    const users = [
      { id: 1, username: 'admin', nombre: 'Administrador', apellido: 'Local', rol: 'perito_lider', cargo: 'Superusuario', email: 'admin@sha256.us', activo: 1, ranking: 5, profile_image: '', password_hash: adminHash, _created: true, created_at: new Date().toISOString() }
    ];
    setStorage('sha256_pwa_users', users);
  }

  seedInitialUsers();

  const selectedFilesMap = new Map<string, File>();

  window.electronAPI = {
    platform: 'browser',
    operationMode: 'production',
    dialog: {
      selectFile: async (filters) => {
        return new Promise((resolve) => {
          const input = document.createElement('input');
          input.type = 'file';
          if (filters && filters.length > 0) {
            const extensions = filters.map((f: any) => f.extensions.map((ext: string) => `.${ext}`).join(',')).join(',');
            input.accept = extensions;
          }
          input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
              selectedFilesMap.set(file.name, file);
              resolve({ canceled: false, filePaths: [file.name] });
            } else {
              resolve({ canceled: true, filePaths: [] });
            }
          };
          input.click();
        });
      }
    },
    file: {
      writeJson: async (filePath, data) => {
        setStorage(`sha256_file_${filePath}`, data);
        return { success: true };
      },
      readJson: async (filePath) => {
        const data = localStorage.getItem(`sha256_file_${filePath}`);
        if (data) {
          return { success: true, data: JSON.parse(data) };
        }
        return { success: false, error: 'Archivo no encontrado en local storage' };
      }
    },
    hash: {
      calculate: async (filePath, algorithm = 'sha256') => {
        const file = selectedFilesMap.get(filePath);
        if (file) {
          try {
            const buffer = await file.arrayBuffer();
            const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            return { success: true, hash: hashHex, algorithm, verified: true };
          } catch (e) {
            console.error('Error calculando hash nativo:', e);
            return { success: false, hash: '', algorithm, verified: false, error: 'Error al calcular hash con Web Crypto' };
          }
        }
        return { success: false, hash: '', algorithm, verified: false, error: 'Archivo no disponible para cálculo de hash.' };
      }
    },
    db: {
      getCasos: async (userId: number) => {
        return getCasosDB(userId);
      },
      addCaso: async (caso: any) => {
        return addCasoDB(caso);
      },
      updateCaso: async (id: string, data: any) => {
        return updateCasoDB(id, data);
      },
      deleteCaso: async (id: string) => {
        return deleteCasoDB(id);
      },
      saveState: async (userId, state) => {
        setStorage(`sha256_pwa_state_${userId}`, state);
        return { success: true };
      },
      loadState: async (userId) => {
        return getStorage(`sha256_pwa_state_${userId}`, null);
      },
      getUsers: async () => {
        return getStorage('sha256_pwa_users', []);
      },
      addUser: async (userIdMaker, user) => {
        const users = getStorage<any[]>('sha256_pwa_users', []);
        
        if (users.some(u => u.username.toLowerCase() === user.username.toLowerCase())) {
          return { success: false, error: 'El nombre de usuario ya está registrado' };
        }

        const newId = Date.now();
        const nuevo = {
          id: newId,
          username: user.username,
          nombre: user.nombre,
          apellido: user.apellido,
          rol: user.rol || 'perito_asistente',
          activo: 1,
          ci: user.ci || '',
          cargo: user.cargo || '',
          email: user.email || '',
          telefono: user.telefono || '',
          despacho: user.despacho || '',
          ranking: user.ranking || 0,
          profile_image: user.profile_image || '',
          created_at: new Date().toISOString()
        };
        users.push(nuevo);
        setStorage('sha256_pwa_users', users);

        const adminUser = users.find(u => u.id === userIdMaker) || users[0];
        const logDetail = `Usuario ${user.username} creado exitosamente en modo PWA por ${adminUser.username}`;
        await addAuditLogDB({
          id: Date.now().toString(),
          user_id: adminUser.id,
          accion: 'USUARIO_CREADO',
          detalle: logDetail,
          timestamp: new Date().toISOString(),
          nombre: adminUser.nombre,
          apellido: adminUser.apellido,
          username: adminUser.username
        });

        return { success: true, id: newId };
      },
      updateUser: async (userIdMaker, userId, data) => {
        const users = getStorage<any[]>('sha256_pwa_users', []);
        const idx = users.findIndex(u => u.id === userId);
        if (idx !== -1) {
          users[idx] = { ...users[idx], ...data };
          setStorage('sha256_pwa_users', users);
          
          const adminUser = users.find(u => u.id === userIdMaker) || users[0];
          const logDetail = `Usuario ID ${userId} actualizado en base de datos local PWA`;
          await addAuditLogDB({
            id: Date.now().toString(),
            user_id: adminUser.id,
            accion: 'USUARIO_ACTUALIZADO',
            detalle: logDetail,
            timestamp: new Date().toISOString(),
            nombre: adminUser.nombre,
            apellido: adminUser.apellido,
            username: adminUser.username
          });
          return { success: true };
        }
        return { success: false, error: 'Usuario no encontrado' };
      },
      getAuditLogs: async () => {
        return getAuditLogsDB();
      },
      addAuditLog: async (log) => {
        return addAuditLogDB(log);
      }
    },
    auth: {
      login: async ({ username, password }) => {
        const users = getStorage<any[]>('sha256_pwa_users', []);
        const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());
        if (!user) {
          return { success: false, message: 'Credenciales inválidas. Acceso denegado.' };
        }
        const hashPass = await sha256Local(password);
        if (hashPass !== user.password_hash) {
          return { success: false, message: 'Credenciales inválidas. Acceso denegado.' };
        }
        const token = `session-token-${Date.now()}`;
        const sessionUser = {
          id: user.id,
          username: user.username,
          nombre: `${user.nombre} ${user.apellido}`.trim(),
          rol: user.rol,
          profileImage: user.profile_image || '',
          token
        };
        setStorage('sha256_active_session', sessionUser);
        
        return { success: true, user: sessionUser };
      },
      validate: async (token) => {
        const session = getStorage<any>('sha256_active_session', null);
        if (session && session.token === token) {
          return { success: true, user: session };
        }
        return { success: false };
      },
      logout: async () => {
        localStorage.removeItem('sha256_active_session');
        return { success: true };
      },
      changePassword: async (userId, newPassword) => {
        const users = getStorage<any[]>('sha256_pwa_users', []);
        const idx = users.findIndex(u => u.id === userId);
        if (idx !== -1) {
          const hashNew = await sha256Local(newPassword);
          users[idx].password_hash = hashNew;
          setStorage('sha256_pwa_users', users);
          return { success: true };
        }
        return { success: false, error: 'Usuario no encontrado' };
      }
    }
  };
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ToastProvider>
      <HashRouter>
        <App />
      </HashRouter>
    </ToastProvider>
  </React.StrictMode>
);
