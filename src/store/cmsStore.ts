import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// ─── Enumeraciones ────────────────────────────────────────────────────────────

export type EstadoCaso = 'iniciado' | 'en_proceso' | 'analisis' | 'informe' | 'cerrado' | 'archivado';
export type PrioridadCaso = 'critica' | 'alta' | 'media' | 'baja';
export type EstadoTarea = 'pendiente' | 'en_progreso' | 'completada' | 'bloqueada';
export type TipoNormativa = 'ISO' | 'NIST' | 'LEY' | 'MANUAL' | 'REGLAMENTO';
export type NivelCumplimiento = 'conforme' | 'parcial' | 'no_conforme' | 'no_aplica';
export type TipoEvidencia = 'dispositivo_movil' | 'computador' | 'memoria' | 'imagen_forense' | 'documento' | 'otro';
export type RolPersonal = 'perito_lider' | 'perito_asistente' | 'fiscal' | 'compliance_officer' | 'coordinador';

// ─── Interfaces de Entidades ──────────────────────────────────────────────────

export interface Personal {
  id: string;
  nombre: string;
  apellido: string;
  ci: string;
  cargo: string;
  rol: RolPersonal;
  organismo: string;
  despacho: string;
  email: string;
  telefono: string;
  activo: boolean;
  ranking?: number;
  profileImage?: string;
}

export interface Normativa {
  id: string;
  codigo: string;
  tipo: TipoNormativa;
  nombre: string;
  descripcion: string;
  version: string;
  fechaVigencia: string;
  urlReferencia?: string;
  articulos?: string[];
  activa: boolean;
}

export interface ChecklistItem {
  id: string;
  normativaId: string;
  requisito: string;
  descripcion: string;
  evidencia?: string;
  cumplimiento: NivelCumplimiento;
  observaciones: string;
  fechaVerificacion?: string;
  verificadoPor?: string;
}

export interface Evidencia {
  id: string;
  casoId: string;
  numero: string;
  tipo: TipoEvidencia;
  descripcion: string;
  marca?: string;
  modelo?: string;
  serial?: string;
  imei?: string;
  estadoFisico: string;
  hashSHA256?: string;
  hashMD5?: string;
  fechaRecepcion: string;
  ubicacionFisica: string;
  sellado: boolean;
  etiquetado: boolean;
  fotoURL?: string;
}

export interface TareaForense {
  id: string;
  casoId: string;
  titulo: string;
  descripcion: string;
  asignadoA: string;
  estado: EstadoTarea;
  prioridad: PrioridadCaso;
  fechaCreacion: string;
  fechaVencimiento?: string;
  fechaCompletada?: string;
  normativasRelacionadas: string[];
  observaciones: string;
  porcentaje: number;
}

export interface FaseForense {
  id: string;
  casoId: string;
  nombre: string;
  orden: number;
  estado: EstadoTarea;
  responsable: string;
  fechaInicio?: string;
  fechaFin?: string;
  normativasAplicadas: string[];
  checklist: ChecklistItem[];
  notas: string;
}

export interface AuditLog {
  id: string;
  casoId?: string;
  usuario: string;
  accion: string;
  detalle: string;
  timestamp: string;
  nivel: 'info' | 'warning' | 'error' | 'success';
}

export interface CasoCMS {
  id: string;
  numeroCaso: string;
  numeroPRCC?: string;
  expediente?: string;
  titulo: string;
  descripcion: string;
  estado: EstadoCaso;
  prioridad: PrioridadCaso;
  fechaCreacion: string;
  fechaUltimaActualizacion: string;
  fechaCierre?: string;
  
  // Equipo
  peritoLider: string;
  fiscal?: string;
  compliance?: string;
  
  // Contexto legal
  despachoFiscal?: string;
  organismoOrdenante?: string;
  
  // Normativas aplicadas al caso
  normativasAplicadas: string[];
  
