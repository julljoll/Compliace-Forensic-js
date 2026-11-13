/**
 * SHA256.US — Cliente de API REST PHP con Respaldo Offline (IndexedDB).
 * Se conecta a los endpoints en /api/*.php y almacena en caché local.
 */

import { idbGet, idbPut, idbGetAll } from './idb';
import type { CasoCMS } from '../domain/types';
import type { EntradaAuditoria } from '../crypto/hashChain';

const API_BASE = '/api';

export interface ApiResponse<T> {
  ok: boolean;
  data?: T;
  error?: string;
  offline?: boolean;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      credentials: 'same-origin',
    });

    const json = await res.json().catch(() => null);
    if (!res.ok) {
      return { ok: false, error: json?.error || `HTTP ${res.status}`, data: json };
    }
    return { ok: true, data: json };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Error de red', offline: true };
  }
}

export const phpApi = {
  // ── Casos ──
  async listarCasos(): Promise<CasoCMS[]> {
    const res = await request<{ casos: CasoCMS[] }>('/casos.php');
    if (res.ok && res.data?.casos) {
      // Actualizar caché IndexedDB
      for (const c of res.data.casos) {
        await idbPut('casos', c);
      }
      return res.data.casos;
    }
    // Fallback offline
    return idbGetAll<CasoCMS>('casos');
  },

  async obtenerCaso(id: string): Promise<CasoCMS | undefined> {
    const res = await request<{ caso: CasoCMS }>(`/casos.php?id=${encodeURIComponent(id)}`);
    if (res.ok && res.data?.caso) {
      await idbPut('casos', res.data.caso);
      return res.data.caso;
    }
    return idbGet<CasoCMS>('casos', id);
  },

  async guardarCaso(caso: CasoCMS): Promise<{ ok: boolean; version?: number; error?: string }> {
    const method = caso.version ? 'PUT' : 'POST';
    const res = await request<{ success: boolean; version?: number }>(`/casos.php`, {
      method,
      body: JSON.stringify(caso),
    });

    if (res.ok) {
      const nuevo = { ...caso, version: res.data?.version ?? (caso.version || 1) + 1 };
      await idbPut('casos', nuevo);
      return { ok: true, version: nuevo.version };
    }

    // Si falló por offline, guardar localmente con bandera de sincronización pendiente
    if (res.offline) {
      await idbPut('casos', caso);
      return { ok: true, version: caso.version, error: 'Guardado en modo offline' };
    }

    return { ok: false, error: res.error };
  },

  // ── Avance de Fase ISO ──
  async avanzarFase(casoId: string, fase: string, controles: Record<string, any>): Promise<ApiResponse<any>> {
    return request('/avanzar-etapa.php', {
      method: 'POST',
      body: JSON.stringify({ casoId, fase, controles }),
    });
  },

  // ── Auditoría ──
  async listarAuditoria(casoId?: string): Promise<EntradaAuditoria[]> {
    const url = casoId ? `/auditoria.php?caso_id=${encodeURIComponent(casoId)}` : '/auditoria.php';
    const res = await request<{ logs: EntradaAuditoria[] }>(url);
    if (res.ok && res.data?.logs) {
      return res.data.logs;
    }
    return idbGetAll<EntradaAuditoria>('auditoria');
  },

  async verificarCadenaAuditoria(): Promise<{ valida: boolean; total: number; motivo?: string }> {
    const res = await request<{ valida: boolean; total: number; motivo?: string }>('/auditoria.php?verificar=1');
    if (res.ok && res.data) {
      return res.data;
    }
    return { valida: false, total: 0, motivo: res.error || 'No se pudo conectar con el servidor' };
  },

  // ── Autenticación ──
  async login(email: string, pass: string = '', totpCode: string = ''): Promise<ApiResponse<any>> {
    return request('/auth.php', {
      method: 'POST',
      body: JSON.stringify({ action: 'login', email, password: pass, totp_code: totpCode }),
    });
  },

  async logout(): Promise<void> {
    await request('/auth.php', {
      method: 'POST',
      body: JSON.stringify({ action: 'logout' }),
    });
  },

  async checkAuth(): Promise<ApiResponse<any>> {
    return request('/auth.php', { method: 'GET' });
  },
};
