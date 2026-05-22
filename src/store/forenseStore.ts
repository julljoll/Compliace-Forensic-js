import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useCMSStore } from './cmsStore';
import { getPasosPorTipo } from '../data/tiposProyecto';

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
  
  // ID del caso CMS vinculado (para sync con Seguimiento & Compliance)
  cmsCasoId: string | null;

  // Acciones para Caso
  setCaso: (caso: Caso) => void;
  clearCaso: () => void;

  // Vinculación con CMS
  setCmsCasoId: (id: string | null) => void;
  
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

  // Seguimiento de pasos completed y metadatos
  completedSteps: Record<string, boolean>;
  stepMetadata: Record<string, { fecha?: string; responsable?: string; observaciones?: string }>;
  setStepCompleted: (stepId: string, completed: boolean) => void;
  setStepMetadata: (stepId: string, metadata: { fecha?: string; responsable?: string; observaciones?: string }) => void;
  loadCompletedSteps: () => void;

  // Sincronizar paso completado con cmsStore (Seguimiento & Compliance)
  markCmsStepComplete: (stepIndex: number) => void;
}

export const useForenseStore = create<ForenseState>()(
  persist(
    (set, get) => ({
      casoActual: null,
      dispositivoActual: null,
      prccActual: null,
      adquisicionAndriller: null,
      adquisicionAleapp: null,
      cmsCasoId: null,
      completedSteps: {},
      stepMetadata: {},

      setCaso: (caso) => set({ casoActual: caso }),
      clearCaso: () => set({ casoActual: null }),
      setCmsCasoId: (id) => set({ cmsCasoId: id }),

      setDispositivo: (dispositivo) => set({ dispositivoActual: dispositivo }),
      clearDispositivo: () => set({ dispositivoActual: null }),

      setPRCC: (prcc) => set({ prccActual: prcc }),
      clearPRCC: () => set({ prccActual: null }),

      setAdquisicionAndriller: (adquisicion) => set({ adquisicionAndriller: adquisicion }),
      setAdquisicionAleapp: (adquisicion) => set({ adquisicionAleapp: adquisicion }),

      resetAll: () => set({
        casoActual: null,
        dispositivoActual: null,
        prccActual: null,
        adquisicionAndriller: null,
        adquisicionAleapp: null,
        cmsCasoId: null,
        completedSteps: {},
        stepMetadata: {},
      }),

      markCmsStepComplete: (stepIndex) => {
        const { cmsCasoId } = get();
        if (!cmsCasoId) return;
        const cmsStore = useCMSStore.getState();
        const caso = cmsStore.casos.find(c => c.id === cmsCasoId);
        if (!caso) return;
        const pasos = getPasosPorTipo(caso.tipoProyecto);
        const paso = pasos[stepIndex];
        if (!paso) return;

        // Usar nuevo sistema si steps existe, legacy como fallback
        if (caso.steps) {
          const stepState = caso.steps[paso.id];
          if (stepState?.estado === 'disponible' || stepState?.estado === 'en_progreso') {
            cmsStore.completeStep(paso.id);
          }
        } else {
          cmsStore.setStepCompleted(paso.id, true);
        }
      },

      setStepCompleted: (stepId, completed) => set((state) => {
        const next = { ...state.completedSteps, [stepId]: completed };

        let nextMetadata = { ...state.stepMetadata };
        if (completed && !nextMetadata[stepId]) {
          const now = new Date();
          const offset = now.getTimezoneOffset() * 60000;
          const localISOTime = (new Date(now.getTime() - offset)).toISOString().slice(0, 16);
          nextMetadata[stepId] = {
            fecha: localISOTime,
            responsable: state.casoActual?.fiscal || 'Perito de Guardia',
            observaciones: ''
          };
        }

        return { completedSteps: next, stepMetadata: nextMetadata };
      }),

      setStepMetadata: (stepId, metadata) => set((state) => {
        const nextMetadata = {
          ...state.stepMetadata,
          [stepId]: { ...state.stepMetadata[stepId], ...metadata }
        };
        return { stepMetadata: nextMetadata };
      }),

      loadCompletedSteps: () => {
        const state = get();
        set({
          completedSteps: state.completedSteps || {},
          stepMetadata: state.stepMetadata || {}
        });
      },
    }),
    {
      name: 'sha256-forense-storage',
      version: 1,
    }
  )
);
