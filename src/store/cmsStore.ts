import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useAuditStore } from './auditStore';
import { getPasosPorTipo } from '../data/tiposProyecto';
import { NORMATIVAS_ETAPAS } from '../data/normativasEtapas';
import { platformAPI } from '../db/platformAPI';

// ─── Enumeraciones ────────────────────────────────────────────────────────────

export type EstadoCaso = 'iniciado' | 'en_proceso' | 'analisis' | 'informe' | 'cerrado' | 'archivado';
export type PrioridadCaso = 'critica' | 'alta' | 'media' | 'baja';
export type EstadoTarea = 'pendiente' | 'en_progreso' | 'completada' | 'bloqueada';
export type TipoNormativa = 'ISO' | 'NIST' | 'LEY' | 'MANUAL' | 'REGLAMENTO';
export type NivelCumplimiento = 'conforme' | 'parcial' | 'no_conforme' | 'no_aplica';
export type TipoEvidencia = 'dispositivo_movil' | 'computador' | 'memoria' | 'imagen_forense' | 'documento' | 'otro';
export type RolPersonal = 'perito_lider' | 'perito_asistente' | 'fiscal' | 'compliance_officer' | 'coordinador';
export type TipoProyecto = 'forense_whatsapp' | 'forense_email' | 'forense_discoduro';
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
  
  // Nuevo sistema de pasos con estado enriquecido y gating secuencial
  initSteps: (casoId: string) => void;
  startStep: (stepId: string) => void;
  verifyStepCompletion: (stepId: string, casoIdOverride?: string) => { 
    canComplete: boolean; 
    missing: string[]; 
    missingObjects?: { type: 'tarea' | 'compliance'; id: string; text: string; subId?: string }[];
  };
  completeStep: (stepId: string) => { success: boolean; missing?: string[]; missingObjects?: any[] };
  unlockNextStep: (stepId: string) => void;
  getStepState: (stepId: string) => EstadoPaso | undefined;
  
  // Migración
  migrateStepsData: () => void;
  _dataMigrated: boolean;
  
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
    descripcion: 'Estándar internacional que proporciona directrices detalladas para el manejo técnico de evidencia digital. Regula las fases críticas de Identificación (reconocer objetos con potencial de evidencia digital), Recolección (recoger dispositivos físicos o copias documentadas), Adquisición (creación de imágenes y copias forenses bit-a-bit verificables mediante hashes) y Preservación (mantenimiento de la integridad y autenticidad en contenedores seguros). Es la norma técnica metodológica de referencia para evitar la contaminación o alteración de la prueba digital en investigaciones criminalísticas.',
    version: '2012', fechaVigencia: '2012-10-15', activa: true,
    urlReferencia: 'normativas_rag/ISO IEC 27037-2012.md',
    articulos: ['Identificación', 'Recopilación', 'Adquisición', 'Preservación']
  },
  {
    id: 'n2', codigo: 'ISO/IEC 27042:2015', tipo: 'ISO',
    nombre: 'Directrices para el análisis e interpretación de evidencia digital',
    descripcion: 'Estándar internacional que regula las fases posteriores a la adquisición de la evidencia digital, proporcionando directrices detalladas para el análisis científico y la interpretación de los datos extraídos. Establece requisitos estrictos de objetividad, repetibilidad y reproducibilidad de los resultados, guiando al perito en la selección de herramientas forenses validadas, la documentación de la metodología aplicada y la fundamentación técnica que soporta las conclusiones del informe pericial.',
    version: '2015', fechaVigencia: '2015-06-01', activa: true,
    urlReferencia: 'normativas_rag/ISO-IEC 27042 2015.md',
  },
  {
    id: 'n3', codigo: 'NIST SP 800-101 r1', tipo: 'NIST',
    nombre: 'Guidelines on Mobile Device Forensics',
    descripcion: 'Directrices técnicas de informática forense para dispositivos móviles del National Institute of Standards and Technology (NIST) de EE.UU. Aborda de manera exhaustiva los desafíos de la preservación (aislamiento de red en bolsas Faraday y modo avión), la adquisición lógica/física de datos de memoria flash y tarjetas SIM, y el análisis de la memoria volátil y bases de datos SQLite en sistemas operativos móviles iOS y Android.',
    version: 'Rev. 1', fechaVigencia: '2014-05-01', activa: true,
    urlReferencia: 'normativas_rag/Guidelines on Mobile Device-NIST Special Publication 800-101.md',
  },
  {
    id: 'n4', codigo: 'MUCC-2017', tipo: 'MANUAL',
    nombre: 'Manual Único de Cadena de Custodia de Evidencias',
    descripcion: 'Manual Único de Cadena de Custodia de Evidencias Físicas y Digitales de la República Bolivariana de Venezuela, publicado en Gaceta Oficial N° 41.247 en septiembre de 2017. Es de obligatorio cumplimiento para todos los órganos de investigación penal y laboratorios forenses. Regula el proceso continuo e ininterrumpido de resguardo técnico de la evidencia, exigiendo el llenado de la Planilla PRCC y el uso de precintos numerados.',
    version: 'Final 29/09/2017', fechaVigencia: '2017-09-29', activa: true,
    urlReferencia: 'normativas_rag/MANUAL_ÚNICO_DE_CADENA DE_CUSTODIA_DE_EVIDENCIAS_(VERSIÓN_FINAL_29SEP17).md',
  },
  {
    id: 'n5', codigo: 'ACPO-v5', tipo: 'MANUAL',
    nombre: 'ACPO Good Practice Guide for Digital Evidence v5',
    descripcion: 'Guía de buenas prácticas de la ACPO para evidencia digital. Establece los cuatro principios fundamentales de la informática forense: (1) no alterar los datos del original, (2) si es necesario acceder, el perito debe estar calificado y poder explicar sus acciones, (3) mantener un registro detallado de todos los procesos aplicados, y (4) el responsable de la investigación debe garantizar la conformidad técnica y legal del procedimiento.',
    version: '5', fechaVigencia: '2012-01-01', activa: true,
    urlReferencia: 'normativas_rag/ACPO_Good_Practice_Guide_for_Digital_Evidence_v5.md',
  },
  {
    id: 'n6', codigo: 'LEDI-2001', tipo: 'LEY',
    nombre: 'Ley Especial de Delitos Informáticos',
    descripcion: 'Ley Especial contra los Delitos Informáticos de la República Bolivariana de Venezuela, publicada en Gaceta Oficial N° 37.313 (octubre de 2001). Tiene por objeto la protección integral de los sistemas de información, así como la prevención y sanción de delitos cometidos contra o mediante el uso de tecnologías, regulando la admisibilidad de las pruebas digitales.',
    version: '2001', fechaVigencia: '2001-10-30', activa: true,
    urlReferencia: 'normativas_rag/Ley Especial de Delitos informáticos (2001). Publicado en Gaceta Oficial Nº 37.313 .md',
  },
  {
    id: 'n7', codigo: 'LMDF-1999', tipo: 'LEY',
    nombre: 'Ley sobre Mensajes de Datos y Firmas Electrónicas',
    descripcion: 'Ley sobre Mensajes de Datos y Firmas Electrónicas de Venezuela. Otorga plena validez y eficacia probatoria a los mensajes de datos y a las firmas electrónicas, equiparándolos funcionalmente a la firma autógrafa y a los documentos escritos en papel, requiriendo herramientas forenses para verificar su origen, integridad y autenticidad.',
    version: '1999', fechaVigencia: '1999-02-10', activa: true,
    urlReferencia: 'normativas_rag/Ley-sobre-Mensajes-de-Datos-y-Firmas-Electronicas.md',
  },
  {
    id: 'n8', codigo: 'COPP', tipo: 'LEY',
    nombre: 'Código Orgánico Procesal Penal (Aplicación Supletoria)',
    descripcion: 'Código Orgánico Procesal Penal de Venezuela (reforma 2021). Sus artículos 187 (obligatoriedad de la Cadena de Custodia para evitar la alteración o contaminación), 223 (experticias científicas), 225 (deber del perito de actuar conforme a las reglas de su ciencia, habilitando el uso supletorio de estándares ISO y NIST) y 181 (nulidad de pruebas ilegales) regulan la licitud de la prueba digital.',
    version: '2021', fechaVigencia: '2021-09-17', activa: true,
    urlReferencia: 'normativas_rag/codigo-organico-procesal-penal.md',
  },
  {
    id: 'n9', codigo: 'CENIF-2012', tipo: 'REGLAMENTO',
    nombre: 'Creación del Centro Nacional de Informática Forense',
    descripcion: 'Decreto de Creación del Centro Nacional de Informática Forense de Venezuela (CENIF), publicado en Gaceta Oficial N° 39.847 en enero de 2012. Establece el marco orgánico para el desarrollo tecnológico, la acreditación de laboratorios forenses digitales, la formación de peritos y la normalización nacional de herramientas de adquisición.',
    version: '2012', fechaVigencia: '2012-01-20', activa: true,
    urlReferencia: 'normativas_rag/Creación del CENIF (2012). Centro Nacional de Informática Forense. Publicado en Gaceta Oficial N° 39.847 de fecha 20 de enero..md',
  },
  {
    id: 'n10', codigo: 'ISO/IEC 27002:2022', tipo: 'ISO',
    nombre: 'Seguridad de la información, ciberseguridad y protección de la privacidad — Controles de seguridad',
    descripcion: 'Estándar internacional que detalla un conjunto de 93 controles de seguridad de la información organizados en 4 categorías: Organizacionales (37 controles), Personas (8 controles), Físicos (14 controles) y Tecnológicos (34 controles). Es de aplicación crítica en el peritaje forense para validar que los sistemas bajo análisis e infraestructuras del laboratorio cuenten con controles de acceso, cifrado, borrado seguro y bitácoras de auditoría.',
    version: '2022', fechaVigencia: '2022-02-15', activa: true,
    urlReferencia: 'normativas_rag/Informatica/ISO 27002_2022 ES.md',
    articulos: ['Controles Organizacionales', 'Controles de Personas', 'Controles Físicos', 'Controles Tecnológicos']
  },
  {
    id: 'n11', codigo: 'ISO/IEC 27001:2022', tipo: 'ISO',
    nombre: 'Requisitos para Sistemas de Gestión de la Seguridad de la Información (SGSI)',
    descripcion: 'Norma internacional auditable que define los requisitos para establecer, implementar, mantener y mejorar continuamente un Sistema de Gestión de la Seguridad de la Información (SGSI). En el contexto forense digital, certifica que el laboratorio de informática forense opera bajo procesos estructurados de control de riesgos y confidencialidad.',
    version: '2022', fechaVigencia: '2022-10-25', activa: true,
    urlReferencia: 'normativas_rag/Informatica/ISO-27001_2022_NOEDER.md',
    articulos: ['Contexto y Liderazgo', 'Planificación y Soporte', 'Operación del SGSI', 'Evaluación y Mejora']
  },
  {
    id: 'n12', codigo: 'Ley de Infogobierno', tipo: 'LEY',
    nombre: 'Ley de Infogobierno de la República Bolivariana de Venezuela',
    descripcion: 'Ley venezolana que establece las bases y lineamientos para el uso de tecnologías de información libres en el Poder Público. Tiene especial relevancia en el resguardo y almacenamiento de evidencias del proceso forense, exigiendo el uso de software libre y estándares abiertos para garantizar la soberanía, auditabilidad y transparencia.',
    version: '2013', fechaVigencia: '2013-10-17', activa: true,
    urlReferencia: 'normativas_rag/Informatica/Ley-de-infogobierno.md',
    articulos: ['Software Libre', 'Estándares Abiertos', 'Seguridad de Información', 'Sanciones']
  },
  {
    id: 'n13', codigo: 'NIST SP 800-86', tipo: 'NIST',
    nombre: 'Guide to Integrating Forensic Techniques into Incident Response',
    descripcion: 'Guía técnica del NIST para la integración de metodologías forenses digitales en el proceso de respuesta a incidentes de seguridad. Estructura el ciclo forense en cuatro fases fundamentales (Recolección, Examen, Análisis y Reporte), sirviendo como marco técnico estándar para peritajes informáticos de incidentes de seguridad y redes.',
    version: '2006', fechaVigencia: '2006-08-01', activa: true,
    urlReferencia: 'normativas_rag/Informatica/NIST SP 800-86_ingles.md',
    articulos: ['Recolección de Datos', 'Examen Forense', 'Análisis de Incidentes', 'Documentación']
  },
  {
    id: 'n14', codigo: 'SUSCERTE-FD', tipo: 'REGLAMENTO',
    nombre: 'Normas Técnicas de SUSCERTE sobre Forense Digital e Infraestructura PKI',
    descripcion: 'Regulaciones emitidas por la Superintendencia de Servicios de Certificación Electrónica (SUSCERTE) de Venezuela. Establece el protocolo técnico para peritajes forenses digitales oficiales, peritaje de firmas electrónicas, criptografía nacional y la acreditación de peritos informáticos habilitados ante el sistema de justicia.',
    version: '2024', fechaVigencia: '2024-05-15', activa: true,
    urlReferencia: 'normativas_rag/Informatica/Normativas SUSCERTE Forense Digital y Firma Electronica.md',
    articulos: ['Criptografía y PKI', 'Firma Electrónica', 'Acreditación de Peritos', 'Informes Periciales']
  },
  {
    id: 'n15', codigo: 'LOMP', tipo: 'LEY',
    nombre: 'Ley Orgánica del Ministerio Público (Investigación Penal)',
    descripcion: 'Regula las atribuciones del Ministerio Público de la República Bolivariana de Venezuela, designándolo como director constitucional de la investigación penal. Es de obligatoria observancia para el perito ya que los fiscales del MP coordinan el aseguramiento de la evidencia y solicitan la práctica de experticias informáticas forenses.',
    version: '2007', fechaVigencia: '2007-03-19', activa: true,
    urlReferencia: 'normativas_rag/Penal/ley-organica-del-ministerio-publico.md',
    articulos: ['Acción Penal', 'Dirección de la Investigación', 'Experticias Periciales', 'Garantía de Legalidad']
  },
  {
    id: 'n16', codigo: 'Código Civil', tipo: 'LEY',
    nombre: 'Código Civil de la República Bolivariana de Venezuela (Valor Probatorio)',
    descripcion: 'Establece los principios de las obligaciones, propiedad y contratos en Venezuela. Contiene artículos de aplicación supletoria clave para el derecho probatorio digital, regulando el valor de la prueba por escrito, los documentos públicos/privados y el régimen general de experticias técnicas.',
    version: '1982', fechaVigencia: '1982-07-26', activa: true,
    urlReferencia: 'normativas_rag/Civil/codigo-civil.md',
    articulos: ['Fuerza Probatoria', 'Experticias Civiles', 'Nulidad de Pruebas', 'Obligaciones']
  },
  {
    id: 'n17', codigo: 'CRBV', tipo: 'LEY',
    nombre: 'Constitución de la República Bolivariana de Venezuela',
    descripcion: 'Norma suprema y fundamento del ordenamiento jurídico venezolano. En el ámbito forense digital, establece las garantías constitucionales del debido proceso (Art. 49), el derecho a la defensa y la inviolabilidad de las comunicaciones privadas (Art. 48), siendo el marco jerárquico supremo de admisibilidad de evidencias.',
    version: '1999', fechaVigencia: '1999-12-30', activa: true,
    urlReferencia: 'normativas_rag/Constitucion/constitucion-nacional-20191205135853.md',
    articulos: ['Art. 48 (Inviolabilidad de Comunicaciones)', 'Art. 49 (Debido Proceso)', 'Garantías Constitucionales']
  },
  {
    id: 'n18', codigo: 'Código Penal', tipo: 'LEY',
    nombre: 'Código Penal de la República Bolivariana de Venezuela',
    descripcion: 'Establece la clasificación de los hechos punibles y determina las penas aplicables. Regula los delitos tradicionales que pueden cometerse mediante sistemas de información (como la estafa, revelación de secretos y daño a la propiedad), complementando la Ley Especial contra Delitos Informáticos.',
    version: '2005', fechaVigencia: '2005-04-13', activa: true,
    urlReferencia: 'normativas_rag/Penal/codigo penal.md',
    articulos: ['Delitos contra la Propiedad', 'Revelación de Secretos', 'Daño a la Propiedad']
  },
  {
    id: 'n19', codigo: 'CPC', tipo: 'LEY',
    nombre: 'Código de Procedimiento Civil de Venezuela',
    descripcion: 'Regula el procedimiento formal para las actuaciones judiciales civiles. De aplicación supletoria al proceso pericial y penal en materia de experticias, valoración de instrumentos técnicos, inspecciones judiciales y régimen de tacha de peritos.',
    version: '1990', fechaVigencia: '1990-03-16', activa: true,
    urlReferencia: 'normativas_rag/Civil/codigo-de-procedimiento-civil.md',
    articulos: ['Prueba Pericial', 'Inspección Judicial', 'Valoración de Pruebas']
  },
  {
    id: 'n20', codigo: 'RFC 3227', tipo: 'MANUAL',
    nombre: 'Guidelines for Evidence Collection and Archiving',
    descripcion: 'Estándar de Internet emitido por el IETF que define las directrices técnicas para la recolección y archivo de evidencia digital tras un incidente de seguridad. Introduce el principio del orden de volatilidad de los datos (memoria RAM, cachés, registros, discos) para priorizar el orden técnico de extracción y preservación.',
    version: '2002', fechaVigencia: '2002-02-01', activa: true,
    urlReferencia: 'normativas_rag/Informatica/RFC 3227 (2002).md',
    articulos: ['Orden de Volatilidad', 'Recolección del Sistema', 'Preservación del Estado']
  },
  {
    id: 'n21', codigo: 'LOADGC', tipo: 'LEY',
    nombre: 'Ley Orgánica de Amparo sobre Derechos y Garantías Constitucionales',
    descripcion: 'Regula la acción de amparo destinada a restablecer la situación jurídica infringida de un derecho constitucional. Es crítica en forensía informática cuando se alega la vulneración al derecho a la privacidad informática, el habeas data o la interceptación ilegal de datos.',
    version: '1988', fechaVigencia: '1988-01-22', activa: true,
    urlReferencia: 'normativas_rag/Constitucion/ley-organica-de-amparo-sobre-derechos-y-garantias-constitucionales.md',
    articulos: ['Derechos Constitucionales', 'Medidas Preventivas', 'Habeas Data']
  },
  {
    id: 'n22', codigo: 'LOPJ', tipo: 'LEY',
    nombre: 'Ley Orgánica del Poder Judicial de Venezuela',
    descripcion: 'Establece la organización, atribuciones y funcionamiento del Poder Judicial. Regula la habilitación legal de los tribunales de la República, el nombramiento formal de peritos y auxiliares de justicia, y el cumplimiento obligatorio de los dictámenes periciales ante los jueces.',
    version: '1998', fechaVigencia: '1998-09-11', activa: true,
    urlReferencia: 'normativas_rag/Penal/ley-organica-del-poder-judicial.md',
    articulos: ['Auxiliares de Justicia', 'Peritos Habilitados', 'Tribunales']
  },
  {
    id: 'n23', codigo: 'AVILLA-FORENSICS', tipo: 'MANUAL',
    nombre: 'Guía Técnica de Análisis Forense en Android con Avilla Forensics',
    descripcion: 'Manual y guía práctica para el análisis y extracción técnica forense en dispositivos Android utilizando la herramienta Avilla Forensics. Detalla los procesos de depuración USB, root, extracción de particiones de datos, bypass de pantallas de bloqueo y análisis de bases de datos de mensajería.',
    version: '2024', fechaVigencia: '2024-01-10', activa: true,
    urlReferencia: 'normativas_rag/Informatica/analisis forense en android con avilla forensics.md',
    articulos: ['Depuración USB', 'Extracción Físca', 'Análisis de Bases de Datos']
  }
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
const now = () => new Date().toISOString();

