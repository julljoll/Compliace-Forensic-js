// Etapas extraídas de los YAMLs en RAG/ para cada normativa registrada en el store

export interface EtapaNormativa {
  id: string;
  nombre: string;
  descripcion: string;
  subetapas?: { id: string; nombre: string; descripcion: string }[];
}

export interface NormativaConEtapas {
  normativaId: string;
  codigo: string;
  etapas: EtapaNormativa[];
}

export const NORMATIVAS_ETAPAS: NormativaConEtapas[] = [
  {
    normativaId: 'n1', codigo: 'ISO/IEC 27037:2012',
    etapas: [
      { id: 'n1__identificacion', nombre: '1. Identificación', descripcion: 'Identificar potenciales fuentes de evidencia digital en el dispositivo consignado.' },
      { id: 'n1__recopilacion', nombre: '2. Recopilación', descripcion: 'Recopilar dispositivos y medios que contienen evidencia digital.' },
      { id: 'n1__adquisicion', nombre: '3. Adquisición', descripcion: 'Crear copia forense bit-a-bit con verificación de hash SHA-256/MD5.' },
      { id: 'n1__preservacion', nombre: '4. Preservación', descripcion: 'Preservar integridad de la evidencia mediante cadena de custodia y almacenamiento seguro.' },
    ],
  },
  {
    normativaId: 'n2', codigo: 'ISO/IEC 27042:2015',
    etapas: [
      { id: 'n2__preparacion', nombre: '1. Preparación del Análisis', descripcion: 'Verificar precintos, recalcular hash, cotejar PRCC con embalaje.' },
      { id: 'n2__examen', nombre: '2. Examen de la Evidencia', descripcion: 'Examinar la evidencia sin alterar su contenido original.' },
      { id: 'n2__analisis', nombre: '3. Análisis de Datos', descripcion: 'Aplicar métodos y técnicas de análisis forense sobre los datos extraídos.' },
      { id: 'n2__interpretacion', nombre: '4. Interpretación de Resultados', descripcion: 'Evaluar los datos resultantes y formular conclusiones técnico-científicas.' },
    ],
  },
  {
    normativaId: 'n3', codigo: 'NIST SP 800-101 r1',
    etapas: [
      { id: 'n3__preservacion', nombre: '1. Preservación', descripcion: 'Asegurar el dispositivo móvil, activar modo avión o bolsa Faraday.' },
      { id: 'n3__adquisicion', nombre: '2. Adquisición', descripcion: 'Extracción lógica o física del dispositivo con herramientas forenses.' },
      { id: 'n3__examen', nombre: '3. Examen y Análisis', descripcion: 'Procesar artefactos del dispositivo: SMS, llamadas, apps, ubicaciones.' },
      { id: 'n3__reporte', nombre: '4. Reporte', descripcion: 'Documentar hallazgos, metodología, herramientas y conclusiones.' },
    ],
  },
  {
    normativaId: 'n4', codigo: 'MUCC-2017',
    etapas: [
      { id: 'n4__fase_inicial', nombre: '1. Fase Inicial – Obtención', descripcion: 'Obtención de evidencia: técnica, aseguramiento, consignación o derivación.',
        subetapas: [
          { id: 'n4__proteccion', nombre: 'Protección Técnica', descripcion: 'Delimitar y preservar la integridad del dispositivo consignado.' },
          { id: 'n4__observacion', nombre: 'Observación Preliminar', descripcion: 'Evaluar condiciones y planificar abordaje.' },
          { id: 'n4__fijacion', nombre: 'Fijación', descripcion: 'Fotografía, escrita, planimétrica y videográfica.' },
          { id: 'n4__coleccion', nombre: 'Colección', descripcion: 'Levantamiento manual o instrumental de evidencia.' },
          { id: 'n4__embalaje', nombre: 'Embalaje y Rotulación', descripcion: 'Una evidencia = un embalaje, sello inviolable.' },
          { id: 'n4__prcc', nombre: 'Registro en PRCC', descripcion: 'Planilla de Registro de Cadena de Custodia.' },
        ],
      },
      { id: 'n4__fase_lab', nombre: '2. Fase de Laboratorio – Peritación', descripcion: 'Análisis técnico-científico de la evidencia.',
        subetapas: [
          { id: 'n4__recepcion_lab', nombre: 'Recepción en Laboratorio', descripcion: 'Verificar precintos, hash, PRCC.' },
          { id: 'n4__designacion', nombre: 'Designación de Perito', descripcion: 'Asignar perito según especialidad.' },
          { id: 'n4__peritaje', nombre: 'Peritaje', descripcion: 'Valoración, descripción, análisis, interpretación, conclusión.' },
          { id: 'n4__remision', nombre: 'Remisión de Resultados', descripcion: 'Entregar dictamen pericial al solicitante.' },
        ],
      },
      { id: 'n4__fase_judicial', nombre: '3. Fase de Disposición Judicial', descripcion: 'Presentación y valoración ante el tribunal.',
        subetapas: [
          { id: 'n4__resguardo_jud', nombre: 'Resguardo Judicial', descripcion: 'Almacenamiento en áreas del Poder Judicial.' },
          { id: 'n4__exhibicion', nombre: 'Exhibición en Audiencia', descripcion: 'Presentar evidencia cumpliendo protocolo de traslado.' },
        ],
      },
      { id: 'n4__fase_final', nombre: '4. Fase de Disposición Final', descripcion: 'Destino definitivo: devolución, entrega, destrucción o consumo.',
        subetapas: [
          { id: 'n4__devolucion', nombre: 'Devolución/Entrega', descripcion: 'Restituir con autorización judicial.' },
          { id: 'n4__destruccion', nombre: 'Destrucción', descripcion: 'Inutilizar evidencia sin interés con autorización.' },
          { id: 'n4__cierre_prcc', nombre: 'Cierre de PRCC', descripcion: 'Cerrar planilla y remitir al expediente.' },
        ],
      },
    ],
  },
  {
    normativaId: 'n5', codigo: 'ACPO-v5',
    etapas: [
      { id: 'n5__p1', nombre: 'Principio 1', descripcion: 'Ninguna acción debe alterar datos que puedan presentarse ante un tribunal.' },
      { id: 'n5__p2', nombre: 'Principio 2', descripcion: 'Persona competente debe poder explicar acciones y su relevancia.' },
      { id: 'n5__p3', nombre: 'Principio 3', descripcion: 'Documentar y preservar pista de auditoría completa.' },
      { id: 'n5__p4', nombre: 'Principio 4', descripcion: 'El responsable del caso debe asegurar cumplimiento de la ley.' },
    ],
  },
  {
    normativaId: 'n6', codigo: 'LEDI-2001',
    etapas: [
      { id: 'n6__sistemas', nombre: 'Título II – Delitos contra Sistemas', descripcion: 'Acceso indebido, sabotaje, espionaje informático.' },
      { id: 'n6__propiedad', nombre: 'Título III – Delitos contra Propiedad', descripcion: 'Hurto, fraude y obtención indebida de bienes.' },
      { id: 'n6__privacidad', nombre: 'Título IV – Delitos contra Privacidad', descripcion: 'Violación de privacidad de datos y comunicaciones.' },
      { id: 'n6__ninos', nombre: 'Título V – Delitos contra Niños/Adolescentes', descripcion: 'Difusión de material pornográfico infantil.' },
      { id: 'n6__economico', nombre: 'Título VI – Delitos contra Orden Económico', descripcion: 'Apropiación, estafa y otros fraudes electrónicos.' },
    ],
  },
  {
    normativaId: 'n7', codigo: 'LMDF-1999',
    etapas: [
      { id: 'n7__eficacia', nombre: 'Art. 4 – Eficacia Probatoria', descripcion: 'Mensajes de datos tienen misma eficacia probatoria que documentos escritos.' },
      { id: 'n7__firma', nombre: 'Art. 7 – Firma Electrónica', descripcion: 'Valor jurídico equivalente a firma manuscrita.' },
      { id: 'n7__igualdad', nombre: 'Art. 8 – Igualdad de Eficacia', descripcion: 'Documento electrónico = documento escrito a efectos legales.' },
    ],
  },
  {
    normativaId: 'n8', codigo: 'COPP',
    etapas: [
      { id: 'n8__187', nombre: 'Art. 187 – Cadena de Custodia', descripcion: 'Definición legal de cadena de custodia de evidencias.' },
      { id: 'n8__188', nombre: 'Art. 188 – Resguardo', descripcion: 'Obligación de resguardo de evidencias físicas y digitales.' },
      { id: 'n8__202', nombre: 'Art. 202 – Obligatoriedad del Manual', descripcion: 'Carácter vinculante del manual único de cadena de custodia.' },
      { id: 'n8__283', nombre: 'Arts. 283-289 – Licitud de la Prueba', descripcion: 'Régimen de licitud y admisibilidad de pruebas en el proceso judicial.' },
    ],
  },
  {
    normativaId: 'n9', codigo: 'CENIF-2012',
    etapas: [
      { id: 'n9__creacion', nombre: 'Creación del CENIF', descripcion: 'Gaceta N° 39.847 – Centro Nacional de Informática Forense.' },
      { id: 'n9__funciones', nombre: 'Funciones del CENIF', descripcion: 'Peritajes informáticos, capacitación y asesoría técnica al sistema de justicia.' },
      { id: 'n9__competencia', nombre: 'Ámbito de Competencia', descripcion: 'Jurisdicción nacional sobre delitos informáticos y evidencia digital.' },
    ],
  },
  {
    normativaId: 'n10', codigo: 'ISO/IEC 27002:2022',
    etapas: [
      { id: 'n10__organizacionales', nombre: 'Controles Organizacionales', descripcion: 'Políticas, gobernanza y gestión de activos de información.' },
      { id: 'n10__personas', nombre: 'Controles de Personas', descripcion: 'Seguridad en recursos humanos y acuerdos de confidencialidad.' },
      { id: 'n10__fisicos', nombre: 'Controles Físicos', descripcion: 'Seguridad física perimetral y resguardo de la evidencia.' },
      { id: 'n10__tecnologicos', nombre: 'Controles Tecnológicos', descripcion: 'Criptografía, endpoints, monitoreo y borrado seguro de datos.' },
    ],
  },
  {
    normativaId: 'n11', codigo: 'ISO/IEC 27001:2022',
    etapas: [
      { id: 'n11__contexto', nombre: '1. Contexto y Liderazgo', descripcion: 'Definición del alcance del SGSI y compromiso de la alta dirección.' },
      { id: 'n11__planificacion', nombre: '2. Planificación y Soporte', descripcion: 'Evaluación de riesgos y asignación de recursos.' },
      { id: 'n11__operacion', nombre: '3. Operación', descripcion: 'Implementación de planes de tratamiento de riesgos de seguridad.' },
      { id: 'n11__evaluacion', nombre: '4. Evaluación y Mejora', descripcion: 'Auditoría interna, revisión por dirección y mejora continua.' },
    ],
  },
  {
    normativaId: 'n12', codigo: 'Ley de Infogobierno',
    etapas: [
      { id: 'n12__principios', nombre: '1. Principios de Infogobierno', descripcion: 'Uso de estándares abiertos y software libre en entes públicos.' },
      { id: 'n12__seguridad', nombre: '2. Seguridad de la Información', descripcion: 'Garantizar la confidencialidad, integridad y disponibilidad estatal.' },
      { id: 'n12__transparencia', nombre: '3. Transparencia y Acceso', descripcion: 'Facilitar el acceso ciudadano a la información pública.' },
    ],
  },
  {
    normativaId: 'n13', codigo: 'NIST SP 800-86',
    etapas: [
      { id: 'n13__recoleccion', nombre: '1. Recolección de Datos', descripcion: 'Identificación, etiquetado y preservación de fuentes de datos.' },
      { id: 'n13__examen', nombre: '2. Examen', descripcion: 'Procesar grandes volúmenes de datos usando herramientas validadas.' },
      { id: 'n13__analisis', nombre: '3. Análisis', descripcion: 'Derivar conclusiones a partir de los datos analizados.' },
      { id: 'n13__reporte', nombre: '4. Reporte', descripcion: 'Documentar hallazgos y lecciones aprendidas.' },
    ],
  },
  {
    normativaId: 'n14', codigo: 'SUSCERTE-FD',
    etapas: [
      { id: 'n14__firma', nombre: '1. Firma Electrónica', descripcion: 'Verificación de autenticidad e integridad de firmas digitales.' },
      { id: 'n14__custodia', nombre: '2. Cadena de Custodia SUSCERTE', descripcion: 'Normas de embalaje y etiquetado para evidencias digitales.' },
      { id: 'n14__peritos', nombre: '3. Acreditación de Peritos', descripcion: 'Requisitos y registro de peritos informáticos habilitados.' },
    ],
  },
  {
    normativaId: 'n15', codigo: 'LOMP',
    etapas: [
      { id: 'n15__competencia', nombre: '1. Ejercicio de la Acción Penal', descripcion: 'Dirección e inicio de la investigación penal de oficio o denuncia.' },
      { id: 'n15__auxiliares', nombre: '2. Control de Órganos Auxiliares', descripcion: 'Instrucciones técnicas a cuerpos de policía e informáticos.' },
      { id: 'n15__custodia', nombre: '3. Control de Cadena de Custodia', descripcion: 'Vigilancia del cumplimiento del resguardo e integridad de evidencias.' },
    ],
  },
  {
    normativaId: 'n16', codigo: 'Código Civil',
    etapas: [
      { id: 'n16__prueba', nombre: '1. Medios de Prueba', descripcion: 'Documentos públicos, privados y experticias.' },
      { id: 'n16__expertos', nombre: '2. Experticia y Peritos', descripcion: 'Designación, recusación y fuerza probatoria del informe.' },
      { id: 'n16__obligaciones', nombre: '3. Responsabilidad Civil', descripcion: 'Reparación del daño y responsabilidad de profesionales.' },
    ],
  }
];
