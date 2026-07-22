
import {
  getCasosSQLite,
  addCasoSQLite,
  updateCasoSQLite,
  deleteCasoSQLite,
  getUsersSQLite,
  addUserSQLite,
  updateUserSQLite,
  getAuditLogsSQLite,
  addAuditLogSQLite
} from './sqliteClient';

declare global {
  interface Window {
    electronAPI?: {
      platform?: string;
      operationMode?: string;
      dialog?: {
        selectFile?: (filters?: any) => Promise<{ canceled: boolean; filePaths: string[] }>;
      };
      file?: {
        writeJson?: (filePath: string, data: any) => Promise<void>;
        readJson?: (filePath: string) => Promise<any>;
      };
      hash?: {
        calculate?: (filePath: string, algorithm?: string) => Promise<{ success: boolean; hash: string; algorithm: string; verified: boolean; error?: string }>;
      };
      db?: {
        getCasos?: (userId: number) => Promise<any[]>;
        addCaso?: (caso: any) => Promise<any>;
        updateCaso?: (id: string, data: any) => Promise<boolean>;
        deleteCaso?: (id: string) => Promise<boolean>;
        saveState?: (userId: number, state: any) => Promise<any>;
        loadState?: (userId: number) => Promise<any>;
        getUsers?: () => Promise<any[]>;
        addUser?: (userIdMaker: number, user: any) => Promise<any>;
        updateUser?: (userIdMaker: number, userId: number, data: any) => Promise<any>;
        getAuditLogs?: () => Promise<any[]>;
        addAuditLog?: (log: any) => Promise<boolean>;
      };
      auth?: {
        login?: (credentials: any) => Promise<any>;
        validate?: (token: string) => Promise<any>;
        logout?: (token: string) => Promise<any>;
        changePassword?: (userId: number, newPassword: string) => Promise<any>;
      };
    };
  }
}

export interface UserDB {
  id: number | string;
  username: string;
  nombre: string;
  apellido: string;
  rol: string;
  cargo: string;
  email: string;
  telefono: string;
  despacho: string;
  activo: boolean | number;
  ranking?: number;
  profile_image?: string;
  created_at?: string;
}

