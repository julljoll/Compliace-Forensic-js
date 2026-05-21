export interface ForensicStep {
  id: string;
  num: number;
  phase: string;
  title: string;
  action: string;
  docs: string[];
  guide: string;
  tasks: string[];
  iconoName: string;
  normativas: { label: string; color: string }[];
  advertencias?: { titulo: string; cuerpo: string; nivel: string }[];
  codigo?: { lang: string; contenido: string }[];
  complianceIds: string[];
}

export const ETAPAS_FORENSES: ForensicStep[] = [
  {
    id: 'step1',
    num: 1,
    phase: 'Fase 1: Obtención',
    title: 'Recepción, Entrevista y Consignación',
    action: 'Recibir el dispositivo y levantar actas preliminares.',
    docs: ['Acta de Entrevista', 'Acta de Obtención por Consignación'],
    guide: 'Deben redactarse en tercera persona, tiempo presente, de manera clara, secuencial y precisa. Indicar circunstancias de modo, tiempo y lugar. Firmadas por el consignatario y funcionario receptor.',
    tasks: [
      'Realiza una entrevista estructurada (preguntas básicas, intermedias y finales) a quien entrega el equipo.',
      'Levanta el Acta de Entrevista para dejar constancia de cómo obtuvo los chats/audios.',
      'Levanta el Acta de Obtención por Consignación recibiendo formalmente la evidencia.',
    ],
    iconoName: 'FileText',
    normativas: [
      { label: 'Art. 187 COPP', color: 'cyan' },
      { label: 'MUCCEF 2017', color: 'green' },
      { label: 'LMDyFE Art. 4', color: 'cyan' },
    ],
    complianceIds: ['n8__187', 'n4__prcc', 'n7__eficacia'],
  },
  {
    id: 'step2',
    num: 2,
    phase: 'Fase 1: Obtención',
    title: 'Cadena de Custodia Inicial (PRCC)',
    action: 'Documentar la trazabilidad inicial del dispositivo.',
    docs: ['Planilla PRCC', 'Fotografías'],
    guide: 'El funcionario receptor debe describir minuciosamente el dispositivo, su estado, accesorios y cualquier detalle relevante, y proceder al sellado y etiquetado.',
    tasks: [
      'Toma fotografías del dispositivo (mínimo 4 ángulos) antes de encenderlo.',
      'Registra el dispositivo en la Planilla de Registro de Cadena de Custodia (PRCC).',
      'Aplica etiquetado único y sellado de seguridad.',
    ],
    iconoName: 'Shield',
    normativas: [
      { label: 'ISO 27037', color: 'green' },
      { label: 'MUCCEF 2017', color: 'green' },
    ],
    complianceIds: ['n1__identificacion', 'n4__prcc'],
  },
  {
    id: 'step3',
    num: 3,
    phase: 'Fase 1: Obtención',
    title: 'Extracción Forense con Avilla / Andriller',
    action: 'Realizar extracción lógica con herramientas forenses.',
    docs: ['Log de extracción', 'Reporte de hash', 'Fotografías'],
    guide: 'Usar cable del perito. Activar modo avión antes de cualquier conexión. Documentar cada comando ejecutado.',
    tasks: [
      'Conectar el dispositivo al equipo forense usando cable propio.',
      'Verificar que el dispositivo esté en modo avión.',
      'Ejecutar Avilla Forensics o Andriller para extracción lógica.',
      'Verificar integridad con hash SHA-256 del archivo generado.',
    ],
    iconoName: 'Terminal',
    normativas: [
      { label: 'ISO 27037', color: 'green' },
      { label: 'NIST 800-101', color: 'green' },
      { label: 'Art. 187 COPP', color: 'cyan' },
    ],
    complianceIds: ['n3__adquisicion', 'n1__adquisicion'],
  },
  {
    id: 'step4',
    num: 4,
    phase: 'Fase 1: Obtención',
    title: 'Resguardo y Sellado de Evidencia Original',
    action: 'Preservar el dispositivo original como evidencia.',
    docs: ['Cadena de Custodia', 'Fotografías de sellado'],
    guide: 'El dispositivo original no debe ser alterado. Se sella y almacena en bóveda de evidencias. Se trabaja sobre la imagen forense.',
    tasks: [
      'Sellar el dispositivo original en bolsa antiestática con precinto de seguridad.',
      'Almacenar en bóveda de evidencias con control de acceso.',
      'Registrar la ubicación en el sistema y en la PRCC.',
    ],
    iconoName: 'Package',
    normativas: [
      { label: 'ISO 27037', color: 'green' },
      { label: 'MUCCEF 2017', color: 'green' },
    ],
    complianceIds: ['n1__preservacion', 'n4__resguardo'],
  },
  {
    id: 'step5',
    num: 5,
    phase: 'Fase 2: Laboratorio',
    title: 'Procesamiento con ALEAPP',
    action: 'Analizar la extracción con herramientas de laboratorio.',
    docs: ['Reporte ALEAPP', 'Reporte de análisis'],
    guide: 'Cargar la extracción en ALEAPP para parseo de artefactos Android. Documentar todos los hallazgos.',
    tasks: [
      'Cargar el archivo de extracción en ALEAPP.',
      'Ejecutar el análisis completo de artefactos Android.',
      'Revisar y documentar los hallazgos (chats, contactos, multimedia).',
    ],
    iconoName: 'Database',
    normativas: [
      { label: 'ISO 27042', color: 'green' },
      { label: 'NIST 800-101', color: 'green' },
    ],
    complianceIds: ['n2__analisis', 'n3__analisis'],
  },
  {
    id: 'step6',
    num: 6,
    phase: 'Fase 2: Laboratorio',
    title: 'Análisis de WhatsApp / Mensajería',
    action: 'Extraer y analizar conversaciones de WhatsApp.',
    docs: ['Reporte de chats', 'Transcripción de audios'],
    guide: 'Parsear msgstore.db con Avilla WhatsApp Parser. Transcribir audios .opus. Documentar metadata de cada mensaje.',
    tasks: [
      'Parsear la base de datos msgstore.db con el parser de WhatsApp.',
      'Extraer conversaciones relevantes para la investigación.',
      'Transcribir audios .opus a texto usando la herramienta de transcripción.',
      'Generar línea de tiempo de mensajes.',
    ],
    iconoName: 'Smartphone',
    normativas: [
      { label: 'LMDyFE', color: 'yellow' },
      { label: 'LEDI', color: 'yellow' },
    ],
    complianceIds: ['n7__eficacia', 'n6__evidencia'],
  },
  {
    id: 'step7',
    num: 7,
    phase: 'Fase 2: Laboratorio',
    title: 'Dictamen Pericial e Informe',
    action: 'Elaborar el informe pericial final.',
    docs: ['Dictamen Pericial', 'Anexos', 'Cadena de Custoria'],
    guide: 'El dictamen debe contener: metodología, hallazgos, conclusión y firma del perito. Debe incluir la cadena de custodia completa.',
    tasks: [
      'Redactar el dictamen pericial con metodología, hallazgos y conclusiones.',
      'Anexar todos los reportes generados (extracción, análisis, transcripción).',
      'Incluir la planilla PRCC y la cadena de custodia completa.',
      'Firmar digitalmente el dictamen.',
    ],
    iconoName: 'FileCheck',
    normativas: [
      { label: 'Art. 187 COPP', color: 'cyan' },
      { label: 'ISO 27037', color: 'green' },
    ],
    complianceIds: ['n8__prueba', 'n1__documentacion'],
  },
  {
    id: 'step8',
    num: 8,
    phase: 'Fase 3: Disposición Judicial',
    title: 'Presentación y Exhibición Judicial',
    action: 'Presentar la evidencia ante el tribunal.',
    docs: ['Acta de Exhibición', 'Oficio de remisión'],
    guide: 'Coordinar con el tribunal la presentación de la evidencia. Levantar acta de exhibición y entrega formal.',
    tasks: [
      'Preparar la evidencia digital y el dictamen para presentación judicial.',
      'Coordinar con el tribunal la fecha y hora de exhibición.',
      'Levantar acta de exhibición y entrega formal.',
    ],
    iconoName: 'Scale',
    normativas: [
      { label: 'Art. 187 COPP', color: 'cyan' },
      { label: 'MUCCEF 2017', color: 'green' },
    ],
    complianceIds: ['n8__exhibicion', 'n4__judicial'],
  },
  {
    id: 'step9',
    num: 9,
    phase: 'Fase 4: Disposición Final',
    title: 'Cierre y Disposición Final de Evidencia',
    action: 'Cerrar el caso y disponer de la evidencia.',
    docs: ['Acta de Cierre', 'Documento de disposición final'],
    guide: 'Determinar la disposición final de la evidencia (devolución, destrucción, archivo definitivo) y documentar el cierre.',
    tasks: [
      'Determinar la disposición final según orden judicial o normativa.',
      'Documentar la disposición en acta de cierre.',
      'Actualizar el estado del caso a cerrado o archivado.',
    ],
    iconoName: 'CheckCircle2',
    normativas: [
      { label: 'MUCCEF 2017', color: 'green' },
      { label: 'LEDI', color: 'yellow' },
    ],
    complianceIds: ['n4__cierre', 'n6__disposicion'],
  },
];

export const getStepById = (id: string): ForensicStep | undefined => {
  return ETAPAS_FORENSES.find((s) => s.id === id);
};

export const getStepsByPhase = (phase: string): ForensicStep[] => {
  return ETAPAS_FORENSES.filter((s) => s.phase === phase);
};

export const getPhases = (): string[] => {
  const phases = new Set(ETAPAS_FORENSES.map((s) => s.phase));
  return Array.from(phases);
};
