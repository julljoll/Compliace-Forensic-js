import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
  pertiLider: string;
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
  addCaso: (caso: Omit<CasoCMS, 'id' | 'fechaCreacion' | 'fechaUltimaActualizacion'>) => string;
  updateCaso: (id: string, datos: Partial<CasoCMS>) => void;
  deleteCaso: (id: string) => void;
  seleccionarCaso: (id: string | null) => void;
  
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
      addCaso: (caso) => {
        const id = uid();
        const nuevo: CasoCMS = {
          ...caso,
          id,
          fechaCreacion: now(),
          fechaUltimaActualizacion: now(),
        };
        set(s => ({ casos: [...s.casos, nuevo] }));
        get().addAuditLog({ accion: 'CASO_CREADO', detalle: `Caso ${caso.numeroCaso} creado`, nivel: 'success', casoId: id, usuario: caso.pertiLider });
        return id;
      },
      updateCaso: (id, datos) => {
        set(s => ({
          casos: s.casos.map(c => c.id === id ? { ...c, ...datos, fechaUltimaActualizacion: now() } : c)
        }));
        get().addAuditLog({ accion: 'CASO_ACTUALIZADO', detalle: `Caso ${id} actualizado`, nivel: 'info', casoId: id, usuario: 'sistema' });
      },
      deleteCaso: (id) => {
        set(s => ({ casos: s.casos.filter(c => c.id !== id) }));
      },
      seleccionarCaso: (id) => set({ casoSeleccionado: id }),

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

      // ── Compliance Checklist ──
      toggleComplianceCheck: (stageId, normativaId) => {
        set(s => {
          const existing = s.complianceChecklist.find(c => c.stageId === stageId);
          if (existing) {
            return {
              complianceChecklist: s.complianceChecklist.map(c =>
                c.stageId === stageId
                  ? { ...c, checked: !c.checked, fechaCheck: !c.checked ? new Date().toISOString() : undefined }
                  : c
              ),
            };
          }
          return {
            complianceChecklist: [
              ...s.complianceChecklist,
              { stageId, normativaId, checked: true, fechaCheck: new Date().toISOString(), observacion: '' },
            ],
          };
        });
      },
      setComplianceObservacion: (stageId, observacion) => {
        set(s => ({
          complianceChecklist: s.complianceChecklist.map(c =>
            c.stageId === stageId ? { ...c, observacion } : c
          ),
        }));
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
    { name: 'cms-forense-store', version: 1 }
  )
);
