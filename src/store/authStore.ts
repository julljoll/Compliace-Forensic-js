/**
 * SHA256.US — Store de Autenticación de Peritos y Compliance Officers.
 */

export interface User {
  id: string;
  email: string;
  nombre: string;
  apellido?: string;
  ci?: string;
  cargo?: string;
  rol: 'admin' | 'perito_lider' | 'perito_asistente' | 'fiscal' | 'compliance_officer';
  organismo?: string;
  despacho?: string;
  profileImage?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  error: string | null;
  isLoading: boolean;

  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  updateProfileImage: (b64: string) => void;
}

const DEFAULT_USER: User = {
  id: 'usr-admin-01',
  email: 'julljoll@gmail.com',
  nombre: 'Jull Joll',
  rol: 'admin',
  cargo: 'Perito Informático Forense Principal',
  ci: 'V-18.999.001',
  organismo: 'Laboratorio Privado SHA256.US',
  despacho: 'División Pericial Digital',
};

let state: AuthState = {
  isAuthenticated: false,
  user: null,
  error: null,
  isLoading: false,

  login: async (email: string, pass: string) => {
    const trimmedEmail = email ? email.trim() : '';
    const trimmedPass = pass ? pass.trim() : '';

    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      state.error = 'Ingrese un correo electrónico válido';
      state.isAuthenticated = false;
      state.user = null;
      notify();
      return false;
    }

    if (!trimmedPass) {
      state.error = 'Ingrese la contraseña';
      state.isAuthenticated = false;
      state.user = null;
      notify();
      return false;
    }

    // Acepta credenciales por defecto o cualquier usuario válido para peritaje local
    if (trimmedEmail === 'julljoll@gmail.com' && trimmedPass === 'admin') {
      state.isAuthenticated = true;
      state.user = { ...DEFAULT_USER };
      state.error = null;
      notify();
      return true;
    }

    state.error = 'Credenciales no autorizadas';
    state.isAuthenticated = false;
    state.user = null;
    notify();
    return false;
  },

  logout: () => {
    state.isAuthenticated = false;
    state.user = null;
    state.error = null;
    notify();
  },

  updateProfileImage: (b64: string) => {
    if (state.user) {
      state.user = { ...state.user, profileImage: b64 };
      notify();
    }
  },
};

const listeners = new Set<() => void>();
function notify() {
  listeners.forEach((l) => l());
}

export const useAuthStore = {
  getState: () => state,
  setState: (partial: Partial<AuthState>) => {
    state = { ...state, ...partial };
    notify();
  },
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};
