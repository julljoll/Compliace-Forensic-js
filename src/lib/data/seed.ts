/**
 * SHA256.US — Datos semilla (normativas del RAG y expedientes de demostración).
 * Migrados íntegramente desde legacy cmsStore.ts.
 */
import type { CasoCMS, Normativa } from '../domain/types';

// ─── Datos Iniciales (Normativas del RAG) ─────────────────────────────────────

export const NORMATIVAS_INICIALES: Normativa[] = [
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
    nombre: 'Manual Único de Cadena de Custodia de Evidencias Físicas y Digitales',
    descripcion: 'Manual Único de Cadena de Custodia de Evidencias Físicas y Digitales de la República Bolivariana de Venezuela, elaborado conjuntamente por el MPPRIJP, Ministerio Público, CICPC y GNB, publicado en Gaceta Oficial N° 41.247 (septiembre 2017). Es de obligatorio cumplimiento para todos los órganos de investigación penal y laboratorios forenses. Concibe la Cadena de Custodia como un sistema integral articulado en 4 Fases (Inicial, Laboratorio, Disposición Judicial y Disposición Final), 4 Modalidades de Obtención (Técnica, Aseguramiento, Consignación y Derivación) y 3 Figuras de Carácter Continuo (Resguardo Temporal, Traslado y Transferencia). Exige el llenado ininterrumpido de la Planilla PRCC, etiquetado formal y uso de precintos numéricos de alta seguridad.',
    version: 'Gaceta Oficial N° 41.247 (29/09/2017)', fechaVigencia: '2017-09-29', activa: true,
    urlReferencia: 'normativas_rag/Informatica/MANUAL_ÚNICO_DE_CADENA DE_CUSTODIA_DE_EVIDENCIAS_(VERSIÓN_FINAL_29SEP17).md',
    articulos: [
      'Fase 1: Obtención Técnica en Sitio del Suceso (Fijación, Colección, Embalaje y Rotulación)',
      'Fase 1: Modalidades de Obtención (Técnica, Aseguramiento, Consignación y Derivación)',
      'Fase 1: Procedimiento Obligatorio de Registro en Planilla PRCC',
      'Fase 2: Peritación en Laboratorio (Recepción, Apertura de Precinto, Designación de Peritos, Peritaje y Remisión)',
      'Fase 3: Disposición Judicial (Resguardo Judicial y Exhibición en Audiencia)',
      'Fase 4: Disposición Final (Devolución, Entrega, Destrucción y Consumida en Peritaje)',
      'Figura de Carácter Continuo: Proceso de Resguardo Temporal y Depósito de Evidencias',
      'Figura de Carácter Continuo: Procedimiento de Traslado con Embalaje de Seguridad',
      'Figura de Carácter Continuo: Actividad de Transferencia y Traspaso Formal entre Custodios'
    ]
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
  },
  {
    id: 'n24', codigo: 'PERITAJE-MANUAL', tipo: 'MANUAL',
    nombre: 'Manual del Perito Informático Forense en el Proceso Penal y Civil',
    descripcion: 'Tratado de metodología pericial y criminalística digital. Define las reglas de actuación del experto informático forense en el levantamiento de evidencias, valoración de la prueba digital, técnicas de preservación sin contaminación de muestras y estructura de rendición del dictamen pericial en sala de juicio conforme al estándar Daubert.',
    version: '2024', fechaVigencia: '2024-02-01', activa: true,
    urlReferencia: 'normativas_rag/Informatica/el peritaje informático.md',
    articulos: ['Acreditación de Idoneidad', 'Metodología Pericial', 'Rendición de Dictamen', 'Cadena de Custodia']
  },
  {
    id: 'n25', codigo: 'CRIM-DIN', tipo: 'REGLAMENTO',
    nombre: 'Criminología Digital y Metodología de la Evidencia Informática',
    descripcion: 'Compendio doctrinario y normativo sobre la ciencia de la criminología aplicada al entorno digital. Regula los patrones de conducta en la comisión de ciberdelitos, perfilamiento de sospechosos, preservación de trazas en redes y análisis de causalidad tecnológica en entornos corporativos.',
    version: '2023', fechaVigencia: '2023-11-15', activa: true,
    urlReferencia: 'normativas_rag/Informatica/LA_CRIMINOLOGÍA_UNA_CIENCIA_DINAMICA.md',
    articulos: ['Profilaxis Criminal', 'Comportamiento en Redes', 'Análisis Causal', 'Fijación de Trazas']
  },
  {
    id: 'n26', codigo: 'NORM-ECO-DIG', tipo: 'REGLAMENTO',
    nombre: 'Normalización y Estandarización de Pruebas en Economía Digital',
    descripcion: 'Normas y recomendaciones técnicas para la auditoría y peritaje de transacciones en la economía digital, blockchain, contratos inteligentes y activos criptográficos. Establece directrices para la preservación de bitácoras contables digitales e integridad de libros electrónicos.',
    version: '2024', fechaVigencia: '2024-03-20', activa: true,
    urlReferencia: 'normativas_rag/Informatica/Normalizacion_economia_digital.md',
    articulos: ['Trazabilidad Financiera', 'Contratos Inteligentes', 'Libros Electrónicos', 'Auditoría Criptográfica']
  },
  {
    id: 'n27', codigo: 'CYB-DELITOS', tipo: 'LEY',
    nombre: 'Marco Comparado de Ciberseguridad y Derecho Penal Informático',
    descripcion: 'Estudio y sistematización de legislación comparada en ciberdelincuencia, Convenio de Budapest y adecuación procesal venezolana. Define tipos penales cibernéticos, cooperación internacional en evidencia transfronteriza y extracción remota autorizada.',
    version: '2023', fechaVigencia: '2023-09-10', activa: true,
    urlReferencia: 'normativas_rag/Informatica/cyb_ecu_delitos_inform.md',
    articulos: ['Convenio de Budapest', 'Delitos Transfronterizos', 'Cooperación Internacional', 'Evidencia Remota']
  },
  {
    id: 'n28', codigo: 'BIBLIO-FORENSE', tipo: 'MANUAL',
    nombre: 'Compendio Doctrinario y Bibliográfico de Informática Forense',
    descripcion: 'Reopilación bibliográfica, jurisprudencial y doctrinal en materia de prueba digital. Reúne sentencias de la Sala de Casación Penal y Constitucional del Tribunal Supremo de Justicia (TSJ) sobre la admisibilidad de mensajes WhatsApp, correos y registros de auditoría.',
    version: '2024', fechaVigencia: '2024-06-01', activa: true,
    urlReferencia: 'normativas_rag/Informatica/borrador para lista de leyes-bibliografias.md',
    articulos: ['Jurisprudencia TSJ', 'Admisibilidad de WhatsApp', 'Valoración Probatoria', 'Doctrina Pericial']
  }
];

export const MOCK_CASOS: CasoCMS[] = [
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
    solicitante_nombre: 'Lt. Col. Joseph Gomez',
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
