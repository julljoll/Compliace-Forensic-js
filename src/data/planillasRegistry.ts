/**
 * planillasRegistry.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Registro Unificado y Dinámico de Planillas Forenses SHA256.US
 * Proporciona el schema centralizado de títulos, normativas y secciones enumeradas
 * para que las portadas (Folio 01) se actualicen automáticamente si se modifica
 * la estructura de cualquier planilla.
 */

export interface PlanillaSectionDef {
  numero: string;      // ej. "1.0", "2.0", "3.0"
  titulo: string;      // ej. "DATOS DE LA ACTUACIÓN FORENSE PRIVADA"
  descripcion: string; // Resumen del contenido de la sección
  camposCount?: number;// Cantidad aproximada de campos u objetos
}

export interface PlanillaRegistryDef {
  id: string;
  codigo: string;
  nombreOficial: string;
  subtitulo: string;
  etapaLegal: string;
  normativas: string[];
  sections: PlanillaSectionDef[];
}

export const PLANILLAS_REGISTRY: Record<string, PlanillaRegistryDef> = {
  'acta-obtencion': {
    id: 'acta-obtencion',
    codigo: 'FO-SHA256-ACT-001',
    nombreOficial: 'ACTA DE OBTENCIÓN POR CONSIGNACIÓN VOLUNTARIA PRIVADA',
    subtitulo: 'RECEPCIÓN DE DISPOSITIVO PARA ANÁLISIS FORENSE EN LABORATORIO PRIVADO SHA256.US',
    etapaLegal: 'ETAPA 1: Consignación & Consentimiento Informado',
    normativas: ['MUCC-2017 Fase 1', 'ISO/IEC 27037 Sec. 6', 'COPP Art. 186', 'NIST SP 800-101'],
    sections: [
      {
        numero: '1.0',
        titulo: 'DATOS DE LA ACTUACIÓN FORENSE PRIVADA',
        descripcion: 'Sede de recepción, fecha, hora, expediente y perito actuante.',
        camposCount: 4,
      },
      {
        numero: '2.0',
        titulo: 'IDENTIFICACIÓN COMPLETA DEL CONSIGNANTE PRIVADO',
        descripcion: 'Nombres, C.I./RIF, calidad jurídica y datos de contacto.',
        camposCount: 5,
      },
      {
        numero: '3.0',
        titulo: 'ESPECIFICACIÓN TÉCNICA RIGUROSA DEL DISPOSITIVO',
        descripcion: 'Marca, modelo, N° serie, IMEI, capacidad y características físicas.',
        camposCount: 8,
      },
      {
        numero: '4.0',
        titulo: 'ESTADO FÍSICO, OBSERVACIONES VISUALES Y ACCESORIOS',
        descripcion: 'Condición física de pantalla, carcasa, SIMs, tarjetas SD y accesorios.',
        camposCount: 6,
      },
      {
        numero: '5.0',
        titulo: 'ALCANCE Y AUTORIZACIÓN EXPRESA DEL EXAMEN PERICIAL',
        descripcion: 'Finalidad del peritaje, límites normativos y COPP Art. 225.',
        camposCount: 3,
      },
      {
        numero: '6.0',
        titulo: 'CUSTODIA INICIAL Y EMPACADO EN BOLSA FARADAY / PRECINTO',
        descripcion: 'N° de precinto, bolsa de apantallamiento electromagnético y primer custodio.',
        camposCount: 4,
      },
      {
        numero: '7.0',
        titulo: 'FIRMAS DE CONFORMIDAD, CERTIFICACIÓN Y CUSTODIA',
        descripcion: 'Firma consignante, perito responsable y huellas dactilares.',
        camposCount: 3,
      },
    ],
  },

  'acta-consentimiento': {
    id: 'acta-consentimiento',
    codigo: 'FO-SHA256-ACT-002',
    nombreOficial: 'ACTA DE CONSENTIMIENTO INFORMADO & HÁBEAS DATA',
    subtitulo: 'AUTORIZACIÓN EXPLÍCITA DE INSPECCIÓN TÉCNICO-PERICIAL Y EXENCIÓN DE RESPONSABILIDAD',
    etapaLegal: 'ETAPA 1: Consignación & Consentimiento Informado',
    normativas: ['CRBV Art. 60', 'LMD FE Arts. 4 y 6', 'ISO/IEC 27701', 'COPP Art. 225'],
    sections: [
      {
        numero: '1.0',
        titulo: 'DECLARACIÓN DE LEGITIMACIÓN DE POSESIÓN Y TITULARIDAD',
        descripcion: 'Acreditación jurada del titular o representante corporativo legitimado.',
        camposCount: 4,
      },
      {
        numero: '2.0',
        titulo: 'AUTORIZACIÓN EXPRESA DE INSPECCIÓN TÉCNICO-PERICIAL',
        descripcion: 'Consentimiento libre de coerción para extracción y análisis forense.',
        camposCount: 3,
      },
      {
        numero: '3.0',
        titulo: 'POLÍTICA DE HÁBEAS DATA Y PROTECCIÓN DE DATOS SENSIBLES',
        descripcion: 'Cláusula de confidencialidad, manejo de datos de terceros y privacidad.',
        camposCount: 4,
      },
      {
        numero: '4.0',
        titulo: 'EXENCIÓN DE RESPONSABILIDAD LEGAL Y ALCANCE PERICIAL',
        descripcion: 'Deslinde de responsabilidad sobre hallazgos ilícitos presistentes.',
        camposCount: 3,
      },
      {
        numero: '5.0',
        titulo: 'FIRMAS Y REGISTRO DACTILAR DE AUTORIZACIÓN',
        descripcion: 'Firma autógrafa del concedente y confirmación dactilar.',
        camposCount: 3,
      },
    ],
  },

  'prcc': {
    id: 'prcc',
    codigo: 'FO-SHA256-PRCC-001',
    nombreOficial: 'PLANILLA DE REGISTRO DE CADENA DE CUSTODIA (PRCC)',
    subtitulo: 'REGISTRO INMUTABLE DE TRAZABILIDAD, TRASPASOS Y CUSTODIA DE EVIDENCIA DIGITAL',
    etapaLegal: 'ETAPA 2: Custodia & Laboratorio Forense',
    normativas: ['MUCC-2017 Control', 'COPP Art. 187', 'ISO/IEC 27037 Sec. 7', 'RFC 3161'],
    sections: [
      {
        numero: '1.0',
        titulo: 'REGISTRO GENERAL DE EVIDENCIA DIGITAL (PRCC-COPP)',
        descripcion: 'Identificación unívoca de la pieza, N° PRCC y correlativo de expediente.',
        camposCount: 5,
      },
      {
        numero: '2.0',
        titulo: 'CARACTERÍSTICAS TÉCNICAS Y MARCAS DE IDENTIFICACIÓN',
        descripcion: 'Número de serie, IMEI, hash SHA-256 de origen y precinto primario.',
        camposCount: 6,
      },
      {
        numero: '3.0',
        titulo: 'HISTORIAL DE TRASPASOS, CUSTODIOS Y CAMBIOS DE CUSTODIA',
        descripcion: 'Matriz cronológica de entregas, recepciones, motivos y firmas.',
        camposCount: 8,
      },
      {
        numero: '4.0',
        titulo: 'ALMACENAMIENTO EN BÓVEDA PRIVADA DE EVIDENCIAS',
        descripcion: 'Ubicación física en caja fuerte / jaula Faraday y condiciones térmicas.',
        camposCount: 4,
      },
      {
        numero: '5.0',
        titulo: 'CERTIFICACIÓN DE INTEGRIDAD Y VERIFICACIÓN SHA-256',
        descripcion: 'Comprobación de no alteración y firma del custodio final.',
        camposCount: 3,
      },
    ],
  },

  'acta-desprecintado': {
    id: 'acta-desprecintado',
    codigo: 'FO-SHA256-ACT-003',
    nombreOficial: 'ACTA DE APERTURA Y DESPRECINTADO EN LABORATORIO',
    subtitulo: 'APERTURA FORMAL DE CONTENEDOR DE EVIDENCIA Y VERIFICACIÓN DE INTEGRIDAD DE PRECINTO',
    etapaLegal: 'ETAPA 2: Custodia & Laboratorio Forense',
    normativas: ['MUCC Fase 2', 'ISO/IEC 27037 Sec. 7.2', 'COPP Art. 187'],
    sections: [
      {
        numero: '1.0',
        titulo: 'IDENTIFICACIÓN DEL PAQUETE Y PRECINTO DE SEGURIDAD',
        descripcion: 'Verificación del N° de precinto recibido contra el registro PRCC.',
        camposCount: 4,
      },
      {
        numero: '2.0',
        titulo: 'COMPROBACIÓN DE INTEGRIDAD DE LA BOLSA FARADAY / EMBALAJE',
        descripcion: 'Inspección visual de indemnidad física del contenedor y roturas.',
        camposCount: 4,
      },
      {
        numero: '3.0',
        titulo: 'REMOCIÓN CONTROLADA DEL PRECINTO Y EXTRACCIÓN DE EVIDENCIA',
        descripcion: 'Corte de precinto en presencia de testigos/perito y extracción limpia.',
        camposCount: 5,
      },
      {
        numero: '4.0',
        titulo: 'REGISTRO FOTOGRÁFICO DE APERTURA Y VERIFICACIÓN VISUAL',
        descripcion: 'Constancia gráfica de la apertura y coincidencia de seriales.',
        camposCount: 3,
      },
      {
        numero: '5.0',
        titulo: 'FIRMAS DE CERTIFICACIÓN DEL ANALISTA FORENSE',
        descripcion: 'Certificación del perito de laboratorio actuante.',
        camposCount: 3,
      },
    ],
  },

  'acta-entrevista': {
    id: 'acta-entrevista',
    codigo: 'FO-SHA256-ACT-004',
    nombreOficial: 'ACTA DE ENTREVISTA TÉCNICO-PERICIAL PRIVADA',
    subtitulo: 'DECLARACIÓN DE CONTEXTO FORENSE Y FACILITACIÓN DE CREDENCIALES DE ACCESO',
    etapaLegal: 'ETAPA 2: Custodia & Laboratorio Forense',
    normativas: ['COPP Art. 153', 'MUCC-2017 Entrevista', 'Redacción Forense Privada'],
    sections: [
      {
        numero: '1.0',
        titulo: 'IDENTIFICACIÓN DEL ENTREVISTADO Y CALIDAD JURÍDICA',
        descripcion: 'Datos personales, cargo corporativo y rol en la investigación.',
        camposCount: 5,
      },
      {
        numero: '2.0',
        titulo: 'CONTEXTO DE LA INVESTIGACIÓN Y ANTECEDENTES DEL CASO',
        descripcion: 'Narración de los hechos relevantes y cronología del incidente.',
        camposCount: 4,
      },
      {
        numero: '3.0',
        titulo: 'CREDENCIALES, CLAVES Y PARÁMETROS DE ACCESO FACILITADOS',
        descripcion: 'Suministro de PIN, contraseñas y patrones bajo reserva confidencial.',
        camposCount: 4,
      },
      {
        numero: '4.0',
        titulo: 'OBSERVACIONES TÉCNICAS Y DECLARACIÓN JURADA',
        descripcion: 'Constancia de veracidad de los datos aportados.',
        camposCount: 3,
      },
      {
        numero: '5.0',
        titulo: 'FIRMAS Y HUELLAS DACTILARES DE LA ENTREVISTA',
        descripcion: 'Firma de entrevistado y perito entrevistador.',
        camposCount: 3,
      },
    ],
  },

  'dictamen-imagenes': {
    id: 'dictamen-imagenes',
    codigo: 'FO-SHA256-DIC-001',
    nombreOficial: 'DICTAMEN PERICIAL INFORMÁTICO FORENSE — ANÁLISIS DE IMÁGENES',
    subtitulo: 'INFORME TÉCNICO PERICIAL DE AUTENTICIDAD, ELA MAP, COPY-MOVE Y METADATOS EXIF',
    etapaLegal: 'ETAPA 3: Análisis Técnico & Certificación',
    normativas: ['Daubert Standard (1993)', 'FRE Rule 702', 'ISO/IEC 27042:2015', 'COPP Arts. 187, 223, 225'],
    sections: [
      {
        numero: '1.0',
        titulo: 'MARCO NORMATIVO RAG Y PREÁMBULO INSTITUCIONAL',
        descripcion: 'Bases legales, justificación técnico-científica y acreditación.',
        camposCount: 6,
      },
      {
        numero: '2.0',
        titulo: 'ACREDITACIÓN DE PERITOS Y OBJETO PERICIAL',
        descripcion: 'Cualificación profesional de los peritos y preguntas formuladas.',
        camposCount: 5,
      },
      {
        numero: '3.0',
        titulo: 'METODOLOGÍA CIENTÍFICA (ISO/IEC 27042:2015)',
        descripcion: 'Fases de procesamiento, herramientas PhotoHolmes y algoritmos.',
        camposCount: 6,
      },
      {
        numero: '4.0',
        titulo: 'ANÁLISIS ELA (ERROR LEVEL ANALYSIS) Y HALLAZGOS',
        descripcion: 'Evaluación de niveles de compresión y zonas de manipulación.',
        camposCount: 4,
      },
      {
        numero: '5.0',
        titulo: 'DETECCIÓN COPY-MOVE Y ANÁLISIS ESTRUCTURAL',
        descripcion: 'Identificación de duplicación de bloques de píxeles.',
        camposCount: 4,
      },
      {
        numero: '6.0',
        titulo: 'ANÁLISIS JPEG GHOSTS Y METADATOS EXIF',
        descripcion: 'Detección de re-salvados y consistencia de encabezados EXIF.',
        camposCount: 5,
      },
      {
        numero: '7.0',
        titulo: 'CONCLUSIONES TÉCNICO-PERICIALES Y HASHES SHA-256',
        descripcion: 'Dictamen de autenticidad final e inmutabilidad criptográfica.',
        camposCount: 4,
      },
      {
        numero: '8.0',
        titulo: 'ANEXO NORMATIVO Y REGISTRO DE AUDITORÍA',
        descripcion: 'Cadena de auditoría inmutable de procesamiento.',
        camposCount: 3,
      },
    ],
  },

  'dictamen-audios': {
    id: 'dictamen-audios',
    codigo: 'FO-SHA256-DIC-002',
    nombreOficial: 'DICTAMEN PERICIAL INFORMÁTICO FORENSE — ANÁLISIS DE AUDIOS / WHATSAPP',
    subtitulo: 'INFORME DE AUTENTICIDAD DE NOTAS DE VOZ, DECODIFICACIÓN OPUS, ESPECTROGRAMA Y CONTINUIDAD',
    etapaLegal: 'ETAPA 3: Análisis Técnico & Certificación',
    normativas: ['COPP Arts. 187, 223', 'ISO/IEC 27042:2015', 'PyOgg Engine', 'MUCC-2017 Audio'],
    sections: [
      {
        numero: '1.0',
        titulo: 'MARCO NORMATIVO Y REQUISITOS PROBATORIOS',
        descripcion: 'Requisitos de admisibilidad de notas de voz en tribunales.',
        camposCount: 5,
      },
      {
        numero: '2.0',
        titulo: 'ACREDITACIÓN PERICIAL E IDENTIFICACIÓN DE AUDIOS',
        descripcion: 'Ficheros analizados, contenedor Opus/Ogg y hashes de origen.',
        camposCount: 6,
      },
      {
        numero: '3.0',
        titulo: 'METODOLOGÍA DE DECODIFICACIÓN OPUS Y METADATOS',
        descripcion: 'Estructura de paquetes OggOpus, cabeceras y muestra de audio.',
        camposCount: 5,
      },
      {
        numero: '4.0',
        titulo: 'ESPECTROGRAMA Y ANÁLISIS DE FRECUENCIA AUDIO',
        descripcion: 'Representación tiempo-frecuencia y detección de ruidos de fondo.',
        camposCount: 4,
      },
      {
        numero: '5.0',
        titulo: 'CÁLCULO DE PITCH, FORMANTES Y CONTINUIDAD',
        descripcion: 'Consistencia acústica de la voz y ausencia de inserciones.',
        camposCount: 4,
      },
      {
        numero: '6.0',
        titulo: 'VERIFICACIÓN DE EDICIÓN Y CORTE DE ONDA',
        descripcion: 'Análisis de fases de señal y posibles ediciones digitales.',
        camposCount: 4,
      },
      {
        numero: '7.0',
        titulo: 'CONCLUSIONES PERICIALES Y REGISTRO DE CADENA',
        descripcion: 'Veredicto pericial de no manipulación acústica.',
        camposCount: 4,
      },
      {
        numero: '8.0',
        titulo: 'ANEXO DE TRAZABILIDAD SHA-256',
        descripcion: 'Log criptográfico de preservación de ficheros de audio.',
        camposCount: 3,
      },
    ],
  },

  'acta-sanitizacion': {
    id: 'acta-sanitizacion',
    codigo: 'FO-SHA256-ACT-005',
    nombreOficial: 'ACTA DE SANITIZACIÓN Y DESTRUCCIÓN SEGURA DE COPIAS',
    subtitulo: 'CERTIFICADO DE DESTRUCCIÓN O BORRADO SEGURO DE COPIAS DE TRABAJO (NIST SP 800-88)',
    etapaLegal: 'ETAPA 4: Cierre & Devolución',
    normativas: ['NIST SP 800-88 Rev 1', 'ISO/IEC 27001 A.8.10', 'MUCC-2017 Cierre'],
    sections: [
      {
        numero: '1.0',
        titulo: 'EVIDENCIA Y MEDIOS DIGITALES A SANITIZAR',
        descripcion: 'Imágenes forenses de trabajo, datos temporales y réplicas.',
        camposCount: 4,
      },
      {
        numero: '2.0',
        titulo: 'METODOLOGÍA DE BORRADO SEGURO (OVERWRITE / CRYPTO-ERASE)',
        descripcion: 'Algoritmo aplicado (DoD 5220.22-M / NIST Clear/Purge).',
        camposCount: 5,
      },
      {
        numero: '3.0',
        titulo: 'REGISTRO DE SOFTWARE Y LOGS DE SANITIZACIÓN',
        descripcion: 'Herramienta utilizada, pasadas ejecutadas y verificación de sectores.',
        camposCount: 4,
      },
      {
        numero: '4.0',
        titulo: 'VERIFICACIÓN Y CERTIFICADO DE ZEROIZATION',
        descripcion: 'Comprobación de imposibilidad de recuperación de datos.',
        camposCount: 3,
      },
      {
        numero: '5.0',
        titulo: 'FIRMAS Y CONSTANCIA DE SANITIZACIÓN',
        descripcion: 'Conformidad del perito de laboratorio y responsable.',
        camposCount: 3,
      },
    ],
  },

  'entrega-resultados': {
    id: 'entrega-resultados',
    codigo: 'FO-SHA256-ACT-006',
    nombreOficial: 'ACTA DE ENTREGA DE RESULTADOS Y DEVOLUCIÓN DE EVIDENCIA',
    subtitulo: 'DEVOLUCIÓN FORMAL DE EVIDENCIA FÍSICA Y ENTREGA DEL INFORME PERICIAL',
    etapaLegal: 'ETAPA 4: Cierre & Devolución',
    normativas: ['MUCC-2017 Cierre', 'COPP Art. 187', 'ISO/IEC 27037 Sec. 8'],
    sections: [
      {
        numero: '1.0',
        titulo: 'IDENTIFICACIÓN DE LA ENTREGA Y RECEPCIÓN DE INFORMES',
        descripcion: 'Acto de entrega al solicitante o tribunal, fecha y acta de cierre.',
        camposCount: 5,
      },
      {
        numero: '2.0',
        titulo: 'INVENTARIO DE EVIDENCIA FÍSICA Y DIGITAL DEVUELTA',
        descripcion: 'Verificación física de dispositivos, pendrives y sobres sellados.',
        camposCount: 5,
      },
      {
        numero: '3.0',
        titulo: 'RE-PRECINTADO Y VERIFICACIÓN DE ESTADO FINAL',
        descripcion: 'N° de nuevo precinto final de resguardo corporativo.',
        camposCount: 4,
      },
      {
        numero: '4.0',
        titulo: 'CONSTANCIA DE CONFORMIDAD DEL SOLICITANTE',
        descripcion: 'Declaración de recepción a satisfacción completa.',
        camposCount: 3,
      },
      {
        numero: '5.0',
        titulo: 'FIRMAS Y REGISTRO DACTILAR DE RECEPCIÓN',
        descripcion: 'Firma del receptor, perito actuante y huellas dactilares.',
        camposCount: 3,
      },
    ],
  },

  'acta-auditoria-timeline': {
    id: 'acta-auditoria-timeline',
    codigo: 'FO-SHA256-ACT-007',
    nombreOficial: 'AUDIT LOG & TIMELINE COMPLIANCE RECORD',
    subtitulo: 'HOJA DE AUDITORÍA INMUTABLE SHA-256 Y CRONOLOGÍA DE CUMPLIMIENTO',
    etapaLegal: 'ETAPA 4: Cierre & Devolución',
    normativas: ['ISO/IEC 27037', 'RFC 3161 Timestamping', 'Audit Chain SHA-256'],
    sections: [
      {
        numero: '1.0',
        titulo: 'RESUMEN DE TRAZABILIDAD Y HASH CHAIN SHA-256',
        descripcion: 'Bloques criptográficos encadenados de cada actuación.',
        camposCount: 5,
      },
      {
        numero: '2.0',
        titulo: 'CRONOLOGÍA DE EVENTOS Y OPERACIONES PERICIALES',
        descripcion: 'Línea de tiempo de hitos desde la recepción hasta el informe.',
        camposCount: 6,
      },
      {
        numero: '3.0',
        titulo: 'VERIFICACIÓN INMUTABLE DE LOGS DE SISTEMA',
        descripcion: 'Verificación de integridad contra la base de datos inmutable.',
        camposCount: 4,
      },
      {
        numero: '4.0',
        titulo: 'ESTADO DE CUMPLIMIENTO REGULATORIO RAG',
        descripcion: 'Checklist de normas aplicadas de las 77 normativas RAG.',
        camposCount: 5,
      },
      {
        numero: '5.0',
        titulo: 'VALIDACIÓN Y SELLO DE INTEGRIDAD DIGITAL',
        descripcion: 'Sello de tiempo criptográfico y firma del Oficial de Cumplimiento.',
        camposCount: 3,
      },
    ],
  },
};

