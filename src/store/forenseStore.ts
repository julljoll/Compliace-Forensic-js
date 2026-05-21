import { create } from 'zustand';

export interface Caso {
  id?: number;
  numeroCaso: string;
  fiscal: string;
  fechaInicio: string;
  estado: 'activo' | 'cerrado' | 'archivado';
  pasoActual: number;
}

export interface Dispositivo {
  id?: number;
  casoId?: number;
  marca: string;
  modelo: string;
  imei: string;
  imei2: string;
  simCard: string;
  numeroTel: string;
  estadoFisico: string;
  modoAislamiento: 'modo_avion' | 'bolsa_faraday' | 'otro';
  danosVisibles: string;
  bateriaEstado: string;
  pantallaEstado: 'encendido' | 'apagado';
}

export interface PRCC {
  expediente: string;
  prcc: string;
  despachoInstruye: string;
  organismoInstruye: string;
  despachoInicia: string;
  organismoInicia: string;
  direccion: string;
  fechaHora: string;
  formaObtencion: string;
  fijacion: { nombre: string; ci: string };
  coleccion: { nombre: string; ci: string };
  descripcion: string;
  motivoTransferencia: string;
  entrega: { nombre: string; organismo: string; despacho: string; ci: string; };
  recibe: { nombre: string; organismo: string; despacho: string; ci: string; };
  observaciones: string;
}

export interface Adquisicion {
  id?: number;
  casoId?: number;
  herramienta: 'andriller' | 'aleapp';
  versionHerramienta: string;
  tipoExtraccion: 'logica' | 'fisica' | 'analisis';
  rutaSalida: string;
  rutaImagenOrigen: string;
  hashOrigenSHA256: string;
  hashCopiaSHA256: string;
  hashesCoinciden: boolean;
  logEjecucion: string;
  pidProceso: number;
}

interface ForenseState {
  // Estado del caso actual
  casoActual: Caso | null;
  dispositivoActual: Dispositivo | null;
  prccActual: PRCC | null;
  adquisicionAndriller: Adquisicion | null;
  adquisicionAleapp: Adquisicion | null;
  
  // Acciones para Caso
  setCaso: (caso: Caso) => void;
  clearCaso: () => void;
  
  // Acciones para Dispositivo
  setDispositivo: (dispositivo: Dispositivo) => void;
  clearDispositivo: () => void;
  
  // Acciones para PRCC
  setPRCC: (prcc: PRCC) => void;
  clearPRCC: () => void;
  
  // Acciones para Adquisiciones
  setAdquisicionAndriller: (adquisicion: Adquisicion) => void;
  setAdquisicionAleapp: (adquisicion: Adquisicion) => void;
  
  // Reset completo
  resetAll: () => void;

  // Seguimiento de pasos completed
  completedSteps: Record<string, boolean>;
  setStepCompleted: (stepId: string, completed: boolean) => void;
  loadCompletedSteps: () => void;
}

export const useForenseStore = create<ForenseState>((set) => ({
  // Estado inicial
  casoActual: null,
  dispositivoActual: null,
  prccActual: null,
  adquisicionAndriller: null,
  adquisicionAleapp: null,
  completedSteps: (() => {
    try {
      const stored = localStorage.getItem('sha256_completed_steps');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  })(),
  
  // Acciones Caso
  setCaso: (caso) => set({ casoActual: caso }),
  clearCaso: () => set({ casoActual: null }),
  
  // Acciones Dispositivo
  setDispositivo: (dispositivo) => set({ dispositivoActual: dispositivo }),
  clearDispositivo: () => set({ dispositivoActual: null }),
  
  // Acciones PRCC
  setPRCC: (prcc) => set({ prccActual: prcc }),
  clearPRCC: () => set({ prccActual: null }),
  
  // Acciones Adquisiciones
  setAdquisicionAndriller: (adquisicion) => set({ adquisicionAndriller: adquisicion }),
  setAdquisicionAleapp: (adquisicion) => set({ adquisicionAleapp: adquisicion }),
  
  // Reset
  resetAll: () => set({
    casoActual: null,
    dispositivoActual: null,
    prccActual: null,
    adquisicionAndriller: null,
    adquisicionAleapp: null,
    completedSteps: {},
  }),

  // Acciones para Seguimiento
  setStepCompleted: (stepId, completed) => set((state) => {
    const next = { ...state.completedSteps, [stepId]: completed };
    try {
      localStorage.setItem('sha256_completed_steps', JSON.stringify(next));
    } catch (e) {
      console.error('Error saving completed steps to localStorage', e);
    }
    return { completedSteps: next };
  }),

  loadCompletedSteps: () => {
    try {
      const stored = localStorage.getItem('sha256_completed_steps');
      if (stored) {
        set({ completedSteps: JSON.parse(stored) });
      }
    } catch (e) {
      console.error('Error loading completed steps from localStorage', e);
    }
  },
}));
