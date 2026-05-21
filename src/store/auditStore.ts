import { create } from 'zustand';
import { indexedDBStorage } from '../db/indexedDB';

export interface AuditEntry {
  id: string;
  casoId?: string;
  usuario: string;
  accion: string;
  detalle: string;
  timestamp: string;
  nivel: 'info' | 'warning' | 'error' | 'success';
  /** Hash SHA-256 del contenido de esta entrada */
  hashActual: string;
  /** Hash SHA-256 de la entrada anterior (encadenamiento inmutable) */
  hashAnterior: string;
  /** Perito que firma esta entrada */
  firmadoPor?: string;
  /** Timestamp de firma */
  firmadoTimestamp?: string;
}

interface AuditState {
  logs: AuditEntry[];
  isLoading: boolean;
  error: string | null;
  /** Hash de la última entrada (para encadenamiento) */
  lastHash: string;

  addEntry: (entry: Omit<AuditEntry, 'id' | 'timestamp' | 'hashActual' | 'hashAnterior'>) => Promise<void>;
  loadLogs: () => Promise<void>;
  getLogsByCaso: (casoId: string) => AuditEntry[];
  clearLogs: () => Promise<void>;
  exportToJSON: () => Promise<string>;
  verifyChain: () => Promise<{ valid: boolean; brokenAt?: string }>;
}

async function sha256(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const buffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

const STORE_NAME = 'audit_logs';

export const useAuditStore = create<AuditState>()((set, get) => ({
  logs: [],
  isLoading: false,
  error: null,
  lastHash: '',

  addEntry: async (entry) => {
    const { logs, lastHash } = get();
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const timestamp = new Date().toISOString();

    const content = `${entry.accion}|${entry.detalle}|${entry.usuario}|${timestamp}|${lastHash}`;
    const hashActual = await sha256(content);

    const newEntry: AuditEntry = {
      ...entry,
      id,
      timestamp,
      hashActual,
      hashAnterior: lastHash,
    };

    try {
      await indexedDBStorage.setItem(STORE_NAME, newEntry);
      set({ logs: [newEntry, ...logs], lastHash: hashActual });
    } catch (err) {
      console.error('[AuditStore] Error guardando entrada:', err);
      set({ error: 'Error al registrar entrada de auditoría' });
    }
  },

  loadLogs: async () => {
    set({ isLoading: true });
    try {
      const logs = await indexedDBStorage.getAll<AuditEntry>(STORE_NAME);
      logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      const lastHash = logs.length > 0 ? logs[0].hashActual : '';
      set({ logs, lastHash, isLoading: false });
    } catch (err) {
      console.error('[AuditStore] Error cargando logs:', err);
      set({ error: 'Error al cargar registros de auditoría', isLoading: false });
    }
  },

  getLogsByCaso: (casoId) => {
    return get().logs.filter((l) => l.casoId === casoId);
  },

  clearLogs: async () => {
    try {
      await indexedDBStorage.clear(STORE_NAME);
      set({ logs: [], lastHash: '' });
    } catch (err) {
      console.error('[AuditStore] Error limpiando logs:', err);
    }
  },

  exportToJSON: async () => {
    return indexedDBStorage.exportToJSON(STORE_NAME);
  },

  verifyChain: async () => {
    const logs = get().logs;
    if (logs.length === 0) return { valid: true };

    const sorted = [...logs].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    for (let i = 0; i < sorted.length; i++) {
      const entry = sorted[i];
      const prevHash = i === 0 ? '' : sorted[i - 1].hashActual;

      const content = `${entry.accion}|${entry.detalle}|${entry.usuario}|${entry.timestamp}|${prevHash}`;
      const expectedHash = await sha256(content);

      if (entry.hashActual !== expectedHash) {
        return { valid: false, brokenAt: entry.id };
      }
      if (entry.hashAnterior !== prevHash) {
        return { valid: false, brokenAt: entry.id };
      }
    }
    return { valid: true };
  },
}));
