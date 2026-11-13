/**
 * SHA256.US — Tipos de dominio forense (migrados desde legacy cmsStore.ts sin pérdida de campos).
 * Fuente única de verdad para CasoCMS y entidades relacionadas.
 */

// ─── Enumeraciones ────────────────────────────────────────────────────────────

export type EstadoCaso = 'iniciado' | 'en_proceso' | 'analisis' | 'informe' | 'cerrado' | 'archivado';
export type PrioridadCaso = 'critica' | 'alta' | 'media' | 'baja';
export type EstadoTarea = 'pendiente' | 'en_progreso' | 'completada' | 'bloqueada';
export type TipoNormativa = 'ISO' | 'NIST' | 'LEY' | 'MANUAL' | 'REGLAMENTO';
export type NivelCumplimiento = 'conforme' | 'parcial' | 'no_conforme' | 'no_aplica';
export type TipoEvidencia = 'dispositivo_movil' | 'computador' | 'memoria' | 'imagen_forense' | 'documento' | 'otro';
export type RolPersonal = 'perito_lider' | 'perito_asistente' | 'fiscal' | 'compliance_officer' | 'coordinador' | 'admin';
export type TipoProyecto = 'forense_whatsapp' | 'forense_email' | 'forense_discoduro' | 'forense_imagen';
export type EstadoPaso = 'bloqueado' | 'disponible' | 'en_progreso' | 'completado';

export interface StepState {
  estado: EstadoPaso;
  fechaInicio?: string;
  fechaCompletado?: string;
  responsable?: string;
  observaciones?: string;
}

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
  profile_image?: string;
  username?: string;
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
  pasoId?: string;
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
  pasoIds: string[];
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
  tipoProyecto: TipoProyecto;
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
  steps?: Record<string, StepState>;
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

  // Nuevos campos dinámicos
  solicitante_nombre?: string;
  solicitante_cedula?: string;
  correo_investigar?: string;
  correo_proveedor?: string;
  discoduro_serial?: string;
  discoduro_capacidad?: string;
  discoduro_marca?: string;
  discoduro_modelo?: string;

  // Datos del Perito Acreditado (Wizard de creación)
  perito_cedula?: string;
  perito_civ?: string;
  perito_inpre?: string;
  perito_cargo?: string;

  // Datos del Consignante (Wizard de creación)
  solicitante_telefono?: string;
  solicitante_email?: string;
  solicitante_direccion?: string;

  // Dispositivo extra
  dispositivo_color?: string;
  dispositivo_accesorios?: string;
  dispositivo_bateria?: string;

  // Imagen Forense (tipo forense_imagen)
  imagen_herramienta?: string;     // FTK Imager / dd / Guymager
  imagen_tipo?: string;            // RAW/dd | E01 | AFF4
  imagen_hash_sha256?: string;
  imagen_hash_md5?: string;
  imagen_tamano_gb?: string;
  imagen_ruta_destino?: string;
  imagen_write_blocker?: string;   // Modelo del write-blocker usado
  imagen_match_hash?: boolean;     // true = MATCH, false = MISMATCH

  // Cadena de Custodia MUCC-2017 & Planillas
  hashSHA256?: string;
  hashMD5?: string;
  bolsa_faraday_numero?: string;
  precinto_numero?: string;
  numero_prcc?: string;

  // Funcionarios del Procedimiento
  perito_coadyuvante?: string;
  perito_coadyuvante_cedula?: string;
  fiscal_nombre?: string;
  fiscal_cedula?: string;
  despacho_custodia?: string;
  organismo_custodia?: string;

  // Acta de Entrevista
  condicion_juridica?: string;

  // Transferencia PRCC Sección V
  motivo_transferencia?: string;
  fecha_transferencia?: string;
  numero_comunicacion?: string;
  receptor_nombre?: string;
  receptor_cedula?: string;

  // ── Ciclo pericial ISO unificado (v4) ──
  /** Estado por fase ISO (F0…F5) con controles verificados y hash encadenado. */
  fasesIso?: Partial<Record<FaseIsoId, FaseIsoEstado>>;
  /** Valores de campos libres de planillas sin campo CasoCMS dedicado: planillaId → clave → valor. */
  planillaOverrides?: Record<string, Record<string, string>>;
  /** Versión para control de concurrencia optimista con el servidor PHP. */
  version?: number;
}

// ─── Ciclo ISO (v4) ───────────────────────────────────────────────────────────

export type PlanillaId =
  | 'prcc'
  | 'acta_obtencion'
  | 'acta_entrevista'
  | 'acta_dictamen'
  | 'acta_entrega_resultados'
  | 'acta_consentimiento'
  | 'acta_desprecintado'
  | 'acta_sanitizacion'
  | 'acta_auditoria_timeline'
  | 'planilla_evaluacion_ux'
  | 'informe_audio_sonic'
  | 'dictamen_imagenes'
  | 'dictamen_audios';

export type FaseIsoId = 'F0' | 'F1' | 'F2' | 'F3' | 'F4' | 'F5';
export type EstadoFaseIso = 'BLOQUEADA' | 'DISPONIBLE' | 'EN_PROGRESO' | 'COMPLETADA';

export interface ControlMarcado {
  ok: boolean;
  ts: string;
  por: string;
  origen?: 'perito' | 'legado';
}

export interface FaseIsoEstado {
  estado: EstadoFaseIso;
  controles: Record<string, ControlMarcado>;
  iniciadaEn?: string;
  completadaEn?: string;
  completadaPor?: string;
  hashAnterior?: string;
  hash?: string;
  /** true cuando el servidor PHP aceptó el cierre de la fase. */
  sellada?: boolean;
}

// ─── Compliance Checklist por Normativa ────────────────────────────────────────

export interface ComplianceCheckItem {
  stageId: string;       // e.g. "n1__identificacion"
  normativaId: string;   // e.g. "n1"
  checked: boolean;
  fechaCheck?: string;
  observacion?: string;
}
