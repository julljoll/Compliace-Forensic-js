
export interface UserDB {
  id: number;
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
    return window.electronAPI?.platform || 'browser';
  },

  get operationMode() {
    return window.electronAPI?.operationMode || 'production';
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
      if (window.electronAPI?.db?.getCasos) {
        return window.electronAPI.db.getCasos(userId);
      }
      return [];
    },
    addCaso: async (caso: any) => {
      if (window.electronAPI?.db?.addCaso) {
        return window.electronAPI.db.addCaso(caso);
      }
      return { success: false, error: 'No electronAPI' };
    },
    updateCaso: async (id: string, data: any) => {
      if (window.electronAPI?.db?.updateCaso) {
        return window.electronAPI.db.updateCaso(id, data);
      }
      return false;
    },
    deleteCaso: async (id: string) => {
      if (window.electronAPI?.db?.deleteCaso) {
        return window.electronAPI.db.deleteCaso(id);
      }
      return false;
    },
    saveState: async (userId: number, state: any) => {
      if (window.electronAPI?.db?.saveState) {
        return window.electronAPI.db.saveState(userId, state);
      }
      return { success: false };
    },
    loadState: async (userId: number) => {
      if (window.electronAPI?.db?.loadState) {
        return window.electronAPI.db.loadState(userId);
      }
      return null;
    },
    getUsers: async (): Promise<UserDB[]> => {
      if (window.electronAPI?.db?.getUsers) {
        return window.electronAPI.db.getUsers();
      }
      return [];
    },
    addUser: async (userIdMaker: number, user: any) => {
      if (window.electronAPI?.db?.addUser) {
        return window.electronAPI.db.addUser(userIdMaker, user);
      }
      return { success: false, error: 'No electronAPI' };
    },
    updateUser: async (userIdMaker: number, userId: number, data: any) => {
      if (window.electronAPI?.db?.updateUser) {
        return window.electronAPI.db.updateUser(userIdMaker, userId, data);
      }
      return { success: false, error: 'No electronAPI' };
    },
    getAuditLogs: async () => {
      if (window.electronAPI?.db?.getAuditLogs) {
        return window.electronAPI.db.getAuditLogs();
      }
      return [];
    },
    addAuditLog: async (log: any) => {
      if (window.electronAPI?.db?.addAuditLog) {
        return window.electronAPI.db.addAuditLog(log);
      }
      return false;
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
