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
      'AVILLA Forensics o Kali Linux + Andriller (ADB) para adquisición',
      'ALEAPP para parseo y triaje de artefactos Android',
      'IPED Forensics para análisis formal completo',
      'Distribución Samurai Linux / PALADIN para respuesta a incidentes en campo',
      'Herramienta de transcripción de audios .opus',
      'Bolsa antiestática Faraday y precintos de seguridad'
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
          'Verificar la identidad del consignatario mediante cédula de identidad',
          'Documentar detalladamente el motivo de la consignación de la evidencia',
          'Registrar marca, modelo, seriales e IMEI/IMEI2 del dispositivo consignado',
          'Registrar número telefónico y compañía operadora de la línea activa',
          'Verificar el estado de carga de la batería y si la pantalla enciende',
          'Inspeccionar y documentar minuciosamente daños físicos visibles en el equipo',
          'Redactar y levantar el Acta de Entrevista estructurada',
          'Redactar y firmar el Acta de Obtención por Consignación (consignatario y receptor)'
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
          'Tomar fijación fotográfica del dispositivo desde al menos 4 ángulos diferentes',
          'Registrar minuciosamente el dispositivo y accesorios en la planilla PRCC',
          'Colocar el equipo en una bolsa antiestática o bolsa Faraday de seguridad',
          'Aplicar sellado de seguridad inviolable y rotulación técnica reglamentaria',
          'Asentar en PRCC los datos del perito de origen y el funcionario trasladante'
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
        titulo: 'Extracción Forense con AVILLA / Andriller',
        action: 'Realizar extracción lógica con herramientas forenses.',
        docs: ['Log de extracción', 'Reporte de hash', 'Fotografías'],
        guide: 'Usar cable del perito. Activar modo avión antes de cualquier conexión. Documentar cada comando.',
        tareas: [
          'Aislar el dispositivo móvil en Modo Avión o dentro de bolsa Faraday',
          'Conectar el equipo a la estación forense usando cable propio certificado',
          'Configurar depuración USB y depurar permisos necesarios en modo solo lectura',
          'Ejecutar extracción lógica o física con AVILLA Forensics o Andriller (vía ADB)',
          'Calcular hash SHA-256 del contenedor de la extracción forense generada',
          'Guardar log detallado de la extracción y el reporte de hash pre-imagen'
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
          'Embalar dispositivo original en bolsa antiestática sellada con precinto único',
          'Rotular el embalaje exterior y asentar la codificación del precinto en PRCC',
          'Registrar formalmente el ingreso físico de la evidencia a la Bóveda de Resguardo',
          'Verificar condiciones de resguardo: temperatura, humedad y control de acceso',
          'Registrar la ubicación física exacta del depósito en PRCC y sistema de control'
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
        titulo: 'Procesamiento con ALEAPP e IPED Forensics',
        action: 'Analizar la extracción con herramientas de laboratorio.',
        docs: ['Reporte ALEAPP', 'Reporte IPED', 'Reporte de análisis'],
        guide: 'Cargar la extracción en ALEAPP para parseo preliminar de artefactos Android y utilizar IPED Forensics para análisis indexado avanzado y búsquedas complejas.',
        tareas: [
          'Verificar la integridad del embalaje y correspondencia de precintos al recibir',
          'Recalcular y validar hash SHA-256 de la extracción antes de iniciar análisis',
          'Cargar el archivo de extracción lógica en la herramienta ALEAPP para triaje rápido',
          'Procesar la extracción en IPED Forensics para indexación profunda y búsquedas cruzadas',
          'Ejecutar búsquedas cruzadas y clasificar los registros de interés forense',
          'Documentar versiones exactas de ALEAPP e IPED Forensics en la bitácora del perito'
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
          'Localizar y extraer base de datos SQLite msgstore.db de WhatsApp',
          'Parsear la base de datos msgstore.db para la extracción íntegra de chats',
          'Extraer y transcribir a texto archivos de audio en formato .opus adjuntos',
          'Construir línea de tiempo cronológica (fecha, hora, remitente, destinatario)',
          'Identificar y documentar metadatos y registros de mensajes eliminados',
          'Exportar chats analizados calculando hash individual para cada reporte'
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
          'Redactar dictamen pericial estructurado (Motivo, Descripción, Examen y Conclusiones)',
          'Registrar de forma obligatoria las versiones exactas de herramientas y software usados',
          'Incluir tabla de resultados con nombre nativo, ruta, tamaño y Hash SHA-256 individual',
          'Formular conclusiones técnico-científicas claras sin precalificaciones jurídicas',
          'Adjuntar planilla PRCC completa, bitácora de peritaje y anexos firmados',
          'Firmar y sellar físicamente/digitalmente el dictamen pericial como Perito Informático'
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
          'Preparar el contenedor de evidencia digital y dictamen pericial para juicio',
          'Coordinar con la secretaría del tribunal la fecha y hora de la exhibición',
          'Realizar el traslado pericial cumpliendo las medidas de seguridad y embalaje',
          'Presentar y exhibir la evidencia digital en la audiencia de juicio oral',
          'Levantar Acta de Exhibición de Evidencias en audiencia y firmar PRCC de traslado'
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
          'Recibir orden judicial expresa que determine la disposición final de la evidencia',
          'Materializar el cierre formal correspondiente (Devolución, Entrega o Destrucción)',
          'Levantar y firmar el Acta de Disposición Final de Evidencias en el laboratorio',
          'Registrar el cierre administrativo e instrumental en observaciones de la planilla PRCC',
          'Archivar copias de respaldo de imágenes forenses bajo resguardo inmutable'
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
          'Identificar cuentas de correo electrónico a investigar e IP de servidores',
          'Documentar proveedores de servicio (IMAP/POP3/Exchange) y tipo de cifrado',
          'Registrar orden judicial de interceptación o autorización de acceso fiscal',
          'Solicitar formalmente credenciales de acceso o copia directa del buzón original',
          'Registrar de forma descriptiva el buzón de destino y perfiles asociados en el PRCC'
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
          'Exportar buzón de correo completo a formato estructurado PST/OST/MBOX',
          'Calcular hash SHA-256 del archivo de buzón exportado (sello criptográfico inicial)',
          'Sellar y etiquetar digitalmente el archivo contenedor como evidencia primaria',
          'Almacenar el archivo de buzón en un medio físico/lógico protegido bajo PRCC',
          'Registrar ingreso a la bóveda y documentar ubicación del respaldo forense'
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
          'Extraer Internet Headers (cabeceras completas) de correos seleccionados',
          'Analizar la ruta de servidores SMTP y direcciones IP de origen del mensaje',
          'Verificar la autenticidad técnica de los correos mediante SPF, DKIM y DMARC',
          'Rastrear y verificar zonas horarias de envío y desfases en marcas de tiempo',
          'Documentar hallazgos de cabeceras en reporte técnico y bitácora del perito'
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
          'Extraer la totalidad de archivos adjuntos de los correos seleccionados',
          'Calcular hash SHA-256 individual de cada archivo adjunto extraído',
          'Analizar archivos adjuntos en busca de malware, virus o troyanos',
          'Verificar metadatos (EXIF, propiedades del documento) de archivos adjuntos',
          'Generar reporte individual de adjuntos con su respectiva correlación hash'
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
          'Extraer metadatos de mensajería (remitente, destinatarios, asunto, fecha, id)',
          'Construir línea de tiempo cronológica unificada de las comunicaciones',
          'Identificar y clasificar patrones de comunicación o alias de interés',
          'Detectar anomalías en metadatos que sugieran alteración o falsificación',
          'Calcular hash SHA-256 de los reportes temporales construidos'
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
          'Redactar dictamen pericial (Motivo, Descripción, Examen y Conclusiones)',
          'Registrar de forma expresa las herramientas de análisis de correo y versiones',
          'Incluir tabla con nombre nativo, metadatos, tamaño y hash SHA-256 de correos y adjuntos',
          'Formular conclusiones periciales técnico-científicas sin precalificar delitos',
          'Adjuntar planilla PRCC completa y las bitácoras firmadas por el perito',
          'Firmar y sellar digitalmente el dictamen de email forense como Perito Informático'
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
          'Verificar orden judicial de disposición final de la copia y buzón',
          'Ejecutar la devolución de soportes físicos o destrucción pericial de respaldos',
          'Levantar y firmar el Acta de Disposición Final de Evidencias de Email',
          'Registrar el cierre en la planilla PRCC asentando observaciones finales',
          'Archivar reporte de dictamen firmado en archivo inmutable del laboratorio'
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
          'Fotografiar el disco duro o unidad desde al menos 4 ángulos diferentes',
          'Registrar minuciosamente marca, modelo, capacidad nominal y número de serie',
          'Registrar tipo de interfaz (SATA, IDE, M.2, NVMe) y formato físico del disco',
          'Inspeccionar y documentar detalladamente el estado físico externo y conectores',
          'Verificar identidad del funcionario que entrega y el motivo de la peritación',
          'Redactar y firmar el Acta de Recepción del dispositivo en el laboratorio'
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
          'Registrar detalladamente el disco duro en la Planilla de Registro de Cadena de Custodia (PRCC)',
          'Aplicar etiquetado físico permanente con código único sobre el dispositivo',
          'Sellar disco en bolsa antiestática homologada con precinto inviolable numerado',
          'Documentar en PRCC el número del precinto y la firma de los intervinientes',
          'Registrar ingreso a bóveda de evidencias y asignar ubicación controlada'
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
          'Conectar el disco duro a la estación forense a través de write-blocker hardware',
          'Verificar en el sistema que la unidad esté montada estrictamente en modo solo lectura',
          'Registrar la marca, modelo y versión de firmware del write-blocker utilizado',
          'Verificar el reconocimiento correcto de la geometría del disco en el sistema forense',
          'Tomar fotografía detallada del esquema de conexión física en la workstation'
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
          'Calcular hash SHA-256 del disco duro original antes de iniciar copia',
          'Crear imagen forense bit-a-bit en formato binario DD o formato pericial E01',
          'Recalcular y verificar el hash SHA-256 de la imagen forense creada contra el original',
          'Generar reporte de hash pre-imagen detallando fecha, hora y velocidad de copia',
          'Almacenar la imagen forense creada en un disco de trabajo seguro y protegido'
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
          'Montar la imagen forense generada estrictamente en modo de solo lectura',
          'Analizar la tabla de particiones del disco (MBR, GPT o esquemas heredados)',
          'Identificar sistemas de archivos presentes (NTFS, FAT32, exFAT, ext4)',
          'Analizar el slack space y sectores no asignados de las particiones',
          'Documentar estructura de particiones en reporte detallado con marcas de tiempo'
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
          'Ejecutar escaneo de archivos eliminados mediante file carving (Autopsy/Scalpel)',
          'Recuperar particiones borradas o huérfanas si existieran en la unidad',
          'Analizar metadatos y registros del sistema de archivos para archivos borrados',
          'Extraer y clasificar archivos recuperados de interés forense para la causa',
          'Calcular hash SHA-256 individual de cada archivo recuperado de relevancia',
          'Generar listado indexado de archivos recuperados con su correspondiente hash'
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
          'Redactar dictamen pericial estructurado (Motivo, Descripción, Examen y Conclusiones)',
          'Registrar de forma obligatoria las versiones del software de análisis forense (Autopsy/FTK)',
          'Incluir tabla con nombre nativo, ruta, tamaño, fecha de creación/modificación y hash de archivos',
          'Formular conclusiones técnico-científicas claras basadas exclusivamente en la evidencia física',
          'Adjuntar planilla PRCC completa, bitácora de adquisición forense y logs de hash',
          'Firmar y sellar digitalmente el dictamen pericial de disco duro como Perito Informático'
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
          'Recibir orden del tribunal indicando disposición final del disco original',
          'Materializar el cierre físico correspondiente (Devolución, Entrega o Destrucción)',
          'Levantar y firmar el Acta de Disposición Final de la evidencia física en el laboratorio',
          'Asentar el egreso y cierre instrumental en observaciones de la planilla PRCC',
          'Archivar la imagen forense de respaldo en soporte inmutable del laboratorio forense'
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