/**
 * Obtiene la definición de registro para una planilla por su ID o clave corta.
 */
export function getPlanillaRegistry(id: string): PlanillaRegistryDef {
  const normalizedId = id.toLowerCase().trim();
  if (PLANILLAS_REGISTRY[normalizedId]) {
    return PLANILLAS_REGISTRY[normalizedId];
  }

  // Búsqueda aproximada si el id viene con variaciones (ej. 'dictamen-imagenes' vs 'dictamen')
  if (normalizedId.includes('dictamen') && normalizedId.includes('audio')) {
    return PLANILLAS_REGISTRY['dictamen-audios'];
  }
  if (normalizedId.includes('dictamen')) {
    return PLANILLAS_REGISTRY['dictamen-imagenes'];
  }

  // Fallback genérico si no existe
  return {
    id: normalizedId,
    codigo: 'FO-SHA256-GEN-000',
    nombreOficial: `PLANILLA FORENSE — ${normalizedId.toUpperCase()}`,
    subtitulo: 'DOCUMENTO PROBATORIO OFICIAL EN LABORATORIO PRIVADO SHA256.US',
    etapaLegal: 'ETAPA DE CUSTODIA & COMPLIANCE',
    normativas: ['MUCC-2017', 'ISO/IEC 27037', 'COPP Art. 187'],
    sections: [
      {
        numero: '1.0',
        titulo: 'DATOS GENERALES DEL CASO Y ACTUACIÓN',
        descripcion: 'Identificación del expediente y fecha de actuación.',
      },
      {
        numero: '2.0',
        titulo: 'DESCRIPCIÓN DE EVIDENCIA Y REGISTRO TÉCNICO',
        descripcion: 'Propiedades del elemento bajo peritaje.',
      },
      {
        numero: '3.0',
        titulo: 'REGISTRO DE CUSTODIA Y CERTIFICACIÓN',
        descripcion: 'Firmas de responsabilidad e inmutabilidad SHA-256.',
      },
    ],
  };
}
