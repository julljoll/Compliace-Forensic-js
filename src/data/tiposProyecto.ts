import { Smartphone, Mail, HardDrive } from '../components/atoms/AppleIcon';

export type TipoProyecto = 'forense_whatsapp' | 'forense_email' | 'forense_discoduro';

export interface ProyectoPaso {
  id: string;
  num: number;
  fase: string;
  titulo: string;
  action: string;
  docs: string[];
  guide: string;
  tareas: string[];
  complianceIds: string[];
  iconoName: string;
  normativas: { label: string; color: string }[];
  advertencias?: { titulo: string; cuerpo: string; nivel: string }[];
  codigo?: { lang: string; contenido: string }[];
}

export interface ProyectoFase {
  nombre: string;
  orden: number;
  pasoIds: string[];
}

export interface ProyectoTipoConfig {
  id: TipoProyecto;
  label: string;
  descripcion: string;
  icon: any;
  iconoName: string;
  color: string;
  pasos: ProyectoPaso[];
  fases: ProyectoFase[];
  normativasPorDefecto: string[];
  requerimientosTecnicos: string[];
  requerimientosLegales: string[];
}

const TIPOS_PROYECTO: Record<TipoProyecto, ProyectoTipoConfig> = {
  // ─── Forense WhatsApp ────────────────────────────────────────────────
  forense_whatsapp: {
    id: 'forense_whatsapp',
    label: 'Forense WhatsApp',
    descripcion: 'Extracción y análisis forense de conversaciones de WhatsApp desde dispositivo móvil Android. Incluye adquisición lógica, parseo de msgstore.db, transcripción de audios .opus y dictamen pericial.',
    icon: Smartphone,
    iconoName: 'Smartphone',
    color: 'green',
    normativasPorDefecto: ['n1', 'n4', 'n8', 'n7'],
    requerimientosTecnicos: [
      'Cable USB propio del perito',
      'Avilla Forensics / Andriller instalado',
      'ALEAPP e IPED Digital Forensic Tool para análisis de artefactos Android y bases de datos',
      'Parser de WhatsApp (Avilla WhatsApp Parser)',
      'Herramienta de transcripción de audios .opus',
      'Bolsa antiestática y precintos de seguridad'
    ],
    requerimientosLegales: [
      'Orden judicial o autorización del fiscal',
      'Acta de entrevista y consignación',
      'Planilla PRCC',
      'Dictamen pericial firmado'
    ],
    fases: [
      { nombre: 'Fase 1: Obtención', orden: 1, pasoIds: ['wp_step1', 'wp_step2', 'wp_step3', 'wp_step4'] },
      { nombre: 'Fase 2: Laboratorio', orden: 2, pasoIds: ['wp_step5', 'wp_step6', 'wp_step7'] },
      { nombre: 'Fase 3: Disposición Judicial', orden: 3, pasoIds: ['wp_step8'] },
      { nombre: 'Fase 4: Disposición Final', orden: 4, pasoIds: ['wp_step9'] },
    ],
    pasos: [
      {
        id: 'wp_step1', num: 1, fase: 'Fase 1: Obtención',
        titulo: 'Recepción, Entrevista y Consignación',
        action: 'Recibir el dispositivo y levantar actas preliminares.',
        docs: ['Acta de Entrevista', 'Acta de Obtención por Consignación'],
        guide: 'Redactar en tercera persona, tiempo presente, de manera clara y precisa. Firmadas por consignatario y funcionario receptor.',
        tareas: [
          'Realizar entrevista estructurada a quien entrega el equipo',
          'Levantar Acta de Entrevista',
          'Levantar Acta de Obtención por Consignación'
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
        id: 'wp_step2', num: 2, fase: 'Fase 1: Obtención',
        titulo: 'Cadena de Custodia Inicial (PRCC)',
        action: 'Documentar la trazabilidad inicial del dispositivo.',
        docs: ['Planilla PRCC', 'Fotografías'],
        guide: 'Describir minuciosamente el dispositivo, su estado, accesorios. Proceder al sellado y etiquetado.',
        tareas: [
          'Tomar fotografías del dispositivo (mínimo 4 ángulos)',
          'Registrar dispositivo en Planilla PRCC',
          'Aplicar etiquetado único y sellado de seguridad'
        ],
        iconoName: 'Shield',
        normativas: [
          { label: 'ISO 27037', color: 'green' },
          { label: 'MUCCEF 2017', color: 'green' },
        ],
        complianceIds: ['n1__identificacion', 'n4__prcc'],
      },
      {
        id: 'wp_step3', num: 3, fase: 'Fase 1: Obtención',
        titulo: 'Extracción Forense con Avilla / Andriller',
        action: 'Realizar extracción lógica con herramientas forenses.',
        docs: ['Log de extracción', 'Reporte de hash', 'Fotografías'],
        guide: 'Usar cable del perito. Activar modo avión antes de cualquier conexión. Documentar cada comando.',
        tareas: [
          'Conectar dispositivo al equipo forense con cable propio',
          'Verificar modo avión activado',
          'Ejecutar Avilla Forensics o Andriller para extracción lógica',
          'Verificar integridad con hash SHA-256 del archivo generado'
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
        id: 'wp_step4', num: 4, fase: 'Fase 1: Obtención',
        titulo: 'Resguardo y Sellado de Evidencia Original',
        action: 'Preservar el dispositivo original como evidencia.',
        docs: ['Cadena de Custodia', 'Fotografías de sellado'],
        guide: 'El dispositivo original no debe ser alterado. Se sella y almacena en bóveda de evidencias.',
        tareas: [
          'Sellar dispositivo original en bolsa antiestática con precinto',
          'Almacenar en bóveda de evidencias',
          'Registrar ubicación en sistema y PRCC'
        ],
        iconoName: 'Package',
        normativas: [
          { label: 'ISO 27037', color: 'green' },
          { label: 'MUCCEF 2017', color: 'green' },
        ],
        complianceIds: ['n1__preservacion', 'n4__resguardo'],
      },
      {
        id: 'wp_step5', num: 5, fase: 'Fase 2: Laboratorio',
        titulo: 'Procesamiento con ALEAPP e IPED Digital Forensic Tool',
        action: 'Analizar la extracción con herramientas de laboratorio.',
        docs: ['Reporte ALEAPP', 'Reporte IPED', 'Reporte de análisis'],
        guide: 'Cargar extracción en ALEAPP para parseo de artefactos Android y utilizar IPED Digital Forensic Tool para análisis avanzado de bases de datos.',
        tareas: [
          'Cargar archivo de extracción en ALEAPP',
          'Procesar extracción con IPED Digital Forensic Tool',
          'Ejecutar análisis completo de artefactos Android y bases de datos',
          'Revisar y documentar hallazgos de ambas herramientas'
        ],
        iconoName: 'Database',
        normativas: [
          { label: 'ISO 27042', color: 'green' },
          { label: 'NIST 800-101', color: 'green' },
        ],
        complianceIds: ['n2__analisis', 'n3__analisis'],
      },
      {
        id: 'wp_step6', num: 6, fase: 'Fase 2: Laboratorio',
        titulo: 'Análisis de WhatsApp / Mensajería',
        action: 'Extraer y analizar conversaciones de WhatsApp.',
        docs: ['Reporte de chats', 'Transcripción de audios'],
        guide: 'Parsear msgstore.db. Transcribir audios .opus. Documentar metadata de cada mensaje.',
        tareas: [
          'Parsear msgstore.db con parser de WhatsApp',
          'Extraer conversaciones relevantes para la investigación',
          'Transcribir audios .opus a texto',
          'Generar línea de tiempo de mensajes'
        ],
        iconoName: 'Smartphone',
        normativas: [
          { label: 'LMDyFE', color: 'yellow' },
          { label: 'LEDI', color: 'yellow' },
        ],
        complianceIds: ['n7__eficacia', 'n6__evidencia'],
      },
      {
        id: 'wp_step7', num: 7, fase: 'Fase 2: Laboratorio',
        titulo: 'Dictamen Pericial e Informe',
        action: 'Elaborar el informe pericial final.',
        docs: ['Dictamen Pericial', 'Anexos', 'Cadena de Custodia'],
        guide: 'Incluir metodología, hallazgos, conclusión y firma del perito.',
        tareas: [
          'Redactar dictamen pericial con metodología y conclusiones',
          'Anexar reportes generados',
          'Incluir planilla PRCC y cadena de custodia',
          'Firmar digitalmente el dictamen'
        ],
        iconoName: 'FileCheck',
        normativas: [
          { label: 'Art. 187 COPP', color: 'cyan' },
          { label: 'ISO 27037', color: 'green' },
        ],
        complianceIds: ['n8__prueba', 'n1__documentacion'],
      },
      {
        id: 'wp_step8', num: 8, fase: 'Fase 3: Disposición Judicial',
        titulo: 'Presentación y Exhibición Judicial',
        action: 'Presentar la evidencia ante el tribunal.',
        docs: ['Acta de Exhibición', 'Oficio de remisión'],
        guide: 'Coordinar con el tribunal la presentación de la evidencia.',
        tareas: [
          'Preparar evidencia digital y dictamen para presentación judicial',
          'Coordinar fecha y hora de exhibición',
          'Levantar acta de exhibición y entrega formal'
        ],
        iconoName: 'Scale',
        normativas: [
          { label: 'Art. 187 COPP', color: 'cyan' },
          { label: 'MUCCEF 2017', color: 'green' },
        ],
        complianceIds: ['n8__exhibicion', 'n4__judicial'],
      },
      {
        id: 'wp_step9', num: 9, fase: 'Fase 4: Disposición Final',
        titulo: 'Cierre y Disposición Final de Evidencia',
        action: 'Cerrar el caso y disponer de la evidencia.',
        docs: ['Acta de Cierre', 'Documento de disposición final'],
        guide: 'Determinar disposición final de la evidencia y documentar el cierre.',
        tareas: [
          'Determinar disposición final según orden judicial',
          'Documentar disposición en acta de cierre',
          'Actualizar estado del caso a cerrado o archivado'
        ],
        iconoName: 'CheckCircle2',
        normativas: [
          { label: 'MUCCEF 2017', color: 'green' },
          { label: 'LEDI', color: 'yellow' },
        ],
        complianceIds: ['n4__cierre', 'n6__disposicion'],
      },
    ],
  },

  // ─── Forense Email ───────────────────────────────────────────────────
  forense_email: {
    id: 'forense_email',
    label: 'Forense Email',
    descripcion: 'Análisis forense de correo electrónico: obtención de buzones (PST/OST), análisis de cabeceras, extracción de adjuntos, verificación de metadatos y cadena de custodia de comunicaciones electrónicas.',
    icon: Mail,
    iconoName: 'Mail',
    color: 'blue',
    normativasPorDefecto: ['n1', 'n7', 'n8', 'n6'],
    requerimientosTecnicos: [
      'Cliente de correo para exportación (Outlook / Thunderbird)',
      'Herramienta de análisis de cabeceras (EmailTrackerPro / MXToolbox)',
      'Analizador de metadatos de correo (emlparser / libpff)',
      'Software de extracción de adjuntos',
      'Hash verifier SHA-256 / MD5',
      'Bolsa antiestática y precintos (si hay hardware)'
    ],
    requerimientosLegales: [
      'Orden judicial o autorización del fiscal',
      'Identificación clara de cuentas de correo a investigar',
      'Acta de obtención de buzón',
      'Planilla PRCC para soporte físico (disco/PC)',
      'Dictamen pericial firmado'
    ],
    fases: [
      { nombre: 'Fase 1: Identificación y Obtención', orden: 1, pasoIds: ['em_step1', 'em_step2'] },
      { nombre: 'Fase 2: Análisis Técnico', orden: 2, pasoIds: ['em_step3', 'em_step4', 'em_step5'] },
      { nombre: 'Fase 3: Documentación y Dictamen', orden: 3, pasoIds: ['em_step6'] },
      { nombre: 'Fase 4: Disposición Final', orden: 4, pasoIds: ['em_step7'] },
    ],
    pasos: [
      {
        id: 'em_step1', num: 1, fase: 'Fase 1: Identificación y Obtención',
        titulo: 'Identificación de Fuentes y Cuentas de Correo',
        action: 'Identificar y documentar todas las cuentas de correo y fuentes de mensajes electrónicos.',
        docs: ['Acta de Identificación de Fuentes', 'Listado de cuentas'],
        guide: 'Identificar todas las cuentas de correo relevantes, proveedores de servicio (Gmail, Outlook, corporativo), y dispositivos asociados.',
        tareas: [
          'Identificar cuentas de correo electrónico a investigar',
          'Documentar proveedores de servicio y tipo de acceso',
          'Solicitar credenciales de acceso o copia del buzón'
        ],
        iconoName: 'FileText',
        normativas: [
          { label: 'ISO 27037', color: 'green' },
          { label: 'Art. 187 COPP', color: 'cyan' },
        ],
        complianceIds: ['n1__identificacion', 'n8__187'],
      },
      {
        id: 'em_step2', num: 2, fase: 'Fase 1: Identificación y Obtención',
        titulo: 'Obtención de Archivos de Buzón (PST/OST)',
        action: 'Realizar copia forense del buzón de correo.',
        docs: ['Acta de Obtención', 'Log de exportación'],
        guide: 'Exportar buzón a formato PST/OST con verificación de integridad SHA-256. Documentar todo el proceso.',
        tareas: [
          'Exportar buzón de correo completo a PST/OST',
          'Verificar integridad del archivo exportado con SHA-256',
          'Sellar y etiquetar el archivo como evidencia digital'
        ],
        iconoName: 'Terminal',
        normativas: [
          { label: 'ISO 27037', color: 'green' },
          { label: 'NIST 800-101', color: 'green' },
        ],
        complianceIds: ['n1__adquisicion', 'n3__adquisicion'],
      },
      {
        id: 'em_step3', num: 3, fase: 'Fase 2: Análisis Técnico',
        titulo: 'Análisis de Cabeceras de Correo Electrónico',
        action: 'Analizar cabeceras para rastrear origen y ruta del mensaje.',
        docs: ['Reporte de análisis de cabeceras', 'Diagrama de ruta'],
        guide: 'Extraer cabeceras completas (Internet Headers). Analizar campos Received, Message-ID, SPF, DKIM, DMARC para determinar autenticidad y ruta.',
        tareas: [
          'Extraer cabeceras completas de cada correo relevante',
          'Analizar ruta de servidores SMTP',
          'Verificar autenticidad SPF, DKIM y DMARC',
          'Documentar hallazgos en reporte técnico'
        ],
        iconoName: 'Database',
        normativas: [
          { label: 'ISO 27042', color: 'green' },
          { label: 'LMDyFE', color: 'yellow' },
        ],
        complianceIds: ['n2__analisis', 'n7__eficacia'],
      },
      {
        id: 'em_step4', num: 4, fase: 'Fase 2: Análisis Técnico',
        titulo: 'Extracción y Análisis de Adjuntos',
        action: 'Extraer y analizar archivos adjuntos de los correos.',
        docs: ['Reporte de adjuntos', 'Análisis de malware'],
        guide: 'Extraer todos los archivos adjuntos, calcular hash de cada uno, analizar en busca de malware o contenido relevante.',
        tareas: [
          'Extraer archivos adjuntos de los correos seleccionados',
          'Calcular hash SHA-256 de cada adjunto',
          'Analizar adjuntos en busca de malware o datos relevantes'
        ],
        iconoName: 'Package',
        normativas: [
          { label: 'LEDI', color: 'yellow' },
          { label: 'NIST 800-101', color: 'green' },
        ],
        complianceIds: ['n6__evidencia', 'n3__examen'],
      },
      {
        id: 'em_step5', num: 5, fase: 'Fase 2: Análisis Técnico',
        titulo: 'Análisis de Metadatos y Línea de Tiempo',
        action: 'Analizar metadatos y construir línea de tiempo de comunicaciones.',
        docs: ['Línea de tiempo', 'Reporte de metadatos'],
        guide: 'Extraer metadatos (fechas, destinatarios, asuntos, tamaño). Construir línea de tiempo cronológica de las comunicaciones.',
        tareas: [
          'Extraer metadatos de todos los correos',
          'Construir línea de tiempo cronológica',
          'Identificar patrones de comunicación relevantes'
        ],
        iconoName: 'Smartphone',
        normativas: [
          { label: 'LMDyFE', color: 'yellow' },
          { label: 'ISO 27042', color: 'green' },
        ],
        complianceIds: ['n7__firma', 'n2__interpretacion'],
      },
      {
        id: 'em_step6', num: 6, fase: 'Fase 3: Documentación y Dictamen',
        titulo: 'Informe Pericial de Correo Electrónico',
        action: 'Elaborar dictamen pericial del análisis de correo.',
        docs: ['Dictamen Pericial Email Forense', 'Anexos técnicos'],
        guide: 'Dictamen debe incluir: metodología, análisis de cabeceras, adjuntos, metadatos, conclusiones sobre autenticidad y autoría.',
        tareas: [
          'Redactar dictamen pericial de correo electrónico',
          'Incluir reportes de cabeceras, adjuntos y metadatos',
          'Firmar digitalmente el dictamen'
        ],
        iconoName: 'FileCheck',
        normativas: [
          { label: 'Art. 187 COPP', color: 'cyan' },
          { label: 'LMDyFE', color: 'yellow' },
        ],
        complianceIds: ['n8__prueba', 'n7__igualdad'],
      },
      {
        id: 'em_step7', num: 7, fase: 'Fase 4: Disposición Final',
        titulo: 'Cierre y Disposición de Evidencia',
        action: 'Cerrar el caso y disponer de la evidencia digital.',
        docs: ['Acta de Cierre'],
        guide: 'Determinar disposición final del material extraído y documentar el cierre del peritaje.',
        tareas: [
          'Determinar disposición final según orden judicial',
          'Archivar copia forense del buzón',
          'Actualizar estado del caso a cerrado'
        ],
        iconoName: 'CheckCircle2',
        normativas: [
          { label: 'MUCCEF 2017', color: 'green' },
          { label: 'LEDI', color: 'yellow' },
        ],
        complianceIds: ['n4__cierre', 'n6__disposicion'],
      },
    ],
  },

  // ─── Forense Disco Duro ──────────────────────────────────────────────
  forense_discoduro: {
    id: 'forense_discoduro',
    label: 'Forense Disco Duro',
    descripcion: 'Adquisición forense de discos duros y unidades de almacenamiento. Incluye creación de imagen bit-a-bit, análisis de particiones, recuperación de archivos eliminados, y dictamen pericial.',
    icon: HardDrive,
    iconoName: 'HardDrive',
    color: 'purple',
    normativasPorDefecto: ['n1', 'n3', 'n4', 'n8'],
    requerimientosTecnicos: [
      'Write-blocker hardware (Tableau / WiebeTech)',
      'FTK Imager / Guymager / DC3DD',
      'Analizador de particiones (Autopsy / Sleuth Kit)',
      'Herramienta de recuperación de archivos (Recuva / R-Studio / Scalpel)',
      'Hash verifier SHA-256',
      'Disco duro de destino con capacidad suficiente',
      'Bolsa antiestática y precintos de seguridad'
    ],
    requerimientosLegales: [
      'Orden judicial o autorización del fiscal',
      'Acta de incautación o consignación del disco',
      'Planilla PRCC con descripción del dispositivo',
      'Dictamen pericial firmado'
    ],
    fases: [
      { nombre: 'Fase 1: Recepción y Preparación', orden: 1, pasoIds: ['hd_step1', 'hd_step2'] },
      { nombre: 'Fase 2: Adquisición Forense', orden: 2, pasoIds: ['hd_step3', 'hd_step4'] },
      { nombre: 'Fase 3: Análisis y Recuperación', orden: 3, pasoIds: ['hd_step5', 'hd_step6'] },
      { nombre: 'Fase 4: Documentación y Cierre', orden: 4, pasoIds: ['hd_step7', 'hd_step8'] },
    ],
    pasos: [
      {
        id: 'hd_step1', num: 1, fase: 'Fase 1: Recepción y Preparación',
        titulo: 'Recepción y Documentación del Dispositivo',
        action: 'Recibir y documentar el disco duro o unidad de almacenamiento.',
        docs: ['Acta de Recepción', 'Fotografías del dispositivo'],
        guide: 'Recibir el dispositivo, fotografiar su estado físico, registrar marca, modelo, capacidad y número de serie.',
        tareas: [
          'Fotografiar el dispositivo desde múltiples ángulos',
          'Registrar marca, modelo, capacidad y serie',
          'Documentar estado físico del dispositivo'
        ],
        iconoName: 'FileText',
        normativas: [
          { label: 'Art. 187 COPP', color: 'cyan' },
          { label: 'MUCCEF 2017', color: 'green' },
        ],
        complianceIds: ['n8__187', 'n4__fase_inicial'],
      },
      {
        id: 'hd_step2', num: 2, fase: 'Fase 1: Recepción y Preparación',
        titulo: 'Cadena de Custodia y PRCC',
        action: 'Documentar la trazabilidad del dispositivo.',
        docs: ['Planilla PRCC'],
        guide: 'Registrar en PRCC la cadena de custodia del dispositivo, incluyendo estado, precintos y sellos.',
        tareas: [
          'Registrar dispositivo en Planilla PRCC',
          'Aplicar etiquetado único y sellado',
          'Documentar cadena de custodia'
        ],
        iconoName: 'Shield',
        normativas: [
          { label: 'ISO 27037', color: 'green' },
          { label: 'Art. 187 COPP', color: 'cyan' },
        ],
        complianceIds: ['n1__identificacion', 'n8__188'],
      },
      {
        id: 'hd_step3', num: 3, fase: 'Fase 2: Adquisición Forense',
        titulo: 'Conexión con Write-Blocker',
        action: 'Conectar el disco usando write-blocker hardware.',
        docs: ['Fotografía de conexión', 'Log de reconocimiento'],
        guide: 'Conectar el disco a través de write-blocker hardware. Verificar que el sistema operativo reconozca el dispositivo en modo solo lectura.',
        tareas: [
          'Conectar disco mediante write-blocker hardware',
          'Verificar reconocimiento en modo solo lectura',
          'Documentar configuración de conexión'
        ],
        iconoName: 'Terminal',
        normativas: [
          { label: 'NIST 800-101', color: 'green' },
          { label: 'ISO 27037', color: 'green' },
        ],
        complianceIds: ['n3__preservacion', 'n1__preservacion'],
      },
      {
        id: 'hd_step4', num: 4, fase: 'Fase 2: Adquisición Forense',
        titulo: 'Creación de Imagen Bit-a-Bit (DD / E01)',
        action: 'Crear imagen forense del disco con verificación de hash.',
        docs: ['Log de adquisición', 'Reporte de hash SHA-256', 'Fotografías'],
        guide: 'Crear imagen bit-a-bit usando FTK Imager, Guymager o DD. Calcular hash SHA-256 antes y después de la adquisición.',
        tareas: [
          'Calcular hash SHA-256 del disco original',
          'Crear imagen forense bit-a-bit (DD/E01)',
          'Verificar hash de la imagen vs disco original',
          'Documentar todo el proceso en log'
        ],
        iconoName: 'HardDrive',
        normativas: [
          { label: 'NIST 800-101', color: 'green' },
          { label: 'ISO 27037', color: 'green' },
        ],
        complianceIds: ['n3__adquisicion', 'n1__adquisicion'],
      },
      {
        id: 'hd_step5', num: 5, fase: 'Fase 3: Análisis y Recuperación',
        titulo: 'Análisis de Particiones y Sistema de Archivos',
        action: 'Analizar la estructura de particiones del disco.',
        docs: ['Reporte de particiones', 'Diagrama de estructura'],
        guide: 'Montar la imagen en modo solo lectura. Analizar tabla de particiones (MBR/GPT), sistema de archivos (NTFS/FAT32/ext4).',
        tareas: [
          'Montar imagen forense en modo solo lectura',
          'Analizar tabla de particiones (MBR/GPT)',
          'Identificar sistemas de archivos presentes'
        ],
        iconoName: 'Database',
        normativas: [
          { label: 'ISO 27042', color: 'green' },
          { label: 'NIST 800-101', color: 'green' },
        ],
        complianceIds: ['n2__examen', 'n3__examen'],
      },
      {
        id: 'hd_step6', num: 6, fase: 'Fase 3: Análisis y Recuperación',
        titulo: 'Recuperación de Archivos Eliminados',
        action: 'Recuperar archivos eliminados y datos ocultos.',
        docs: ['Reporte de recuperación', 'Listado de archivos'],
        guide: 'Utilizar herramientas forenses para recuperar archivos eliminados, slack space, y datos ocultos. Documentar todos los hallazgos.',
        tareas: [
          'Ejecutar escaneo de archivos eliminados',
          'Recuperar archivos de interés forense',
          'Documentar hallazgos con hash de cada archivo'
        ],
        iconoName: 'Smartphone',
        normativas: [
          { label: 'ISO 27042', color: 'green' },
          { label: 'LEDI', color: 'yellow' },
        ],
        complianceIds: ['n2__analisis', 'n6__evidencia'],
      },
      {
        id: 'hd_step7', num: 7, fase: 'Fase 4: Documentación y Cierre',
        titulo: 'Dictamen Pericial de Disco Duro',
        action: 'Elaborar el informe pericial del análisis forense.',
        docs: ['Dictamen Pericial', 'Anexos'],
        guide: 'Incluir metodología de adquisición, hallazgos, archivos recuperados, y conclusiones técnicas.',
        tareas: [
          'Redactar dictamen pericial de disco duro',
          'Incluir log de adquisición y reportes de hash',
          'Firmar digitalmente el dictamen'
        ],
        iconoName: 'FileCheck',
        normativas: [
          { label: 'Art. 187 COPP', color: 'cyan' },
          { label: 'ISO 27037', color: 'green' },
        ],
        complianceIds: ['n8__prueba', 'n1__documentacion'],
      },
      {
        id: 'hd_step8', num: 8, fase: 'Fase 4: Documentación y Cierre',
        titulo: 'Cierre y Disposición de Evidencia',
        action: 'Cerrar el caso y disponer del disco.',
        docs: ['Acta de Cierre', 'Documento de disposición'],
        guide: 'Determinar disposición final del disco y la imagen forense.',
        tareas: [
          'Determinar disposición final del disco',
          'Archivar imagen forense según normativa',
          'Actualizar estado del caso a cerrado'
        ],
        iconoName: 'CheckCircle2',
        normativas: [
          { label: 'MUCCEF 2017', color: 'green' },
          { label: 'LEDI', color: 'yellow' },
        ],
        complianceIds: ['n4__cierre', 'n6__disposicion'],
      },
    ],
  },
};

export function getTipoProyectoConfig(tipo: TipoProyecto): ProyectoTipoConfig {
  return TIPOS_PROYECTO[tipo];
}

export function getTiposProyecto(): { id: TipoProyecto; label: string; descripcion: string; icon: any; color: string }[] {
  return Object.values(TIPOS_PROYECTO).map(t => ({
    id: t.id, label: t.label, descripcion: t.descripcion, icon: t.icon, color: t.color
  }));
}

export function getPasosPorTipo(tipo: TipoProyecto): ProyectoPaso[] {
  return TIPOS_PROYECTO[tipo].pasos;
}

export function getFasesPorTipo(tipo: TipoProyecto): ProyectoFase[] {
  return TIPOS_PROYECTO[tipo].fases;
}

export function getTareasPorDefecto(tipo: TipoProyecto): { pasoId: string; titulo: string }[] {
  const tareas: { pasoId: string; titulo: string }[] = [];
  for (const paso of TIPOS_PROYECTO[tipo].pasos) {
    for (const t of paso.tareas) {
      tareas.push({ pasoId: paso.id, titulo: t });
    }
  }
  return tareas;
}

export default TIPOS_PROYECTO;
