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

  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
  changePassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
  updateProfileImage: (imgBase64: string) => void;
}

/** Credenciales provisionales por defecto (mientras se configura Neon) */
const DEFAULT_CREDENTIALS = {
  email: 'julljoll@gmail.com',
  password: 'admin',
};

/**
 * Auth store — login por correo electrónico + contraseña.
 * Provisionalmente valida credenciales hardcodeadas.
 * Cuando Neon esté configurado, se validará contra authorized_users.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });

        const trimmedEmail = email.trim().toLowerCase();
        const trimmedPassword = password.trim();

        if (!trimmedEmail || !trimmedEmail.includes('@')) {
          set({ error: 'Ingrese un correo electrónico válido', isLoading: false });
          return false;
        }

        if (!trimmedPassword) {
          set({ error: 'Ingrese la contraseña', isLoading: false });
          return false;
        }

        // 1. Validar credenciales provisionales por defecto
        if (
          trimmedEmail === DEFAULT_CREDENTIALS.email &&
          trimmedPassword === DEFAULT_CREDENTIALS.password
        ) {
          set({
            user: {
              id: 1,
              email: DEFAULT_CREDENTIALS.email,
              nombre: 'Jull Joll',
              rol: 'admin',
            },
            isAuthenticated: true,
            isLoading: false,
          });
          return true;
        }

        // 2. Intentar validación contra Neon PostgreSQL
        try {
          await initDatabase();
          const result = await authUserByEmail(trimmedEmail);
          if (result.success && result.user) {
            set({
              user: result.user,
              isAuthenticated: true,
              isLoading: false,
            });
            return true;
          }

          set({ error: result.error || 'Credenciales no válidas', isLoading: false });
          return false;
        } catch {
          set({ error: 'Credenciales no válidas', isLoading: false });
          return false;
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false, error: null });
      },

      clearError: () => set({ error: null }),

      changePassword: async () => {
        return { success: true };
      },

      updateProfileImage: (imgBase64: string) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, profileImage: imgBase64 } });
        }
      },
    }),
    {
      name: 'sha256-auth',
      version: 3,
      migrate: (persistedState: any, version: number) => {
        // Si la versión guardada es menor a 3, resetear el estado de auth
        if (version < 3) {
          return {
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          };
        }
        return persistedState;
      },
    }
  )
);