let migrationRunning = false;

const MOCK_CASOS: CasoCMS[] = [
  {
    id: 'caso-mock-1',
    tipoProyecto: 'forense_whatsapp',
    numeroCaso: 'MP-01-2026-WA',
    expediente: 'EXP-45920-2026',
    titulo: 'Extracción Forense - Caso Extorsión Telefónica',
    descripcion: 'Investigación pericial de mensajería instantánea en dispositivo móvil Android incautado. Adquisición ejecutada mediante AVILLA Forensics y Kali Linux + Andriller (ADB). Parseo y triaje de base de datos msgstore.db con ALEAPP, y posterior análisis profundo, indexación y extracción de audios .opus adjuntos mediante IPED Forensics.',
    estado: 'analisis',
    prioridad: 'alta',
    fechaCreacion: '2026-07-19T08:00:00.000Z',
    fechaUltimaActualizacion: '2026-07-19T09:30:00.000Z',
    peritoLider: '',
    fiscal: 'Dr. Alberto Silva (Fiscalía 12º del M.P. Estado Lara)',
    compliance: 'Conforme',
    despachoFiscal: 'Fiscalía 12º del Ministerio Público',
    organismoOrdenante: 'CICPC Delegación Quíbor',
    normativasAplicadas: ['n1', 'n4', 'n8', 'n7'],
    fasesCompletadas: 4,
    totalFases: 9,
    porcentajeCompletado: 44,
    totalEvidencias: 1,
    nivelCumplimientoGeneral: 'conforme',
    etiquetas: ['Android', 'WhatsApp', 'Extorsión'],
    notas: 'El dispositivo fue embalado bajo cadena de custodia respetando el protocolo MUCCEF 2017.',
    dispositivo_marca: 'Samsung',
    dispositivo_modelo: 'Galaxy A54',
    dispositivo_imei: '354928110948271',
    dispositivo_imei2: '354928110948272',
    dispositivo_sim_card: 'Movistar 4G',
    dispositivo_numero_tel: '+58 412-5551234',
    dispositivo_estado_fisico: 'Excelente estado, enciende correctamente.',
    dispositivo_modo_aislamiento: 'Modo Avión y bolsa Faraday',
    dispositivo_danos_visibles: 'Ninguno',
    dispositivo_bateria_estado: '85%',
    dispositivo_pantalla_estado: 'Operativa',
    solicitante_nombre: 'Insp. Jefe Luis Ortega',
    solicitante_cedula: 'V-12.345.678',
    steps: {
      wp_step1: { estado: 'completado', fechaInicio: '2026-07-19T08:05:00.000Z', fechaCompletado: '2026-07-19T08:15:00.000Z', responsable: '', observaciones: 'Se recibió y se levantaron actas preliminares.' },
      wp_step2: { estado: 'completado', fechaInicio: '2026-07-19T08:20:00.000Z', fechaCompletado: '2026-07-19T08:30:00.000Z', responsable: '', observaciones: 'Planilla PRCC completada y firmada.' },
      wp_step3: { estado: 'completado', fechaInicio: '2026-07-19T08:35:00.000Z', fechaCompletado: '2026-07-19T09:00:00.000Z', responsable: '', observaciones: 'Adquisición forense con AVILLA Forensics y cálculo de hash SHA-256.' },
      wp_step4: { estado: 'completado', fechaInicio: '2026-07-19T09:05:00.000Z', fechaCompletado: '2026-07-19T09:15:00.000Z', responsable: '', observaciones: 'Dispositivo sellado en bolsa Faraday y guardado en bóveda.' },
      wp_step5: { estado: 'disponible' }
    }
  },
  {
    id: 'caso-mock-2',
    tipoProyecto: 'forense_email',
    numeroCaso: 'MP-02-2026-EM',
    expediente: 'EXP-45921-2026',
    titulo: 'Análisis Forense de Correo - Fuga de Información',
    descripcion: 'Peritaje informático de buzón de correo corporativo Outlook (archivo PST) sospechoso de fuga de secretos industriales. Extracción y análisis de cabeceras de red, metadatos y archivos adjuntos mediante mxToolbox, emlparser y libpff.',
    estado: 'en_proceso',
    prioridad: 'media',
    fechaCreacion: '2026-07-19T08:10:00.000Z',
    fechaUltimaActualizacion: '2026-07-19T09:20:00.000Z',
    peritoLider: '',
    fiscal: 'Dra. Elena Ramos (Fiscalía 5º del M.P. Estado Lara)',
    compliance: 'Parcial',
    despachoFiscal: 'Fiscalía 5º del Ministerio Público',
    organismoOrdenante: 'DGCIM Barquisimeto',
    normativasAplicadas: ['n1', 'n7', 'n8', 'n6'],
    fasesCompletadas: 2,
    totalFases: 7,
    porcentajeCompletado: 28,
    totalEvidencias: 1,
    nivelCumplimientoGeneral: 'parcial',
    etiquetas: ['Email', 'Outlook', 'Corporativo'],
    notas: 'Se extrajo el buzón PST cumpliendo el orden de volatilidad.',
    correo_investigar: 'empleado@empresa-victima.com',
    correo_proveedor: 'Exchange Corporativo (IMAP)',
    solicitante_nombre: 'Tte. Coronel José Gómez',
    solicitante_cedula: 'V-10.123.456',
    steps: {
      em_step1: { estado: 'completado', fechaInicio: '2026-07-19T08:15:00.000Z', fechaCompletado: '2026-07-19T08:25:00.000Z', responsable: '', observaciones: 'Se identificaron las fuentes y orden judicial de interceptación.' },
      em_step2: { estado: 'completado', fechaInicio: '2026-07-19T08:30:00.000Z', fechaCompletado: '2026-07-19T09:00:00.000Z', responsable: '', observaciones: 'Obtención y preservación forense de buzón PST con hash verificado.' },
      em_step3: { estado: 'disponible' }
    }
  },
  {
    id: 'caso-mock-3',
    tipoProyecto: 'forense_discoduro',
    numeroCaso: 'MP-03-2026-DD',
    expediente: 'EXP-45922-2026',
    titulo: 'Preservación e Investigación - Sabotaje de Servidor',
    descripcion: 'Adquisición forense de unidad de estado sólido (SSD) correspondiente al servidor de base de datos saboteado. Preservación en sitio mediante bloqueador de escritura físico Tableau y la Suite forense PALADIN LINUX. Análisis de imagen forense E01 mediante IPED Forensics para file carving de logs del sistema.',
    estado: 'iniciado',
    prioridad: 'critica',
    fechaCreacion: '2026-07-19T08:20:00.000Z',
    fechaUltimaActualizacion: '2026-07-19T09:10:00.000Z',
    peritoLider: '',
    fiscal: 'Dr. Alberto Silva (Fiscalía 12º del M.P. Estado Lara)',
    compliance: 'Pendiente',
    despachoFiscal: 'Fiscalía 12º del Ministerio Público',
    organismoOrdenante: 'CICPC Delegación Quíbor',
    normativasAplicadas: ['n1', 'n3', 'n4', 'n8'],
    fasesCompletadas: 1,
    totalFases: 8,
    porcentajeCompletado: 12,
    totalEvidencias: 1,
    nivelCumplimientoGeneral: 'no_aplica',
    etiquetas: ['Servidor', 'Disco Duro', 'Incidente'],
    notas: 'Adquisición en caliente de la memoria RAM antes del apagado seguro.',
    discoduro_serial: 'S6B1NX0N123456Y',
    discoduro_capacidad: '512 GB',
    discoduro_marca: 'Samsung EVO 970',
    discoduro_modelo: 'NVMe M.2',
    solicitante_nombre: 'Insp. Jefe Luis Ortega',
    solicitante_cedula: 'V-12.345.678',
    steps: {
      dd_step1: { estado: 'completado', fechaInicio: '2026-07-19T08:30:00.000Z', fechaCompletado: '2026-07-19T09:00:00.000Z', responsable: '', observaciones: 'Preservación inicial en sitio con Suite forense PALADIN LINUX y hash generado.' },
      dd_step2: { estado: 'disponible' }
    }
  }
];

const neonStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return localStorage.getItem(name);
  },
  setItem: async (name: string, value: string): Promise<void> => {
    localStorage.setItem(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    localStorage.removeItem(name);
  },
};

// ─── Store ────────────────────────────────────────────────────────────────────

export const useCMSStore = create<CMSState>()(
  persist(
    (set, get) => ({
      casos: MOCK_CASOS,
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
      _dataMigrated: false,

      // ── Casos ──
      fetchCasos: async () => {
        try {
            // Asegurar que las normativas del store estén sincronizadas con NORMATIVAS_INICIALES
            const currentNormativas = get().normativas || [];
            const mergedNormativas = [...NORMATIVAS_INICIALES];
            currentNormativas.forEach(cn => {
              if (!mergedNormativas.some(inNorm => inNorm.id === cn.id)) {
                mergedNormativas.push(cn);
              }
            });
            // Asegurar que se actualicen las descripciones, nombres y códigos de las existentes
            const finalNormativas = mergedNormativas.map(n => {
              const defaultNorm = NORMATIVAS_INICIALES.find(inNorm => inNorm.id === n.id);
              return defaultNorm ? { ...n, ...defaultNorm } : n;
            });
            set({ normativas: finalNormativas });

            const casosDB = platformAPI.db ? await platformAPI.db.getCasos(1) : null;
            if (casosDB && casosDB.length > 0) {
                const mapeados: CasoCMS[] = casosDB.map((c: any) => {
                    let completed = {};
                    let metadata = {};
                    let compliance = [];
                    let steps = {};
                    try {
                        completed = typeof c.completed_steps === 'string' ? JSON.parse(c.completed_steps) : (c.completed_steps || {});
                    } catch (e) { console.error('Error parsing completed_steps', e); }
                    try {
                        metadata = typeof c.step_metadata === 'string' ? JSON.parse(c.step_metadata) : (c.step_metadata || {});
                    } catch (e) { console.error('Error parsing step_metadata', e); }
                    try {
                        compliance = typeof c.compliance_checklist === 'string' ? JSON.parse(c.compliance_checklist) : (c.compliance_checklist || []);
                    } catch (e) { console.error('Error parsing compliance_checklist', e); }
                    try {
                        steps = typeof c.steps === 'string' ? JSON.parse(c.steps) : (c.steps || {});
                    } catch (e) { console.error('Error parsing steps', e); }

                    let finalSteps = steps as Record<string, StepState>;
                    const hasNewSteps = Object.keys(finalSteps).length > 0;
                    if (!hasNewSteps) {
                      const oldCompleted = (completed || {}) as Record<string, any>;
                      const oldMetadata = (metadata || {}) as Record<string, any>;
                      const pasos = c.tipo_proyecto ? getPasosPorTipo(c.tipo_proyecto) : [];
                      finalSteps = {};

                      pasos.forEach((paso, idx) => {
                        const wasCompleted = !!oldCompleted[paso.id];
                        const meta = oldMetadata[paso.id] || {};

                        if (wasCompleted) {
                          finalSteps[paso.id] = {
                            estado: 'completado',
                            fechaInicio: meta.fecha || undefined,
                            fechaCompletado: meta.fecha || undefined,
                            responsable: meta.responsable || '',
                            observaciones: meta.observaciones || '',
                          };
                        } else {
                          const prevCompleted = idx === 0 || pasos.slice(0, idx).every(p => !!oldCompleted[p.id]);
                          finalSteps[paso.id] = {
                            estado: prevCompleted ? 'disponible' : 'bloqueado',
                          };
                        }
                      });
                    }

                    const totalSteps = c.tipo_proyecto ? getPasosPorTipo(c.tipo_proyecto).length : 9;
                    const completedCount = Object.values(finalSteps).filter(s => s.estado === 'completado').length;
                    const pct = Math.round((completedCount / Math.max(totalSteps, 1)) * 100);

                    return {
                        id: c.id.toString(),
                        tipoProyecto: c.tipo_proyecto || 'forense_whatsapp',
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
                        totalFases: totalSteps,
                        porcentajeCompletado: pct,
                        totalEvidencias: 0,
                        nivelCumplimientoGeneral: 'no_aplica',
                        etiquetas: [],
                        notas: '',
                        steps: finalSteps,
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
                        solicitante_nombre: c.solicitante_nombre || c.solicitanteNombre || '',
                        solicitante_cedula: c.solicitante_cedula || c.solicitanteCedula || '',
                        correo_investigar: c.correo_investigar || c.correoInvestigar || '',
                        correo_proveedor: c.correo_proveedor || c.correoProveedor || '',
                        discoduro_serial: c.discoduro_serial || c.discoduroSerial || '',
                        discoduro_capacidad: c.discoduro_capacidad || c.discoduroCapacidad || '',
                        discoduro_marca: c.discoduro_marca || c.discoduroMarca || '',
                        discoduro_modelo: c.discoduro_modelo || c.discoduroModelo || '',
                    };
                });
                set({ casos: mapeados });
            } else {
                // BUG-003: Si la base de datos no está disponible u offline, mantener los casos locales de Zustand persistidos.
                console.info('[CMS] Sin conexión DB o vacía — usando datos persistidos localmente.');
                if (get().casos.length === 0) {
                  set({ casos: MOCK_CASOS });
                }
            }
        } catch (err) {
            console.error('Error fetching casos', err);
        }
      },
      addCaso: async (caso) => {
        const fallbackId = uid();
        try {
            const payload = {
                id: (caso as any).id || fallbackId,
                tipo_proyecto: caso.tipoProyecto || 'forense_whatsapp',
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
                steps: caso.steps || {},
                completed_steps: caso.steps ? undefined : (caso.completed_steps || {}),
                step_metadata: caso.steps ? undefined : (caso.step_metadata || {}),
                compliance_checklist: caso.compliance_checklist || [],
                user_id: 1,
                solicitante_nombre: caso.solicitante_nombre || '',
                solicitante_cedula: caso.solicitante_cedula || '',
                correo_investigar: caso.correo_investigar || '',
                correo_proveedor: caso.correo_proveedor || '',
                discoduro_serial: caso.discoduro_serial || '',
                discoduro_capacidad: caso.discoduro_capacidad || '',
                discoduro_marca: caso.discoduro_marca || '',
                discoduro_modelo: caso.discoduro_modelo || '',
            };
            const result = platformAPI.db ? await platformAPI.db.addCaso(payload) : null;
            
            if (result && result.success) {
                const id = result.id.toString();
                const nuevo: CasoCMS = {
                  ...caso,
                  tipoProyecto: caso.tipoProyecto || 'forense_whatsapp',
                  id,
                  fechaCreacion: now(),
                  fechaUltimaActualizacion: now(),
                  steps: payload.steps,
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
                  solicitante_nombre: payload.solicitante_nombre,
                  solicitante_cedula: payload.solicitante_cedula,
                  correo_investigar: payload.correo_investigar,
                  correo_proveedor: payload.correo_proveedor,
                  discoduro_serial: payload.discoduro_serial,
                  discoduro_capacidad: payload.discoduro_capacidad,
                  discoduro_marca: payload.discoduro_marca,
                  discoduro_modelo: payload.discoduro_modelo,
                };
                set(s => ({ casos: [...s.casos, nuevo] }));
                get().addAuditLog({ accion: 'CASO_CREADO', detalle: `Caso ${caso.numeroCaso} creado exitosamente en Neon`, nivel: 'success', casoId: id, usuario: caso.peritoLider });
                useAuditStore.getState().addEntry({
                  accion: 'CASO_CREADO',
                  detalle: `Caso ${caso.numeroCaso} — ${caso.titulo}`,
                  usuario: caso.peritoLider,
                  nivel: 'success',
                  casoId: id,
                });
                return id;
            }
            throw new Error(result?.error || 'Error desconocido al guardar en DB');
        } catch (e) {
            console.error('Error addCaso DB (operando offline):', e);
            // BUG-010: Aunque falle la base de datos, retornar ID y guardar caso localmente para no perder trabajo del usuario
            const fallbackCaso: CasoCMS = {
              ...caso,
              tipoProyecto: caso.tipoProyecto || 'forense_whatsapp',
              id: (caso as any).id || fallbackId,
              fechaCreacion: now(),
              fechaUltimaActualizacion: now(),
              steps: caso.steps || {},
              compliance_checklist: caso.compliance_checklist || [],
              dispositivo_marca: caso.dispositivo_marca,
              dispositivo_modelo: caso.dispositivo_modelo,
              dispositivo_imei: caso.dispositivo_imei,
              dispositivo_imei2: caso.dispositivo_imei2,
              dispositivo_sim_card: caso.dispositivo_sim_card,
              dispositivo_numero_tel: caso.dispositivo_numero_tel,
              dispositivo_estado_fisico: caso.dispositivo_estado_fisico,
              dispositivo_modo_aislamiento: caso.dispositivo_modo_aislamiento,
              dispositivo_danos_visibles: caso.dispositivo_danos_visibles,
              dispositivo_bateria_estado: caso.dispositivo_bateria_estado,
              dispositivo_pantalla_estado: caso.dispositivo_pantalla_estado,
              solicitante_nombre: caso.solicitante_nombre,
              solicitante_cedula: caso.solicitante_cedula,
              correo_investigar: caso.correo_investigar,
              correo_proveedor: caso.correo_proveedor,
              discoduro_serial: caso.discoduro_serial,
              discoduro_capacidad: caso.discoduro_capacidad,
              discoduro_marca: caso.discoduro_marca,
              discoduro_modelo: caso.discoduro_modelo,
            };
            set(s => ({ casos: [...s.casos, fallbackCaso] }));
            get().addAuditLog({ accion: 'CASO_CREADO_LOCAL', detalle: `Caso ${caso.numeroCaso} guardado localmente (sin conexión a Neon)`, nivel: 'warning', casoId: fallbackCaso.id, usuario: caso.peritoLider });
            useAuditStore.getState().addEntry({
              accion: 'CASO_CREADO_LOCAL',
              detalle: `Caso ${caso.numeroCaso} guardado localmente — ${caso.titulo}`,
              usuario: caso.peritoLider,
              nivel: 'warning',
              casoId: fallbackCaso.id,
            });
            return fallbackCaso.id;
        }
      },
      updateCaso: async (id, datos) => {
        set(s => ({
          casos: s.casos.map(c => c.id === id ? { ...c, ...datos, fechaUltimaActualizacion: now() } : c)
        }));
        try {
          if (platformAPI.db) {
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
            if (datos.tipoProyecto !== undefined) mappedData.tipo_proyecto = datos.tipoProyecto;
            if (datos.solicitante_nombre !== undefined) mappedData.solicitante_nombre = datos.solicitante_nombre;
            if (datos.solicitante_cedula !== undefined) mappedData.solicitante_cedula = datos.solicitante_cedula;
            if (datos.correo_investigar !== undefined) mappedData.correo_investigar = datos.correo_investigar;
            if (datos.correo_proveedor !== undefined) mappedData.correo_proveedor = datos.correo_proveedor;
            if (datos.discoduro_serial !== undefined) mappedData.discoduro_serial = datos.discoduro_serial;
            if (datos.discoduro_capacidad !== undefined) mappedData.discoduro_capacidad = datos.discoduro_capacidad;
            if (datos.discoduro_marca !== undefined) mappedData.discoduro_marca = datos.discoduro_marca;
            if (datos.discoduro_modelo !== undefined) mappedData.discoduro_modelo = datos.discoduro_modelo;
            if (datos.steps !== undefined) mappedData.steps = datos.steps;
            if (datos.completed_steps !== undefined) mappedData.completed_steps = datos.completed_steps;
            if (datos.step_metadata !== undefined) mappedData.step_metadata = datos.step_metadata;
            await platformAPI.db.updateCaso(id, mappedData);
          }
        } catch (e) {
          console.error('Error al actualizar caso en DB:', e);
        }
        get().addAuditLog({ accion: 'CASO_ACTUALIZADO', detalle: `Caso ${id} actualizado`, nivel: 'info', casoId: id, usuario: 'sistema' });
      },
      deleteCaso: async (id) => {
        set(s => ({ casos: s.casos.filter(c => c.id !== id) }));
        try {
          if (platformAPI.db) {
            await platformAPI.db.deleteCaso(id);
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

        // Si el caso ya tiene steps (nuevo sistema), usar completeStep
        if (caso.steps) {
          if (completed) {
            get().completeStep(stepId);
          } else {
            // Permitir desmarcar (solo si está completado)
            const current = caso.steps[stepId];
            if (current?.estado === 'completado') {
              const steps = {
                ...(caso.steps || {}),
                [stepId]: {
                  ...current,
                  estado: 'disponible' as EstadoPaso,
                  fechaCompletado: undefined,
                },
              };
              get().updateCaso(casoSeleccionado, { steps });
            }
          }
          return;
        }

        // Sistema legacy (completed_steps boolean)
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

        const totalSteps = caso.tipoProyecto
          ? getPasosPorTipo(caso.tipoProyecto).length
          : 9;

        const stepsArray = Object.keys(completed_steps).filter(k => completed_steps[k]);
        const porcentajeCompletado = Math.round((stepsArray.length / Math.max(totalSteps, 1)) * 100);

        get().updateCaso(casoSeleccionado, {
          completed_steps,
          step_metadata,
          porcentajeCompletado,
          fasesCompletadas: stepsArray.length,
          totalFases: totalSteps
        });
        const stepNum = stepId.replace('step', '');
        if (completed) {
          useAuditStore.getState().addEntry({
            accion: 'PASO_COMPLETADO',
            detalle: `Paso ${stepNum} completado — ${caso.titulo}`,
            usuario: caso.peritoLider,
            nivel: 'success',
            casoId: casoSeleccionado,
          });
        }
      },
      setStepMetadata: (stepId, metadata) => {
        const { casoSeleccionado, casos } = get();
        if (!casoSeleccionado) return;
        const caso = casos.find(c => c.id === casoSeleccionado);
        if (!caso) return;

        // Nuevo sistema: steps
        if (caso.steps) {
          const steps = {
            ...(caso.steps || {}),
            [stepId]: {
              ...(caso.steps?.[stepId] || { estado: 'disponible' as EstadoPaso }),
              ...metadata,
            },
          };
          get().updateCaso(casoSeleccionado, { steps });
          useAuditStore.getState().addEntry({
            accion: 'METADATA_ACTUALIZADA',
            detalle: `Paso ${stepId} — responsable/observaciones actualizados`,
            usuario: caso.fiscal || 'Perito de Guardia',
            nivel: 'info',
            casoId: casoSeleccionado,
          });
          return;
        }

        // Sistema legacy
        const step_metadata = {
          ...(caso.step_metadata || {}),
          [stepId]: { ...(caso.step_metadata?.[stepId] || {}), ...metadata }
        };

        get().updateCaso(casoSeleccionado, { step_metadata });
        const stepNum = stepId.replace('step', '');
        useAuditStore.getState().addEntry({
          accion: 'METADATA_ACTUALIZADA',
          detalle: `Paso ${stepNum} — responsable/observaciones actualizados en caso`,
          usuario: caso.fiscal || 'Perito de Guardia',
          nivel: 'info',
          casoId: casoSeleccionado,
        });
      },

      // ── Migración: completed_steps + step_metadata → steps ──
      migrateStepsData: () => {
        const { casos, _dataMigrated, normativas } = get();

        // Sincronizar descripciones de normativas extendidas de RAG
        const currentNormativas = normativas || [];
        const needsNormativasUpdate = currentNormativas.length === 0 || currentNormativas.some(n => !n.descripcion || n.descripcion.length < 100);
        if (needsNormativasUpdate) {
          set({ normativas: NORMATIVAS_INICIALES });
        }

        // BUG-014: Mutex para evitar ejecución duplicada en desarrollo (React 18 StrictMode)
        if (_dataMigrated || casos.length === 0 || migrationRunning) return;
        migrationRunning = true;

        let needsUpdate = false;
        const migratedCasos = casos.map(caso => {
          if (caso.steps) return caso; // Ya migrado

          const oldCompleted = caso.completed_steps || {};
          const oldMetadata = caso.step_metadata || {};
          const pasos = caso.tipoProyecto ? getPasosPorTipo(caso.tipoProyecto) : [];
          const steps: Record<string, StepState> = {};

          pasos.forEach((paso, idx) => {
            const wasCompleted = !!oldCompleted[paso.id];
            const meta = oldMetadata[paso.id] || {};

            if (wasCompleted) {
              steps[paso.id] = {
                estado: 'completado',
                fechaInicio: meta.fecha || undefined,
                fechaCompletado: meta.fecha || undefined,
                responsable: meta.responsable || '',
                observaciones: meta.observaciones || '',
              };
            } else {
              // El paso está disponible si el anterior está completado, o si es el primero
              const prevCompleted = idx === 0 || pasos.slice(0, idx).every(p => !!oldCompleted[p.id]);
              steps[paso.id] = {
                estado: prevCompleted ? 'disponible' : 'bloqueado',
              };
            }
          });

          needsUpdate = true;
          return {
            ...caso,
            steps,
            completed_steps: undefined,
            step_metadata: undefined,
          };
        });

        if (needsUpdate) {
          set({ casos: migratedCasos as CasoCMS[], _dataMigrated: true });
        } else {
          set({ _dataMigrated: true });
        }
        migrationRunning = false;
      },

      // ── Inicializar pasos para un caso ──
      initSteps: (casoId) => {
        const { casos } = get();
        const caso = casos.find(c => c.id === casoId);
        if (!caso) return;
        if (caso.steps && Object.keys(caso.steps).length > 0) return; // Ya inicializado

        const pasos = caso.tipoProyecto ? getPasosPorTipo(caso.tipoProyecto) : [];
        const steps: Record<string, StepState> = {};

        pasos.forEach((paso, idx) => {
          steps[paso.id] = {
            estado: idx === 0 ? 'disponible' : 'bloqueado',
          };
        });

        get().updateCaso(casoId, { steps });
      },

      // ── Iniciar paso (disponible → en_progreso) ──
      startStep: (stepId) => {
        const { casoSeleccionado, casos } = get();
        if (!casoSeleccionado) return;
        const caso = casos.find(c => c.id === casoSeleccionado);
        if (!caso) return;

        const currentState = caso.steps?.[stepId]?.estado;
        if (currentState !== 'disponible') return;

        const steps = {
          ...(caso.steps || {}),
          [stepId]: {
            ...(caso.steps?.[stepId] || {}),
            estado: 'en_progreso' as EstadoPaso,
            fechaInicio: new Date().toISOString(),
          },
        };

        get().updateCaso(casoSeleccionado, { steps });
        useAuditStore.getState().addEntry({
          accion: 'PASO_INICIADO',
          detalle: `Paso ${stepId} iniciado`,
          usuario: caso.peritoLider,
          nivel: 'info',
          casoId: casoSeleccionado,
        });
      },

      // ── Verificar si un paso puede completarse ──
      verifyStepCompletion: (stepId, casoIdOverride) => {
        const { casoSeleccionado, casos, tareas } = get();
        // BUG-011: Admitir casoIdOverride opcional
        const effectiveCasoId = casoIdOverride || casoSeleccionado;
        if (!effectiveCasoId) return { canComplete: false, missing: ['No hay caso seleccionado'], missingObjects: [] };
        const caso = casos.find(c => c.id === effectiveCasoId);
        if (!caso) return { canComplete: false, missing: ['Caso no encontrado'], missingObjects: [] };
        if (!caso.tipoProyecto) return { canComplete: false, missing: ['Tipo de proyecto no definido'], missingObjects: [] };

        const pasos = getPasosPorTipo(caso.tipoProyecto);
        const paso = pasos.find(p => p.id === stepId);
        if (!paso) return { canComplete: false, missing: ['Paso no encontrado'], missingObjects: [] };

        const missing: string[] = [];
        const missingObjects: { type: 'tarea' | 'compliance'; id: string; text: string; subId?: string }[] = [];

        // 1. Verificar tareas del paso (solo si existen tareas asignadas)
        const tareasPaso = tareas.filter(t => t.casoId === effectiveCasoId && t.pasoId === stepId);
        const tareasPendientes = tareasPaso.filter(t => t.estado !== 'completada');
        tareasPendientes.forEach(t => {
          missing.push(`Tarea pendiente: ${t.titulo}`);
          missingObjects.push({
            type: 'tarea',
            id: t.id,
            text: `Tarea pendiente: ${t.titulo}`
          });
        });

        // 2. Verificar compliance — Leer del caso directamente (fuente de verdad definitiva)
        const checklist = caso.compliance_checklist || [];
        paso.complianceIds.forEach(reqId => {
          const item = checklist.find(c => c.stageId === reqId);
          if (!item?.checked) {
            // Buscar un nombre legible de la normativa para mostrar una advertencia amigable
            let nombreLegible = reqId;
            let normativaId = '';
            for (const ne of NORMATIVAS_ETAPAS) {
              for (const et of ne.etapas) {
                if (et.id === reqId) {
                  nombreLegible = `${ne.codigo} — ${et.nombre}`;
                  normativaId = ne.normativaId;
                  break;
                }
                if (et.subetapas) {
                  const sub = et.subetapas.find(s => s.id === reqId);
                  if (sub) {
                    nombreLegible = `${ne.codigo} — ${sub.nombre}`;
                    normativaId = ne.normativaId;
                    break;
                  }
                }
              }
            }
            missing.push(`Requisito normativo pendiente: ${nombreLegible}`);
            missingObjects.push({
              type: 'compliance',
              id: reqId,
              subId: normativaId,
              text: `Requisito normativo pendiente: ${nombreLegible}`
            });
          }
        });

        return { canComplete: missing.length === 0, missing, missingObjects };
      },

      // ── Completar paso (con validación) ──
      completeStep: (stepId) => {
        const { casoSeleccionado, casos } = get();
        if (!casoSeleccionado) return { success: false, missing: ['No hay caso seleccionado'] };
        const caso = casos.find(c => c.id === casoSeleccionado);
        if (!caso) return { success: false, missing: ['Caso no encontrado'] };

        const currentState = caso.steps?.[stepId]?.estado;
        if (currentState !== 'en_progreso' && currentState !== 'disponible') {
          return { success: false, missing: ['El paso no está en progreso o disponible'] };
        }

        // BUG-013: Retornar resultado de verificación para que la UI lo muestre
        const { canComplete, missing, missingObjects } = get().verifyStepCompletion(stepId);
        if (!canComplete) {
          useAuditStore.getState().addEntry({
            accion: 'PASO_BLOQUEADO',
            detalle: `Paso ${stepId} no puede completarse. Pendientes: ${missing.join(', ')}`,
            usuario: caso.peritoLider,
            nivel: 'warning',
            casoId: casoSeleccionado,
          });
          return { success: false, missing, missingObjects };
        }

        const nowTime = new Date();
        const offset = nowTime.getTimezoneOffset() * 60000;
        const localISOTime = (new Date(nowTime.getTime() - offset)).toISOString().slice(0, 16);

        const steps = {
          ...(caso.steps || {}),
          [stepId]: {
            ...(caso.steps?.[stepId] || {}),
            estado: 'completado' as EstadoPaso,
            fechaCompletado: localISOTime,
            responsable: caso.fiscal || 'Perito de Guardia',
          },
        };

        // Recalcular porcentaje global
        const totalPasoCount = getPasosPorTipo(caso.tipoProyecto).length;
        const completedCount = Object.values(steps).filter(s => s.estado === 'completado').length;
        const porcentajeCompletado = Math.round((completedCount / Math.max(totalPasoCount, 1)) * 100);

        get().updateCaso(casoSeleccionado, { steps, porcentajeCompletado, fasesCompletadas: completedCount, totalFases: totalPasoCount });

        // Desbloquear siguiente paso
        get().unlockNextStep(stepId);

        useAuditStore.getState().addEntry({
          accion: 'PASO_COMPLETADO',
          detalle: `Paso ${stepId} completado — ${caso.titulo}`,
          usuario: caso.peritoLider,
          nivel: 'success',
          casoId: casoSeleccionado,
        });

        return { success: true };
      },

      // ── Desbloquear siguiente paso ──
      unlockNextStep: (stepId) => {
        const { casoSeleccionado, casos } = get();
        if (!casoSeleccionado) return;
        const caso = casos.find(c => c.id === casoSeleccionado);
        if (!caso || !caso.tipoProyecto) return;

        const pasos = getPasosPorTipo(caso.tipoProyecto);
        const currentIdx = pasos.findIndex(p => p.id === stepId);
        if (currentIdx === -1 || currentIdx >= pasos.length - 1) return;

        const nextPaso = pasos[currentIdx + 1];
        const steps = {
          ...(caso.steps || {}),
          [nextPaso.id]: {
            ...(caso.steps?.[nextPaso.id] || {}),
            estado: 'disponible' as EstadoPaso,
          },
        };

        get().updateCaso(casoSeleccionado, { steps });
      },

      // ── Obtener estado de un paso ──
      getStepState: (stepId) => {
        const { casoSeleccionado, casos } = get();
        if (!casoSeleccionado) return undefined;
        const caso = casos.find(c => c.id === casoSeleccionado);
        return caso?.steps?.[stepId]?.estado;
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
        // Determinar nuevo estado ANTES de actualizar para audit log
        const stateBefore = get();
        const existingBefore = stateBefore.complianceChecklist.find(c => c.stageId === stageId);
        const newChecked = existingBefore ? !existingBefore.checked : true;
        const casoId = stateBefore.casoSeleccionado;

        // Actualización SÍNCRONA: todo dentro del mismo set() para evitar condición de carrera
        set(s => {
          const fechaNow = new Date().toISOString();

          // 1. Actualizar complianceChecklist global
          let updatedChecklist: ComplianceCheckItem[];
          const existing = s.complianceChecklist.find(c => c.stageId === stageId);
          if (existing) {
            updatedChecklist = s.complianceChecklist.map(c =>
              c.stageId === stageId
                ? { ...c, checked: !c.checked, fechaCheck: !c.checked ? fechaNow : undefined }
                : c
            );
          } else {
            updatedChecklist = [
              ...s.complianceChecklist,
              { stageId, normativaId, checked: true, fechaCheck: fechaNow, observacion: '' },
            ];
          }

          // 2. Actualizar compliance_checklist del caso SÍNCRONAMENTE en el mismo set
          let updatedCasos = s.casos;
          if (s.casoSeleccionado) {
            updatedCasos = s.casos.map(caso => {
              if (caso.id !== s.casoSeleccionado) return caso;
              const currentChecklist = caso.compliance_checklist || [];
              let nextChecklist: typeof currentChecklist;
              const cExisting = currentChecklist.find(c => c.stageId === stageId);
              if (cExisting) {
                nextChecklist = currentChecklist.map(c =>
                  c.stageId === stageId
                    ? { ...c, checked: !c.checked, fechaCheck: !c.checked ? fechaNow : undefined }
                    : c
                );
              } else {
                nextChecklist = [
                  ...currentChecklist,
                  { stageId, normativaId, checked: true, fechaCheck: fechaNow, observacion: '' }
                ];
              }
              return { ...caso, compliance_checklist: nextChecklist };
            });
          }

          return { complianceChecklist: updatedChecklist, casos: updatedCasos };
        });

        // BUG-007: Evitar setTimeouts con closures stale. Realizar persistencia de forma asíncrona pero directa.
        const persistAndLog = async () => {
          if (casoId) {
            const updatedCaso = get().casos.find(c => c.id === casoId);
            if (updatedCaso?.compliance_checklist && window.electronAPI?.db?.updateCaso) {
               await window.electronAPI.db.updateCaso(casoId, { compliance_checklist: updatedCaso.compliance_checklist });
            }
          }
          useAuditStore.getState().addEntry({
            accion: newChecked ? 'CUMPLIMIENTO_VERIFICADO' : 'CUMPLIMIENTO_DESVERIFICADO',
            detalle: `Requisito ${stageId} (normativa ${normativaId}) ${newChecked ? 'verificado' : 'desmarcado'}`,
            usuario: 'Perito de Guardia',
            nivel: newChecked ? 'success' : 'info',
            casoId: casoId || undefined,
          });
        };
        persistAndLog();
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
      // BUG-022: partialize para excluir auditLogs y evitar crecimiento desmedido de localStorage
      partialize: (state) => ({
        casos: state.casos,
        evidencias: state.evidencias,
        tareas: state.tareas,
        fases: state.fases,
        personal: state.personal,
        normativas: state.normativas,
        casoSeleccionado: state.casoSeleccionado,
        filtroEstado: state.filtroEstado,
        filtroPrioridad: state.filtroPrioridad,
        busqueda: state.busqueda,
        _dataMigrated: state._dataMigrated,
      }),
    }
  )
);
