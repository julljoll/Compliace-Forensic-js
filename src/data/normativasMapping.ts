export interface NormativaRAGItem {
  codigo: string;
  nombre: string;
  ambito: 'Internacional' | 'Nacional (Venezuela)' | 'Técnico / RFC';
  descripcion: string;
  articuloRelevante: string;
  cumplimientoRequerido: string;
}

export interface EvidenciaNormativaGroup {
  categoriaId: 'movil' | 'computadora' | 'usb' | 'dvd_imagen';
  tituloCategoria: string;
  icono: string;
  normativas: NormativaRAGItem[];
}

export const NORMATIVAS_RAG_MAPPING: Record<string, EvidenciaNormativaGroup> = {
  movil: {
    categoriaId: 'movil',
    tituloCategoria: 'Teléfonos Móviles, WhatsApp y Dispositivos Celulares',
    icono: 'Smartphone',
    normativas: [
      {
        codigo: 'ISO/IEC 27037:2012',
        nombre: 'Directrices para Identificación, Recolección, Adquisición y Preservación de Evidencia Digital',
        ambito: 'Internacional',
        descripcion: 'Define el aislamiento electromagnético (Jaula/Bolsa Faraday) antes del triaje y extracción lógica/física.',
        articuloRelevante: 'Cláusula 6.3 - Adquisición de Dispositivos Móviles en Campo',
        cumplimientoRequerido: 'Embalaje antiestático Faraday, modo avión activado y bloqueo de conexiones de red.'
      },
      {
        codigo: 'NIST SP 800-101 Rev. 1',
        nombre: 'Guidelines on Mobile Device Forensics',
        ambito: 'Internacional',
        descripcion: 'Protocolo de extracción de almacenamiento flash (Android/iOS), parseo de SQLite databases y recuperación de artefactos borrados.',
        articuloRelevante: 'Sección 4.2 - Extractions & Data Storage Analysis',
        cumplimientoRequerido: 'Extracción física/lógica verificada con hashes duales (SHA-256 / MD5).'
      },
      {
        codigo: 'MUCC-2017 (MP-CICPC)',
        nombre: 'Manual Único de Procedimientos en Materia de Cadena de Custodia de Evidencias Físicas',
        ambito: 'Nacional (Venezuela)',
        descripcion: 'Establece la obligatoriedad del llenado inmediato de la Planilla PRCC y el Acta de Obtención por Consignación o Incautación.',
        articuloRelevante: 'Capítulo II - Protocolo de Fijación e Inalterabilidad Dactilar',
        cumplimientoRequerido: 'Planilla PRCC llenada en duplicado con impresiones dactilares y firma del perito.'
      },
      {
        codigo: 'Ley de Delitos Informáticos',
        nombre: 'Ley Especial Contra los Delitos Informáticos (Gaceta Oficial N° 37.313)',
        ambito: 'Nacional (Venezuela)',
        descripcion: 'Regula los delitos de acceso indebido, sabotaje a sistemas y violación de la privacidad de las comunicaciones.',
        articuloRelevante: 'Arts. 6, 7 y 11 (Violación de Privacidad de la Información)',
        cumplimientoRequerido: 'Orden judicial o consentimiento expreso por escrito de la víctima/consignante.'
      },
      {
        codigo: 'LMDFE (G.O. N° 37.076)',
        nombre: 'Ley sobre Mensajes de Datos y Firmas Electrónicas',
        ambito: 'Nacional (Venezuela)',
        descripcion: 'Otorga plena validez y eficacia probatoria a los mensajes de texto, chats de WhatsApp y evidencias electrónicas.',
        articuloRelevante: 'Art. 4 - Eficacia Probatoria de los Mensajes de Datos',
        cumplimientoRequerido: 'Preservación del valor hash de los archivos de base de datos msgstore.db.'
      },
      {
        codigo: 'RFC 3227',
        nombre: 'Guidelines for Evidence Collection and Archiving',
        ambito: 'Técnico / RFC',
        descripcion: 'Prioriza la recolección de memoria RAM volátil antes del apagado o extracción de tarjeta SIM.',
        articuloRelevante: 'Order of Volatility (Memoria RAM > Almacenamiento Flash)',
        cumplimientoRequerido: 'Extracción inicial de datos volátiles antes de desarmar el hardware.'
      }
    ]
  },
  computadora: {
    categoriaId: 'computadora',
    tituloCategoria: 'Análisis de Computadoras, Servidores y Discos Duros',
    icono: 'HardDrive',
    normativas: [
      {
        codigo: 'NIST SP 800-86',
        nombre: 'Guide to Integrating Forensic Techniques into Incident Response',
        ambito: 'Internacional',
        descripcion: 'Estándar para la clonación bit a bit y análisis de sistemas de archivos (NTFS, EXT4, APFS).',
        articuloRelevante: 'Sección 3 - Media Forensics & Bit-Stream Image Acquisition',
        cumplimientoRequerido: 'Uso de FTK Imager o Paladin Linux con validación de Hash SHA-256.'
      },
      {
        codigo: 'ISO/IEC 27042:2015',
        nombre: 'Directrices para el Análisis e Interpretación de Evidencia Digital',
        ambito: 'Internacional',
        descripcion: 'Establece los criterios para el análisis de registros de eventos (Event Logs), registro de Windows y metadatos.',
        articuloRelevante: 'Cláusula 7 - Analysis Framework & Audit Verification',
        cumplimientoRequerido: 'Repetibilidad del análisis en copia de trabajo sin modificar el medio original.'
      },
      {
        codigo: 'ACPO Principles',
        nombre: 'ACPO Good Practice Guide for Digital Evidence',
        ambito: 'Internacional',
        descripcion: '4 Principios fundamentales: Ninguna acción pericial debe modificar los datos contenidos en el medio primario.',
        articuloRelevante: 'Principio 1 y 2 - Preservación de la Prueba Original',
        cumplimientoRequerido: 'Intervención exclusiva sobre copias de trabajo bit a bit.'
      },
      {
        codigo: 'COPP (G.O. N° 6.644)',
        nombre: 'Código Orgánico Procesal Penal Venezolano',
        ambito: 'Nacional (Venezuela)',
        descripcion: 'Norma la admisibilidad de dictámenes periciales en el juicio oral y público.',
        articuloRelevante: 'Art. 225 - Dictamen Pericial Judicial',
        cumplimientoRequerido: 'Elaboración del Acta Dictamen con identificación formal del perito actuante.'
      }
    ]
  },
  usb: {
    categoriaId: 'usb',
    tituloCategoria: 'Medios Extraíbles (USB, Tarjetas SD, Pen Drives)',
    icono: 'Database',
    normativas: [
      {
        codigo: 'ISO/IEC 27037 Sec. 6.2',
        nombre: 'Bloqueo de Escritura en Medios Removibles',
        ambito: 'Internacional',
        descripcion: 'Exige el empleo obligatorio de bloqueadores de escritura por hardware o software (*Write Blockers*).',
        articuloRelevante: 'Sec. 6.2 - Hardware Write-Blocking Protocol',
        cumplimientoRequerido: 'Conexión a través de puerto bloqueado contra escritura.'
      },
      {
        codigo: 'MUCC-2017 (Embalaje)',
        nombre: 'Norma de Rotulado y Precintado de Evidencia Digital',
        ambito: 'Nacional (Venezuela)',
        descripcion: 'Precintado con sobre de evidencia transparente inviolable y firma sobre el sello.',
        articuloRelevante: 'Capítulo IV - Rotulado de Medios Removibles',
        cumplimientoRequerido: 'Asignación de número de planilla PRCC e identificación física en la etiqueta.'
      },
      {
        codigo: 'ISO/IEC 27041:2015',
        nombre: 'Aseguramiento de Idoneidad de Herramientas Forenses',
        ambito: 'Internacional',
        descripcion: 'Valida que el software empleado no altere la estructura de la FAT/exFAT o sistema de archivos del pendrive.',
        articuloRelevante: 'Cláusula 5 - Tool Validation for Removable Media',
        cumplimientoRequerido: 'Uso de software verificado (IPED, FTK Imager, Andriller).'
      }
    ]
  },
  dvd_imagen: {
    categoriaId: 'dvd_imagen',
    tituloCategoria: 'DVD / Blu-Ray / Imágenes Forenses (.E01 / .DD / .ISO)',
    icono: 'Disc',
    normativas: [
      {
        codigo: 'ISO/IEC 27042:2015',
        nombre: 'Validación e Inalterabilidad de Imágenes Forenses',
        ambito: 'Internacional',
        descripcion: 'Norma la preservación de archivos contenedor .E01 (EnCase) o .DD raw respaldados en soporte óptico.',
        articuloRelevante: 'Cláusula 8 - Forensic Image Storage Integrity',
        cumplimientoRequerido: 'Verificación del hash SHA-256 grabado en el soporte óptico con el acta oficial.'
      },
      {
        codigo: 'NIST SP 800-86 Sec. 4',
        nombre: 'Dual Hash Verification Protocol',
        ambito: 'Internacional',
        descripcion: 'Comparación dual del Hash SHA-256 de la imagen ISO/E01 contra el valor registrado en el ingreso al laboratorio.',
        articuloRelevante: 'Dual Hash Integrity Verification',
        cumplimientoRequerido: '100% de coincidencia hexadecimal de 64 caracteres en el reporte.'
      },
      {
        codigo: 'ISO 27001 / 27002',
        nombre: 'Controles de Seguridad de la Información y Almacenamiento Físico',
        ambito: 'Internacional',
        descripcion: 'Condiciones ambientales y físicas para la custodia a largo plazo de discos ópticos periciales.',
        articuloRelevante: 'Control A.11.2 - Physical Media Security',
        cumplimientoRequerido: 'Bóveda de evidencias con temperatura controlada y acceso restringido.'
      }
    ]
  }
};
