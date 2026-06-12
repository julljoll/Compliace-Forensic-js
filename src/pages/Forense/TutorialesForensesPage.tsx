import { useState, useEffect, useRef, useMemo } from 'react';
import { useCMSStore } from '../../store/cmsStore';
import { useAuditStore } from '../../store/auditStore';
import { useAuthStore } from '../../store/authStore';
import { indexedDBStorage } from '../../db/indexedDB';
import {
  Mail, Shield, CheckCircle2, Circle,
  FileText, Printer, AlertTriangle,
  Fingerprint, Lock, Search, MessageSquare,
  Terminal as TerminalIcon, Play, Save, Smartphone,
  Database, Mic, Upload, RefreshCw, Copy, Check, BookOpen, Users,
  Award, Trophy, Gavel, Scale
} from '../../components/atoms/AppleIcon';

// ── TYPES & INTERFACES ────────────────────────────────────────────────────────

interface StepLog {
  stepId: string;
  completado: boolean;
  fecha?: string;
  responsable?: string;
  observaciones?: string;
}

interface ProcesoCorreo {
  id: string;
  casoId: string;
  remitente: string;
  destinatarios: string;
  asunto: string;
  fechaCorreo: string;
  messageId: string;
  casoRef: string;
  fechaInicio: string;
  fechaCierre?: string;
  finalizado: boolean;
  pasos: StepLog[];
}

interface ConsoleLine {
  text: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'command';
  timestamp: string;
}

interface StepStatus {
  title: string;
  desc: string;
  status: 'pending' | 'active' | 'success' | 'error';
}

interface ChatMessage {
  id: string;
  sender: string;
  message: string;
  timestamp: string;
  isOutgoing: boolean;
  type?: 'text' | 'audio' | 'document';
  duration?: string;
  transcription?: string;
}

interface ChatSession {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  lastMessage: string;
  lastTime: string;
  messages: ChatMessage[];
}

interface Contact {
  id: string;
  name: string;
  phone: string;
  status: string;
  lastSeen: string;
}

interface FileDetail {
  name: string;
  size: string;
  type: string;
  lastModified: string;
}

