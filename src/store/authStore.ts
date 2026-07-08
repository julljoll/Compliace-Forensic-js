import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authUserByEmail, initDatabase } from '../db/neonRestClient';

export interface AuthUser {
  id: number;
  email: string;
  nombre: string;
  rol: string;
  profileImage?: string;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (email: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
  changePassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
  updateProfileImage: (imgBase64: string) => void;
}

/**
 * Auth store — login por correo electrónico contra Neon PostgreSQL.
 * Solo usuarios autorizados en la tabla `authorized_users` pueden acceder.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string) => {
        set({ isLoading: true, error: null });

        const trimmed = email.trim().toLowerCase();
        if (!trimmed || !trimmed.includes('@')) {
          set({ error: 'Ingrese un correo electrónico válido', isLoading: false });
          return false;
        }

        try {
          // Asegurar que las tablas existan
          await initDatabase();

          const result = await authUserByEmail(trimmed);
          if (result.success && result.user) {
            set({
              user: result.user,
              isAuthenticated: true,
              isLoading: false,
            });
            return true;
          }

          set({ error: result.error || 'Correo no autorizado', isLoading: false });
          return false;
        } catch (error) {
          set({ error: 'Error de conexión con el sistema de autenticación', isLoading: false });
          return false;
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false, error: null });
      },

      clearError: () => set({ error: null }),

      changePassword: async () => {
        // Login por correo — no hay cambio de contraseña
        return { success: true };
      },

      updateProfileImage: (imgBase64: string) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, profileImage: imgBase64 } });
        }
      },
    }),
    { name: 'sha256-auth', version: 2 }
  )
);
