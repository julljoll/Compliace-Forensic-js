import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AuthUser {
  id: number;
  username: string;
  nombre: string;
  rol: string;
  token: string;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  validateSession: () => Promise<boolean>;
  clearError: () => void;
}

/**
 * Auth store — funciona en dos modos:
 * 1. Electron: usa IPC para autenticar contra SQLite
 * 2. Web/Dev: usa auth local simple (admin/julljoll)
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (username, password) => {
        set({ isLoading: true, error: null });

        // Verificar si estamos en Electron
        const electronAPI = (window as any).electronAPI;
        if (electronAPI?.auth) {
          try {
            const result = await electronAPI.auth.login({ username, password });
            if (result.success) {
              set({ user: result.user, isAuthenticated: true, isLoading: false });
              return true;
            }
            set({ error: result.message || 'Credenciales incorrectas', isLoading: false });
            return false;
          } catch {
            set({ error: 'Error de conexión con la base de datos', isLoading: false });
            return false;
          }
        }

        // Modo web/dev — auth local simple
        await new Promise(r => setTimeout(r, 500)); // Simular latencia
        if (username === 'admin' && password === 'julljoll') {
          const user: AuthUser = {
            id: 1, username: 'admin', nombre: 'Administrador',
            rol: 'perito_lider', token: `dev-${Date.now()}`
          };
          set({ user, isAuthenticated: true, isLoading: false });
          return true;
        }
        set({ error: 'Usuario o contraseña incorrectos', isLoading: false });
        return false;
      },

      logout: () => {
        const { user } = get();
        const electronAPI = (window as any).electronAPI;
        if (electronAPI?.auth && user?.token) {
          electronAPI.auth.logout(user.token);
        }
        set({ user: null, isAuthenticated: false, error: null });
      },

      validateSession: async () => {
        const { user } = get();
        if (!user?.token) { set({ isAuthenticated: false }); return false; }

        const electronAPI = (window as any).electronAPI;
        if (electronAPI?.auth) {
          const result = await electronAPI.auth.validate(user.token);
          if (!result.success) { set({ user: null, isAuthenticated: false }); return false; }
          return true;
        }
        // En modo dev, siempre válido si hay token
        return true;
      },

      clearError: () => set({ error: null }),
    }),
    { name: 'sha256-auth', version: 1 }
  )
);
