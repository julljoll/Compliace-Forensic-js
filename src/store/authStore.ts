import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AuthUser {
  id: number;
  username: string;
  nombre: string;
  rol: string;
  token: string;
  profileImage?: string;
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
  changePassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
  updateProfileImage: (imgBase64: string) => void;
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

        if (window.electronAPI?.auth) {
          try {
            const result = await window.electronAPI.auth.login({ username, password });
            if (result.success) {
              set({ user: result.user, isAuthenticated: true, isLoading: false });
              return true;
            }
            set({ error: result.message || 'Credenciales incorrectas', isLoading: false });
            return false;
          } catch (error) {
            set({ error: 'Error de conexión con la base de datos Neon', isLoading: false });
            return false;
          }
        } else {
          // Fallback para Web / Modo Desarrollo
          await new Promise(resolve => setTimeout(resolve, 800)); // Simular latencia
          if (username.toLowerCase() === 'admin' || username.toLowerCase() === 'julljoll') {
            set({ 
              user: { id: 1, username, nombre: 'Perito Dev', rol: 'admin', token: 'dev-token-123' }, 
              isAuthenticated: true, 
              isLoading: false 
            });
            return true;
          }
          set({ error: 'Credenciales inválidas. En desarrollo usa "admin"', isLoading: false });
          return false;
        }
      },

      logout: async () => {
        const { user } = get();
        if (window.electronAPI?.auth && user?.token) {
          await window.electronAPI.auth.logout(user.token);
        }
        set({ user: null, isAuthenticated: false, error: null });
      },

      validateSession: async () => {
        const { user } = get();
        if (!user?.token) { set({ isAuthenticated: false }); return false; }

        if (window.electronAPI?.auth) {
          const result = await window.electronAPI.auth.validate(user.token);
          if (!result.success) { set({ user: null, isAuthenticated: false }); return false; }
          return true;
        }
        
        // Modo web dev
        return true;
      },

      clearError: () => set({ error: null }),

      changePassword: async (newPassword) => {
        const { user } = get();
        if (!user) return { success: false, error: 'No hay usuario autenticado' };
        
        if (window.electronAPI?.auth?.changePassword) {
          try {
            const result = await window.electronAPI.auth.changePassword(user.id, newPassword);
            return result;
          } catch (e: any) {
            console.error('[AuthStore] Error cambiando clave:', e);
            return { success: false, error: e.message || 'Error de comunicación' };
          }
        } else {
          // Modo web dev
          console.log('[AuthStore] Contraseña cambiada en modo Web/Dev a:', newPassword);
          return { success: true };
        }
      },

      updateProfileImage: (imgBase64) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, profileImage: imgBase64 } });
        }
      },
    }),
    { name: 'sha256-auth', version: 1 }
  )
);