  // Progreso
  fasesCompletadas: number;
  totalFases: number;
  porcentajeCompletado: number;
  
  // Evidencias
  totalEvidencias: number;
  
  // Cumplimiento global calculado
  nivelCumplimientoGeneral: NivelCumplimiento;
  
  // Tags
  etiquetas: string[];
  notas: string;

  // Seguimiento Forense y Compliance
  completed_steps?: Record<string, boolean>;
  step_metadata?: Record<string, { fecha?: string; responsable?: string; observaciones?: string }>;
  compliance_checklist?: { stageId: string; normativaId: string; checked: boolean; fechaCheck?: string; observacion?: string }[];

  // Dispositivo Details
  dispositivo_marca?: string;
  dispositivo_modelo?: string;
  dispositivo_imei?: string;
  dispositivo_imei2?: string;
  dispositivo_sim_card?: string;
  dispositivo_numero_tel?: string;
  dispositivo_estado_fisico?: string;
  dispositivo_modo_aislamiento?: string;
  dispositivo_danos_visibles?: string;
  dispositivo_bateria_estado?: string;
  dispositivo_pantalla_estado?: string;
}

// ─── Compliance Checklist por Normativa ────────────────────────────────────────

export interface ComplianceCheckItem {
  stageId: string;       // e.g. "n1__identificacion"
  normativaId: string;   // e.g. "n1"
  checked: boolean;
  fechaCheck?: string;
  observacion?: string;
}

// ─── Estado Global del CMS ────────────────────────────────────────────────────

interface CMSState {
  // Datos
  casos: CasoCMS[];
  evidencias: Evidencia[];
  tareas: TareaForense[];
  fases: FaseForense[];
  personal: Personal[];
  normativas: Normativa[];
  auditLogs: AuditLog[];
  complianceChecklist: ComplianceCheckItem[];
  
  // Estado UI
  casoSeleccionado: string | null;
  filtroEstado: EstadoCaso | 'todos';
  filtroPrioridad: PrioridadCaso | 'todos';
  busqueda: string;
  
  // Acciones - Casos
  fetchCasos: () => Promise<void>;
  addCaso: (caso: Omit<CasoCMS, 'id' | 'fechaCreacion' | 'fechaUltimaActualizacion'>) => Promise<string | null>;
  updateCaso: (id: string, datos: Partial<CasoCMS>) => Promise<void>;
  deleteCaso: (id: string) => Promise<void>;
  seleccionarCaso: (id: string | null) => void;
  setStepCompleted: (stepId: string, completed: boolean) => void;
  setStepMetadata: (stepId: string, metadata: { fecha?: string; responsable?: string; observaciones?: string }) => void;
  
  // Acciones - Evidencias
  addEvidencia: (evidencia: Omit<Evidencia, 'id'>) => void;
  updateEvidencia: (id: string, datos: Partial<Evidencia>) => void;
  deleteEvidencia: (id: string) => void;
  
  // Acciones - Tareas
  addTarea: (tarea: Omit<TareaForense, 'id' | 'fechaCreacion'>) => void;
  updateTarea: (id: string, datos: Partial<TareaForense>) => void;
  deleteTarea: (id: string) => void;
  
  // Acciones - Fases
  addFase: (fase: Omit<FaseForense, 'id'>) => void;
  updateFase: (id: string, datos: Partial<FaseForense>) => void;
  
  // Acciones - Personal
  addPersonal: (p: Omit<Personal, 'id'>) => void;
  updatePersonal: (id: string, datos: Partial<Personal>) => void;
  
  // Acciones - Normativas
  addNormativa: (n: Omit<Normativa, 'id'>) => void;
  
  // Acciones - Audit
  addAuditLog: (log: Omit<AuditLog, 'id' | 'timestamp'>) => void;
  
  // Acciones - Compliance Checklist
  toggleComplianceCheck: (stageId: string, normativaId: string) => void;
  setComplianceObservacion: (stageId: string, observacion: string) => void;
  getComplianceByNormativa: (normativaId: string) => ComplianceCheckItem[];
  
