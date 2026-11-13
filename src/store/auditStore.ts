/**
 * SHA256.US — Store de Auditoría Criptográfica Inmutable (SHA-256 Hash Chain).
 * Implementado con arquitectura pura y compatible con React / Vanilla TypeScript.
 */

import { crearEslabon, verificarCadena, type EntradaAuditoria, type NuevaEntrada } from '../lib/crypto/hashChain';
import { GENESIS_HASH } from '../lib/crypto/canonical';
import { idbGetAll, idbPut, idbClear } from '../lib/data/idb';

export interface AuditEntry {
  id: string;
  seq?: number;
  casoId?: string;
  usuario: string;
  accion: string;
  detalle: string;
  timestamp: string;
  nivel: 'info' | 'warning' | 'error' | 'success';
  hashActual: string;
  hashAnterior: string;
  firmadoPor?: string;
  firmadoTimestamp?: string;
}

interface AuditState {
  logs: AuditEntry[];
  isLoading: boolean;
  error: string | null;
  lastHash: string;

  addEntry: (entry: {
    usuario: string;
    accion: string;
    detalle: string;
    nivel?: 'info' | 'warning' | 'error' | 'success';
    casoId?: string;
  }) => Promise<void>;
  loadLogs: () => Promise<void>;
  getLogsByCaso: (casoId: string) => AuditEntry[];
  clearLogs: () => Promise<void>;
  verifyChain: () => Promise<{ valid: boolean; brokenAt?: string }>;
}

let state: AuditState = {
  logs: [],
  isLoading: false,
  error: null,
  lastHash: GENESIS_HASH,

  addEntry: async (entry) => {
    const prev = state.logs[0];
    const prevEslabon: EntradaAuditoria | undefined = prev
      ? {
          seq: prev.seq || state.logs.length,
          casoId: prev.casoId || null,
          usuario: prev.usuario,
          accion: prev.accion,
          detalle: prev.detalle,
          nivel: prev.nivel,
          ts: prev.timestamp,
          hashAnterior: prev.hashAnterior,
          hashActual: prev.hashActual,
        }
      : undefined;

    const nueva: NuevaEntrada = {
      casoId: entry.casoId || null,
      usuario: entry.usuario,
      accion: entry.accion,
      detalle: entry.detalle,
      nivel: entry.nivel || 'info',
    };

    const eslabon = await crearEslabon(nueva, prevEslabon);

    const auditEntry: AuditEntry = {
      id: `audit-${eslabon.seq}-${Date.now()}`,
      seq: eslabon.seq,
      casoId: eslabon.casoId || undefined,
      usuario: eslabon.usuario,
      accion: eslabon.accion,
      detalle: eslabon.detalle,
      timestamp: eslabon.ts,
      nivel: eslabon.nivel,
      hashActual: eslabon.hashActual,
      hashAnterior: prev ? prev.hashActual : '',
    };

    state.logs = [auditEntry, ...state.logs];
    state.lastHash = auditEntry.hashActual;
    listeners.forEach((l) => l());

    if (typeof window !== 'undefined') {
      await idbPut('auditoria', eslabon).catch(() => {});
    }
  },

  loadLogs: async () => {
    state.isLoading = true;
    listeners.forEach((l) => l());
    try {
      if (typeof window !== 'undefined') {
        const raw = await idbGetAll<EntradaAuditoria>('auditoria');
        raw.sort((a, b) => b.seq - a.seq);
        state.logs = raw.map((r) => ({
          id: `audit-${r.seq}`,
          seq: r.seq,
          casoId: r.casoId || undefined,
          usuario: r.usuario,
          accion: r.accion,
          detalle: r.detalle,
          timestamp: r.ts,
          nivel: r.nivel,
          hashActual: r.hashActual,
          hashAnterior: r.hashAnterior,
        }));
        state.lastHash = state.logs[0]?.hashActual || GENESIS_HASH;
      }
    } finally {
      state.isLoading = false;
      listeners.forEach((l) => l());
    }
  },

  getLogsByCaso: (casoId: string) => {
    return state.logs.filter((l) => l.casoId === casoId);
  },

  clearLogs: async () => {
    state.logs = [];
    state.lastHash = GENESIS_HASH;
    listeners.forEach((l) => l());
    if (typeof window !== 'undefined') {
      await idbClear('auditoria').catch(() => {});
    }
  },

  verifyChain: async () => {
    if (state.logs.length === 0) return { valid: true };
    const entradas: EntradaAuditoria[] = state.logs.map((l) => ({
      seq: l.seq || 1,
      casoId: l.casoId || null,
      usuario: l.usuario,
      accion: l.accion,
      detalle: l.detalle,
      nivel: l.nivel,
      ts: l.timestamp,
      hashAnterior: l.hashAnterior || GENESIS_HASH,
      hashActual: l.hashActual,
    }));

    const res = await verificarCadena(entradas);
    if (res.valida) {
      return { valid: true };
    }
    const roto = state.logs.find((l) => l.seq === res.rotoEn);
    return { valid: false, brokenAt: roto?.id || String(res.rotoEn) };
  },
};

const listeners = new Set<() => void>();

export const useAuditStore = {
  getState: () => state,
  setState: (partial: Partial<AuditState>) => {
    state = { ...state, ...partial };
    listeners.forEach((l) => l());
  },
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};