export const platformAPI = {
  get platform() {
    return window.electronAPI?.platform || 'local_desktop';
  },

  get operationMode() {
    return window.electronAPI?.operationMode || 'local_sqlite';
  },

  dialog: {
    selectFile: async (filters?: any) => {
      if (window.electronAPI?.dialog?.selectFile) {
        return window.electronAPI.dialog.selectFile(filters);
      }
      return { canceled: true, filePaths: [] };
    }
  },

  file: {
    writeJson: async (filePath: string, data: any) => {
      if (window.electronAPI?.file?.writeJson) {
        return window.electronAPI.file.writeJson(filePath, data);
      }
      return { success: false, error: 'No electronAPI' };
    },
    readJson: async (filePath: string) => {
      if (window.electronAPI?.file?.readJson) {
        return window.electronAPI.file.readJson(filePath);
      }
      return { success: false, error: 'No electronAPI' };
    }
  },

  hash: {
    calculate: async (filePath: string, algorithm: string = 'sha256') => {
      if (window.electronAPI?.hash?.calculate) {
        return window.electronAPI.hash.calculate(filePath, algorithm);
      }
      return { success: false, hash: '', algorithm, verified: false, error: 'No electronAPI' };
    }
  },

  db: {
    getCasos: async (userId: number = 1): Promise<any[]> => {
      if (typeof window !== 'undefined' && window.electronAPI?.db?.getCasos) {
        return window.electronAPI.db.getCasos(userId);
      }
      if (typeof window !== 'undefined') {
        try {
          const res = await fetch('/api/db/local');
          if (res.ok) {
            const data = await res.json();
            return data.casos || [];
          }
        } catch (e) {}
      }
      return getCasosSQLite();
    },
    addCaso: async (caso: any) => {
      if (typeof window !== 'undefined' && window.electronAPI?.db?.addCaso) {
        return window.electronAPI.db.addCaso(caso);
      }
      if (typeof window !== 'undefined') {
        try {
          const res = await fetch('/api/db/local', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'save_caso', caso })
          });
          if (res.ok) {
            const data = await res.json();
            return data;
          }
        } catch (e) {}
      }
      return addCasoSQLite(caso);
    },
    updateCaso: async (id: string, data: any) => {
      if (typeof window !== 'undefined' && window.electronAPI?.db?.updateCaso) {
        return window.electronAPI.db.updateCaso(id, data);
      }
      if (typeof window !== 'undefined') {
        try {
          const res = await fetch('/api/db/local', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'update_caso', id, data })
          });
          if (res.ok) {
            const resData = await res.json();
            return resData.success;
          }
        } catch (e) {}
      }
      return updateCasoSQLite(id, data);
    },
    deleteCaso: async (id: string) => {
      if (typeof window !== 'undefined' && window.electronAPI?.db?.deleteCaso) {
        return window.electronAPI.db.deleteCaso(id);
      }
      if (typeof window !== 'undefined') {
        try {
          const res = await fetch('/api/db/local', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'delete_caso', id })
          });
          if (res.ok) {
            const resData = await res.json();
            return resData.success;
          }
        } catch (e) {}
      }
      return deleteCasoSQLite(id);
    },
    saveState: async (userId: number, state: any) => {
      if (typeof window !== 'undefined' && window.electronAPI?.db?.saveState) {
        return window.electronAPI.db.saveState(userId, state);
      }
      return { success: true };
    },
    loadState: async (userId: number) => {
      if (typeof window !== 'undefined' && window.electronAPI?.db?.loadState) {
        return window.electronAPI.db.loadState(userId);
      }
      return null;
    },
    getUsers: async (): Promise<UserDB[]> => {
      if (typeof window !== 'undefined' && window.electronAPI?.db?.getUsers) {
        return window.electronAPI.db.getUsers();
      }
      if (typeof window !== 'undefined') {
        try {
          const res = await fetch('/api/db/local');
          if (res.ok) {
            const data = await res.json();
            if (data.users && data.users.length > 0) return data.users;
          }
        } catch (e) {}
      }
      return getUsersSQLite();
    },
    addUser: async (userIdMaker: number, user: any) => {
      if (typeof window !== 'undefined' && window.electronAPI?.db?.addUser) {
        return window.electronAPI.db.addUser(userIdMaker, user);
      }
      if (typeof window !== 'undefined') {
        try {
          const res = await fetch('/api/db/local', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'add_user', user })
          });
          if (res.ok) {
            return await res.json();
          }
        } catch (e) {}
      }
      return addUserSQLite(user);
    },
    updateUser: async (userIdMaker: number, userId: number, data: any) => {
      if (typeof window !== 'undefined' && window.electronAPI?.db?.updateUser) {
        return window.electronAPI.db.updateUser(userIdMaker, userId, data);
      }
      if (typeof window !== 'undefined') {
        try {
          const res = await fetch('/api/db/local', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'update_user', id: String(userId), data })
          });
          if (res.ok) {
            return await res.json();
          }
        } catch (e) {}
      }
      return updateUserSQLite(String(userId), data);
    },
    getAuditLogs: async () => {
      if (typeof window !== 'undefined' && window.electronAPI?.db?.getAuditLogs) {
        return window.electronAPI.db.getAuditLogs();
      }
      if (typeof window !== 'undefined') {
        try {
          const res = await fetch('/api/db/local');
          if (res.ok) {
            const data = await res.json();
            if (data.logs) return data.logs;
          }
        } catch (e) {}
      }
      return getAuditLogsSQLite();
    },
    addAuditLog: async (log: any) => {
      if (typeof window !== 'undefined' && window.electronAPI?.db?.addAuditLog) {
        return window.electronAPI.db.addAuditLog(log);
      }
      if (typeof window !== 'undefined') {
        try {
          const res = await fetch('/api/db/local', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'add_audit_log', log })
          });
          if (res.ok) {
            const resData = await res.json();
            return resData.success;
          }
        } catch (e) {}
      }
      return addAuditLogSQLite(log);
    }
  },




  auth: {
    login: async (credentials: any) => {
      if (window.electronAPI?.auth?.login) {
        return window.electronAPI.auth.login(credentials);
      }
      return { success: false, message: 'No electronAPI' };
    },
    validate: async (token: string) => {
      if (window.electronAPI?.auth?.validate) {
        return window.electronAPI.auth.validate(token);
      }
      return { success: false };
    },
    logout: async (token: string) => {
      if (window.electronAPI?.auth?.logout) {
        return window.electronAPI.auth.logout(token);
      }
      return { success: true };
    },
    changePassword: async (userId: number, newPassword: string) => {
      if (window.electronAPI?.auth?.changePassword) {
        return window.electronAPI.auth.changePassword(userId, newPassword);
      }
      return { success: false, error: 'No electronAPI' };
    }
  }
};
