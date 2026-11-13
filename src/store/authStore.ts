/**
 * SHA256.US — Store de Autenticación de Peritos y Compliance Officers.
 * Soporta autenticación por contraseña y Google Authenticator (TOTP RFC 6238).
 */

import { verificarTotpCode } from '../lib/crypto/totp';

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
  totpSecret?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  error: string | null;
  isLoading: boolean;

  login: (email: string, pass?: string, totpCode?: string) => Promise<boolean>;
  logout: () => void;
  updateProfileImage: (b64: string) => void;
}

export const USER_JULL: User = {
  id: 'usr-jull-01',
  email: 'julljoll@gmail.com',
  nombre: 'Jull Joll',
  apellido: 'Joll',
  rol: 'admin',
  cargo: 'Perito Analizador de Datos Forenses',
  ci: 'V-18.999.001',
  organismo: 'Laboratorio Privado SHA256.US',
  despacho: 'Área de Análisis e Interpretación (F3/F4)',
  totpSecret: 'JULLJOLLFCCO2FA1',
};

export const USER_SHA256: User = {
  id: 'usr-sha256-02',
  email: 'sha256.us@gmail.com',
  nombre: 'SHA256 Adquisición',
  apellido: 'Oficial',
  rol: 'perito_lider',
  cargo: 'Encargado de la Etapa de Adquisición',
  ci: 'V-15.816.003',
  organismo: 'Laboratorio Privado SHA256.US',
  despacho: 'Área de Adquisición y Cadena de Custodia (F1/F2)',
  totpSecret: 'SHA256USFCCO2FA2',
};

let state: AuthState = {
  isAuthenticated: false,
  user: null,
  error: null,
  isLoading: false,

  login: async (email: string, pass: string = '', totpCode: string = '') => {
    const trimmedEmail = (email || '').trim().toLowerCase();
    const trimmedPass = (pass || '').trim();
    const trimmedTotp = (totpCode || '').trim();

    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      state.error = 'Ingrese un correo electrónico válido';
      state.isAuthenticated = false;
      state.user = null;
      notify();
      return false;
    }

    if (!trimmedPass && !trimmedTotp) {
      state.error = 'Ingrese la contraseña o el código de Google Authenticator';
      state.isAuthenticated = false;
      state.user = null;
      notify();
      return false;
    }

    // 1. Perito Analizador de Datos (Jull)
    if (trimmedEmail === 'julljoll@gmail.com') {
      let ok = false;
      if (trimmedPass && (trimmedPass === 'Karupano' || trimmedPass === 'admin')) {
        ok = true;
      }
      if (trimmedTotp) {
        const totpValido = await verificarTotpCode(USER_JULL.totpSecret!, trimmedTotp);
        if (totpValido) ok = true;
      }

      if (ok) {
        state.isAuthenticated = true;
        state.user = { ...USER_JULL };
        state.error = null;
        notify();
        return true;
      }
    }

    // 2. Perito Encargado de Adquisición (SHA256)
    if (trimmedEmail === 'sha256.us@gmail.com') {
      let ok = false;
      if (trimmedPass && trimmedPass === '15816003') {
        ok = true;
      }
      if (trimmedTotp) {
        const totpValido = await verificarTotpCode(USER_SHA256.totpSecret!, trimmedTotp);
        if (totpValido) ok = true;
      }

      if (ok) {
        state.isAuthenticated = true;
        state.user = { ...USER_SHA256 };
        state.error = null;
        notify();
        return true;
      }
    }

    state.error = 'Credenciales no autorizadas o código 2FA erróneo';
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
