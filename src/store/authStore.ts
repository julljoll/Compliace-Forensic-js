import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { platformAPI } from '../db/platformAPI';

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
  isFirstLogin?: boolean;

  login: (username: string, password: string) => Promise<boolean>;
  vercelLogin: (user: AuthUser) => void;
  logout: () => void;
  validateSession: () => Promise<boolean>;
  clearError: () => void;
  changePassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
  updateProfileImage: (imgBase64: string) => void;
}

/**
 * Auth store — funciona en dos modos:
 * 1. Electron: usa IPC para autenticar contra SQLite/Neon
 * 2. Web/PWA: usa auth local con contraseñas hasheadas (SHA-256)
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      isFirstLogin: false,

      login: async (username, password) => {
        set({ isLoading: true, error: null });

        // Esperar hasta 2s a que el shim de main.tsx esté listo
        let attempts = 0;
        while (!window.electronAPI?.auth && attempts < 20) {
          await new Promise(r => setTimeout(r, 100));
          attempts++;
        }

        if (!window.electronAPI?.auth) {
          set({ error: 'Sistema de autenticación no disponible. Recarga la página.', isLoading: false });
          return false;
        }

        try {
          const result = await platformAPI.auth.login({ username, password });
          if (result.success) {
            // BUG-021: Si el usuario es admin y clave es admin, marcar primer login
            const isFirstLogin = username === 'admin' && password === 'admin';
            set({ 
              user: result.user, 
              isAuthenticated: true, 
              isFirstLogin, 
              isLoading: false 
            });
            return true;
          }
          set({ error: result.message || 'Credenciales incorrectas', isLoading: false });
          return false;
        } catch (error) {
          set({ error: 'Error de conexión con el sistema de autenticación', isLoading: false });
          return false;
        }
      },

      vercelLogin: (user) => {
        set({ user, isAuthenticated: true, isLoading: false, error: null, isFirstLogin: false });
      },

      logout: async () => {
        const { user } = get();
        if (platformAPI.auth && user?.token) {
          try {
            await platformAPI.auth.logout(user.token);
          } catch (e) {
            console.error('Error logging out from server:', e);
          }
        }
        set({ user: null, isAuthenticated: false, error: null, isFirstLogin: false });
      },

      validateSession: async () => {
        const { user } = get();
        if (!user?.token) { set({ isAuthenticated: false }); return false; }

        if (platformAPI.auth) {
          const result = await platformAPI.auth.validate(user.token);
          if (!result.success) { set({ user: null, isAuthenticated: false }); return false; }
          return true;
        }
        
        try {
          const stored = localStorage.getItem('sha256_active_session');
          if (!stored) { set({ user: null, isAuthenticated: false }); return false; }
          const session = JSON.parse(stored);
          if (session.token !== user.token) { set({ user: null, isAuthenticated: false }); return false; }
          return true;
        } catch {
          set({ user: null, isAuthenticated: false });
          return false;
        }
      },

      clearError: () => set({ error: null }),

      changePassword: async (newPassword) => {
        const { user } = get();
        if (!user) return { success: false, error: 'No hay usuario autenticado' };
        
        if (platformAPI.auth?.changePassword) {
          try {
            const result = await platformAPI.auth.changePassword(user.id, newPassword);
            if (result.success) {
              set({ isFirstLogin: false });
            }
            return result;
          } catch (e: any) {
            console.error('[AuthStore] Error cambiando clave:', e);
            return { success: false, error: e.message || 'Error de comunicación' };
          }
        } else {
          set({ isFirstLogin: false });
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