  // Acciones - Filtros UI
  setFiltroEstado: (estado: EstadoCaso | 'todos') => void;
  setFiltroPrioridad: (p: PrioridadCaso | 'todos') => void;
  setBusqueda: (q: string) => void;
  
  // Selectores computados
  getCasosFiltrados: () => CasoCMS[];
  getEvidenciasPorCaso: (casoId: string) => Evidencia[];
  getTareasPorCaso: (casoId: string) => TareaForense[];
  getFasesPorCaso: (casoId: string) => FaseForense[];
  getAuditLogsPorCaso: (casoId: string) => AuditLog[];
  getEstadisticas: () => {
    totalCasos: number;
    casosActivos: number;
    casosCerrados: number;
    tareasPendientes: number;
    cumplimientoGeneral: number;
    casosConformidad: number;
  };
}

// ─── Datos Iniciales (Normativas del RAG) ─────────────────────────────────────

const NORMATIVAS_INICIALES: Normativa[] = [
  {
    id: 'n1', codigo: 'ISO/IEC 27037:2012', tipo: 'ISO',
    nombre: 'Directrices para identificación, recopilación, adquisición y preservación de evidencia digital',
    descripcion: 'Norma internacional para el manejo de evidencia digital en investigaciones forenses.',
    version: '2012', fechaVigencia: '2012-10-15', activa: true,
    articulos: ['Identificación', 'Recopilación', 'Adquisición', 'Preservación']
  },
  {
    id: 'n2', codigo: 'ISO/IEC 27042:2015', tipo: 'ISO',
    nombre: 'Directrices para el análisis e interpretación de evidencia digital',
    descripcion: 'Norma para el análisis e interpretación de evidencia digital.',
    version: '2015', fechaVigencia: '2015-06-01', activa: true,
  },
  {
    id: 'n3', codigo: 'NIST SP 800-101 r1', tipo: 'NIST',
    nombre: 'Guidelines on Mobile Device Forensics',
    descripcion: 'Guía del NIST para forense en dispositivos móviles.',
    version: 'Rev. 1', fechaVigencia: '2014-05-01', activa: true,
  },
  {
    id: 'n4', codigo: 'MUCC-2017', tipo: 'MANUAL',
    nombre: 'Manual Único de Cadena de Custodia de Evidencias',
    descripcion: 'Manual oficial venezolano para la cadena de custodia de evidencias.',
    version: 'Final 29/09/2017', fechaVigencia: '2017-09-29', activa: true,
  },
  {
    id: 'n5', codigo: 'ACPO-v5', tipo: 'MANUAL',
    nombre: 'ACPO Good Practice Guide for Digital Evidence v5',
    descripcion: 'Guía de buenas prácticas de la ACPO para evidencia digital.',
    version: '5', fechaVigencia: '2012-01-01', activa: true,
  },
  {
    id: 'n6', codigo: 'LEDI-2001', tipo: 'LEY',
    nombre: 'Ley Especial de Delitos Informáticos',
    descripcion: 'Gaceta Oficial Nº 37.313. Ley venezolana de delitos informáticos.',
    version: '2001', fechaVigencia: '2001-10-30', activa: true,
  },
  {
    id: 'n7', codigo: 'LMDF-1999', tipo: 'LEY',
    nombre: 'Ley sobre Mensajes de Datos y Firmas Electrónicas',
    descripcion: 'Marco legal venezolano para mensajes de datos y firmas electrónicas.',
    version: '1999', fechaVigencia: '1999-02-10', activa: true,
  },
  {
    id: 'n8', codigo: 'COPP', tipo: 'LEY',
    nombre: 'Código Orgánico Procesal Penal (Aplicación Supletoria)',
    descripcion: 'Marco procesal de Venezuela aplicable a la cadena de custodia y licitud de la prueba digital.',
    version: '2021', fechaVigencia: '2021-09-17', activa: true,
  },
  {
    id: 'n9', codigo: 'CENIF-2012', tipo: 'REGLAMENTO',
    nombre: 'Creación del Centro Nacional de Informática Forense',
    descripcion: 'Gaceta Oficial N° 39.847. Creación del CENIF.',
    version: '2012', fechaVigencia: '2012-01-20', activa: true,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
const now = () => new Date().toISOString();

const neonStorage = {
  getItem: async (name: string): Promise<string | null> => {
    if (window.electronAPI?.db) {
      // Aquí idealmente usaríamos el ID del usuario real autenticado.
      const state = await window.electronAPI.db.loadState(1);
      return state ? JSON.stringify(state) : null;
    }
    return localStorage.getItem(name);
  },
  setItem: async (name: string, value: string): Promise<void> => {
    if (window.electronAPI?.db) {
      // Almacena todo el estado global en PostgreSQL en background
      await window.electronAPI.db.saveState(1, JSON.parse(value));
    } else {
      localStorage.setItem(name, value);
    }
  },
  removeItem: async (name: string): Promise<void> => {
    if (window.electronAPI?.db) {
      // No implementado
    } else {
      localStorage.removeItem(name);
    }
  },
};

// ─── Store ────────────────────────────────────────────────────────────────────

export const useCMSStore = create<CMSState>()(
  persist(
    (set, get) => ({
      casos: [],
      evidencias: [],
      tareas: [],
      fases: [],
      personal: [],
      normativas: NORMATIVAS_INICIALES,
      auditLogs: [],
      complianceChecklist: [],
      casoSeleccionado: null,
      filtroEstado: 'todos',
      filtroPrioridad: 'todos',
      busqueda: '',

      // ── Casos ──
      fetchCasos: async () => {
        try {
            const casosDB = window.electronAPI?.db ? await window.electronAPI.db.getCasos(1) : null;
            if (casosDB && casosDB.length > 0) {
                const mapeados: CasoCMS[] = casosDB.map((c: any) => {
                    let completed = {};
                    let metadata = {};
                    let compliance = [];
                    try {
                        completed = typeof c.completed_steps === 'string' ? JSON.parse(c.completed_steps) : (c.completed_steps || {});
                    } catch (e) { console.error('Error parsing completed_steps', e); }
                    try {
                        metadata = typeof c.step_metadata === 'string' ? JSON.parse(c.step_metadata) : (c.step_metadata || {});
                    } catch (e) { console.error('Error parsing step_metadata', e); }
                    try {
                        compliance = typeof c.compliance_checklist === 'string' ? JSON.parse(c.compliance_checklist) : (c.compliance_checklist || []);
                    } catch (e) { console.error('Error parsing compliance_checklist', e); }

                    const completedCount = Object.values(completed).filter(Boolean).length;
                    const pct = Math.round((completedCount / 9) * 100);

                    return {
                        id: c.id.toString(),
                        numeroCaso: c.numero_caso,
                        titulo: c.titulo,
                        descripcion: c.descripcion,
                        estado: c.estado,
                        prioridad: c.prioridad || 'media',
                        fechaCreacion: c.created_at,
                        fechaUltimaActualizacion: c.updated_at,
                        peritoLider: 'Perito',
                        fiscal: c.fiscal,
                        normativasAplicadas: [],
                        fasesCompletadas: completedCount,
                        totalFases: 9,
                        porcentajeCompletado: pct,
                        totalEvidencias: 0,
                        nivelCumplimientoGeneral: 'no_aplica',
                        etiquetas: [],
                        notas: '',
                        completed_steps: completed,
                        step_metadata: metadata,
                        compliance_checklist: compliance,
                        dispositivo_marca: c.dispositivo_marca,
                        dispositivo_modelo: c.dispositivo_modelo,
                        dispositivo_imei: c.dispositivo_imei,
                        dispositivo_imei2: c.dispositivo_imei2,
                        dispositivo_sim_card: c.dispositivo_sim_card,
                        dispositivo_numero_tel: c.dispositivo_numero_tel,
                        dispositivo_estado_fisico: c.dispositivo_estado_fisico,
                        dispositivo_modo_aislamiento: c.dispositivo_modo_aislamiento,
                        dispositivo_danos_visibles: c.dispositivo_danos_visibles,
                        dispositivo_bateria_estado: c.dispositivo_bateria_estado,
                        dispositivo_pantalla_estado: c.dispositivo_pantalla_estado,
                    };
                });
                set({ casos: mapeados });
            } else {
                set({ casos: [] });
            }
        } catch (err) {
            console.error('Error fetching casos', err);
        }
      },
      addCaso: async (caso) => {
        try {
            const payload = {
                id: (caso as any).id || uid(),
                numero_caso: caso.numeroCaso,
                titulo: caso.titulo,
                descripcion: caso.descripcion,
                estado: caso.estado,
                prioridad: caso.prioridad || 'media',
                fiscal: caso.fiscal || '',
                dispositivo_marca: caso.dispositivo_marca || '',
                dispositivo_modelo: caso.dispositivo_modelo || '',
                dispositivo_imei: caso.dispositivo_imei || '',
                dispositivo_imei2: caso.dispositivo_imei2 || '',
                dispositivo_sim_card: caso.dispositivo_sim_card || '',
                dispositivo_numero_tel: caso.dispositivo_numero_tel || '',
                dispositivo_estado_fisico: caso.dispositivo_estado_fisico || '',
                dispositivo_modo_aislamiento: caso.dispositivo_modo_aislamiento || '',
                dispositivo_danos_visibles: caso.dispositivo_danos_visibles || '',
                dispositivo_bateria_estado: caso.dispositivo_bateria_estado || '',
                dispositivo_pantalla_estado: caso.dispositivo_pantalla_estado || '',
                completed_steps: caso.completed_steps || {},
                step_metadata: caso.step_metadata || {},
                compliance_checklist: caso.compliance_checklist || [],
                user_id: 1
            };
            const result = window.electronAPI?.db ? await window.electronAPI.db.addCaso(payload) : null;
            
            if (result && result.success) {
                const id = result.id.toString();
                const nuevo: CasoCMS = {
                  ...caso,
                  id,
                  fechaCreacion: now(),
                  fechaUltimaActualizacion: now(),
                  completed_steps: payload.completed_steps,
                  step_metadata: payload.step_metadata,
                  compliance_checklist: payload.compliance_checklist,
                  dispositivo_marca: payload.dispositivo_marca,
                  dispositivo_modelo: payload.dispositivo_modelo,
                  dispositivo_imei: payload.dispositivo_imei,
                  dispositivo_imei2: payload.dispositivo_imei2,
                  dispositivo_sim_card: payload.dispositivo_sim_card,
                  dispositivo_numero_tel: payload.dispositivo_numero_tel,
                  dispositivo_estado_fisico: payload.dispositivo_estado_fisico,
                  dispositivo_modo_aislamiento: payload.dispositivo_modo_aislamiento,
                  dispositivo_danos_visibles: payload.dispositivo_danos_visibles,
                  dispositivo_bateria_estado: payload.dispositivo_bateria_estado,
                  dispositivo_pantalla_estado: payload.dispositivo_pantalla_estado,
                };
                set(s => ({ casos: [...s.casos, nuevo] }));
                get().addAuditLog({ accion: 'CASO_CREADO', detalle: `Caso ${caso.numeroCaso} creado exitosamente en Neon`, nivel: 'success', casoId: id, usuario: caso.peritoLider });
                return id;
            }
            throw new Error(result?.error || 'Error desconocido al guardar en DB');
        } catch (e) {
            console.error('Error addCaso DB:', e);
            get().addAuditLog({ accion: 'CASO_ERROR', detalle: `Error guardando en base de datos Neon`, nivel: 'error', casoId: undefined, usuario: caso.peritoLider });
            return null;
        }
      },
      updateCaso: async (id, datos) => {
        set(s => ({
          casos: s.casos.map(c => c.id === id ? { ...c, ...datos, fechaUltimaActualizacion: now() } : c)
        }));
        try {
          if (window.electronAPI?.db) {
            const mappedData: any = { ...datos };
            if (datos.numeroCaso !== undefined) mappedData.numero_caso = datos.numeroCaso;
            if (datos.dispositivo_marca !== undefined) mappedData.dispositivo_marca = datos.dispositivo_marca;
            if (datos.dispositivo_modelo !== undefined) mappedData.dispositivo_modelo = datos.dispositivo_modelo;
            if (datos.dispositivo_imei !== undefined) mappedData.dispositivo_imei = datos.dispositivo_imei;
            if (datos.dispositivo_imei2 !== undefined) mappedData.dispositivo_imei2 = datos.dispositivo_imei2;
            if (datos.dispositivo_sim_card !== undefined) mappedData.dispositivo_sim_card = datos.dispositivo_sim_card;
            if (datos.dispositivo_numero_tel !== undefined) mappedData.dispositivo_numero_tel = datos.dispositivo_numero_tel;
            if (datos.dispositivo_estado_fisico !== undefined) mappedData.dispositivo_estado_fisico = datos.dispositivo_estado_fisico;
            if (datos.dispositivo_modo_aislamiento !== undefined) mappedData.dispositivo_modo_aislamiento = datos.dispositivo_modo_aislamiento;
            if (datos.dispositivo_danos_visibles !== undefined) mappedData.dispositivo_danos_visibles = datos.dispositivo_danos_visibles;
            if (datos.dispositivo_bateria_estado !== undefined) mappedData.dispositivo_bateria_estado = datos.dispositivo_bateria_estado;
            if (datos.dispositivo_pantalla_estado !== undefined) mappedData.dispositivo_pantalla_estado = datos.dispositivo_pantalla_estado;
            await window.electronAPI.db.updateCaso(id, mappedData);
          }
        } catch (e) {
          console.error('Error al actualizar caso en DB:', e);
        }
        get().addAuditLog({ accion: 'CASO_ACTUALIZADO', detalle: `Caso ${id} actualizado`, nivel: 'info', casoId: id, usuario: 'sistema' });
      },
      deleteCaso: async (id) => {
        set(s => ({ casos: s.casos.filter(c => c.id !== id) }));
        try {
          if (window.electronAPI?.db) {
            await window.electronAPI.db.deleteCaso(id);
          }
        } catch (e) {
          console.error('Error al eliminar caso en DB:', e);
        }
        get().addAuditLog({ accion: 'CASO_ELIMINADO', detalle: `Caso ${id} eliminado`, nivel: 'warning', casoId: id, usuario: 'sistema' });
      },
      seleccionarCaso: (id) => {
        set({ casoSeleccionado: id });
        if (id) {
          const caso = get().casos.find(c => c.id === id);
          if (caso) {
            set({ complianceChecklist: caso.compliance_checklist || [] });
          }
        } else {
          set({ complianceChecklist: [] });
        }
      },
      setStepCompleted: (stepId, completed) => {
        const { casoSeleccionado, casos } = get();
        if (!casoSeleccionado) return;
        const caso = casos.find(c => c.id === casoSeleccionado);
        if (!caso) return;

        const completed_steps = { ...(caso.completed_steps || {}), [stepId]: completed };

        let step_metadata = { ...(caso.step_metadata || {}) };
        if (completed && !step_metadata[stepId]) {
          const nowTime = new Date();
          const offset = nowTime.getTimezoneOffset() * 60000;
          const localISOTime = (new Date(nowTime.getTime() - offset)).toISOString().slice(0, 16);
          step_metadata[stepId] = {
            fecha: localISOTime,
            responsable: caso.fiscal || 'Perito de Guardia',
            observaciones: ''
          };
        }

        const stepsArray = Object.keys(completed_steps).filter(k => completed_steps[k]);
        const porcentajeCompletado = Math.round((stepsArray.length / 9) * 100);

        get().updateCaso(casoSeleccionado, {
          completed_steps,
          step_metadata,
          porcentajeCompletado,
          fasesCompletadas: stepsArray.length,
          totalFases: 9
        });
      },
      setStepMetadata: (stepId, metadata) => {
        const { casoSeleccionado, casos } = get();
        if (!casoSeleccionado) return;
        const caso = casos.find(c => c.id === casoSeleccionado);
        if (!caso) return;

        const step_metadata = {
          ...(caso.step_metadata || {}),
          [stepId]: { ...(caso.step_metadata?.[stepId] || {}), ...metadata }
        };

        get().updateCaso(casoSeleccionado, { step_metadata });
      },

      // ── Evidencias ──
      addEvidencia: (evidencia) => {
        set(s => ({ evidencias: [...s.evidencias, { ...evidencia, id: uid() }] }));
      },
      updateEvidencia: (id, datos) => {
        set(s => ({ evidencias: s.evidencias.map(e => e.id === id ? { ...e, ...datos } : e) }));
      },
      deleteEvidencia: (id) => {
        set(s => ({ evidencias: s.evidencias.filter(e => e.id !== id) }));
      },

      // ── Tareas ──
      addTarea: (tarea) => {
        set(s => ({ tareas: [...s.tareas, { ...tarea, id: uid(), fechaCreacion: now() }] }));
      },
      updateTarea: (id, datos) => {
        set(s => ({ tareas: s.tareas.map(t => t.id === id ? { ...t, ...datos } : t) }));
      },
      deleteTarea: (id) => {
        set(s => ({ tareas: s.tareas.filter(t => t.id !== id) }));
      },

      // ── Fases ──
      addFase: (fase) => {
        set(s => ({ fases: [...s.fases, { ...fase, id: uid() }] }));
      },
      updateFase: (id, datos) => {
        set(s => ({ fases: s.fases.map(f => f.id === id ? { ...f, ...datos } : f) }));
      },

      // ── Personal ──
      addPersonal: (p) => {
        set(s => ({ personal: [...s.personal, { ...p, id: uid() }] }));
      },
      updatePersonal: (id, datos) => {
        set(s => ({ personal: s.personal.map(p => p.id === id ? { ...p, ...datos } : p) }));
      },

      // ── Normativas ──
      addNormativa: (n) => {
        set(s => ({ normativas: [...s.normativas, { ...n, id: uid() }] }));
      },

      // ── Audit ──
      addAuditLog: (log) => {
        set(s => ({
          auditLogs: [{ ...log, id: uid(), timestamp: now() }, ...s.auditLogs].slice(0, 500)
        }));
      },

      toggleComplianceCheck: (stageId, normativaId) => {
        set(s => {
          let updatedChecklist: ComplianceCheckItem[] = [];
          const existing = s.complianceChecklist.find(c => c.stageId === stageId);
          if (existing) {
            updatedChecklist = s.complianceChecklist.map(c =>
              c.stageId === stageId
                ? { ...c, checked: !c.checked, fechaCheck: !c.checked ? new Date().toISOString() : undefined }
                : c
            );
          } else {
            updatedChecklist = [
              ...s.complianceChecklist,
              { stageId, normativaId, checked: true, fechaCheck: new Date().toISOString(), observacion: '' },
            ];
          }

          if (s.casoSeleccionado) {
            const casoAct = s.casos.find(c => c.id === s.casoSeleccionado);
            if (casoAct) {
              const currentChecklist = casoAct.compliance_checklist || [];
              let nextChecklist: any[] = [];
              const cExisting = currentChecklist.find(c => c.stageId === stageId);
              if (cExisting) {
                nextChecklist = currentChecklist.map(c =>
                  c.stageId === stageId
                    ? { ...c, checked: !c.checked, fechaCheck: !c.checked ? new Date().toISOString() : undefined }
                    : c
                );
              } else {
                nextChecklist = [
                  ...currentChecklist,
                  { stageId, normativaId, checked: true, fechaCheck: new Date().toISOString(), observacion: '' }
                ];
              }
              setTimeout(() => {
                get().updateCaso(s.casoSeleccionado!, { compliance_checklist: nextChecklist });
              }, 0);
            }
          }

          return { complianceChecklist: updatedChecklist };
        });
      },
      setComplianceObservacion: (stageId, observacion) => {
        set(s => {
          const updatedChecklist = s.complianceChecklist.map(c =>
            c.stageId === stageId ? { ...c, observacion } : c
          );

          if (s.casoSeleccionado) {
            const casoAct = s.casos.find(c => c.id === s.casoSeleccionado);
            if (casoAct) {
              const currentChecklist = casoAct.compliance_checklist || [];
              const nextChecklist = currentChecklist.map(c =>
                c.stageId === stageId ? { ...c, observacion } : c
              );
              setTimeout(() => {
                get().updateCaso(s.casoSeleccionado!, { compliance_checklist: nextChecklist });
              }, 0);
            }
          }

          return { complianceChecklist: updatedChecklist };
        });
      },
      getComplianceByNormativa: (normativaId) => {
        return get().complianceChecklist.filter(c => c.normativaId === normativaId);
      },

      // ── Filtros ──
      setFiltroEstado: (estado) => set({ filtroEstado: estado }),
      setFiltroPrioridad: (p) => set({ filtroPrioridad: p }),
      setBusqueda: (q) => set({ busqueda: q }),

      // ── Selectores ──
      getCasosFiltrados: () => {
        const { casos, filtroEstado, filtroPrioridad, busqueda } = get();
        return casos.filter(c => {
          const matchEstado = filtroEstado === 'todos' || c.estado === filtroEstado;
          const matchPrioridad = filtroPrioridad === 'todos' || c.prioridad === filtroPrioridad;
          const matchBusqueda = !busqueda ||
            c.numeroCaso.toLowerCase().includes(busqueda.toLowerCase()) ||
            c.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
            c.descripcion.toLowerCase().includes(busqueda.toLowerCase());
          return matchEstado && matchPrioridad && matchBusqueda;
        });
      },
      getEvidenciasPorCaso: (casoId) => get().evidencias.filter(e => e.casoId === casoId),
      getTareasPorCaso: (casoId) => get().tareas.filter(t => t.casoId === casoId),
      getFasesPorCaso: (casoId) => get().fases.filter(f => f.casoId === casoId).sort((a, b) => a.orden - b.orden),
      getAuditLogsPorCaso: (casoId) => get().auditLogs.filter(l => l.casoId === casoId),
      getEstadisticas: () => {
        const { casos, tareas } = get();
        const activos = casos.filter(c => !['cerrado', 'archivado'].includes(c.estado));
        const cerrados = casos.filter(c => c.estado === 'cerrado');
        const conformes = casos.filter(c => c.nivelCumplimientoGeneral === 'conforme');
        const pendientes = tareas.filter(t => t.estado === 'pendiente');
        const cumplimientoGeneral = casos.length > 0 ? Math.round((conformes.length / casos.length) * 100) : 0;
        return {
          totalCasos: casos.length,
          casosActivos: activos.length,
          casosCerrados: cerrados.length,
          tareasPendientes: pendientes.length,
          cumplimientoGeneral,
          casosConformidad: conformes.length,
        };
      },
    }),
    {
      name: 'cms-neon-storage',
      storage: createJSONStorage(() => neonStorage),
      partialize: (state) => ({ ...state, casos: [] }), // Ignoramos 'casos' porque ya los obtenemos explícitamente con fetchCasos para que no haya colisiones
    }
  )
);