interface AcademyProgress {
  xp: number;
  completedQuizzes: Record<string, boolean>;
  unlockedBadges: string[];
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface CaseStudy {
  id: string;
  title: string;
  description: string;
  hypothesis: string;
  recommendedModules: string[];
  recommendedTools: string[];
}

// ── CONSTANTS ────────────────────────────────────────────────────────────────

const CORREO_PASOS_FIJOS = [
  {
    id: 'p1',
    fase: 'Fase 1: Identificación y Preservación',
    titulo: 'Identificar el correo electrónico como fuente de evidencia',
    descripcion: 'Identificar el mensaje de datos en su soporte original (bandeja, servidor, respaldo) sin alterar su contenido ni metadatos.',
    normativa: 'ISO/IEC 27037:2012 — Identificación de evidencia digital',
    acciones: [
      'Localizar el mensaje original en la bandeja de correo del remitente o destinatario',
      'Verificar que sea el mensaje original (no reenviado ni exportado previamente)',
      'No abrir adjuntos ni hacer clic en enlaces durante la identificación',
      'Documentar la ubicación exacta: nombre de bandeja, ruta, tipo de cliente',
      'Tomar captura de pantalla del mensaje en su contexto original',
      'Registrar en la bitácora con fecha, hora y responsable',
    ],
  },
  {
    id: 'p2',
    fase: 'Fase 1: Identificación y Preservación',
    titulo: 'Preservar el mensaje original intacto',
    descripcion: 'Realizar copia forense bit a bit del contenedor del correo o exportar el .eml/.msg sin alterar cabeceras ni metadatos. Almacenar el original en custodia.',
    normativa: 'ISO/IEC 27037:2012 — Preservación · Art. 187 COPP — Cadena de Custodia',
    acciones: [
      'Exportar el mensaje en formato original (.eml en Thunderbird, .msg en Outlook, original en Gmail)',
      'Verificar que la exportación no modifique cabeceras comparando hashes',
      'Crear copia de trabajo para análisis y copia de resguardo sellada',
      'Etiquetar físicamente el medio con: N° caso, fecha, hora, nombre del perito, hash',
      'Almacenar el original en custodia segura (sobre cerrado, firma en sello)',
      'Registrar en la Planilla PRCC',
    ],
  },
  {
    id: 'p3',
    fase: 'Fase 1: Identificación y Preservación',
    titulo: 'Calcular hash SHA-256 del mensaje original',
    descripcion: 'Calcular el hash criptográfico del archivo de correo original (.eml/.msg) como sello de integridad. Registrar en la cadena de custodia.',
    normativa: 'ISO/IEC 27037:2012 — Integridad · MUCC-2017',
    acciones: [
      'Calcular SHA-256: sha256sum mensaje_original.eml (Linux) o Get-FileHash (PowerShell)',
      'Calcular MD5 como respaldo: Get-FileHash -Algorithm MD5',
      'Calcular hash de la copia de trabajo y verificar coincidencia',
      'Registrar ambos hashes en la cadena de custodia con fecha, hora y responsable',
      'Firmar digitalmente el registro si aplica',
    ],
  },
  {
    id: 'p4',
    fase: 'Fase 2: Documentación Técnica',
    titulo: 'Extraer y documentar encabezados SMTP completos',
    descripcion: 'Extraer todos los encabezados del mensaje (Received, From, To, Date, Message-ID, DKIM-Signature, SPF, etc.) y documentar la ruta del correo.',
    normativa: 'ISO/IEC 27037:2012 — Recopilación · LMDF Art. 4 — Valor probatorio',
    acciones: [
      'Acceder a encabezados completos: Outlook (Propiedades), Thunderbird (Código fuente), Gmail (Mostrar original)',
      'Extraer cada campo Received con IP, timestamp y hostname de cada salto',
      'Documentar From, To, CC, Date, Message-ID, DKIM-Signature, SPF, Authentication-Results',
      'Reconstruir la ruta: analizar secuencia de servidores Received en orden inverso',
      'Verificar consistencia entre IPs, timestamps y dominios',
      'Exportar encabezados completos a archivo de texto para el expediente',
    ],
  },
  {
    id: 'p5',
    fase: 'Fase 2: Documentación Técnica',
    titulo: 'Documentar metadatos del mensaje',
    descripcion: 'Registrar: remitente, destinatarios, fecha/hora (con zona horaria), Message-ID, tamaño, adjuntos, cliente de correo. Verificar autenticidad DKIM/SPF.',
    normativa: 'NIST SP 800-101 — Metadatos de evidencia digital',
    acciones: [
      'Crear ficha técnica: remitente, destinatarios, fecha UTC, Message-ID, tamaño, tipo MIME, X-Mailer',
      'Listar adjuntos con nombres, tamaños y tipos MIME',
      'Verificar DKIM: pass/fail (firma criptográfica del dominio)',
      'Verificar SPF: pass/fail (IP autorizada del remitente)',
      'Verificar DMARC: política de alineación del dominio',
      'Documentar cualquier anomalía: encabezados inconsistentes, fechas discrepantes',
    ],
  },
  {
    id: 'p6',
    fase: 'Fase 2: Documentación Técnica',
    titulo: 'Establecer la cadena de custodia del correo',
    descripcion: 'Documentar quién, cuándo y cómo obtuvo el acceso al correo. Registrar cada transferencia de custodia con fechas, firmas y motivos.',
    normativa: 'Art. 187-188 COPP · MUCC-2017 — Cadena de Custodia',
    acciones: [
      'Registrar el primer acceso: quién, fecha/hora exacta, método de acceso',
      'Documentar cada transferencia de custodia: de quién a quién, fecha y motivo',
      'Mantener registro continuo de cada acceso, copia o procesamiento',
      'Completar la Planilla PRCC con datos del caso, evidencia y firmas',
      'Garantizar cadena de custodia ininterrumpida',
    ],
  },
  {
    id: 'p7',
    fase: 'Fase 3: Análisis Forense',
    titulo: 'Analizar el contenido del mensaje',
    descripcion: 'Extraer el cuerpo del mensaje, firmas digitales, archivos adjuntos y enlaces. Documentar hallazgos relevantes para la investigación.',
    normativa: 'ISO/IEC 27042:2015 — Análisis e interpretación',
    acciones: [
      'Extraer el cuerpo separando partes HTML y texto plano',
      'Identificar y catalogar adjuntos: nombre, tamaño, tipo MIME, hash SHA-256',
      'Extraer enlaces (URLs): lista completa, expandir acortadas, verificar dominios',
      'Identificar firmas digitales en el cuerpo y certificados S/MIME',
      'Documentar citas textuales relevantes con su contexto',
      'Relacionar hallazgos con otras evidencias de la investigación',
    ],
  },
  {
    id: 'p8',
    fase: 'Fase 3: Análisis Forense',
    titulo: 'Verificar autenticidad de adjuntos y enlaces',
    descripcion: 'Analizar archivos adjuntos en busca de malware, metadatos ocultos o alteraciones. Verificar la legitimidad de los enlaces contenidos.',
    normativa: 'ISO/IEC 27037:2012 · LEDI — Delitos Informáticos',
    acciones: [
      'Escanear adjuntos con antivirus actualizado',
      'Analizar en sandbox (Cuckoo, Joe Sandbox)',
      'Verificar hashes contra bases de datos de malware',
      'Extraer metadatos de adjuntos (autor, fecha creación, versiones)',
      'Expandir URLs acortadas y verificar dominios contra listas de phishing',
      'NO hacer clic directo en enlaces — usar resolución DNS segura',
      'Documentar resultados: archivos limpios/infectados, URLs legítimas/sospechosas',
    ],
  },
  {
    id: 'p9',
    fase: 'Fase 3: Análisis Forense',
    titulo: 'Documentar hallazgos con línea de tiempo',
    descripcion: 'Crear una línea de tiempo forense con todos los eventos: recepción, reenvíos, apertura de adjuntos, respuestas. Correlacionar con otras evidencias.',
    normativa: 'ISO/IEC 27042:2015 — Interpretación · NIST SP 800-101',
    acciones: [
      'Construir línea de tiempo base: fecha envío, recepción en servidores, reenvíos',
      'Correlacionar con otras evidencias: logs de servidor, firewall, otros correos',
      'Identificar anomalías temporales: discrepancias entre fechas de encabezados',
      'Crear tabla cronológica de eventos con timestamps UTC',
      'Generar diagrama de línea de tiempo y mapa de relaciones',
    ],
  },
  {
    id: 'p10',
    fase: 'Fase 4: Informe y Presentación',
    titulo: 'Redactar el informe pericial de correo electrónico',
    descripcion: 'Elaborar dictamen pericial con: metodología, cadena de custodia, hallazgos técnicos, hash de integridad, conclusiones y firma digital.',
    normativa: 'Art. 187 COPP · LMDF Art. 4-9 — Valor probatorio',
    acciones: [
      'Encabezado: N° dictamen, fecha, datos del perito, N° caso',
      'Identificación de la evidencia: Message-ID, hash, fecha, remitente/destinatarios',
      'Metodología: normativa aplicada, herramientas, procedimiento',
      'Cadena de custodia: N° PRCC, transferencias, sellos y firmas',
      'Hallazgos técnicos: encabezados, autenticación DKIM/SPF/DMARC, adjuntos',
      'Conclusiones: hechos demostrados, nivel de confianza, limitaciones',
      'Firma digital del perito',
    ],
  },
  {
    id: 'p11',
    fase: 'Fase 4: Informe y Presentación',
    titulo: 'Cerrar el caso y generar reporte de auditoría',
    descripcion: 'Completar todos los pasos. Generar el reporte final de auditoría con la línea de tiempo completa de todas las acciones realizadas.',
    normativa: 'MUCC-2017 · ISO/IEC 27037:2012',
    acciones: [
      'Verificar completitud: todos los pasos 1-10 completados y checklists firmados',
      'Generar reporte de auditoría: resumen, línea de tiempo, hashes, accesos',
      'Preparar expediente final: dictamen, PRCC, actas, copia de evidencia sellada',
      'Programar entrega con el consignante y completar Acta de Entrega de Resultados',
      'Obtener firma de recibido conforme',
    ],
  },
];

const MOCK_CHATS: ChatSession[] = [
  {
    id: 'c1',
    name: 'Lic. Alejandro Torres',
    phone: '+598 99 123 456',
    avatar: 'https://avatars.githubusercontent.com/u/95193522?v=4',
    lastMessage: 'Sí, ya está firmado y sellado con hash SHA-256 en la cadena.',
    lastTime: '14:22',
    messages: [
      { id: 'm1_1', sender: 'Yo', message: 'Estimado Alejandro, ¿confirmaste el envío del reporte de compliance?', timestamp: '14:15', isOutgoing: true },
      { id: 'm1_2', sender: 'Lic. Alejandro Torres', message: 'Hola. Sí, ya está firmado y sellado con hash SHA-256 en la cadena.', timestamp: '14:22', isOutgoing: false },
      { id: 'm1_3', sender: 'Yo', message: 'Perfecto, procedo a anexarlo al expediente digital en el CMS.', timestamp: '14:25', isOutgoing: true }
    ]
  },
  {
    id: 'c2',
    name: 'Ing. Mariana Silva',
    phone: '+598 94 987 654',
    avatar: 'https://avatars.githubusercontent.com/u/95193522?v=4',
    lastMessage: 'Nota de voz de 12 segundos',
    lastTime: 'Ayer',
    messages: [
      { id: 'm2_1', sender: 'Ing. Mariana Silva', message: '¿Completaron la extracción física de la base de datos del móvil?', timestamp: 'Ayer 18:02', isOutgoing: false },
      { id: 'm2_2', sender: 'Yo', message: 'Sí, empleamos el APK Downgrade exitosamente.', timestamp: 'Ayer 18:05', isOutgoing: true },
      { id: 'm2_3', sender: 'Yo', message: 'Audio', timestamp: 'Ayer 18:07', isOutgoing: false, type: 'audio', duration: '0:12', transcription: 'Excelente trabajo pericial. Avísame cuando calcules el hash .avilla para contrastar.' }
    ]
  },
  {
    id: 'c3',
    name: 'Soporte Técnico',
    phone: '+1 800 555 0199',
    avatar: 'https://avatars.githubusercontent.com/u/95193522?v=4',
    lastMessage: 'Dispositivo Android listo para extracción por depuración USB.',
    lastTime: 'Lunes',
    messages: [
      { id: 'm3_1', sender: 'Soporte Técnico', message: 'Dispositivo Android listo para extracción por depuración USB.', timestamp: 'Lunes 10:14', isOutgoing: false }
    ]
  }
];

const MOCK_CONTACTS: Contact[] = [
  { id: 'con_1', name: 'Lic. Alejandro Torres', phone: '+598 99 123 456', status: 'Disponible', lastSeen: 'Hoy 14:22' },
  { id: 'con_2', name: 'Ing. Mariana Silva', phone: '+598 94 987 654', status: 'En el trabajo', lastSeen: 'Hoy 13:10' },
  { id: 'con_3', name: 'Soporte Técnico', phone: '+1 800 555 0199', status: 'En línea', lastSeen: 'Lunes 10:14' },
  { id: 'con_4', name: 'Dra. Gabriela Méndez (Fiscal)', phone: '+598 91 222 333', status: 'Solo llamadas de emergencia', lastSeen: 'Ayer 09:30' }
];

const PRESET_FILES = [
  { name: 'reporte_forense_caso_102.pdf', size: '1.2 MB', type: 'document/pdf', lastModified: 'Hoy, 10:15' },
  { name: 'chats_whatsapp_extraidos.db', size: '24.5 MB', type: 'application/x-sqlite3', lastModified: 'Ayer, 18:02' },
  { name: 'log_adquisicion_adb.log', size: '412 KB', type: 'text/plain', lastModified: 'Hoy, 14:10' }
];

const CASES_STUDY: CaseStudy[] = [
  {
    id: 'fuga',
    title: 'Fuga de Secretos Industriales',
    description: 'Se sospecha que un ex-empleado transmitió planos y códigos confidenciales a la competencia a través de su correo corporativo antes de renunciar. El archivo local de correo de la máquina de desarrollo y la firma criptográfica son clave.',
    hypothesis: 'Comprobar si hay filtración mediante el análisis de cabeceras SMTP, adjuntos en correos originales y sellado con hash SHA-256 para juicio.',
    recommendedModules: ['correo', 'integrity'],
    recommendedTools: ['FTK Imager', 'Mozilla Thunderbird', 'Avilla Crypt (CLI)']
  },
  {
    id: 'incautado',
    title: 'Operación Móvil Antinarcóticos',
    description: 'Se incauta un smartphone Android desbloqueado y encendido en el sitio del suceso. El fiscal requiere de manera urgente extraer logs del sistema operativo y conversaciones de WhatsApp sin alterar el dispositivo físico original.',
    hypothesis: 'Realizar adquisición lógica por ADB de la información del sistema, parsear los mensajes y transcribir las notas de voz en busca de direcciones de entrega.',
    recommendedModules: ['adb', 'whatsapp'],
    recommendedTools: ['Android SDK Platform Tools', 'SQLite Database Browser', 'FFmpeg']
  },
  {
    id: 'sabotaje',
    title: 'Sabotaje de Base de Datos y Datos de Pago',
    description: 'Una aplicación móvil de facturación ha sido manipulada localmente y se registran pagos fantasmas. La base de datos local SQLite de WhatsApp/Facturas está protegida y se requiere una extracción invasiva de la base SQLite.',
    hypothesis: 'Utilizar el APK Downgrade con desinstalación conservadora para forzar el volcado de la base de datos protegida y analizar las tablas mediante consultas SQL estructuradas.',
    recommendedModules: ['downgrade', 'whatsapp'],
    recommendedTools: ['adb.exe', 'ApkTool', 'DB Browser for SQLite']
  }
];

const QUIZZES: Record<string, QuizQuestion[]> = {
  correo: [
    {
      question: "¿Cuál es el formato estándar recomendado por la ISO/IEC 27037:2012 para exportar un correo electrónico manteniendo intactos sus metadatos y cabeceras?",
      options: [".pdf (Documento Portable)", ".txt (Archivo de Texto Plano)", ".eml / .msg (Mensaje de datos original)", ".html (Formato Web)"],
      correctAnswer: 2,
      explanation: "El estándar ISO/IEC 27037:2012 exige preservar la evidencia digital en su contenedor original o formatos crudos (.eml o .msg) para conservar cabeceras SMTP intactas."
    },
    {
      question: "Bajo el MUCC-2017, si un empleado entrega voluntariamente un archivo de correo para su análisis, ¿bajo qué forma de obtención se registra?",
      options: ["Obtención Técnica", "Obtención por Consignación", "Obtención por Aseguramiento", "Obtención por Derivación"],
      correctAnswer: 1,
      explanation: "La entrega voluntaria y formal de una evidencia digital por parte de su titular o custodio se cataloga en el MUCC-2017 como Obtención por Consignación."
    },
    {
      question: "¿Cuál de las siguientes cabeceras SMTP certifica la firma criptográfica del dominio emisor del correo electrónico?",
      options: ["Received", "SPF (Sender Policy Framework)", "DKIM-Signature (DomainKeys Identified Mail)", "Message-ID"],
      correctAnswer: 2,
      explanation: "DKIM-Signature añade una firma digital al correo vinculada al dominio, lo que permite verificar la autenticidad del emisor y la integridad del mensaje de datos."
    }
  ],
  adb: [
    {
      question: "¿Qué comando de la suite Android Debug Bridge (ADB) permite realizar un diagnóstico y volcado completo del estado de los servicios del sistema?",
      options: ["adb backup", "adb shell dumpsys", "adb logcat", "adb devices"],
      correctAnswer: 1,
      explanation: "El comando 'adb shell dumpsys' vuelca el estado detallado de todos los servicios del sistema, crucial para obtener metadatos y configuraciones del dispositivo móvil."
    },
    {
      question: "¿Cuál es el propósito primordial del hash SHA-256 en una colecta forense por ADB?",
      options: ["Acelerar la velocidad de transmisión de datos", "Garantizar la inmutabilidad de la evidencia y cumplir con el Criterio de Integridad", "Ocultar la identidad del perito informático", "Otorgar acceso de administrador (root) al dispositivo"],
      correctAnswer: 1,
      explanation: "El hash criptográfico SHA-256 sirve como sello digital. Cualquier modificación posterior en los archivos de la adquisición alteraría el hash, revelando manipulación y violando el Criterio de Integridad."
    },
    {
      question: "Según el MUCC-2017, la colección directa de datos y diagnósticos de un dispositivo mediante consola en el sitio del suceso constituye una:",
      options: ["Obtención por Consignación", "Obtención por Aseguramiento", "Obtención Técnica", "Obtención por Derivación"],
      correctAnswer: 2,
      explanation: "La adquisición directa empleando herramientas de software y hardware especializados en el sitio de investigación o laboratorio se define como Obtención Técnica en el MUCC-2017."
    }
  ],
  downgrade: [
    {
      question: "¿Qué flag del comando 'pm uninstall' en Android permite desinstalar una aplicación pero retener sus carpetas de datos y caché?",
      options: ["-f (force)", "-k (keep data)", "-d (downgrade)", "-r (reinstall)"],
      correctAnswer: 1,
      explanation: "El parámetro '-k' le indica al administrador de paquetes de Android (pm) que desinstale el binario pero mantenga el directorio de datos (/data/data/com.app), lo que permite instalar una versión anterior sin perder la base de datos."
    },
    {
      question: "¿Qué documento legal firmado por el custodio es indispensable antes de realizar un APK Downgrade en un dispositivo móvil?",
      options: ["Acta de Incautación", "Acta de Consignación Oficial y Consentimiento Informado", "Orden de Allanamiento General", "Bitácora de Entrega de Equipos"],
      correctAnswer: 1,
      explanation: "Al ser un procedimiento invasivo que puede conllevar riesgo de pérdida de datos o alteración de software, se requiere el consentimiento explícito y firma del Acta de Consignación Oficial."
    },
    {
      question: "Cuando extraemos la base de datos 'msgstore.db' descifrada a partir de un APK Downgrade, el MUCC-2017 considera esta base de datos extraída como una:",
      options: ["Obtención Técnica", "Obtención por Aseguramiento", "Obtención por Derivación", "Obtención por Consignación"],
      correctAnswer: 2,
      explanation: "La Obtención por Derivación se produce cuando se genera o extrae una nueva evidencia (la base de datos descifrada) a partir de otra evidencia física o digital previamente obtenida."
    }
  ],
  whatsapp: [
    {
      question: "En el análisis forense de WhatsApp, ¿en qué base de datos SQLite se almacena la agenda de contactos y su sincronización?",
      options: ["msgstore.db", "wa.db", "axolotl.db", "chatsettings.db"],
      correctAnswer: 1,
      explanation: "WhatsApp guarda la información de contactos, nombres de perfil y sincronización telefónica en 'wa.db', mientras que el historial de chats se guarda en 'msgstore.db'."
    },
    {
      question: "¿Bajo qué fase del MUCC-2017 y de la norma ISO/IEC 27042:2015 se realiza el parseo de tablas de bases de datos forenses?",
      options: ["Fase Inicial: Obtención", "Fase de Laboratorio: Peritación", "Fase de Resguardo", "Fase de Cierre"],
      correctAnswer: 1,
      explanation: "El examen, procesamiento, consultas y transcripción de la evidencia digital en entornos controlados de laboratorio corresponden a la Fase de Laboratorio o Peritación."
    },
    {
      question: "¿Por qué es fundamental que el perito realice el análisis forense sobre una copia de trabajo de 'msgstore.db' y no sobre el archivo original extraído?",
      options: ["Para evitar corromper la evidencia original y preservar la cadena de custodia", "Porque la base original está encriptada y no se puede abrir", "Para acelerar la velocidad del software parser", "Porque las herramientas forenses no abren archivos .db"],
      correctAnswer: 0,
      explanation: "Para cumplir con la ISO 27037 y el MUCC-2017, la evidencia original debe resguardarse intacta. Todo análisis se practica sobre copias de trabajo bit a bit, garantizando que el original jamás sea alterado."
    }
  ],
  integrity: [
    {
      question: "Según el Artículo 188 del COPP, si una evidencia digital es modificada o su hash cambia en la Fase de Resguardo, ¿qué ocurre con su valor probatorio?",
      options: ["Se mantiene intacto", "Se convalida automáticamente", "Se debilita o anula debido a la ruptura de la cadena de custodia", "Es reemplazado por la declaración del perito"],
      correctAnswer: 2,
      explanation: "La alteración de la firma hash rompe la cadena de custodia, lo que vulnera el derecho al debido proceso (Art. 49 CRBV) y puede anular el valor probatorio de la evidencia en juicio."
    },
    {
      question: "¿Qué algoritmos de hashing criptográfico genera la firma de integridad de Avilla Forensics para el sellado digital?",
      options: ["Solo MD5", "Solo SHA-256", "MD5, SHA-1 y SHA-256 combinados", "AES-256 y RSA"],
      correctAnswer: 2,
      explanation: "Avilla Forensics genera simultáneamente MD5, SHA-1 y SHA-256 para proporcionar retrocompatibilidad y redundancia criptográfica contra colisiones de hash."
    },
    {
      question: "¿Qué artículo de la Ley sobre Mensajes de Datos y Firmas Electrónicas de Venezuela respalda la validez probatoria de la evidencia firmada digitalmente?",
      options: ["Artículo 4 (Eficacia del Mensaje de Datos)", "Artículo 20 (Definición de Proveedor)", "Artículo 50 (Sanciones)", "Artículo 187"],
      correctAnswer: 0,
      explanation: "El Artículo 4 establece que los mensajes de datos firmados con tecnologías criptográficas tienen la misma eficacia y valor probatorio que los documentos físicos firmados por escrito."
    }
  ]
};

const MODULE_MANUALS: Record<string, {
  muccPhase: string;
  legalBase: string;
  tools: string[];
  procedureSteps: string[];
  consoleCommands?: string[];
}> = {
  correo: {
    muccPhase: 'Fase Inicial: Obtención (por Consignación o Técnica)',
    legalBase: 'Artículo 49 CRBV (Debido Proceso), Artículos 187 y 188 COPP (Cadena de Custodia), Artículos 4 y 8 de la Ley de Mensajes de Datos y Firmas Electrónicas.',
    tools: [
      'FTK Imager (Adquisición lógica de disco local)',
      'Mozilla Thunderbird (Cliente alternativo para exportación .eml)',
      'MFT Explorer (Análisis de la Master File Table de Windows)',
      'Wireshark (Auditoría de trazas y tráfico SMTP en red en tiempo real)'
    ],
    procedureSteps: [
      'Identificar la cuenta corporativa activa y su buzón local o en el servidor.',
      'Documentar las IPs de conexión asociadas a las cabeceras utilizando herramientas de resolución DNS.',
      'Exportar el mensaje en su formato original (.eml/.msg) sin abrir adjuntos ni enlaces sospechosos.',
      'Calcular inmediatamente las firmas de integridad SHA-256 y MD5 y registrarlas en el acta de cadena de custodia.',
      'Verificar las directivas SPF, firmas DKIM y políticas DMARC del encabezado SMTP para comprobar la legitimidad del remitente.'
    ],
    consoleCommands: [
      '# Consulta del registro DKIM del remitente para validar autenticidad criptográfica',
      'nslookup -type=txt google._domainkey.dominioexterno.com',
      '',
      '# Calcular hash SHA-256 de la evidencia exportada en PowerShell',
      'Get-FileHash -Algorithm SHA256 .\\evidencia_correo.eml',
      '',
      '# Calcular hash en sistemas Unix',
      'sha256sum evidencia_correo.eml'
    ]
  },
  adb: {
    muccPhase: 'Fase Inicial: Obtención Técnica',
    legalBase: 'Artículo 187 COPP (Manual Único de Cadena de Custodia), directivas ISO/IEC 27037:2012 e instrucciones NIST SP 800-101 (Mobile Forensics).',
    tools: [
      'Android SDK Platform Tools (adb.exe)',
      'Controladores OEM (Samsung, Xiaomi, Motorola, etc.)',
      'Bolsa Faraday de aislamiento de radiofrecuencias',
      'Cable de datos USB 3.0 blindado y verificado'
    ],
    procedureSteps: [
      'Colocar el dispositivo en modo avión e introducirlo en una bolsa Faraday para evitar alteraciones remotas (bloqueo, borrado).',
      'Habilitar el modo de Desarrollador tocando 7 veces el "Número de Compilación" en los Ajustes del dispositivo.',
      'Activar la Depuración USB en el menú de Desarrollador.',
      'Conectar el smartphone a la estación forense y autorizar la huella RSA en la pantalla del dispositivo.',
      'Lanzar la consola y verificar el reconocimiento del hardware.',
      'Ejecutar la extracción lógica del diagnóstico de servicios (Dumpsys) o búferes circulares de logs (Logcat) guardando el volcado.',
      'Generar los hashes SHA-256 de las adquisiciones para el Libro de Custodia Forense.'
    ],
    consoleCommands: [
      '# Verificar conexión del dispositivo y estado de autorización RSA',
      'adb devices',
      '',
      '# Obtener información del modelo y versión de compilación del sistema',
      'adb shell getprop ro.product.model',
      'adb shell getprop ro.build.version.release',
      '',
      '# Realizar volcado del diagnóstico de servicios generales de Android',
      'adb shell dumpsys > C:\\SHA256_Forense\\Adquisiciones\\dumpsys_completo.txt',
      '',
      '# Extraer buffer circular logcat para reconstrucción de eventos temporales',
      'adb logcat -d > C:\\SHA256_Forense\\Adquisiciones\\android_logcat.log'
    ]
  },
  downgrade: {
    muccPhase: 'Fase Inicial: Obtención por Consignación y Derivación',
    legalBase: 'Consentimiento Informado del Propietario (Artículo 49 CRBV), Cadena de Custodia (Artículo 187 COPP), Manual Único de Cadena de Custodia de Evidencias (MUCC-2017).',
    tools: [
      'Android Debug Bridge (ADB)',
      'ApkTool / Jadx-GUI (Ingeniería inversa y deconstrucción de APKs)',
      'Firmas Legacy de la aplicación oficial (e.g. WhatsApp v2.11.431)',
      'ApkSigner (Herramienta para refirmar los instaladores)'
    ],
    procedureSteps: [
      'Obtener y hacer firmar el Acta de Consignación Oficial, que otorga el consentimiento explícito del custodio para un procedimiento invasivo.',
      'Realizar un respaldo completo preventivo del contenedor de datos oficial mediante ADB.',
      'Desinstalar la aplicación de producción manteniendo intactos los directorios de usuario del dispositivo mediante el comando pm.',
      'Instalar el APK heredado (Legacy) compatible con la vulnerabilidad de respaldo sin cifrado.',
      'Generar el respaldo del APK Downgrade obteniendo la base de datos SQLite descifrada.',
      'Extraer el contenedor .ab, transformándolo en un tar y extrayendo `msgstore.db`. This is recorded as a Derivation (Obtención por Derivación).',
      'Reinstalar la aplicación original y restaurar el respaldo de datos preventivo.'
    ],
    consoleCommands: [
      '# 1. Respaldo de seguridad preventivo (Fase de Resguardo Inicial)',
      'adb backup -f backup_preventivo.ab -apk com.whatsapp',
      '',
      '# 2. Desinstalación conservadora (Reteniendo directorios de datos /data/data)',
      'adb shell pm uninstall -k com.whatsapp',
      '',
      '# 3. Instalación de la versión Legacy (Downgrade tolerado)',
      'adb install -d -r whatsapp_legacy.apk',
      '',
      '# 4. Extraer el respaldo de datos descifrado de la versión antigua',
      'adb backup -f whatsapp_descifrado.ab com.whatsapp',
      '',
      '# 5. Convertir el backup de Android (.ab) a archivo TAR mediante OpenSSL',
      'dd if=whatsapp_descifrado.ab bs=24 skip=1 | openssl zlib -d > whatsapp_datos.tar'
    ]
  },
  whatsapp: {
    muccPhase: 'Fase de Laboratorio: Peritación (Examen y Análisis)',
    legalBase: 'ISO/IEC 27042:2015 (Análisis e Interpretación de Evidencias), Artículo 4 de la Ley sobre Mensajes de Datos y Firmas Electrónicas.',
    tools: [
      'DB Browser for SQLite (Visor gráfico y analizador de sentencias SQL)',
      'SQLCipher (Decodificador de esquemas SQLite encriptados)',
      'FFmpeg (Transcodificador de códecs multimedia forenses)',
      'Python con librerías sqlite3 y pandas (Scripting forense)'
    ],
    procedureSteps: [
      'Trabajar estrictamente sobre una copia forense bit a bit de `msgstore.db` y `wa.db` para no alterar el original.',
      'Montar la copia de trabajo en el gestor SQLite y mapear la tabla `message` (esquema nuevo) o `messages` (esquema antiguo).',
      'Mapear la tabla `jid` para asociar números de teléfono reales con los IDs internos de las filas de mensajes.',
      'Ejecutar sentencias SQL estructuradas para cribar conversaciones según palabras clave o rangos de tiempo.',
      'Decodificar los ficheros de notas de voz en formato `.opus` extraídos del directorio de caché utilizando conversores de audio.',
      'Documentar los resultados en el reporte técnico del laboratorio.'
    ],
    consoleCommands: [
      '-- Consulta SQL: Filtrar mensajes e identificar remitente cruzando tablas en SQLite',
      'SELECT j.user AS telefono_remitente, m.text AS contenido, datetime(m.timestamp/1000, \'unixepoch\') AS fecha_utc',
      'FROM message m',
      'JOIN jid j ON m.chat_row_id = j._id',
      'WHERE m.text LIKE \'%comisión%\' OR m.text LIKE \'%transferencia%\';',
      '',
      '# Transcodificar audio opus de WhatsApp a formato WAV forense sin pérdida para transcripción',
      'ffmpeg -i voice_note.opus -acodec pcm_s16le -ac 1 -ar 16000 output_forense.wav'
    ]
  },
  integrity: {
    muccPhase: 'Fase de Resguardo: Criterios de Custodia (Inmutabilidad)',
    legalBase: 'Artículo 188 COPP (Preservación del Estado de las Evidencias), ISO/IEC 27037:2012 (Garantías de Integridad), Artículo 4 de la Ley sobre Mensajes de Datos.',
    tools: [
      'OpenSSL (Criptografía general y Hashing)',
      'GnuPG / PGP (Firmas asimétricas y certificados)',
      'Avilla Integrity Client (Módulo integrado de sellado criptográfico)'
    ],
    procedureSteps: [
      'Tomar el archivo de evidencia digital final (actas, bases de datos o reportes PDF).',
      'Calcular y registrar simultáneamente los hashes MD5, SHA-1 y SHA-256 para evitar colisiones criptográficas.',
      'Generar la firma criptográfica combinando el hash del archivo con el identificador del caso, la marca de tiempo exacta del perito y la clave privada.',
      'Exportar el token de firma resultante (.avilla) y adjuntarlo formalmente al expediente de cadena de custodia.',
      'Verificar periódicamente el token contra el archivo original para auditar que la cadena de custodia no haya sido vulnerada.'
    ],
    consoleCommands: [
      '# Generar un hash SHA-256 robusto para un dictamen pericial',
      'openssl dgst -sha256 dictamen_pericial_caso_102.pdf',
      '',
      '# Generar una firma simétrica HMAC-SHA256 simulada para el token de sellado',
      'openssl dgst -sha256 -hmac "CLAVE_PRIVADA_PERITO" -out firma_expediente.avilla dictamen_pericial_caso_102.pdf',
      '',
      '# Comprobar la integridad de un archivo contrastando hashes',
      'fciv.exe -sha256 dictamen_pericial_caso_102.pdf'
    ]
  }
};

export default function TutorialesForensesPage() {
  const casos = useCMSStore(state => state.casos);
  const addAuditLog = useCMSStore(state => state.addAuditLog);
  const addEntry = useAuditStore(state => state.addEntry);
  const { user } = useAuthStore();

  const [activeTutorial, setActiveTutorial] = useState<'correo' | 'adb' | 'downgrade' | 'whatsapp' | 'integrity'>('correo');
  
  // ─── ESTADO DE LA ACADEMIA (PROGRESS & PERSISTENCE) ───────────────────────
  const [selectedCase, setSelectedCase] = useState<string | null>(null);
  const [subTabs, setSubTabs] = useState<Record<string, 'manual' | 'lab' | 'quiz'>>({
    correo: 'manual',
    adb: 'manual',
    downgrade: 'manual',
    whatsapp: 'manual',
    integrity: 'manual'
  });

  const [academyProgress, setAcademyProgress] = useState<AcademyProgress>(() => {
    const saved = localStorage.getItem('avilla_academy_progress');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return { xp: 0, completedQuizzes: {}, unlockedBadges: [] };
  });

  useEffect(() => {
    localStorage.setItem('avilla_academy_progress', JSON.stringify(academyProgress));
  }, [academyProgress]);

  // Estados de examen/quiz
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<Record<string, boolean>>({});
  const [quizScore, setQuizScore] = useState<Record<string, number>>({});
  const [unlockedModal, setUnlockedModal] = useState<{
    badgeTitle: string;
    badgeIcon: 'correo' | 'adb' | 'downgrade' | 'whatsapp' | 'integrity';
    xpGained: number;
  } | null>(null);

  // Lógica de puntuación y niveles
  const peritoLevel = useMemo(() => {
    const xp = academyProgress.xp;
    if (xp >= 1000) return { title: 'Perito Certificado Principal', badge: 'Oro', style: 'text-yellow-600 bg-yellow-100 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800' };
    if (xp >= 600) return { title: 'Especialista en Evidencia Digital', badge: 'Plata', style: 'text-indigo-600 bg-indigo-100 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-800' };
    if (xp >= 200) return { title: 'Perito Forense en Formación', badge: 'Bronce', style: 'text-green-600 bg-green-100 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800' };
    return { title: 'Novato en Cómputo Forense', badge: 'Iniciado', style: 'text-neutral-500 bg-neutral-100 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700' };
  }, [academyProgress.xp]);

  const totalCertified = useMemo(() => {
    return Object.values(academyProgress.completedQuizzes).filter(Boolean).length;
  }, [academyProgress.completedQuizzes]);

  // Lista de tutoriales para renderizado del selector lateral
  const tutorialList = useMemo(() => {
    return [
      { id: 'correo', label: 'Correo Corporativo', sub: 'Consignación / Técnica', icon: Mail, complexity: 'Baja', badge: 'Auditor de Correo' },
      { id: 'adb', label: 'Colectas ADB', sub: 'Obtención Técnica', icon: TerminalIcon, complexity: 'Media', badge: 'Analista Móvil ADB' },
      { id: 'downgrade', label: 'APK Downgrade', sub: 'Consignación / Derivación', icon: Smartphone, complexity: 'Alta', badge: 'SQLite Extractor' },
      { id: 'whatsapp', label: 'WhatsApp Parser', sub: 'Fase de Laboratorio - Peritación', icon: Database, complexity: 'Media', badge: 'WhatsApp Parser' },
      { id: 'integrity', label: 'Integridad (.avilla)', sub: 'Fase de Resguardo', icon: Shield, complexity: 'Baja', badge: 'Oficial de Custodia' },
    ] as const;
  }, []);

  // ─── ESTADOS DEL SIMULADOR / LABS (PRESERVADO) ───────────────────────────
  const [correoCasoId, setCorreoCasoId] = useState('');
  const [correoProceso, setCorreoProceso] = useState<ProcesoCorreo | null>(null);
  const [correoShowForm, setCorreoShowForm] = useState(true);
  const [correoFormBasico, setCorreoFormBasico] = useState({ remitente: '', destinatarios: '', asunto: '', fechaCorreo: '', messageId: '' });
  const [correoPasos, setCorreoPasos] = useState<StepLog[]>([]);
  const [correoProcesosExistentes, setCorreoProcesosExistentes] = useState<ProcesoCorreo[]>([]);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (correoProceso) {
      setCorreoPasos(correoProceso.pasos.length === CORREO_PASOS_FIJOS.length ? correoProceso.pasos : CORREO_PASOS_FIJOS.map(p => {
        const existente = correoProceso.pasos.find(s => s.stepId === p.id);
        return existente || { stepId: p.id, completado: false, responsable: '', observaciones: '' };
      }));
    }
  }, [correoProceso]);

  const cargarProcesosExistentes = async (cid: string) => {
    if (!cid) return;
    const all = await indexedDBStorage.getAll<ProcesoCorreo>('correos_forenses');
    setCorreoProcesosExistentes(all.filter(p => p.casoId === cid));
    
    const activo = all.find(p => p.casoId === cid && !p.finalizado);
    if (activo) {
      setCorreoProceso(activo);
      setCorreoFormBasico({ remitente: activo.remitente, destinatarios: activo.destinatarios, asunto: activo.asunto, fechaCorreo: activo.fechaCorreo, messageId: activo.messageId });
      setCorreoShowForm(false);
    } else {
      setCorreoProceso(null);
      setCorreoShowForm(true);
      setCorreoFormBasico({ remitente: '', destinatarios: '', asunto: '', fechaCorreo: '', messageId: '' });
    }
  };

  const handleIniciarCorreo = () => {
    if (!correoCasoId || !correoFormBasico.remitente) return;
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const nuevo: ProcesoCorreo = {
      id,
      casoId: correoCasoId,
      ...correoFormBasico,
      casoRef: casos.find(c => c.id === correoCasoId)?.numeroCaso || '',
      fechaInicio: new Date().toISOString(),
      finalizado: false,
      pasos: CORREO_PASOS_FIJOS.map(p => ({ stepId: p.id, completado: false, responsable: '', observaciones: '' })),
    };
    indexedDBStorage.setItem('correos_forenses', nuevo).then(() => {
      setCorreoProceso(nuevo);
      setCorreoShowForm(false);
      cargarProcesosExistentes(correoCasoId);
    });
  };

  const togglePasoCorreo = async (stepId: string) => {
    if (!correoProceso) return;
    const nuevosPasos = correoPasos.map(p =>
      p.stepId === stepId
        ? {
            ...p,
            completado: !p.completado,
            fecha: !p.completado ? new Date().toISOString() : p.fecha,
            responsable: user?.nombre || 'Perito',
          }
        : p
    );
    setCorreoPasos(nuevosPasos);
    const finalizado = nuevosPasos.every(p => p.completado);
    const updated = {
      ...correoProceso,
      pasos: nuevosPasos,
      finalizado,
      fechaCierre: finalizado ? new Date().toISOString() : correoProceso.fechaCierre
    };
    setCorreoProceso(updated);
    await indexedDBStorage.setItem('correos_forenses', updated);
    cargarProcesosExistentes(correoCasoId);
  };

  const updateObservacionCorreo = async (stepId: string, obs: string) => {
    if (!correoProceso) return;
    const nuevosPasos = correoPasos.map(p => p.stepId === stepId ? { ...p, observaciones: obs } : p);
    setCorreoPasos(nuevosPasos);
    const updated = { ...correoProceso, pasos: nuevosPasos };
    setCorreoProceso(updated);
    await indexedDBStorage.setItem('correos_forenses', updated);
  };

  const imprimirCorreo = () => {
    window.print();
  };

  const correoCompletados = correoPasos.filter(p => p.completado).length;
  const correoTotal = CORREO_PASOS_FIJOS.length;
  const correoPorcentaje = correoTotal > 0 ? Math.round((correoCompletados / correoTotal) * 100) : 0;
  const correoFinalizado = correoPasos.length > 0 && correoPasos.every(p => p.completado);

  const correoFases = CORREO_PASOS_FIJOS.reduce<{ fase: string; pasos: typeof CORREO_PASOS_FIJOS }[]>((acc, p) => {
    const existente = acc.find(a => a.fase === p.fase);
    if (existente) existente.pasos.push(p);
    else acc.push({ fase: p.fase, pasos: [p] });
    return acc;
  }, []);

  const [adbCasoId, setAdbCasoId] = useState('');
  const [adbSerial, setAdbSerial] = useState('ADB-77491-MOBILE');
  const [adbRuta, setAdbRuta] = useState('C:/SHA256_Forense/Adquisiciones/Colectas_ADB');
  const [adbOpciones, setAdbOpciones] = useState({
    dumpsys: true,
    wifi: true,
    cpu: true,
    cuentas: true,
    logcat: false,
  });
  const [adbEjecutando, setAdbEjecutando] = useState(false);
  const [adbCompletado, setAdbCompletado] = useState(false);
  const [adbProgreso, setAdbProgreso] = useState(0);
  const [adbConsola, setAdbConsola] = useState<ConsoleLine[]>([]);
  const [adbHash, setAdbHash] = useState('');
  const adbConsoleEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (adbConsoleEndRef.current) {
      adbConsoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [adbConsola]);

  const pushAdbLog = (text: string, type: ConsoleLine['type'] = 'info') => {
    const time = new Date().toLocaleTimeString();
    setAdbConsola(prev => [...prev, { text, type, timestamp: time }]);
  };

  const simularEjecucionAdb = async () => {
    if (!adbCasoId) {
      alert('Por favor, seleccione un caso judicial válido antes de iniciar la colecta.');
      return;
    }
    setAdbEjecutando(true);
    setAdbCompletado(false);
    setAdbProgreso(0);
    setAdbConsola([]);
    setAdbHash('');

    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

    pushAdbLog('$ adb kill-server && adb start-server', 'command');
    await delay(600);
    pushAdbLog('* daemon not running; starting now at tcp:5037', 'info');
    pushAdbLog('* daemon started successfully', 'success');

    pushAdbLog(`$ adb devices`, 'command');
    await delay(500);
    setAdbProgreso(15);
    pushAdbLog(`List of devices attached\n${adbSerial}\tdevice`, 'info');
    pushAdbLog(`[CONEXIÓN] Dispositivo ${adbSerial} reconocido exitosamente en modo Depuración USB.`, 'success');

    pushAdbLog(`$ adb shell getprop ro.build.version.release`, 'command');
    await delay(300);
    pushAdbLog(`Android OS Version: 12 (API Level 31)`, 'info');
    pushAdbLog(`$ adb shell getprop ro.product.model`, 'command');
    await delay(300);
    pushAdbLog(`Modelo del Dispositivo: Samsung Galaxy S21 Ultra`, 'info');

    if (adbOpciones.wifi) {
      setAdbProgreso(30);
      pushAdbLog(`$ adb shell dumpsys wifi > "${adbRuta}/wifi_logs.txt"`, 'command');
      await delay(700);
      pushAdbLog(`[OK] Logs de conectividad inalámbrica y redes históricas guardados. (215 KB)`, 'success');
    }
    if (adbOpciones.cpu) {
      setAdbProgreso(45);
      pushAdbLog(`$ adb shell dumpsys cpuinfo > "${adbRuta}/cpu_info.txt"`, 'command');
      await delay(600);
      pushAdbLog(`[OK] Metadatos del estado del procesador y memoria extraídos. (84 KB)`, 'success');
    }
    if (adbOpciones.cuentas) {
      setAdbProgreso(60);
      pushAdbLog(`$ adb shell dumpsys account > "${adbRuta}/cuentas_dispositivo.txt"`, 'command');
      await delay(700);
      pushAdbLog(`[OK] Extracción de cuentas de sincronización activa (Gmail, WhatsApp, iCloud, Outlook). (48 KB)`, 'success');
    }
    if (adbOpciones.dumpsys) {
      setAdbProgreso(75);
      pushAdbLog(`$ adb shell dumpsys > "${adbRuta}/dumpsys_completo.txt"`, 'command');
      await delay(1000);
      pushAdbLog(`[OK] Volcado de estado de servicios del sistema (Dumpsys) completado. (3.2 MB)`, 'success');
    }
    if (adbOpciones.logcat) {
      setAdbProgreso(85);
      pushAdbLog(`$ adb logcat -d > "${adbRuta}/android_logcat.log"`, 'command');
      await delay(800);
      pushAdbLog(`[OK] Buffer de eventos del sistema (logcat) adquirido. (1.8 MB)`, 'success');
    }

    setAdbProgreso(95);
    pushAdbLog(`Generando firma criptográfica SHA-256 de la adquisición forense...`, 'info');
    await delay(700);
    const hash = 'a8f5c6b4e78921503c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b';
    setAdbHash(hash);
    pushAdbLog(`[INTEGRIDAD] Hash SHA-256 calculado para la adquisición:`, 'success');
    pushAdbLog(hash, 'success');

    const perito = user?.nombre || 'Perito Forense';
    addAuditLog({
      casoId: adbCasoId,
      usuario: perito,
      accion: 'COLECTA_ADB_COMPLETADA',
      detalle: `Adquisición lógica por ADB completada. Dispositivo: ${adbSerial}. Hash: ${hash.substring(0, 16)}...`,
      nivel: 'success'
    });
    await addEntry({
      casoId: adbCasoId,
      usuario: perito,
      accion: 'ADB_FORENSIC_ACQUISITION',
      detalle: `Adquisición lógica por ADB en dispositivo ${adbSerial}. Hash SHA-256: ${hash}. Destino: ${adbRuta}`,
      nivel: 'success',
      firmadoPor: perito,
      firmadoTimestamp: new Date().toISOString()
    });

    setAdbProgreso(100);
    setAdbEjecutando(false);
    setAdbCompletado(true);
    pushAdbLog(`[ÉXITO] Adquisición lógica de dispositivo móvil finalizada bajo protocolo ISO 27037.`, 'success');
  };

  const handleExportAdbConsole = () => {
    const contenido = adbConsola.map(c => `[${c.timestamp}] [${c.type.toUpperCase()}] ${c.text}`).join('\n');
    const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Log_ADB_Caso_${adbCasoId}_${Date.now()}.txt`;
    link.click();
  };

  const [downCasoId, setDownCasoId] = useState('');
  const [downApp, setDownApp] = useState<'whatsapp' | 'telegram' | 'signal'>('whatsapp');
  const [downPerito, setDownPerito] = useState(user?.nombre || 'Perito Judicial');
  const [downConsent, setDownConsent] = useState(false);
  const [downEjecutando, setDownEjecutando] = useState(false);
  const [downCompletado, setDownCompletado] = useState(false);
  const [downPasoActivo, setDownPasoActivo] = useState(0);
  const [downHash, setDownHash] = useState('');
  const [downPasos, setDownPasos] = useState<StepStatus[]>([
    { title: 'Respaldo de Datos', desc: 'Realizando adb backup del contenedor de datos original.', status: 'pending' },
    { title: 'Desinstalación Conservadora', desc: 'Desinstalando app manteniendo directorios de caché (pm uninstall -k).', status: 'pending' },
    { title: 'Instalación Legacy', desc: 'Instalando versión anterior vulnerable compatible con la extracción de DB.', status: 'pending' },
    { title: 'Extracción de Base de Datos', desc: 'Copiando base de datos descifrada al almacenamiento local.', status: 'pending' },
    { title: 'Restauración de App', desc: 'Reinstalando la app oficial de producción y restaurando el respaldo original.', status: 'pending' }
  ]);

  const iniciarDowngrade = async () => {
    if (!downCasoId) {
      alert('Seleccione un caso judicial antes de iniciar el procedimiento.');
      return;
    }
    if (!downConsent) {
      alert('Debe aceptar y firmar el Acta de Consignación legal para proceder con esta acción invasiva.');
      return;
    }
    setDownEjecutando(true);
    setDownCompletado(false);
    setDownPasoActivo(0);
    setDownHash('');

    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
    setDownPasos(prev => prev.map(p => ({ ...p, status: 'pending' })));

    for (let i = 0; i < downPasos.length; i++) {
      setDownPasoActivo(i);
      setDownPasos(prev => prev.map((p, idx) => ({
        ...p,
        status: idx === i ? 'active' : idx < i ? 'success' : 'pending'
      })));
      const duration = i === 3 ? 1800 : i === 0 ? 1500 : 1000;
      await delay(duration);
    }

    setDownPasos(prev => prev.map(p => ({ ...p, status: p.status === 'active' ? 'success' : p.status })));
    const targetHash = 'b6d8f5c9e472a1503c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a99';
    setDownHash(targetHash);

    const perito = user?.nombre || 'Perito Forense';
    addAuditLog({
      casoId: downCasoId,
      usuario: perito,
      accion: 'APK_DOWNGRADE_COMPLETADO',
      detalle: `Downgrade y extracción de ${downApp.toUpperCase()} exitosa. Hash extraído: ${targetHash.substring(0, 16)}...`,
      nivel: 'success'
    });
    await addEntry({
      casoId: downCasoId,
      usuario: perito,
      accion: 'APK_DOWNGRADE_EXTRACTION',
      detalle: `Extracción por APK Downgrade de ${downApp.toUpperCase()} finalizada. Hash: ${targetHash}. Acta de Consignación firmada por ${downPerito}`,
      nivel: 'success',
      firmadoPor: downPerito,
      firmadoTimestamp: new Date().toISOString()
    });

    setDownEjecutando(false);
    setDownCompletado(true);
  };

  const [wpCasoId, setWpCasoId] = useState('');
  const [wpActiveTab, setWpActiveTab] = useState<'chats' | 'contacts' | 'audios' | 'search'>('chats');
  const [wpSelectedChatId, setWpSelectedChatId] = useState('c1');
  const [wpBusquedaChats, setWpBusquedaChats] = useState('');
  const [wpQueryBusqueda, setWpQueryBusqueda] = useState('');
  const [wpAudioPlayingId, setWpAudioPlayingId] = useState<string | null>(null);

  const wpSelectedChat = useMemo(() => {
    return MOCK_CHATS.find(c => c.id === wpSelectedChatId) || MOCK_CHATS[0];
  }, [wpSelectedChatId]);

  const wpChatsFiltrados = useMemo(() => {
    return MOCK_CHATS.filter(c =>
      c.name.toLowerCase().includes(wpBusquedaChats.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(wpBusquedaChats.toLowerCase())
    );
  }, [wpBusquedaChats]);

  const wpTodosLosAudios = useMemo(() => {
    const list: { chatName: string; msg: ChatMessage }[] = [];
    MOCK_CHATS.forEach(chat => {
      chat.messages.forEach(msg => {
        if (msg.type === 'audio') list.push({ chatName: chat.name, msg });
      });
    });
    return list;
  }, []);

  const wpMensajesEncontrados = useMemo(() => {
    if (!wpQueryBusqueda.trim()) return [];
    const list: { chatName: string; msg: ChatMessage }[] = [];
    MOCK_CHATS.forEach(chat => {
      chat.messages.forEach(msg => {
        if (msg.message && msg.message.toLowerCase().includes(wpQueryBusqueda.toLowerCase())) {
          list.push({ chatName: chat.name, msg });
        } else if (msg.transcription && msg.transcription.toLowerCase().includes(wpQueryBusqueda.toLowerCase())) {
          list.push({ chatName: chat.name, msg });
        }
      });
    });
    return list;
  }, [wpQueryBusqueda]);

  const toggleWpAudio = (id: string) => {
    setWpAudioPlayingId(prev => prev === id ? null : id);
  };

  const [intCasoId, setIntCasoId] = useState('');
  const [intSelectedFile, setIntSelectedFile] = useState<FileDetail | null>(null);
  const [intCalculando, setIntCalculando] = useState(false);
  const [intHashes, setIntHashes] = useState<{ md5?: string; sha1?: string; sha256?: string } | null>(null);
  const [intGenerandoFirma, setIntGenerandoFirma] = useState(false);
  const [intFirmaGenerada, setIntFirmaGenerada] = useState<{ token: string; perito: string; timestamp: string } | null>(null);
  const [intPeritoFirmante, setIntPeritoFirmante] = useState(user?.nombre || 'Perito Forense');
  const [intTokenVerificar, setIntTokenVerificar] = useState('');
  const [intVerificacionResultado, setIntVerificacionResultado] = useState<{
    valido: boolean;
    perito?: string;
    timestamp?: string;
    sha256Original?: string;
    mensaje: string;
  } | null>(null);
  const [intCopiadoIdx, setIntCopiadoIdx] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setIntCopiadoIdx(id);
    setTimeout(() => setIntCopiadoIdx(null), 2000);
  };

  const handleSelectPresetFile = (file: FileDetail) => {
    setIntSelectedFile(file);
    setIntHashes(null);
    setIntFirmaGenerada(null);
    setIntVerificacionResultado(null);
  };

  const calcularHashes = async () => {
    if (!intSelectedFile) return;
    setIntCalculando(true);
    setIntHashes(null);

    await new Promise(res => setTimeout(res, 900));

    const seed = intSelectedFile.name;
    const sha256 = seed === 'reporte_forense_caso_102.pdf'
      ? 'a8f5c6b4e78921503c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b'
      : seed === 'chats_whatsapp_extraidos.db'
      ? 'b6d8f5c9e472a1503c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a99'
      : '7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d';

    const md5 = seed === 'reporte_forense_caso_102.pdf'
      ? '9e107d9d372bb6826bd81d3542a419d6'
      : '2f9a7b8c8d0e1f2a3b4c5d6e7f8a9b0c';

    const sha1 = seed === 'reporte_forense_caso_102.pdf'
      ? '8f94a38cc246bb6fcf56f7ef57d23d8bdf9253cf'
      : '4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d';

    setIntHashes({ md5, sha1, sha256 });
    setIntCalculando(false);

    addAuditLog({
      casoId: intCasoId,
      usuario: intPeritoFirmante,
      accion: 'HASH_CALCULADO',
      detalle: `Cálculo de hashes para archivo: ${intSelectedFile.name}. SHA-256: ${sha256.substring(0, 16)}...`,
      nivel: 'info'
    });
  };

  const generarFirmaAvilla = async () => {
    if (!intSelectedFile || !intHashes) return;
    setIntGenerandoFirma(true);

    await new Promise(res => setTimeout(res, 800));

    const timestamp = new Date().toISOString();
    const payload = JSON.stringify({
      filename: intSelectedFile.name,
      sha256: intHashes.sha256,
      perito: intPeritoFirmante,
      timestamp,
      casoId: intCasoId
    });

    const token = `AVILLA-SIG.${window.btoa(payload).substring(0, 150)}...`;
    setIntFirmaGenerada({ token, perito: intPeritoFirmante, timestamp });
    setIntGenerandoFirma(false);

    addAuditLog({
      casoId: intCasoId,
      usuario: intPeritoFirmante,
      accion: 'FIRMA_AVILLA_GENERADA',
      detalle: `Firma digital .avilla generada para ${intSelectedFile.name}. Perito: ${intPeritoFirmante}`,
      nivel: 'success'
    });

    await addEntry({
      casoId: intCasoId,
      usuario: intPeritoFirmante,
      accion: 'INTEGRITY_SIGNATURE',
      detalle: `Firma forense digital .avilla generada. Archivo: ${intSelectedFile.name}. Token: ${token}`,
      nivel: 'success',
      firmadoPor: intPeritoFirmante,
      firmadoTimestamp: timestamp
    });
  };

  const verificarFirmaAvilla = () => {
    if (!intTokenVerificar.trim()) {
      alert('Introduzca un token de firma .avilla para validar.');
      return;
    }
    if (intTokenVerificar.startsWith('AVILLA-SIG.')) {
      setIntVerificacionResultado({
        valido: true,
        perito: 'Ing. Mariana Silva',
        timestamp: new Date().toISOString(),
        sha256Original: 'a8f5c6b4e78921503c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b',
        mensaje: 'La firma digital es válida y el archivo de origen no ha sufrido ninguna modificación post-adquisición.'
      });
    } else {
      setIntVerificacionResultado({
        valido: false,
        mensaje: 'ERROR DE INTEGRIDAD: El token de firma digital no es válido, está corrupto o la cadena de custodia ha sido alterada.'
      });
    }
  };

  // ─── LÓGICA DE EXAMEN / QUIZ ACADÉMICO ────────────────────────────────────
  const handleSelectAnswer = (moduleId: string, questionIdx: number, optionIdx: number) => {
    const key = `${moduleId}_${questionIdx}`;
    setQuizAnswers(prev => ({ ...prev, [key]: optionIdx }));
  };

  const handleSubmitQuiz = (moduleId: string) => {
    const questions = QUIZZES[moduleId];
    let score = 0;
    let answeredAll = true;

    for (let i = 0; i < questions.length; i++) {
      const selected = quizAnswers[`${moduleId}_${i}`];
      if (selected === undefined) {
        answeredAll = false;
        break;
      }
      if (selected === questions[i].correctAnswer) {
        score++;
      }
    }

    if (!answeredAll) {
      alert('Por favor, responde todas las preguntas del examen antes de enviarlo.');
      return;
    }

    setQuizScore(prev => ({ ...prev, [moduleId]: score }));
    setQuizSubmitted(prev => ({ ...prev, [moduleId]: true }));

    if (score === questions.length) {
      // Examen Aprobado con 100% de aciertos!
      const currentModuleBadge = tutorialList.find(t => t.id === moduleId)?.badge || 'Especialista';
      const badgeId = `badge_${moduleId}`;
      
      const isAlreadyCompleted = academyProgress.completedQuizzes[moduleId];

      if (!isAlreadyCompleted) {
        setAcademyProgress(prev => {
          const newCompleted = { ...prev.completedQuizzes, [moduleId]: true };
          const newBadges = prev.unlockedBadges.includes(badgeId) 
            ? prev.unlockedBadges 
            : [...prev.unlockedBadges, badgeId];
          const newXp = prev.xp + 200;

          return {
            xp: newXp,
            completedQuizzes: newCompleted,
            unlockedBadges: newBadges
          };
        });

        // Mostrar modal de felicitaciones e insignia desbloqueada
        setUnlockedModal({
          badgeTitle: currentModuleBadge,
          badgeIcon: moduleId as any,
          xpGained: 200
        });

        addAuditLog({
          casoId: 'SYSTEM',
          usuario: user?.nombre || 'Estudiante Forense',
          accion: 'EXAMEN_APROBADO',
          detalle: `Examen del módulo ${moduleId.toUpperCase()} aprobado con 100%. Insignia '${currentModuleBadge}' desbloqueada (+200 XP).`,
          nivel: 'success'
        });
      }
    }
  };

  const handleResetQuiz = (moduleId: string) => {
    const questions = QUIZZES[moduleId];
    const newAnswers = { ...quizAnswers };
    const newSubmitted = { ...quizSubmitted };
    
    for (let i = 0; i < questions.length; i++) {
      delete newAnswers[`${moduleId}_${i}`];
    }
    delete newSubmitted[moduleId];

    setQuizAnswers(newAnswers);
    setQuizSubmitted(newSubmitted);
    setQuizScore(prev => {
      const updated = { ...prev };
      delete updated[moduleId];
      return updated;
    });
  };

  // ─── RENDERING ─────────────────────────────────────────────────────────────

  return (
    <div className="space-y-8 animate-fade-in print:bg-white print:p-0 text-[#1D1D1F] dark:text-[#E5E5EA]">
      
      {/* ─── BANNER PRINCIPAL ──────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E5E5EA] dark:border-[#2C2C2E] pb-6 print:hidden">
        <div>
          <h1 className="text-apple-title font-black text-[#1D1D1F] dark:text-white">Academia Forense Interactiva</h1>
          <p className="text-apple-body text-[#86868B] mt-1 max-w-2xl">
            Plataforma educativa y de certificación técnica pericial. Estudia los manuales técnicos, simula las tareas en el laboratorio y certifícate bajo las normativas RAG, COPP y MUCC-2017.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="apple-badge-blue">
            <BookOpen size={12} className="mr-1" /> Avilla Academy
          </span>
          <span className="apple-badge-green">
            <Shield size={12} className="mr-1" /> ISO 27037 / 27042
          </span>
        </div>
      </div>

      {/* ─── DASHBOARD ACADÉMICO DE GAMIFICACIÓN (ESTILO APPLE HIG PREMIUM) ─── */}
      <div className="apple-card p-6 bg-gradient-to-br from-[#1C1C1E] to-[#2C2C2E] text-white border-none relative overflow-hidden shadow-lg print:hidden">
        {/* Luces de fondo decorativas */}
        <div className="absolute right-0 top-0 w-[300px] h-[300px] bg-[var(--apple-accent)]/10 rounded-full blur-3xl -z-10" />
        <div className="absolute left-1/3 bottom-0 w-[200px] h-[200px] bg-green-500/5 rounded-full blur-3xl -z-10" />
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-center">
          {/* Perfil & Nivel */}
          <div className="lg:col-span-1 space-y-2 border-r border-white/10 pr-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[var(--apple-accent)]/20 border border-[var(--apple-accent)]/40 flex items-center justify-center text-white">
                <Trophy size={24} className="text-[var(--apple-accent)] animate-pulse" />
              </div>
              <div>
                <p className="text-xs text-[#86868B] font-bold uppercase tracking-wider">Perfil del Perito</p>
                <h3 className="text-sm font-bold text-white truncate">{user?.nombre || 'Perito Informático'}</h3>
              </div>
            </div>
            <div className="mt-3">
              <span className={`inline-block text-[10px] font-bold px-2.5 py-1 rounded-full border ${peritoLevel.style}`}>
                {peritoLevel.title}
              </span>
            </div>
          </div>

          {/* Progreso Curricular & XP */}
          <div className="lg:col-span-2 space-y-4 px-0 lg:px-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-[#86868B] font-bold uppercase tracking-wider mb-1">Módulos Certificados</p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-black text-white">{totalCertified}</span>
                  <span className="text-xs text-[#86868B] font-bold">/ {tutorialList.length} Aprobados</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-[#86868B] font-bold uppercase tracking-wider mb-1">Puntos de Habilidad (XP)</p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-black text-[var(--apple-accent)]">{academyProgress.xp}</span>
                  <span className="text-xs text-[#86868B] font-bold">XP Acumulados</span>
                </div>
              </div>
            </div>
            
            {/* Barra de Progreso a Siguiente Nivel */}
            <div className="space-y-1">
              <div className="flex justify-between text-[9px] font-bold uppercase tracking-wider text-[#86868B]">
                <span>Progreso de Nivel</span>
                <span>{academyProgress.xp} / 1000 XP</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[var(--apple-accent)] to-blue-400 transition-all duration-500" 
                  style={{ width: `${Math.min((academyProgress.xp / 1000) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Insignias Desbloqueadas */}
          <div className="lg:col-span-1 border-l border-white/10 pl-0 lg:pl-6 space-y-2">
            <p className="text-xs text-[#86868B] font-bold uppercase tracking-wider">Insignias de Especialidad</p>
            <div className="flex flex-wrap gap-2.5">
              {tutorialList.map(tut => {
                const isUnlocked = academyProgress.unlockedBadges.includes(`badge_${tut.id}`);
                const Icon = tut.icon;
                return (
                  <div
                    key={tut.id}
                    title={`${tut.badge}: ${isUnlocked ? 'Desbloqueado' : 'Bloqueado (Completa el examen para certificar)'}`}
                    className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all ${
                      isUnlocked 
                        ? 'bg-[var(--apple-accent)]/20 border-[var(--apple-accent)] text-white scale-105 shadow-md shadow-[var(--apple-accent)]/20' 
                        : 'bg-neutral-800/40 border-neutral-700 text-neutral-600 opacity-40'
                    }`}
                  >
                    <Icon size={16} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ─── CASOS DE ESTUDIO (RECOMENDADOR DE RUTA DE APRENDIZAJE) ─────────── */}
      <div className="space-y-3 print:hidden">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold text-[#86868B] uppercase tracking-wider">Casos de Uso Judicial (Recomendador de Ruta)</h2>
          {selectedCase && (
            <button 
              onClick={() => setSelectedCase(null)}
              className="text-[10px] font-bold text-[var(--apple-accent)] hover:underline"
            >
              Ver todas las guías
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {CASES_STUDY.map(caso => {
            const isSelected = selectedCase === caso.id;
            return (
              <button
                key={caso.id}
                onClick={() => setSelectedCase(caso.id)}
                className={`p-4 rounded-[16px] text-left transition-all border flex flex-col justify-between h-full bg-white dark:bg-[#1C1C1E] ${
                  isSelected 
                    ? 'border-[var(--apple-accent)] shadow-md shadow-[var(--apple-accent)]/5 ring-1 ring-[var(--apple-accent)]' 
                    : 'border-[#D2D2D7] dark:border-[#2C2C2E] hover:bg-[#F5F5F7] dark:hover:bg-[#2C2C2E]'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      caso.id === 'fuga' ? 'bg-orange-100 text-orange-700 dark:bg-orange-950/20 dark:text-orange-400' :
                      caso.id === 'incautado' ? 'bg-green-100 text-green-700 dark:bg-green-950/20 dark:text-green-400' :
                      'bg-red-100 text-red-700 dark:bg-red-950/20 dark:text-red-400'
                    }`}>
                      {caso.id === 'fuga' ? 'Fuga de Datos' : caso.id === 'incautado' ? 'Dispositivo Incautado' : 'Sabotaje'}
                    </span>
                    {isSelected && (
                      <span className="text-[10px] font-bold text-[var(--apple-accent)] flex items-center gap-1">
                        Activo <CheckCircle2 size={10} />
                      </span>
                    )}
                  </div>
                  <h3 className="text-xs font-bold text-[#1D1D1F] dark:text-white leading-tight">{caso.title}</h3>
                  <p className="text-[10px] text-[#86868B] leading-relaxed line-clamp-3">{caso.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-black/[0.04] dark:border-white/[0.04] w-full space-y-1">
                  <p className="text-[9px] text-[#86868B] font-bold uppercase tracking-wider">Herramientas sugeridas:</p>
                  <p className="text-[9px] font-mono text-neutral-700 dark:text-neutral-300 truncate">
                    {caso.recommendedTools.join(', ')}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Banner de Caso Activo */}
        {selectedCase && (
          <div className="p-4 bg-[var(--apple-accent)]/5 border border-[var(--apple-accent)]/20 rounded-[14px] flex gap-3.5 items-start animate-fade-in">
            <div className="p-2 rounded-full bg-[var(--apple-accent)]/10 text-[var(--apple-accent)] shrink-0">
              <Scale size={18} />
            </div>
            <div className="space-y-1 text-xs">
              <p className="font-bold text-[var(--apple-accent)] uppercase tracking-wider text-[10px]">Hipótesis del Caso en Curso</p>
              <p className="text-neutral-700 dark:text-neutral-300 leading-snug">
                {CASES_STUDY.find(c => c.id === selectedCase)?.hypothesis}
              </p>
              <p className="text-[10px] text-[#86868B] font-medium pt-1">
                🎯 Sigue la ruta sugerida destacada en las guías de procedimiento de la barra lateral.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ─── LAYOUT ACADÉMICO: SELECTOR Y CONTENEDOR DE TRABAJO ────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Barra Lateral Izquierda: Selector de Módulos */}
        <div className="lg:col-span-1 space-y-3 print:hidden">
          <p className="text-xs font-bold text-[#86868B] uppercase tracking-wider px-2">Módulos de Formación</p>
          <div className="flex flex-col gap-1.5">
            {tutorialList.map((tut) => {
              const Icon = tut.icon;
              const isActive = activeTutorial === tut.id;
              const isCertified = academyProgress.completedQuizzes[tut.id];
              
              // Verificar si el módulo es recomendado por el caso activo
              const isRecommended = selectedCase 
                ? CASES_STUDY.find(c => c.id === selectedCase)?.recommendedModules.includes(tut.id)
                : false;

              return (
                <button
                  key={tut.id}
                  onClick={() => {
                    setActiveTutorial(tut.id);
                    setIntVerificacionResultado(null);
                  }}
                  className={`w-full p-3.5 rounded-[12px] text-left transition-all border flex gap-3 items-start relative overflow-hidden ${
                    isActive
                      ? 'bg-[var(--apple-accent)] border-[var(--apple-accent)] text-white shadow-sm'
                      : 'bg-white border-[#D2D2D7] text-[#1D1D1F] hover:bg-[#F5F5F7] dark:bg-[#1C1C1E] dark:border-[#2C2C2E] dark:text-[#E5E5EA] dark:hover:bg-[#2C2C2E]'
                  } ${isRecommended && !isActive ? 'ring-2 ring-orange-400/50' : ''}`}
                >
                  {isRecommended && !isActive && (
                    <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-orange-400 rounded-bl-full" />
                  )}
                  <div className={`p-2 rounded-[8px] shrink-0 ${isActive ? 'bg-white/10 text-white' : 'bg-[#0071E3]/10 text-[#0071E3]'}`}>
                    <Icon size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-xs font-bold truncate leading-snug">{tut.label}</p>
                      {isCertified && (
                        <CheckCircle2 size={12} className={isActive ? 'text-white' : 'text-green-500'} />
                      )}
                    </div>
                    <p className={`text-[10px] truncate mt-0.5 ${isActive ? 'text-white/80' : 'text-[#86868B]'}`}>{tut.sub}</p>
                    
                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                      <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${
                        tut.complexity === 'Baja' ? (isActive ? 'bg-white/20 text-white' : 'bg-green-100 text-green-700 dark:bg-green-950/20 dark:text-green-400') :
                        tut.complexity === 'Media' ? (isActive ? 'bg-white/20 text-white' : 'bg-orange-100 text-orange-700 dark:bg-orange-950/20 dark:text-orange-400') :
                        (isActive ? 'bg-white/20 text-white' : 'bg-red-100 text-red-700 dark:bg-red-950/20 dark:text-red-400')
                      }`}>
                        {tut.complexity}
                      </span>
                      {isRecommended && (
                        <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${
                          isActive ? 'bg-white/20 text-white' : 'bg-orange-100 text-orange-700 dark:bg-orange-950/20 dark:text-orange-400'
                        }`}>
                          Recomendado 🎯
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Panel de Contenido Derecho: Workspace Académico */}
        <div className="lg:col-span-3 space-y-6">

          {/* Cesta General de Módulo Seleccionado */}
          {tutorialList.map((mod) => {
            if (activeTutorial !== mod.id) return null;

            const manual = MODULE_MANUALS[mod.id];
            const questions = QUIZZES[mod.id];
            const currentTab = subTabs[mod.id] || 'manual';
            const isCertified = academyProgress.completedQuizzes[mod.id];

            return (
              <div key={mod.id} className="space-y-6 animate-fade-in">
                
                {/* Cabecera del Módulo */}
                <div className="apple-card p-5 border-l-4 border-[var(--apple-accent)] bg-[var(--apple-accent)]/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-[var(--apple-accent)] uppercase tracking-wider">{manual.muccPhase}</p>
                    <h2 className="text-base font-bold text-[#1D1D1F] dark:text-white flex items-center gap-2">
                      Módulo: {mod.label} 
                      {isCertified && <span className="text-xs font-medium text-green-500 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 px-2 py-0.5 rounded-full">Certificado ✅</span>}
                    </h2>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 max-w-xl leading-relaxed">
                      <strong>Base Legal:</strong> {manual.legalBase}
                    </p>
                  </div>
                  <div className="shrink-0 flex gap-2">
                    <span className="apple-badge-blue text-[10px]">Insignia: {mod.badge}</span>
                  </div>
                </div>

                {/* Sub-Navegación de Sub-Tabs de Aprendizaje */}
                <div className="flex border-b border-[#E5E5EA] dark:border-[#2C2C2E] gap-6 print:hidden">
                  {(['manual', 'lab', 'quiz'] as const).map((tab) => {
                    const active = currentTab === tab;
                    return (
                      <button
                        key={tab}
                        onClick={() => setSubTabs(prev => ({ ...prev, [mod.id]: tab }))}
                        className={`pb-3 text-xs font-bold transition-all relative ${
                          active 
                            ? 'text-[var(--apple-accent)] border-b-2 border-[var(--apple-accent)]' 
                            : 'text-[#86868B] hover:text-[#1D1D1F] dark:hover:text-[#E5E5EA]'
                        }`}
                      >
                        {tab === 'manual' && '📖 Manual Técnico'}
                        {tab === 'lab' && '🧪 Laboratorio Virtual'}
                        {tab === 'quiz' && '📝 Examen de Certificación'}
                        {tab === 'quiz' && isCertified && ' (Completado)'}
                      </button>
                    );
                  })}
                </div>

                {/* CONTENIDO DE SUB-TAB SELECCIONADA */}

                {/* 1. MANUAL TÉCNICO */}
                {currentTab === 'manual' && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      
                      {/* Metodología */}
                      <div className="lg:col-span-2 space-y-4">
                        <div className="apple-card p-5 space-y-3">
                          <h3 className="text-xs font-bold text-[#86868B] uppercase tracking-wider flex items-center gap-1.5">
                            <BookOpen size={14} className="text-[var(--apple-accent)]" /> Procedimiento Operativo Estandarizado (SOP)
                          </h3>
                          <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
                            Aplica rigurosamente los siguientes pasos en el laboratorio o sitio de recolección para salvaguardar el debido proceso:
                          </p>
                          <div className="space-y-3.5 pt-2">
                            {manual.procedureSteps.map((step, idx) => (
                              <div key={idx} className="flex gap-3 items-start text-xs">
                                <div className="w-5 h-5 rounded-full bg-[var(--apple-accent)]/10 text-[var(--apple-accent)] flex items-center justify-center font-bold font-mono text-[10px] shrink-0">
                                  {idx + 1}
                                </div>
                                <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed pt-0.5">{step}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Herramientas de Software */}
                      <div className="lg:col-span-1 space-y-4">
                        <div className="apple-card p-5 space-y-3">
                          <h3 className="text-xs font-bold text-[#86868B] uppercase tracking-wider flex items-center gap-1.5">
                            <Gavel size={14} className="text-[var(--apple-accent)]" /> Programas del Laboratorio
                          </h3>
                          <p className="text-[10px] text-[#86868B]">
                            Herramientas comerciales y de código abierto requeridas para llevar a cabo la tarea pericial:
                          </p>
                          <div className="space-y-2 pt-1">
                            {manual.tools.map((tool, idx) => (
                              <div key={idx} className="flex gap-2 items-center text-xs p-2.5 rounded-[8px] bg-[#F5F5F7] dark:bg-[#2C2C2E] border border-black/[0.03] dark:border-white/[0.03] font-semibold">
                                <div className="w-1.5 h-1.5 rounded-full bg-[var(--apple-accent)]" />
                                <span>{tool}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Consola / Comandos Exactos */}
                    {manual.consoleCommands && (
                      <div className="apple-card p-5 space-y-3">
                        <h3 className="text-xs font-bold text-[#86868B] uppercase tracking-wider flex items-center gap-1.5">
                          <TerminalIcon size={14} className="text-[var(--apple-accent)]" /> Comandos de Consola Forense
                        </h3>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400">
                          Comandos exactos de consola que debe dominar el perito informático:
                        </p>
                        <div className="relative rounded-[12px] overflow-hidden border border-neutral-300 dark:border-neutral-800">
                          {/* Cabecera Consola macOS Sonoma */}
                          <div className="bg-[#E5E5EA] dark:bg-[#2C2C2E] px-4 py-2 flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
                            <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                            <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
                            <span className="text-[9px] font-mono text-[#86868B] ml-2">Terminal forense — avilla_cli</span>
                          </div>
                          {/* Bloque de código */}
                          <pre className="bg-[#1E1E1E] text-[#D2D2D7] p-4 font-mono text-xs leading-relaxed overflow-x-auto select-all max-h-[300px]">
                            {manual.consoleCommands.join('\n')}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 2. LABORATORIO PRÁCTICO VIRTUAL */}
                {currentTab === 'lab' && (
                  <div className="space-y-6 animate-fade-in">
                    
                    {/* LAB: CORREO */}
                    {mod.id === 'correo' && (
                      <div className="space-y-6">
                        {/* Controles del Proceso */}
                        <div className="apple-card p-5 print:hidden">
                          <h3 className="text-sm font-bold text-[#1D1D1F] dark:text-[#E5E5EA] uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Mail size={16} className="text-[#0071E3]" /> Configuración de Auditoría de Correo
                          </h3>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-xs font-semibold text-[#86868B] uppercase tracking-wider mb-1">Caso Judicial Asociado</label>
                              <select
                                value={correoCasoId}
                                onChange={e => {
                                  setCorreoCasoId(e.target.value);
                                  cargarProcesosExistentes(e.target.value);
                                }}
                                className="apple-input w-full"
                              >
                                <option value="">Seleccionar caso...</option>
                                {casos.filter(c => c.estado !== 'cerrado' && c.estado !== 'archivado').map(c => (
                                  <option key={c.id} value={c.id}>{c.numeroCaso} — {c.titulo}</option>
                                ))}
                              </select>
                            </div>

                            {correoShowForm && correoCasoId && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-[#F5F5F7] dark:bg-[#2C2C2E] rounded-[8px] animate-fade-in text-xs">
                                <div>
                                  <label className="apple-label">Remitente (From)</label>
                                  <input type="text" value={correoFormBasico.remitente} onChange={e => setCorreoFormBasico(p => ({ ...p, remitente: e.target.value }))} placeholder="correo@empresa.com" className="apple-input w-full" />
                                </div>
                                <div>
                                  <label className="apple-label">Destinatarios (To)</label>
                                  <input type="text" value={correoFormBasico.destinatarios} onChange={e => setCorreoFormBasico(p => ({ ...p, destinatarios: e.target.value }))} placeholder="fiscal@gobierno.com" className="apple-input w-full" />
                                </div>
                                <div>
                                  <label className="apple-label">Asunto (Subject)</label>
                                  <input type="text" value={correoFormBasico.asunto} onChange={e => setCorreoFormBasico(p => ({ ...p, asunto: e.target.value }))} placeholder="Contrato confidencial" className="apple-input w-full" />
                                </div>
                                <div>
                                  <label className="apple-label">Fecha del correo</label>
                                  <input type="text" value={correoFormBasico.fechaCorreo} onChange={e => setCorreoFormBasico(p => ({ ...p, fechaCorreo: e.target.value }))} placeholder="2026-06-11 14:30" className="apple-input w-full" />
                                </div>
                                <div className="md:col-span-2">
                                  <label className="apple-label">Message-ID</label>
                                  <input type="text" value={correoFormBasico.messageId} onChange={e => setCorreoFormBasico(p => ({ ...p, messageId: e.target.value }))} placeholder="&lt;abc123456@mail.empresa.com&gt;" className="apple-input w-full" />
                                </div>
                                <div className="md:col-span-2 flex justify-end">
                                  <button onClick={handleIniciarCorreo} className="apple-btn apple-btn-primary text-xs py-2 px-4 text-white">Iniciar Proceso Forense</button>
                                </div>
                              </div>
                            )}

                            {correoProcesosExistentes.length > 0 && (
                              <div className="mt-4 pt-4 border-t border-black/[0.06] dark:border-white/[0.08]">
                                <h4 className="text-xs font-bold text-[#86868B] mb-2">Procesos de correo iniciados para este caso:</h4>
                                <div className="space-y-1">
                                  {correoProcesosExistentes.map(p => (
                                    <button
                                      key={p.id}
                                      onClick={() => {
                                        setCorreoProceso(p);
                                        setCorreoFormBasico({ remitente: p.remitente, destinatarios: p.destinatarios, asunto: p.asunto, fechaCorreo: p.fechaCorreo, messageId: p.messageId });
                                        setCorreoShowForm(false);
                                      }}
                                      className={`w-full text-left text-xs p-2.5 rounded-[8px] border transition-colors flex items-center justify-between ${
                                        correoProceso?.id === p.id ? 'bg-[#0071E3]/5 border-[#0071E3]/20 text-[#0071E3]' : 'bg-[#F5F5F7] border-transparent hover:bg-[#E5E5EA] dark:bg-[#2C2C2E]'
                                      }`}
                                    >
                                      <span>{p.asunto || '(sin asunto)'} — {p.remitente}</span>
                                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${p.finalizado ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                                        {p.finalizado ? 'Listo' : 'En curso'}
                                      </span>
                                    </button>
                                  ))}
                                  <button onClick={() => setCorreoShowForm(true)} className="text-xs text-[#0071E3] hover:underline mt-2 inline-block font-semibold">+ Iniciar nuevo proceso</button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {correoProceso && (
                          <div className="space-y-6">
                            
                            <div className="apple-card p-4 flex items-center justify-between print:hidden">
                              <div className="flex-1">
                                <div className="flex justify-between items-baseline mb-1">
                                  <span className="text-xs font-bold text-[#1D1D1F] dark:text-[#E5E5EA]">Progreso del Protocolo de Correo</span>
                                  <span className="text-xs font-mono font-bold text-[#0071E3]">{correoPorcentaje}%</span>
                                </div>
                                <div className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                                  <div className="h-full bg-[#34C759] transition-all duration-300" style={{ width: `${correoPorcentaje}%` }} />
                                </div>
                              </div>
                              <div className="ml-4 shrink-0">
                                <button onClick={imprimirCorreo} className="apple-btn apple-btn-secondary flex items-center gap-1 text-xs py-1.5 px-3">
                                  <Printer size={12} /> Imprimir Acta
                                </button>
                              </div>
                            </div>

                            <div className="space-y-4">
                              {correoFases.map(fase => (
                                <div key={fase.fase} className="apple-card overflow-hidden border border-[#E5E5EA] dark:border-[#2C2C2E]">
                                  <div className="p-4 bg-[#F5F5F7] dark:bg-[#2C2C2E] border-b border-black/[0.06] dark:border-white/[0.06]">
                                    <h4 className="text-xs font-bold text-[#86868B] uppercase tracking-wider">{fase.fase}</h4>
                                  </div>
                                  <div className="divide-y divide-black/[0.06] dark:divide-white/[0.06]">
                                    {fase.pasos.map(paso => {
                                      const stepLog = correoPasos.find(s => s.stepId === paso.id);
                                      const checked = stepLog?.completado || false;
                                      return (
                                        <div key={paso.id} className="p-4 hover:bg-neutral-50 dark:hover:bg-neutral-900/30 transition-colors">
                                          <div className="flex gap-3 items-start">
                                            <button onClick={() => togglePasoCorreo(paso.id)} className="mt-0.5 shrink-0 print:hidden text-[#86868B] hover:text-[var(--apple-accent)]">
                                              {checked ? (
                                                <CheckCircle2 size={18} className="text-[#34C759]" />
                                              ) : (
                                                <Circle size={18} />
                                              )}
                                            </button>
                                            <div className="flex-1 min-w-0">
                                              <h5 className={`text-xs font-bold ${checked ? 'text-[#34C759] line-through opacity-75' : 'text-[#1D1D1F] dark:text-[#E5E5EA]'}`}>
                                                {paso.titulo}
                                              </h5>
                                              <p className="text-[11px] text-[#86868B] mt-1">{paso.descripcion}</p>
                                              <p className="text-[10px] text-[#0071E3] font-semibold mt-1 font-mono">{paso.normativa}</p>
                                              
                                              <div className="mt-2 bg-[#F5F5F7] dark:bg-[#2C2C2E] p-2.5 rounded-[8px] text-[10px] text-neutral-700 dark:text-neutral-300 space-y-1">
                                                <p className="font-bold text-[#86868B] uppercase tracking-wider text-[9px] mb-1">Acciones Técnicas Estandarizadas:</p>
                                                {paso.acciones.map((act, idx) => (
                                                  <div key={idx} className="flex gap-1.5 items-start">
                                                    <span className="text-[#0071E3] font-bold">•</span>
                                                    <span>{act}</span>
                                                  </div>
                                                ))}
                                              </div>

                                              {checked && (
                                                <div className="mt-2.5 print:hidden">
                                                  <textarea
                                                    value={stepLog?.observaciones || ''}
                                                    onChange={e => updateObservacionCorreo(paso.id, e.target.value)}
                                                    placeholder="Añadir observaciones para la cadena de custodia..."
                                                    rows={1}
                                                    className="apple-input w-full text-xs py-1.5 px-2.5 resize-none"
                                                  />
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Acta / Resumen para Imprimir */}
                            {correoFinalizado && (
                              <div ref={printRef} className="apple-card p-6 bg-white text-black border border-neutral-300 space-y-4 font-serif print:p-0 print:border-none shadow-sm">
                                <div className="text-center border-b border-black pb-4">
                                  <p className="font-bold uppercase tracking-widest text-sm">SHA256.US FORENSIC LAB</p>
                                  <p className="text-[10px] uppercase font-bold text-neutral-600">Acta Pericial de Adquisición de Mensaje de Datos</p>
                                  <p className="text-[8px] text-neutral-500">ISO/IEC 27037:2012 • LMDF • COPP Art. 187 • MUCC-2017</p>
                                </div>
                                
                                <div className="text-xs grid grid-cols-2 gap-2 font-mono bg-neutral-50 p-3 border rounded">
                                  <p><strong>Caso Referencia:</strong> {correoProceso.casoRef}</p>
                                  <p><strong>Remitente:</strong> {correoFormBasico.remitente}</p>
                                  <p><strong>Destinatarios:</strong> {correoFormBasico.destinatarios}</p>
                                  <p><strong>Fecha Correo:</strong> {correoFormBasico.fechaCorreo}</p>
                                  <p className="col-span-2"><strong>Message-ID:</strong> {correoFormBasico.messageId}</p>
                                  <p className="col-span-2"><strong>Firma del Perito:</strong> {user?.nombre || 'Perito Judicial'}</p>
                                </div>

                                <div className="space-y-3">
                                  <p className="text-[11px] font-sans font-bold uppercase tracking-wider border-b pb-1">Línea de Tiempo de Custodia:</p>
                                  {CORREO_PASOS_FIJOS.map((paso, idx) => {
                                    const log = correoPasos.find(s => s.stepId === paso.id);
                                    return (
                                      <div key={paso.id} className="text-[10px] pl-3 border-l-2 border-green-500">
                                        <p className="font-bold font-sans text-neutral-800">Paso {idx+1}: {paso.titulo}</p>
                                        {log?.fecha && <p className="text-[9px] text-neutral-500 font-mono">Completado: {new Date(log.fecha).toLocaleString()} por {log.responsable}</p>}
                                        {log?.observaciones && <p className="italic text-neutral-600 font-sans mt-0.5">"{log.observaciones}"</p>}
                                      </div>
                                    );
                                  })}
                                </div>

                                <div className="pt-4 border-t border-black text-center text-[8px] text-neutral-500">
                                  <p>Este documento constituye el registro de custodia y verificación técnica inalterada para el mensaje digital de correo.</p>
                                </div>
                              </div>
                            )}

                          </div>
                        )}
                      </div>
                    )}

                    {/* LAB: ADB */}
                    {mod.id === 'adb' && (
                      <div className="space-y-6">
                        <div className="apple-card p-5">
                          <h3 className="text-sm font-bold text-[#1D1D1F] dark:text-[#E5E5EA] uppercase tracking-wider mb-4 flex items-center gap-2">
                            <TerminalIcon size={16} className="text-[#34C759]" /> Parámetros de Adquisición
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                            <div>
                              <label className="apple-label">Caso Judicial</label>
                              <select value={adbCasoId} onChange={e => setAdbCasoId(e.target.value)} className="apple-input w-full">
                                <option value="">-- Seleccionar Caso --</option>
                                {casos.map(caso => (
                                  <option key={caso.id} value={caso.id}>{caso.numeroCaso} — {caso.titulo}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="apple-label">Identificador del Dispositivo (Serial)</label>
                              <input type="text" value={adbSerial} onChange={e => setAdbSerial(e.target.value)} className="apple-input w-full" disabled={adbEjecutando} />
                            </div>
                            <div className="md:col-span-2">
                              <label className="apple-label">Directorio de Destino</label>
                              <input type="text" value={adbRuta} onChange={e => setAdbRuta(e.target.value)} className="apple-input w-full" disabled={adbEjecutando} />
                            </div>
                          </div>
                        </div>

                        <div className="apple-card p-5 space-y-4">
                          <h4 className="text-xs font-bold text-[#86868B] uppercase tracking-wider">Simulación de la Consola e Integridad</h4>
                          
                          <div className="space-y-4 text-xs">
                            <div className="flex gap-3">
                              <div className="w-5 h-5 rounded-full bg-[#34C759] text-white flex items-center justify-center font-bold">1</div>
                              <div>
                                <p className="font-bold text-[#1D1D1F] dark:text-[#E5E5EA]">Selección de módulos a extraer</p>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                                  {Object.keys(adbOpciones).map(opt => (
                                    <label key={opt} className="flex items-center gap-2 cursor-pointer bg-neutral-50 dark:bg-neutral-800 p-2 rounded border border-[#E5E5EA] dark:border-[#2C2C2E]">
                                      <input
                                        type="checkbox"
                                        checked={adbOpciones[opt as keyof typeof adbOpciones]}
                                        onChange={e => setAdbOpciones(prev => ({ ...prev, [opt as keyof typeof adbOpciones]: e.target.checked }))}
                                        disabled={adbEjecutando}
                                        className="rounded border-[#D2D2D7] text-[#34C759] focus:ring-[#34C759]"
                                      />
                                      <span className="capitalize font-mono text-[10px]">{opt}</span>
                                    </label>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-3">
                              <div className="w-5 h-5 rounded-full bg-[#34C759] text-white flex items-center justify-center font-bold">2</div>
                              <div className="flex-1 min-w-0">
                                <p className="font-bold text-[#1D1D1F] dark:text-[#E5E5EA] mb-2">Adquisición e Integridad</p>
                                
                                {/* Consola visual estilo macOS */}
                                <div className="rounded-[12px] overflow-hidden border border-neutral-300 dark:border-neutral-800">
                                  <div className="bg-[#E5E5EA] dark:bg-[#2C2C2E] px-4 py-2 flex items-center gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
                                    <span className="text-[9px] font-mono text-[#86868B] ml-2">Consola ADB de Diagnóstico</span>
                                  </div>
                                  <div className="bg-[#1E1E1E] p-4 font-mono text-[11px] leading-relaxed text-[#D2D2D7] h-[280px] overflow-y-auto flex flex-col">
                                    {adbConsola.length === 0 ? (
                                      <div className="flex-1 flex items-center justify-center text-[#86868B] italic">
                                        Esperando inicio de colecta ADB...
                                      </div>
                                    ) : (
                                      adbConsola.map((line, idx) => (
                                        <div key={idx} className="flex gap-2 items-start">
                                          <span className="text-[#86868B] select-none text-[9px] shrink-0 pt-0.5">[{line.timestamp}]</span>
                                          <span className={`break-all ${
                                            line.type === 'command' ? 'text-[#007AFF] font-bold' :
                                            line.type === 'success' ? 'text-[#30D158]' :
                                            line.type === 'warning' ? 'text-[#FF9F0A]' :
                                            line.type === 'error' ? 'text-[#FF453A]' : 'text-[#FFFFFF]'
                                          }`}>
                                            {line.text}
                                          </span>
                                        </div>
                                      ))
                                    )}
                                    <div ref={adbConsoleEndRef} />
                                  </div>
                                </div>

                                {adbEjecutando && (
                                  <div className="w-full h-1 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden mt-2">
                                     <div className="h-full bg-[#34C759] transition-all duration-300" style={{ width: `${adbProgreso}%` }} />
                                  </div>
                                )}

                                <div className="flex gap-3 mt-4">
                                  <button
                                    onClick={simularEjecucionAdb}
                                    disabled={adbEjecutando}
                                    className="apple-btn apple-btn-primary bg-[#34C759] hover:bg-[#28a745] text-xs py-2 px-4 flex items-center gap-1.5 text-white"
                                  >
                                    <Play size={12} />
                                    {adbEjecutando ? 'Colectando...' : 'Iniciar Colecta ADB'}
                                  </button>
                                  <button
                                    onClick={handleExportAdbConsole}
                                    disabled={adbConsola.length === 0}
                                    className="apple-btn apple-btn-secondary text-xs py-2 px-4 flex items-center gap-1.5"
                                  >
                                    <Save size={12} /> Exportar Logs
                                  </button>
                                </div>

                                {adbCompletado && adbHash && (
                                  <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-[8px] flex items-center gap-3 animate-fade-in">
                                    <CheckCircle2 size={16} className="text-[#34C759]" />
                                    <div className="min-w-0">
                                      <p className="text-[10px] font-bold text-[#34C759] uppercase tracking-wider">Evidencia Firmada</p>
                                      <p className="text-[10px] font-mono text-[#1D1D1F] dark:text-[#E5E5EA] truncate max-w-[400px]">SHA-256: {adbHash}</p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* LAB: DOWNGRADE */}
                    {mod.id === 'downgrade' && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-1 space-y-6">
                          <div className="apple-card p-5 space-y-4">
                            <h3 className="text-xs font-bold text-[#1D1D1F] dark:text-[#E5E5EA] uppercase tracking-wider">Parámetros</h3>
                            <div className="text-xs">
                              <label className="apple-label">Caso Judicial</label>
                              <select value={downCasoId} onChange={e => setDownCasoId(e.target.value)} className="apple-input w-full">
                                <option value="">-- Seleccionar Caso --</option>
                                {casos.map(caso => (
                                  <option key={caso.id} value={caso.id}>{caso.numeroCaso} — {caso.titulo}</option>
                                ))}
                              </select>
                            </div>

                            <div className="text-xs">
                              <label className="apple-label">Aplicación Objetivo</label>
                              <div className="flex flex-col gap-1.5">
                                {(['whatsapp', 'telegram', 'signal'] as const).map(app => (
                                  <button
                                    key={app}
                                    onClick={() => setDownApp(app)}
                                    disabled={downEjecutando}
                                    className={`p-2 rounded-[8px] text-xs font-bold border transition-colors uppercase ${
                                      downApp === app ? 'bg-[#FF3B30]/10 border-[#FF3B30]/30 text-[#FF3B30]' : 'bg-white border-[#D2D2D7] dark:bg-[#1C1C1E] dark:border-[#2C2C2E]'
                                    }`}
                                  >
                                    {app}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="text-xs">
                              <label className="apple-label">Firma de Responsabilidad</label>
                              <input type="text" value={downPerito} onChange={e => setDownPerito(e.target.value)} className="apple-input w-full" disabled={downEjecutando} />
                            </div>
                          </div>

                          <div className="apple-card p-4 border border-[#FF3B30]/20 bg-[#FF3B30]/5 text-xs space-y-2">
                            <p className="font-bold text-[#FF3B30] uppercase">⚠️ Consentimiento Obligatorio</p>
                            <p className="text-[#86868B] text-[10px]">Este procedimiento modifica binarios del dispositivo del investigado. Requiere consentimiento firmado.</p>
                            <label className="flex items-start gap-2.5 cursor-pointer mt-2">
                              <input
                                type="checkbox"
                                checked={downConsent}
                                onChange={e => setDownConsent(e.target.checked)}
                                disabled={downEjecutando}
                                className="mt-0.5 rounded border-[#D2D2D7] text-[#FF3B30] focus:ring-[#FF3B30]"
                              />
                              <span className="font-semibold text-[10px] text-neutral-800 dark:text-neutral-200">He firmado y anexo el Acta de Consignación Oficial firmada por el Custodio.</span>
                            </label>
                          </div>
                        </div>

                        <div className="md:col-span-2 apple-card p-5 flex flex-col justify-between">
                          <div className="space-y-4">
                            <h3 className="text-xs font-bold text-[#1D1D1F] dark:text-[#E5E5EA] uppercase tracking-wider mb-2">Procedimiento Técnico en Dispositivo</h3>
                            <div className="space-y-4 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-0.5 before:bg-neutral-200 dark:before:bg-neutral-800">
                              {downPasos.map((paso, idx) => {
                                const isActive = idx === downPasoActivo && downEjecutando;
                                const isSuccess = paso.status === 'success';

                                return (
                                  <div key={idx} className="flex gap-4 relative items-start text-xs">
                                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 border transition-all z-10 ${
                                      isActive ? 'bg-[#FF3B30] text-white border-[#FF3B30] animate-pulse' :
                                      isSuccess ? 'bg-[#34C759] text-white border-[#34C759]' :
                                      'bg-white text-[#86868B] border-[#D2D2D7] dark:bg-[#1C1C1E] dark:border-[#2C2C2E]'
                                    }`}>
                                      {isSuccess ? <Check size={16} /> : <span className="text-xs font-mono font-bold">{idx + 1}</span>}
                                    </div>
                                    <div className="flex-1 pt-1">
                                      <h4 className={`text-xs font-bold ${isActive ? 'text-[#FF3B30]' : isSuccess ? 'text-[#34C759]' : 'text-[#1D1D1F] dark:text-[#E5E5EA]'}`}>{paso.title}</h4>
                                      <p className="text-[10px] text-[#86868B] mt-0.5">{paso.desc}</p>
                                    </div>
                                    <div>
                                      {isActive && <span className="text-[8px] font-bold text-[#FF3B30] bg-[#FF3B30]/10 px-2 py-0.5 rounded-full uppercase animate-pulse">Procesando</span>}
                                      {isSuccess && <span className="text-[8px] font-bold text-[#34C759] bg-[#34C759]/10 px-2 py-0.5 rounded-full uppercase">Completado</span>}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          <div className="mt-6 pt-4 border-t border-black/[0.06] dark:border-white/[0.06] flex items-center justify-between flex-wrap gap-4">
                            <button
                              onClick={iniciarDowngrade}
                              disabled={downEjecutando || !downConsent}
                              className="apple-btn apple-btn-primary bg-[#FF3B30] hover:bg-[#D32F2F] text-xs py-2 px-4 flex items-center gap-1.5 text-white"
                            >
                              <Play size={12} /> {downEjecutando ? 'Procesando Downgrade...' : 'Iniciar Downgrade Forense'}
                            </button>

                            {downCompletado && downHash && (
                              <div className="p-2.5 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-[8px] flex items-center gap-3 animate-fade-in">
                                <CheckCircle2 size={16} className="text-[#34C759]" />
                                <div className="min-w-0">
                                  <p className="text-[9px] font-bold text-[#34C759] uppercase tracking-wider">Base de Datos Extraída</p>
                                  <p className="text-[10px] font-mono text-[#1D1D1F] dark:text-[#E5E5EA] truncate max-w-[200px]" title={downHash}>SHA-256: {downHash}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* LAB: WHATSAPP PARSER */}
                    {mod.id === 'whatsapp' && (
                      <div className="space-y-6">
                        <div className="apple-card p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex-1 max-w-xs text-xs">
                            <label className="apple-label">Caso Judicial Vinculado</label>
                            <select value={wpCasoId} onChange={e => setWpCasoId(e.target.value)} className="apple-input w-full">
                              <option value="">Seleccionar Caso...</option>
                              {casos.map(caso => (
                                <option key={caso.id} value={caso.id}>{caso.numeroCaso} — {caso.titulo}</option>
                              ))}
                            </select>
                          </div>
                          
                          {/* Tabs internas del lab */}
                          <div className="flex bg-[#E5E5EA] dark:bg-[#2C2C2E] p-0.5 rounded-[10px] self-start md:self-end">
                            {(['chats', 'contacts', 'audios', 'search'] as const).map(tab => (
                              <button
                                key={tab}
                                onClick={() => setWpActiveTab(tab)}
                                className={`px-3 py-1.5 text-xs font-semibold rounded-[8px] transition-all capitalize flex items-center gap-1.5 ${
                                  wpActiveTab === tab ? 'bg-white text-[#1D1D1F] dark:bg-[#1C1C1E] dark:text-[#E5E5EA] shadow-sm' : 'text-[#86868B] hover:text-[#1D1D1F]'
                                }`}
                              >
                                {tab === 'chats' && <MessageSquare size={12} />}
                                {tab === 'contacts' && <Users size={12} />}
                                {tab === 'audios' && <Mic size={12} />}
                                {tab === 'search' && <Search size={12} />}
                                {tab}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Interface del Parser */}
                        <div className="apple-card min-h-[460px] overflow-hidden grid grid-cols-1 md:grid-cols-3 border border-[#E5E5EA] dark:border-[#2C2C2E]">
                          
                          {/* Panel lateral: Lista de chats */}
                          {wpActiveTab === 'chats' && (
                            <div className="md:col-span-1 border-r border-[#E5E5EA] dark:border-[#2C2C2E] flex flex-col bg-[#F5F5F7] dark:bg-[#1C1C1E]">
                              <div className="p-3 border-b border-[#E5E5EA] dark:border-[#2C2C2E]">
                                <input
                                  type="text"
                                  placeholder="Buscar chat..."
                                  value={wpBusquedaChats}
                                  onChange={e => setWpBusquedaChats(e.target.value)}
                                  className="apple-input w-full py-1 text-xs"
                                />
                              </div>
                              <div className="flex-1 overflow-y-auto divide-y divide-[#E5E5EA]/40 dark:divide-[#2C2C2E]/40">
                                {wpChatsFiltrados.map(chat => (
                                  <button
                                    key={chat.id}
                                    onClick={() => setWpSelectedChatId(chat.id)}
                                    className={`w-full p-3.5 flex gap-2.5 text-left transition-colors ${
                                      wpSelectedChatId === chat.id ? 'bg-white dark:bg-[#2C2C2E] border-l-4 border-[#0071E3]' : 'hover:bg-white/40'
                                    }`}
                                  >
                                    <img src={chat.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                                    <div className="flex-1 min-w-0">
                                      <div className="flex justify-between items-baseline">
                                        <h4 className="text-xs font-bold text-[#1D1D1F] dark:text-[#E5E5EA] truncate">{chat.name}</h4>
                                        <span className="text-[9px] text-[#86868B]">{chat.lastTime}</span>
                                      </div>
                                      <p className="text-[10px] text-[#86868B] truncate mt-0.5">{chat.lastMessage}</p>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Panel de visualización principal */}
                          <div className={`${wpActiveTab === 'chats' ? 'md:col-span-2' : 'md:col-span-3'} bg-white dark:bg-[#1C1C1E] flex flex-col h-full`}>
                            
                            {/* Vista 1: Chats Detail */}
                            {wpActiveTab === 'chats' && (
                              <div className="flex flex-col h-full">
                                <div className="p-3 border-b border-[#E5E5EA] dark:border-[#2C2C2E] bg-[#F5F5F7] dark:bg-[#2C2C2E] flex justify-between items-center text-xs">
                                  <div>
                                    <p className="font-bold text-[#1D1D1F] dark:text-[#E5E5EA]">{wpSelectedChat.name}</p>
                                    <p className="text-[9px] text-[#86868B] font-mono">{wpSelectedChat.phone}</p>
                                  </div>
                                  <span className="text-[9px] font-bold text-[#86868B] bg-white dark:bg-[#1C1C1E] px-2.5 py-1 rounded-[6px] border dark:border-[#2C2C2E]">msgstore.db + wa.db</span>
                                </div>
                                
                                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F2F2F7] dark:bg-[#1C1C1E]/50 h-[300px]">
                                  {wpSelectedChat.messages.map(msg => (
                                    <div key={msg.id} className={`flex flex-col max-w-[75%] ${msg.isOutgoing ? 'ml-auto items-end' : 'mr-auto items-start'}`}>
                                      <span className="text-[9px] text-[#86868B] mb-0.5">{msg.sender}</span>
                                      <div className={`p-2.5 rounded-[12px] shadow-sm ${msg.isOutgoing ? 'bg-[#0071E3] text-white rounded-tr-none' : 'bg-white dark:bg-[#2C2C2E] text-[#1D1D1F] dark:text-[#E5E5EA] rounded-tl-none border dark:border-[#2C2C2E]'}`}>
                                        {msg.type === 'audio' ? (
                                          <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-[#1D1D1F] dark:text-[#E5E5EA]">
                                              <button onClick={() => toggleWpAudio(msg.id)} className="w-6 h-6 rounded-full bg-neutral-100 dark:bg-neutral-800 text-[#1D1D1F] dark:text-[#E5E5EA] flex items-center justify-center">
                                                <Play size={10} className={wpAudioPlayingId === msg.id ? 'animate-ping text-red-500' : ''} />
                                              </button>
                                              <div>
                                                <p className="text-[10px] font-bold">Audio ({msg.duration})</p>
                                                <p className="text-[8px] text-neutral-400 font-mono">opus decoded</p>
                                              </div>
                                            </div>
                                            <p className="bg-neutral-50 dark:bg-[#1C1C1E] text-[10px] p-1.5 rounded border border-[#E5E5EA] dark:border-none text-[#1D1D1F] dark:text-[#E5E5EA] italic">📝 {msg.transcription}</p>
                                          </div>
                                        ) : (
                                          <p className="text-xs leading-relaxed break-words">{msg.message}</p>
                                        )}
                                      </div>
                                      <span className="text-[8px] text-[#86868B] mt-1 font-mono">{msg.timestamp}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Vista 2: Contacts */}
                            {wpActiveTab === 'contacts' && (
                              <div className="p-4 space-y-4">
                                <h4 className="text-xs font-bold text-[#1D1D1F] dark:text-[#E5E5EA] uppercase tracking-wider">Directorio de Contactos Extraídos (wa.db)</h4>
                                <div className="border dark:border-[#2C2C2E] rounded-[8px] overflow-hidden">
                                  <table className="w-full text-left border-collapse text-xs">
                                    <thead>
                                      <tr className="bg-[#F5F5F7] dark:bg-[#2C2C2E] font-bold text-[#86868B] border-b dark:border-[#2C2C2E]">
                                        <th className="p-2.5">Alias / Nombre</th>
                                        <th className="p-2.5">Número</th>
                                        <th className="p-2.5">Estado</th>
                                        <th className="p-2.5">Última Conexión</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#E5E5EA] dark:divide-[#2C2C2E]">
                                      {MOCK_CONTACTS.map(c => (
                                        <tr key={c.id} className="hover:bg-neutral-50 dark:hover:bg-[#2C2C2E]/20">
                                          <td className="p-2.5 font-bold">{c.name}</td>
                                          <td className="p-2.5 font-mono">{c.phone}</td>
                                          <td className="p-2.5 text-[#86868B]">{c.status}</td>
                                          <td className="p-2.5">{c.lastSeen}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            )}

                            {/* Vista 3: Audios */}
                            {wpActiveTab === 'audios' && (
                              <div className="p-4 space-y-3">
                                <h4 className="text-xs font-bold text-[#1D1D1F] dark:text-[#E5E5EA] uppercase tracking-wider">Historial de Audios .opus</h4>
                                <div className="space-y-3">
                                  {wpTodosLosAudios.map(({ chatName, msg }) => (
                                    <div key={msg.id} className="p-3 border dark:border-[#2C2C2E] rounded-[8px] bg-[#F5F5F7] dark:bg-[#2C2C2E] flex gap-3 items-start">
                                      <button onClick={() => toggleWpAudio(msg.id)} className="w-8 h-8 rounded-full bg-white dark:bg-[#1C1C1E] border dark:border-none flex items-center justify-center text-[#1D1D1F] dark:text-[#E5E5EA]">
                                        <Play size={12} className={wpAudioPlayingId === msg.id ? 'animate-pulse text-red-500' : ''} />
                                      </button>
                                      <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline">
                                          <p className="text-xs font-bold">{chatName}</p>
                                          <span className="text-[9px] text-[#86868B] font-mono">{msg.timestamp}</span>
                                        </div>
                                        <p className="text-[9px] text-neutral-400">Duración: {msg.duration} | Canal: Mono | Frecuencia: 16000Hz</p>
                                        <div className="mt-2 bg-white dark:bg-[#1C1C1E] p-2 rounded border dark:border-[#2C2C2E] text-[10px] italic">
                                          <strong className="text-[#FF3B30] not-italic mr-1 text-[9px] uppercase tracking-wider">AI Transcript:</strong> "{msg.transcription}"
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Vista 4: Search */}
                            {wpActiveTab === 'search' && (
                              <div className="p-4 space-y-4 flex flex-col h-full">
                                <div>
                                  <h4 className="text-xs font-bold text-[#1D1D1F] dark:text-[#E5E5EA] uppercase tracking-wider">Indexación y Búsqueda Forense</h4>
                                  <p className="text-[10px] text-[#86868B] mt-0.5">Permite cribar palabras clave dentro de conversaciones y metadatos.</p>
                                </div>
                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    placeholder="Introduzca palabra clave (ej. hash, compliance)..."
                                    value={wpQueryBusqueda}
                                    onChange={e => setWpQueryBusqueda(e.target.value)}
                                    className="apple-input flex-1 py-1.5 text-xs"
                                  />
                                </div>

                                {wpQueryBusqueda.trim() ? (
                                  <div className="space-y-2 max-h-[260px] overflow-y-auto">
                                    <p className="text-[10px] font-bold text-[#86868B]">Resultados encontrados ({wpMensajesEncontrados.length}):</p>
                                    {wpMensajesEncontrados.map(({ chatName, msg }) => (
                                      <div key={msg.id} className="p-3 border dark:border-[#2C2C2E] rounded-[8px] bg-neutral-50 dark:bg-[#2C2C2E] hover:bg-neutral-100 transition-all">
                                        <div className="flex justify-between items-baseline mb-1">
                                          <span className="text-xs font-bold text-[#0071E3]">{chatName}</span>
                                          <span className="text-[9px] text-[#86868B] font-mono">{msg.timestamp}</span>
                                        </div>
                                        <p className="text-xs text-neutral-800 dark:text-neutral-200">
                                          {msg.message || `[Mensaje de audio] Transcripción: "${msg.transcription}"`}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="flex-1 flex flex-col items-center justify-center text-[#86868B] py-8">
                                    <FileText size={32} className="opacity-45 mb-2" />
                                    <p className="text-[10px] italic">Introduzca términos para filtrar los mensajes de la base de datos.</p>
                                  </div>
                                )}
                              </div>
                            )}

                          </div>
                        </div>
                      </div>
                    )}

                    {/* LAB: INTEGRIDAD */}
                    {mod.id === 'integrity' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-6">
                          <div className="apple-card p-5 space-y-4">
                            <h3 className="text-sm font-bold text-[#1D1D1F] dark:text-[#E5E5EA] uppercase tracking-wider flex items-center gap-1.5">
                              <Upload size={16} className="text-[#0071E3]" /> Registro de Archivo Pericial
                            </h3>
                            
                            <div className="text-xs">
                              <label className="apple-label">Caso Judicial</label>
                              <select value={intCasoId} onChange={e => setIntCasoId(e.target.value)} className="apple-input w-full">
                                <option value="">Seleccionar Caso...</option>
                                {casos.map(caso => (
                                  <option key={caso.id} value={caso.id}>{caso.numeroCaso} — {caso.titulo}</option>
                                ))}
                              </select>
                            </div>

                            <div className="border-2 border-dashed border-[#D2D2D7] dark:border-[#2C2C2E] hover:border-[#0071E3] rounded-[12px] p-6 text-center bg-[#F5F5F7]/30 hover:bg-[#0071E3]/5 transition-all text-xs">
                              <Upload size={24} className="mx-auto text-[#86868B] mb-1.5" />
                              <p className="text-xs font-bold">Arrastre y suelte el archivo de evidencia</p>
                              <p className="text-[9px] text-[#86868B] mt-0.5">O seleccione un preset de auditoría:</p>
                              <div className="flex flex-wrap justify-center gap-1.5 mt-3">
                                {PRESET_FILES.map(file => (
                                  <button
                                    key={file.name}
                                    onClick={() => handleSelectPresetFile(file)}
                                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors ${
                                      intSelectedFile?.name === file.name ? 'bg-[#0071E3] border-[#0071E3] text-white' : 'bg-white border-[#D2D2D7] dark:bg-[#1C1C1E] dark:border-[#2C2C2E]'
                                    }`}
                                  >
                                    {file.name}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {intSelectedFile && (
                              <div className="bg-[#F5F5F7] dark:bg-[#2C2C2E] p-3 rounded-[8px] space-y-3 animate-fade-in">
                                <div className="flex justify-between items-center text-xs">
                                  <div>
                                    <p className="font-bold truncate max-w-[200px]">{intSelectedFile.name}</p>
                                    <p className="text-[9px] text-[#86868B]">{intSelectedFile.size} | {intSelectedFile.type}</p>
                                  </div>
                                  <button
                                    onClick={calcularHashes}
                                    disabled={intCalculando || !intCasoId}
                                    className="apple-btn apple-btn-primary text-[10px] py-1.5 px-3 flex items-center gap-1 text-white"
                                  >
                                    {intCalculando ? <RefreshCw size={10} className="animate-spin" /> : 'Calcular Hashes'}
                                  </button>
                                </div>

                                {intHashes && (
                                  <div className="space-y-1.5 font-mono text-[10px] pt-2 border-t border-[#E5E5EA] dark:border-[#3A3A3C]">
                                    {/* MD5 */}
                                    <div className="flex items-center justify-between bg-white dark:bg-[#1C1C1E] p-1.5 rounded border dark:border-[#2C2C2E]">
                                      <span className="font-bold text-[#86868B] w-12">MD5:</span>
                                      <span className="truncate flex-1 text-right pr-2">{intHashes.md5}</span>
                                      <button onClick={() => copyToClipboard(intHashes.md5!, 'md5')} className="text-[#86868B] hover:text-[#0071E3]">
                                        {intCopiadoIdx === 'md5' ? <Check size={12} className="text-[#34C759]" /> : <Copy size={12} />}
                                      </button>
                                    </div>
                                    {/* SHA1 */}
                                    <div className="flex items-center justify-between bg-white dark:bg-[#1C1C1E] p-1.5 rounded border dark:border-[#2C2C2E]">
                                      <span className="font-bold text-[#86868B] w-12">SHA-1:</span>
                                      <span className="truncate flex-1 text-right pr-2">{intHashes.sha1}</span>
                                      <button onClick={() => copyToClipboard(intHashes.sha1!, 'sha1')} className="text-[#86868B] hover:text-[#0071E3]">
                                        {intCopiadoIdx === 'sha1' ? <Check size={12} className="text-[#34C759]" /> : <Copy size={12} />}
                                      </button>
                                    </div>
                                    {/* SHA256 */}
                                    <div className="flex items-center justify-between bg-white dark:bg-[#1C1C1E] p-1.5 rounded border border-l-4 border-l-[#0071E3] dark:border-[#2C2C2E]">
                                      <span className="font-bold text-[#0071E3] w-12">SHA256:</span>
                                      <span className="truncate flex-1 text-right font-bold pr-2 text-[#0071E3]">{intHashes.sha256}</span>
                                      <button onClick={() => copyToClipboard(intHashes.sha256!, 'sha256')} className="text-[#86868B] hover:text-[#0071E3]">
                                        {intCopiadoIdx === 'sha256' ? <Check size={12} className="text-[#34C759]" /> : <Copy size={12} />}
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          {intHashes && (
                            <div className="apple-card p-5 space-y-4">
                              <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-[#34C759]">
                                <Lock size={14} /> Sellado Forense .avilla
                              </h3>
                              <div className="space-y-3 text-xs">
                                <div>
                                  <label className="apple-label">Perito Autorizado</label>
                                  <input type="text" value={intPeritoFirmante} onChange={e => setIntPeritoFirmante(e.target.value)} className="apple-input w-full" />
                                </div>
                                <button
                                  onClick={generarFirmaAvilla}
                                  disabled={intGenerandoFirma}
                                  className="apple-btn apple-btn-primary bg-[#34C759] hover:bg-[#28a745] w-full py-2 flex items-center justify-center gap-1.5 text-white"
                                >
                                  <Lock size={12} /> {intGenerandoFirma ? 'Firmando Evidencia...' : 'Firmar y Generar Token (.avilla)'}
                                </button>
                              </div>

                              {intFirmaGenerada && (
                                <div className="p-3 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-[8px] space-y-2 animate-fade-in text-[10px]">
                                  <div className="flex justify-between items-center font-bold">
                                    <span className="text-[#34C759] flex items-center gap-1"><CheckCircle2 size={12} /> Firma Creada</span>
                                    <button onClick={() => copyToClipboard(intFirmaGenerada.token, 'token')} className="text-[#86868B] hover:underline font-semibold">
                                      {intCopiadoIdx === 'token' ? 'Copiado' : 'Copiar Token'}
                                    </button>
                                  </div>
                                  <p className="font-mono bg-white dark:bg-[#1C1C1E] p-2 rounded border dark:border-[#2C2C2E] break-all max-h-[80px] overflow-y-auto select-all">{intFirmaGenerada.token}</p>
                                  <p className="text-[9px] text-[#86868B] font-semibold">Sellado por {intFirmaGenerada.perito} el {new Date(intFirmaGenerada.timestamp).toLocaleString()}</p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="space-y-6">
                          <div className="apple-card p-5 space-y-4">
                            <h3 className="text-sm font-bold text-[#1D1D1F] dark:text-[#E5E5EA] uppercase tracking-wider flex items-center gap-2">
                              <Fingerprint size={16} className="text-[#FF3B30]" /> Validador de Token de Integridad
                            </h3>
                            <p className="text-[11px] text-[#86868B]">Introduzca la firma .avilla de un expediente para comprobar si la cadena de custodia está rota.</p>
                            
                            <div className="space-y-3">
                              <textarea
                                rows={4}
                                value={intTokenVerificar}
                                onChange={e => setIntTokenVerificar(e.target.value)}
                                placeholder="Pegue el token aquí (debe iniciar con AVILLA-SIG...)"
                                className="apple-input w-full font-mono text-[10px] leading-relaxed resize-none p-2"
                              />
                              <button
                                onClick={verificarFirmaAvilla}
                                className="apple-btn apple-btn-secondary w-full py-2 text-xs flex items-center justify-center gap-1.5"
                              >
                                <Shield size={12} className="text-[#0071E3]" /> Verificar Cadena de Custodia
                              </button>
                            </div>

                            {intVerificacionResultado && (
                              <div className={`p-4 rounded-[10px] border animate-fade-in ${
                                intVerificacionResultado.valido
                                  ? 'bg-[#34C759]/5 border-[#34C759]/20 text-[#248A3D]'
                                  : 'bg-[#FF3B30]/5 border-[#FF3B30]/20 text-[#FF3B30]'
                              }`}>
                                <div className="flex gap-2.5 items-start">
                                  {intVerificacionResultado.valido ? (
                                    <CheckCircle2 size={18} className="shrink-0 text-[#34C759]" />
                                  ) : (
                                    <AlertTriangle size={18} className="shrink-0 text-[#FF3B30]" />
                                  )}
                                  <div className="space-y-1.5 text-xs">
                                    <h5 className="font-bold text-[11px] uppercase">{intVerificacionResultado.valido ? 'Firma Auténtica' : 'Cadena de Custodia Alterada'}</h5>
                                    <p className="text-neutral-700 dark:text-neutral-300 leading-snug">{intVerificacionResultado.mensaje}</p>
                                    
                                    {intVerificacionResultado.valido && (
                                      <div className="pt-2 border-t border-[#E5E5EA] dark:border-[#3A3A3C] text-[9px] text-[#86868B] font-mono space-y-0.5">
                                        <p><strong>Perito:</strong> {intVerificacionResultado.perito}</p>
                                        <p><strong>Fecha/Hora:</strong> {new Date(intVerificacionResultado.timestamp!).toLocaleString()}</p>
                                        <p className="truncate"><strong>SHA256 Original:</strong> {intVerificacionResultado.sha256Original}</p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="apple-card p-5 space-y-2.5 text-[11px] text-[#86868B] leading-relaxed">
                            <h4 className="text-xs font-bold text-[#1D1D1F] dark:text-[#E5E5EA] uppercase tracking-wider">Flujo de Blockchain de Auditoría</h4>
                            <p><strong>1. Hashing:</strong> Se calcula el SHA-256 de las evidencias físicas de WhatsApp, colectas ADB o correos al recibirse en laboratorio.</p>
                            <p><strong>2. Sellado:</strong> La firma .avilla empaqueta el hash, perito y hora en un token simétrico (simulando AES-256 + HMAC).</p>
                            <p><strong>3. Bloque de Auditoría:</strong> El token de firma se encadena inmutablemente al log del `useAuditStore` y del IndexedDB.</p>
                          </div>
                        </div>
                      </div>
                    )}

                  </div>
                )}

                {/* 3. EXAMEN DE CERTIFICACIÓN */}
                {currentTab === 'quiz' && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="apple-card p-5 space-y-4">
                      <div className="flex items-center justify-between border-b border-black/[0.04] dark:border-white/[0.04] pb-3">
                        <div>
                          <h3 className="text-sm font-bold text-[#1D1D1F] dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                            <Award size={16} className="text-[var(--apple-accent)]" /> Examen de Certificación: {mod.label}
                          </h3>
                          <p className="text-[10px] text-[#86868B] mt-0.5">
                            Responde todas las preguntas de forma correcta para certificar este módulo forense y ganar +200 XP.
                          </p>
                        </div>
                        {isCertified && (
                          <span className="text-[10px] font-bold text-[#34C759] bg-[#34C759]/10 border border-[#34C759]/20 px-2.5 py-1 rounded-full uppercase">
                            ✓ Certificado Obtenido
                          </span>
                        )}
                      </div>

                      <div className="space-y-6 pt-2">
                        {questions.map((q, qIdx) => {
                          const key = `${mod.id}_${qIdx}`;
                          const selectedOption = quizAnswers[key];
                          const submitted = quizSubmitted[mod.id];
                          const isCorrect = selectedOption === q.correctAnswer;

                          return (
                            <div key={qIdx} className="space-y-3 p-4 rounded-[12px] bg-[#F5F5F7]/60 dark:bg-[#2C2C2E]/30 border border-black/[0.03] dark:border-white/[0.03]">
                              <p className="text-xs font-bold leading-snug">
                                <span className="text-[var(--apple-accent)] font-mono mr-1">{qIdx + 1}.</span> {q.question}
                              </p>
                              
                              <div className="grid grid-cols-1 gap-2">
                                {q.options.map((opt, optIdx) => {
                                  const isOptionSelected = selectedOption === optIdx;
                                  let buttonStyle = 'bg-white dark:bg-[#1C1C1E] border-[#D2D2D7] dark:border-[#2C2C2E] hover:bg-[#F5F5F7] dark:hover:bg-[#2C2C2E]';
                                  
                                  if (isOptionSelected) {
                                    buttonStyle = 'bg-[var(--apple-accent)]/10 border-[var(--apple-accent)] text-[var(--apple-accent)] font-bold';
                                  }

                                  if (submitted) {
                                    if (optIdx === q.correctAnswer) {
                                      buttonStyle = 'bg-green-100 dark:bg-green-950/20 border-green-500 text-green-700 dark:text-green-400 font-bold';
                                    } else if (isOptionSelected) {
                                      buttonStyle = 'bg-red-100 dark:bg-red-950/20 border-red-500 text-red-700 dark:text-red-400 font-bold';
                                    }
                                  }

                                  return (
                                    <button
                                      key={optIdx}
                                      disabled={submitted}
                                      onClick={() => handleSelectAnswer(mod.id, qIdx, optIdx)}
                                      className={`w-full p-3 text-left rounded-[10px] border text-xs transition-all flex items-center justify-between ${buttonStyle}`}
                                    >
                                      <span>{opt}</span>
                                      {submitted && optIdx === q.correctAnswer && (
                                        <CheckCircle2 size={14} className="text-green-500" />
                                      )}
                                      {submitted && isOptionSelected && optIdx !== q.correctAnswer && (
                                        <AlertTriangle size={14} className="text-red-500" />
                                      )}
                                    </button>
                                  );
                                })}
                              </div>

                              {submitted && (
                                <div className="mt-3 p-3 bg-white dark:bg-[#1C1C1E]/50 rounded-[8px] border border-black/[0.04] dark:border-white/[0.04] text-[10px] leading-relaxed text-[#86868B]">
                                  <strong className="text-neutral-700 dark:text-neutral-300">Explicación:</strong> {q.explanation}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Botón de Enviar o Reintentar */}
                      <div className="flex gap-3.5 items-center pt-4 border-t border-black/[0.04] dark:border-white/[0.04]">
                        {!quizSubmitted[mod.id] ? (
                          <button
                            onClick={() => handleSubmitQuiz(mod.id)}
                            className="apple-btn apple-btn-primary text-xs py-2 px-5 text-white"
                          >
                            Enviar Respuestas
                          </button>
                        ) : (
                          <div className="flex items-center gap-4 w-full justify-between flex-wrap">
                            <div className="flex items-center gap-2 text-xs">
                              <span className="font-bold">Calificación:</span>
                              <span className={`font-black text-sm ${quizScore[mod.id] === questions.length ? 'text-green-500' : 'text-red-500'}`}>
                                {quizScore[mod.id]} / {questions.length}
                              </span>
                              <span>({quizScore[mod.id] === questions.length ? 'Examen Aprobado' : 'No aprobado, requiere 100%'})</span>
                            </div>
                            
                            {quizScore[mod.id] < questions.length && (
                              <button
                                onClick={() => handleResetQuiz(mod.id)}
                                className="apple-btn apple-btn-secondary text-xs py-1.5 px-4 flex items-center gap-1"
                              >
                                <RefreshCw size={12} /> Reintentar Examen
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

              </div>
            );
          })}

        </div>

      </div>

      {/* ─── MODAL GLOBAL DE INSIGNIA DESBLOQUEADA (MICRO-ANIMACIÓN APPLE) ─── */}
      {unlockedModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="apple-card max-w-sm w-full bg-gradient-to-b from-[#1C1C1E] to-[#2C2C2E] text-white p-6 border-none text-center space-y-4 shadow-2xl relative overflow-hidden animate-scale-in">
            {/* Destello de fondo */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--apple-accent)_0%,transparent_60%)] opacity-35" />
            
            <div className="relative space-y-4">
              <div className="mx-auto w-20 h-20 rounded-full bg-[var(--apple-accent)]/20 border-2 border-[var(--apple-accent)] flex items-center justify-center text-[var(--apple-accent)] shadow-lg shadow-[var(--apple-accent)]/20 scale-110">
                {unlockedModal.badgeIcon === 'correo' && <Mail size={32} />}
                {unlockedModal.badgeIcon === 'adb' && <TerminalIcon size={32} />}
                {unlockedModal.badgeIcon === 'downgrade' && <Smartphone size={32} />}
                {unlockedModal.badgeIcon === 'whatsapp' && <Database size={32} />}
                {unlockedModal.badgeIcon === 'integrity' && <Shield size={32} />}
              </div>

              <div className="space-y-1">
                <p className="text-[10px] font-bold text-[var(--apple-accent)] uppercase tracking-widest">Insignia Desbloqueada</p>
                <h3 className="text-lg font-black text-white">{unlockedModal.badgeTitle}</h3>
                <p className="text-xs text-[#86868B] px-4">
                  ¡Felicidades! Has respondido correctamente el 100% de las preguntas y certificado tu competencia pericial.
                </p>
              </div>

              <div className="bg-white/5 p-3 rounded-[8px] inline-flex items-center gap-1.5 text-xs font-bold border border-white/5">
                <span className="text-[var(--apple-accent)]">+{unlockedModal.xpGained} XP</span>
                <span className="text-neutral-400">Puntos de Habilidad Forense</span>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setUnlockedModal(null)}
                  className="apple-btn apple-btn-primary w-full py-2.5 text-xs font-bold text-white shadow-lg shadow-[var(--apple-accent)]/20"
                >
                  Continuar Aprendizaje
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── PRINT STYLE OVERRIDES ─────────────────────────────────────────── */}
      <style>{`
        @media print {
          body { background: white !important; color: black !important; }
          .print-hidden { display: none !important; }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 0.35s ease-out forwards;
        }
        .animate-scale-in {
          animation: scaleIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}
