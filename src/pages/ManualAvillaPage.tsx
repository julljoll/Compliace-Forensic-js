/**
 * ManualAvillaForensics — Manual Operativo Completo
 * Consignación Forense de Dispositivo Móvil Android
 *
 * Cubre el proceso completo: Consignación → Extracción con Avilla →
 * Imagen Forense → Análisis → Documentación → Presentación Judicial
 *
 * Normativa aplicable:
 *  - Art. 187 y 225 COPP (Venezuela)
 *  - Manual Único de Cadena de Custodia Venezuela 2017 (actualizado 2022)
 *  - ISO/IEC 27037:2012, ISO/IEC 27041:2015, ISO/IEC 27042:2015
 *  - Decreto con Fuerza de Ley sobre Mensajes de Datos y Firmas Electrónicas
 *
 * Stack: React + TypeScript + Tailwind CSS (Vite/Electron)
 * Integración: Se usa como ManualAvillaPage.tsx en el CMS
 */

import { useState, useEffect, useCallback } from 'react';
import {
  CheckCircle2, Circle, ChevronDown, ChevronUp, Terminal,
  Shield, Lock, Camera, Smartphone, Database, FileText,
  AlertTriangle, Copy, CheckCheck, Gavel, Hash,
  BookOpen, Fingerprint, Package, Scale, Eye, Mic,
  ImageIcon, Archive, TrendingUp, Info, Zap, RotateCcw
} from '../components/atoms/AppleIcon';

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTES Y TIPOS
// ─────────────────────────────────────────────────────────────────────────────

const LS_KEY = 'manual_avilla_progress_v2';

type NormativaTag = {
  label: string;
  color: 'cyan' | 'green' | 'yellow' | 'red' | 'purple';
};

type Advertencia = {
  titulo: string;
  cuerpo: string;
  nivel: 'warning' | 'critical' | 'info';
};

type Paso = {
  id: string;
  numero: string;
  titulo: string;
  descripcion: string;
  items?: string[];
  codigo?: { lang: string; contenido: string }[];
  normativas?: NormativaTag[];
  advertencias?: Advertencia[];
  icono: typeof Shield;
};

type Fase = {
  id: string;
  numero: number;
  titulo: string;
  subtitulo: string;
  icono: typeof Shield;
  color: string;        // clase Tailwind para el color principal
  glowColor: string;    // rgba para box-shadow
  pasos: Paso[];
};

// ─────────────────────────────────────────────────────────────────────────────
// DATOS — 7 FASES COMPLETAS (0 – 6)
// ─────────────────────────────────────────────────────────────────────────────

const FASES: Fase[] = [
  // ══════════════════════════════════════════════════════════════════
  // FASE 0 — PRE-RECEPCIÓN Y CONSIGNACIÓN
  // ══════════════════════════════════════════════════════════════════
  {
    id: 'f0',
    numero: 0,
    titulo: 'Pre-Recepción y Consignación',
    subtitulo: 'Documentación legal antes de tocar el dispositivo',
    icono: FileText,
    color: 'text-[#007AFF]',
    glowColor: 'rgba(0,122,255,0.15)',
    pasos: [
      {
        id: 'f0p1',
        numero: '0.1',
        titulo: 'Acta de Consignación Voluntaria',
        descripcion:
          'Antes de recibir físicamente el dispositivo, se debe redactar y firmar el Acta de Consignación. Este documento es la base legal de toda la cadena de custodia.',
        items: [
          'Identidad completa del consignante: nombre, cédula, carácter con que actúa (propietario, representante legal, apoderado)',
          'Descripción física del dispositivo: marca, modelo, IMEI 1 y IMEI 2 (marcado en dispositivo o en caja), color y estado físico observable',
          'Fotografías del dispositivo ANTES de encenderlo — mínimo 4 ángulos (frontal, trasero, laterales) + pantalla apagada',
          'Verificar nivel de batería (mínimo 80% recomendado; si es inferior, conectar a corriente con cable del perito — nunca del dueño)',
          'Activar Modo Avión INMEDIATAMENTE después de recibir el dispositivo — antes de cualquier conexión',
          'Firma del acta por el consignante y el perito con fecha y hora exacta (HH:MM Venezuela)',
          'Presencia de testigo si el proceso es en sede judicial o ante Notario Público',
        ],
        normativas: [
          { label: 'Art. 187 COPP', color: 'cyan' },
          { label: 'MUCC-2017', color: 'green' },
          { label: 'ISO 27037 §6', color: 'purple' },
        ],
        advertencias: [
          {
            titulo: 'Modo Avión es OBLIGATORIO e INMEDIATO',
            cuerpo:
              'El dispositivo debe pasar a Modo Avión en el momento de la entrega física. Cualquier conexión a red puede desencadenar un borrado remoto (remote wipe) o alterar datos. Documente fotográficamente la pantalla con el ícono de Modo Avión visible.',
            nivel: 'critical',
          },
          {
            titulo: 'NUNCA use cable del propietario',
            cuerpo:
              'El cable de carga y el cargador deben ser del perito — equipo forense estéril. El cable del propietario puede contener firmware malicioso (O.MG cable) o transferir datos involuntariamente.',
            nivel: 'warning',
          },
        ],
        icono: FileText,
      },
      {
        id: 'f0p2',
        numero: '0.2',
        titulo: 'Etiquetado y Rotulado de Evidencia',
        descripcion:
          'Toda evidencia debe etiquetarse de forma inmediata y permanente antes de ser almacenada. El rótulo es su identidad legal durante todo el proceso.',
        items: [
          'Número de caso asignado (ej: CASO-2025-001)',
          'Número de evidencia única (ej: EV-001-2025)',
          'Fecha y hora exacta de recepción (Formato: DD/MM/AAAA HH:MM VET)',
          'Nombre completo y firma del perito receptor',
          'Descripción breve del objeto: "Teléfono inteligente Samsung Galaxy A32 color negro"',
          'Estado de los sellos al momento de la recepción',
          'Colocar dispositivo en bolsa de evidencia antiestática y sellar con firma en el sello',
        ],
        normativas: [
          { label: 'MUCC-2017 §Rotulado', color: 'green' },
          { label: 'ISO 27037 §7', color: 'purple' },
        ],
        icono: Package,
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════
  // FASE 1 — PREPARACIÓN DEL ENTORNO FORENSE
  // ══════════════════════════════════════════════════════════════════
  {
    id: 'f1',
    numero: 1,
    titulo: 'Preparación del Entorno Forense',
    subtitulo: 'Workstation, herramientas y configuración del dispositivo',
    icono: Terminal,
    color: 'text-[#34C759]',
    glowColor: 'rgba(52,199,89,0.15)',
    pasos: [
      {
        id: 'f1p1',
        numero: '1.1',
        titulo: 'Verificación de la Workstation Forense',
        descripcion:
          'El entorno de trabajo debe ser controlado, documentado y reproducible. Cualquier falla en la workstation puede invalidar la evidencia.',
        items: [
          'Sistema operativo: Ubuntu 22.04 LTS / Kali Linux 2024 o Windows 10/11 Pro x64',
          'Avilla Forensics versión actualizada — descargar de github.com/AvillaDaniel/AvillaForensics',
          'ADB (Android Debug Bridge) instalado y en PATH del sistema',
          'Drivers del fabricante instalados (Samsung Odin, MediaTek, Qualcomm según el dispositivo)',
          'Cable USB de datos verificado — probar con `adb devices` en dispositivo conocido',
          'Disco duro externo o partición dedicada: nueva, formateada, sin datos previos (formato NTFS o ext4)',
          'Herramienta de hash: sha256sum (Linux/macOS), CertUtil o PowerShell Get-FileHash (Windows)',
          'Conexión a internet DESACTIVADA en la workstation durante la extracción',
          'Antivirus DESACTIVADO temporalmente para evitar interferencia con archivos extraídos',
        ],
        codigo: [
          {
            lang: 'bash',
            contenido:
              '# Verificar ADB instalado correctamente\nadb version\n\n# Listar dispositivos conectados\nadb devices -l\n\n# El resultado esperado:\n# List of devices attached\n# RF8M123ABC device  transport_id:1\n\n# Si aparece "unauthorized" → revisar paso 1.2',
          },
          {
            lang: 'powershell',
            contenido:
              '# Windows: Verificar sha256 disponible\nGet-FileHash -Algorithm SHA256 C:\\Windows\\System32\\notepad.exe\n# Debe retornar un hash de 64 caracteres hexadecimales',
          },
        ],
        normativas: [
          { label: 'ISO 27037 §8', color: 'purple' },
          { label: 'NIST SP 800-101', color: 'cyan' },
        ],
        icono: Terminal,
      },
      {
        id: 'f1p2',
        numero: '1.2',
        titulo: 'Activación de Opciones de Desarrollador en el Dispositivo',
        descripcion:
          'Para que ADB pueda conectarse al dispositivo, se deben habilitar las opciones de desarrollador. Este proceso debe documentarse fotográficamente en cada paso.',
        items: [
          'Ir a: Ajustes → Acerca del teléfono → Número de compilación',
          'Tocar "Número de compilación" exactamente 7 veces hasta ver "Ahora eres un desarrollador"',
          'Ir a: Ajustes → Opciones de Desarrollador → activar "Depuración USB"',
          'Conectar el dispositivo a la workstation forense mediante cable USB',
          'En la pantalla del dispositivo aparecerá: "¿Permitir la depuración USB?" → Marcar "Permitir siempre desde este equipo" → Aceptar',
          'Ejecutar `adb devices` — el dispositivo debe aparecer como "device" (NO "unauthorized")',
          'Fotografiar: (a) la pantalla con Depuración USB activada, (b) el mensaje de autorización, (c) la salida de `adb devices`',
        ],
        codigo: [
          {
            lang: 'bash',
            contenido:
              '# Verificar que el dispositivo está correctamente autorizado\nadb devices -l\n\n# Obtener información del dispositivo para el acta\nadb shell getprop ro.product.brand\nadb shell getprop ro.product.model\nadb shell getprop ro.product.device\nadb shell getprop gsm.imei\nadb shell getprop ro.build.version.release\n\n# Ver almacenamiento disponible\nadb shell df -h /data /sdcard',
          },
        ],
        normativas: [
          { label: 'ISO 27037 §8.2', color: 'purple' },
          { label: 'MUCC-2017', color: 'green' },
        ],
        advertencias: [
          {
            titulo: 'Documentación fotográfica obligatoria en CADA paso',
            cuerpo:
              'Fotografiar cada pantalla del dispositivo durante la configuración. Estas fotos forman parte del expediente técnico y demuestran que el proceso se realizó correctamente y sin alteración de datos.',
            nivel: 'warning',
          },
        ],
        icono: Smartphone,
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════
  // FASE 2 — EXTRACCIÓN CON AVILLA FORENSICS
  // ══════════════════════════════════════════════════════════════════
  {
    id: 'f2',
    numero: 2,
    titulo: 'Extracción con Avilla Forensics',
        subtitulo: 'APK Downgrade multi-app, WhatsApp DB, multimedia y almacenamiento interno',
    icono: Database,
    color: 'text-[#30B0C7]',
    glowColor: 'rgba(48,176,199,0.15)',
    pasos: [
      {
        id: 'f2p1',
        numero: '2.1',
        titulo: 'Apertura y Configuración Inicial de Avilla Forensics',
        descripcion:
          'Avilla Forensics debe ejecutarse con permisos de administrador. La carpeta de destino debe seguir una nomenclatura estándar que permita identificar el caso de forma inequívoca.',
        items: [
          'Ejecutar Avilla Forensics como Administrador (clic derecho → Ejecutar como administrador)',
          'Verificar que el dispositivo aparece en la lista de dispositivos detectados',
          'Crear carpeta de destino con nomenclatura estándar antes de iniciar',
          'Nomenclatura: CASO-[numero]_[IMEI]_[YYYYMMDD]',
          'Ejemplo: CASO-2025-001_359123456789_20250520',
          'NUNCA usar el Escritorio como destino — usar unidad forense dedicada (D:\\ o /mnt/forense/)',
          'Verificar espacio disponible: mínimo 3x el tamaño del almacenamiento del dispositivo',
        ],
        codigo: [
          {
            lang: 'bash',
            contenido:
              '# Crear estructura de carpetas del caso (Linux)\nmkdir -p /mnt/forense/CASO-2025-001_359123456789_20250520/{\n  01_Extraccion_Avilla,\n  02_Hash_Verificacion,\n  03_Imagen_Forense,\n  04_Analisis,\n  05_Dictamen\n}\n\necho "Estructura creada: $(date)" >> /mnt/forense/CASO-2025-001_359123456789_20250520/BITACORA.txt',
          },
          {
            lang: 'powershell',
            contenido:
              '# Crear estructura de carpetas del caso (Windows)\n$caso = "D:\\ForensicAcq\\CASO-2025-001_359123456789_20250520"\n@("01_Extraccion_Avilla","02_Hash_Verificacion","03_Imagen_Forense","04_Analisis","05_Dictamen") | ForEach-Object {\n  New-Item -ItemType Directory -Path "$caso\\$_" -Force\n}\nAdd-Content "$caso\\BITACORA.txt" "Estructura creada: $(Get-Date -Format \'dd/MM/yyyy HH:mm\')"',
          },
        ],
        normativas: [
          { label: 'ISO 27037 §8.3', color: 'purple' },
          { label: 'MUCC-2017', color: 'green' },
        ],
        icono: Database,
      },
      {
        id: 'f2p2',
        numero: '2.2',
        titulo: 'Módulo APK Downgrade para WhatsApp y otras apps',
        descripcion:
          'Avilla Forensics aplica técnicas de downgrade de APK sobre diversas aplicaciones para extraer datos de sus zonas privadas sin necesidad de root. En WhatsApp, esto permite acceder a la base de datos cifrada (Crypt15/Crypt14) y descifrarla. También es compatible con Telegram, Signal, y otras apps de mensajería.',
        items: [
          'En Avilla Forensics: seleccionar módulo "APK Downgrade / App Extraction" según la app objetivo',
          'El módulo desinstala la versión actual de la app e instala una versión legacy compatible con ADB Backup',
          'WhatsApp: extrae msgstore.db.crypt15 (o .crypt14), clave en WhatsApp/files/key, y medios en WhatsApp/Media/',
          'Telegram/Signal: extrae bases de datos SQLite de su sandbox en /data/data/ (sin cifrado adicional)',
          'Avilla descifra automáticamente las bases de datos usando las claves extraídas',
          'Resultado final: bases de datos SQLite limpias + estructura completa de medios por app',
          'Fotografiar la pantalla de Avilla mostrando "Extracción completada" con el log visible',
          'IMPORTANTE: sin permisos root, el alcance se limita a apps que soportan ADB Backup — los datos extraídos son menores que con acceso root',
        ],
        normativas: [
          { label: 'ISO 27037', color: 'purple' },
          { label: 'NIST SP 800-101', color: 'cyan' },
        ],
        advertencias: [
          {
            titulo: 'El APK Downgrade requiere consentimiento documentado',
            cuerpo:
              'El proceso de Downgrade es irreversible para esa instalación — la app afectada queda en versión legacy hasta que el usuario la actualice manualmente. Debe constar en el Acta de Consignación que el propietario consiente en este procedimiento técnico.',
            nivel: 'critical',
          },
          {
            titulo: 'Conservar SIEMPRE los archivos cifrados originales',
            cuerpo:
              'Los archivos cifrados originales (msgstore.db.crypt15, key, etc.) deben conservarse en carpeta separada "01_Extraccion_Original_Cifrada" y NUNCA eliminarse. Son la prueba de que la extracción partió de datos cifrados auténticos.',
            nivel: 'warning',
          },
          {
            titulo: 'Sin root: alcance limitado',
            cuerpo:
              'Sin permisos root en el dispositivo, Avilla solo puede acceder a datos de apps que soportan ADB Backup. Muchas aplicaciones modernas (bancos, algunas versiones de Signal) bloquean ADB Backup. En esos casos, los datos extraídos serán significativamente menores. Documentar siempre el nivel de acceso obtenido.',
            nivel: 'warning',
          },
        ],
        icono: Lock,
      },
      {
        id: 'f2p3',
        numero: '2.3',
        titulo: 'Extracción de Almacenamiento Interno',
        descripcion:
          'Además de las apps de mensajería, se extrae el contenido relevante del almacenamiento interno: capturas de pantalla, galería, registros de llamadas y contactos. Sin permisos root, el acceso es limitado a rutas accesibles vía ADB (no se puede acceder a /data/data/ directamente).',
        items: [
          'En Avilla Forensics: seleccionar módulo "Internal Storage Extraction"',
          'Extrae capturas de pantalla: DCIM/Screenshots/',
          'Extrae galería de imágenes: DCIM/Camera/ y Pictures/',
          'Extrae registros de llamadas y contactos (formato XML o CSV según el fabricante)',
          'Tiempo estimado de extracción: 15-45 minutos según volumen de datos',
          'Durante la extracción: NO usar el dispositivo, NO desconectar el cable, NO apagar la pantalla',
          'Monitorear el log de Avilla para detectar errores o archivos omitidos',
          'Si Avilla no puede acceder a ciertas rutas (sin root), complementar con adb pull manual sobre directorios accesibles',
        ],
        codigo: [
          {
            lang: 'bash',
            contenido:
              '# Extracción manual complementaria via ADB (si Avilla falla algún módulo)\n\n# Capturas de pantalla\nadb pull /sdcard/DCIM/Screenshots/ ./Screenshots_Manual/\n\n# Imágenes de WhatsApp\nadb pull "/sdcard/Android/media/com.whatsapp/WhatsApp/Media/WhatsApp Images/" ./WA_Imagenes/\n\n# Notas de voz WhatsApp\nadb pull "/sdcard/Android/media/com.whatsapp/WhatsApp/Media/WhatsApp Voice Notes/" ./WA_Audios/\n\n# Registros de llamadas (si accesible)\nadb shell content query --uri content://call_log/calls --projection number,duration,date,type',
          },
        ],
        normativas: [
          { label: 'ISO 27037 §8.4', color: 'purple' },
        ],
        icono: Archive,
      },
      {
        id: 'f2p4',
        numero: '2.4',
        titulo: 'Verificación de Extracción Exitosa',
        descripcion:
          'Antes de continuar, verificar que todos los archivos críticos están presentes y accesibles. Un error no detectado aquí puede invalidar todo el proceso posterior.',
        items: [
          'Confirmar existencia del archivo msgstore.db en la carpeta de destino',
          'Abrir msgstore.db con DB Browser for SQLite — verificar que la tabla "messages" existe y tiene registros',
          'Revisar el log completo de Avilla Forensics en busca de errores (texto rojo o "FAILED")',
          'Verificar que la carpeta WhatsApp/Media/ tiene las subcarpetas esperadas (Images, Voice Notes, etc.)',
          'Fotografiar la pantalla de Avilla con el resumen de extracción visible',
          'Si hay errores: documentarlos, intentar módulo alternativo, o dejar constancia en el acta',
          'Calcular el número total de archivos extraídos: `find ./extraccion/ -type f | wc -l`',
        ],
        codigo: [
          {
            lang: 'bash',
            contenido:
              '# Verificar estructura de extracción\nfind ./CASO-2025-001_359123456789_20250520/01_Extraccion_Avilla/ -type f | sort > listado_archivos.txt\necho "Total archivos: $(wc -l < listado_archivos.txt)"\n\n# Verificar tamaño total\ndu -sh ./CASO-2025-001_359123456789_20250520/01_Extraccion_Avilla/\n\n# Verificar que msgstore.db no está cifrado (debe tener cabecera SQLite)\nfile ./01_Extraccion_Avilla/msgstore.db\n# Resultado esperado: SQLite 3.x database',
          },
        ],
        normativas: [
          { label: 'ISO 27041:2015', color: 'purple' },
          { label: 'MUCC-2017', color: 'green' },
        ],
        icono: Eye,
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════
  // FASE 3 — CREACIÓN DE IMAGEN FORENSE
  // ══════════════════════════════════════════════════════════════════
  {
    id: 'f3',
    numero: 3,
    titulo: 'Imagen Forense e Integridad SHA-256',
    subtitulo: 'Sellado criptográfico conforme a ISO/IEC 27037:2012',
    icono: Hash,
    color: 'text-[#FF9500]',
    glowColor: 'rgba(255,149,0,0.15)',
    pasos: [
      {
        id: 'f3p1',
        numero: '3.1',
        titulo: 'Generación del Hash SHA-256 PREVIO (Estado Original)',
        descripcion:
          'El hash SHA-256 pre-imagen es el "sello criptográfico de origen". Se calcula sobre la carpeta de extracción completa ANTES de crear la imagen. Este valor se registra en el Acta de Integridad y NUNCA debe modificarse.',
        items: [
          'Calcular SHA-256 de cada archivo individual en la carpeta de extracción',
          'Guardar el resultado en archivo: HASH_PRE_IMAGEN_[YYYYMMDD_HHMM].txt',
          'Este archivo de hashes es el "sello de integridad inicial"',
          'Principio aplicado: ISO/IEC 27037:2012 §8.1 — Identificación y Recolección',
          'El hash debe calcularse con la workstation SIN conexión a internet',
          'Registrar fecha, hora exacta y versión del software usado para el cálculo',
        ],
        codigo: [
          {
            lang: 'bash',
            contenido:
              '# Linux/macOS — Calcular SHA-256 de TODOS los archivos\ncd /mnt/forense/CASO-2025-001_359123456789_20250520/01_Extraccion_Avilla/\n\n# Generar hash de cada archivo y guardar en texto\nfind . -type f -exec sha256sum {} \\; | sort > ../02_Hash_Verificacion/HASH_PRE_IMAGEN_$(date +%Y%m%d_%H%M).txt\n\n# Verificar que el archivo se generó correctamente\nwc -l ../02_Hash_Verificacion/HASH_PRE_IMAGEN_*.txt\necho "Hash generado en: $(date)"',
          },
          {
            lang: 'powershell',
            contenido:
              '# Windows — Calcular SHA-256 de todos los archivos\n$carpeta = "D:\\ForensicAcq\\CASO-2025-001_359123456789_20250520\\01_Extraccion_Avilla"\n$salida  = "D:\\ForensicAcq\\CASO-2025-001_359123456789_20250520\\02_Hash_Verificacion"\n$fecha   = Get-Date -Format "yyyyMMdd_HHmm"\n\nGet-ChildItem -Path $carpeta -Recurse -File |\n  Get-FileHash -Algorithm SHA256 |\n  Select-Object Hash, Path |\n  Export-Csv "$salida\\HASH_PRE_IMAGEN_$fecha.csv" -NoTypeInformation\n\nWrite-Host "Hash generado: $(Get-Date)"',
          },
        ],
        normativas: [
          { label: 'ISO 27037 §8.1', color: 'purple' },
          { label: 'Art. 187 COPP', color: 'cyan' },
        ],
        advertencias: [
          {
            titulo: 'El hash pre-imagen es inmutable — NUNCA modificar',
            cuerpo:
              'El archivo HASH_PRE_IMAGEN_*.txt/csv es la prueba de integridad original. Debe guardarse en ubicación separada (segunda unidad de almacenamiento) y su hash propio también debe calcularse para demostrar que no fue alterado.',
            nivel: 'critical',
          },
        ],
        icono: Hash,
      },
      {
        id: 'f3p2',
        numero: '3.2',
        titulo: 'Creación de Imagen Forense Empaquetada',
        descripcion:
          'Para la extracción lógica con Avilla Forensics, la carpeta de extracción es la evidencia primaria. Se crea una imagen empaquetada con hash integrado que puede ser verificada en cualquier momento.',
        items: [
          'Comprimir la carpeta de extracción en un archivo ZIP con contraseña forense documentada',
          'Generar hash SHA-256 del archivo ZIP resultante — este es el "hash de imagen"',
          'Alternativa con FTK Imager (gratuito): File → Add Evidence Item → Logical Drive → formato E01 con SHA256',
          'Alternativa con 7-Zip: comprimir con AES-256 y generar hash del resultado',
          'La contraseña del ZIP debe consignarse en el acta de custodia en sobre sellado',
          'Guardar la imagen en la partición de trabajo (Copia 1)',
        ],
        codigo: [
          {
            lang: 'bash',
            contenido:
              '# Crear imagen ZIP con integridad SHA-256 integrada\ncd /mnt/forense/CASO-2025-001_359123456789_20250520/\n\n# Crear ZIP (requiere zip instalado)\nzip -r -9 "03_Imagen_Forense/IMAGEN_FORENSE_CASO2025001_$(date +%Y%m%d).zip" \\\n    "01_Extraccion_Avilla/"\n\n# Calcular SHA-256 del ZIP creado\nsha256sum "03_Imagen_Forense/IMAGEN_FORENSE_CASO2025001_$(date +%Y%m%d).zip" \\\n    > "02_Hash_Verificacion/HASH_IMAGEN_FORENSE.sha256"\n\ncat "02_Hash_Verificacion/HASH_IMAGEN_FORENSE.sha256"',
          },
        ],
        normativas: [
          { label: 'ISO 27037 §8.3', color: 'purple' },
          { label: 'ISO 27041:2015', color: 'purple' },
        ],
        icono: Archive,
      },
      {
        id: 'f3p3',
        numero: '3.3',
        titulo: 'Verificación de Integridad POST-Imagen',
        descripcion:
          'Recalcular el hash de la imagen creada y comparar con el hash pre-imagen. Esta verificación garantiza que el proceso de empaquetado no alteró ningún dato.',
        items: [
          'Recalcular SHA-256 del archivo de imagen creado',
          'Comparar carácter por carácter con el hash registrado en el paso 3.2',
          'Ambos hashes DEBEN ser idénticos — cualquier diferencia invalida la imagen',
          'Documentar la comparación en el "Acta de Integridad de Evidencia Digital"',
          'El acta debe incluir: hash pre-imagen, hash imagen, fecha y hora del cálculo, resultado (ÍNTEGRO/FALLIDO)',
        ],
        codigo: [
          {
            lang: 'bash',
            contenido:
              '# Verificar integridad de la imagen generada\nsha256sum -c "02_Hash_Verificacion/HASH_IMAGEN_FORENSE.sha256"\n\n# Resultado esperado:\n# 03_Imagen_Forense/IMAGEN_FORENSE_CASO2025001_20250520.zip: OK\n\n# Si dice "FAILED" → la imagen está corrupta → repetir proceso',
          },
          {
            lang: 'powershell',
            contenido:
              '# Windows: comparar hashes manualmente\n$hashOriginal = (Get-Content "02_Hash_Verificacion\\HASH_IMAGEN_FORENSE.sha256").Split(" ")[0]\n$hashActual   = (Get-FileHash "03_Imagen_Forense\\IMAGEN_FORENSE_CASO2025001_20250520.zip" -Algorithm SHA256).Hash\n\nif ($hashOriginal.ToUpper() -eq $hashActual.ToUpper()) {\n  Write-Host "✅ ÍNTEGRO: Los hashes coinciden" -ForegroundColor Green\n} else {\n  Write-Host "❌ FALLO: Los hashes NO coinciden" -ForegroundColor Red\n}',
          },
        ],
        normativas: [
          { label: 'ISO 27041:2015', color: 'purple' },
          { label: 'Art. 225 COPP', color: 'cyan' },
        ],
        advertencias: [
          {
            titulo: 'Si los hashes NO coinciden: detener el proceso',
            cuerpo:
              'Una discrepancia en los hashes pre/post imagen indica corrupción o alteración de datos. El proceso debe detenerse, documentarse exhaustivamente y comunicarse al fiscal. NO presentar evidencia con hashes que no coincidan.',
            nivel: 'critical',
          },
        ],
        icono: Shield,
      },
      {
        id: 'f3p4',
        numero: '3.4',
        titulo: 'Duplicado de la Imagen Forense — Regla 3-2-1',
        descripcion:
          'La regla de custodia 3-2-1 exige tres copias de la evidencia digital en al menos dos soportes físicos distintos, con una copia en posesión del solicitante.',
        items: [
          'Copia 1 (Trabajo): Disco duro del perito — para análisis activo',
          'Copia 2 (Resguardo): Disco duro adicional guardado en lugar seguro — NO para trabajo',
          'Copia 3 (Cliente): Entregada al solicitante en disco duro o USB en sobre sellado y firmado',
          'Cada copia incluye: la imagen ZIP + el archivo .sha256 de verificación',
          'Registro en el acta de cadena de custodia de cada transferencia con firma y fecha',
          'La copia 3 debe entregarse con documento de recepción firmado por el solicitante',
        ],
        normativas: [
          { label: 'MUCC-2017 §Resguardo', color: 'green' },
          { label: 'ISO 27037 §9', color: 'purple' },
        ],
        icono: Package,
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════
  // FASE 4 — ANÁLISIS Y VALIDACIÓN DE EVIDENCIAS
  // ══════════════════════════════════════════════════════════════════
  {
    id: 'f4',
    numero: 4,
    titulo: 'Análisis y Validación de Evidencias',
    subtitulo: 'Mensajes, imágenes, audios .opus y capturas de pantalla',
    icono: Eye,
    color: 'text-[#007AFF]',
    glowColor: 'rgba(0,122,255,0.15)',
    pasos: [
      {
        id: 'f4p1',
        numero: '4.1',
        titulo: 'Análisis de Mensajes WhatsApp (msgstore.db)',
        descripcion:
          'La base de datos SQLite descifrada contiene la historia completa de mensajes. El análisis debe realizarse sobre una copia de trabajo — NUNCA sobre el archivo original.',
        items: [
          'Herramienta: DB Browser for SQLite (gratuito, open source)',
          'Tabla principal: "messages" — campos clave: _id, key_remote_jid, data, timestamp, status',
          'Campo "key_remote_jid": identifica el chat (número@s.whatsapp.net o grupo@g.us)',
          'Campo "timestamp": tiempo UNIX en milisegundos — convertir a fecha legible',
          'Campo "data": contenido del mensaje de texto (NULL para multimedia)',
          'Exportar conversaciones relevantes a formato CSV o generar reporte HTML',
          'Verificar metadatos: remitente, receptor, fecha, hora, estado de lectura (0=no leído, 1=leído)',
          'Documentar el número total de mensajes en el chat analizado',
        ],
        codigo: [
          {
            lang: 'sql',
            contenido:
              '-- Consulta para extraer mensajes de un chat específico\n-- Reemplazar +584121234567 con el número objetivo\nSELECT\n  _id,\n  key_remote_jid,\n  key_from_me,  -- 0 = recibido, 1 = enviado\n  datetime(timestamp/1000, \'unixepoch\', \'-4 hours\') AS fecha_hora_VET,\n  data AS mensaje,\n  media_mime_type,\n  media_size,\n  status\nFROM messages\nWHERE key_remote_jid LIKE \'%+584121234567%\'\nORDER BY timestamp ASC;',
          },
          {
            lang: 'bash',
            contenido:
              '# Exportar mensajes de texto a CSV (Python + sqlite3)\npython3 << EOF\nimport sqlite3, csv\ncon = sqlite3.connect("./msgstore.db")\ncur = con.cursor()\ncur.execute("""\n  SELECT datetime(timestamp/1000, \'unixepoch\', \'-4 hours\'),\n         key_remote_jid, key_from_me, data\n  FROM messages WHERE data IS NOT NULL\n  ORDER BY timestamp ASC\n""")\nwith open("mensajes_exportados.csv","w",newline="",encoding="utf-8") as f:\n    w = csv.writer(f)\n    w.writerow(["Fecha_VET","Chat","Enviado_por_mi","Mensaje"])\n    w.writerows(cur.fetchall())\nprint(f"Exportados {cur.rowcount if cur.rowcount>0 else \'todos\'} mensajes")\nEOF',
          },
        ],
        normativas: [
          { label: 'ISO 27042:2015', color: 'purple' },
          { label: 'Art. 225 COPP', color: 'cyan' },
        ],
        icono: Database,
      },
      {
        id: 'f4p2',
        numero: '4.2',
        titulo: 'Validación de Imágenes (JPG/PNG de WhatsApp y Capturas)',
        descripcion:
          'Cada imagen relevante debe ser validada individualmente: metadatos EXIF, hash SHA-256 individual y coherencia entre nombre del archivo y contenido.',
        items: [
          'Herramienta EXIF: ExifTool (gratuito, multi-plataforma)',
          'Verificar: fecha de captura, coordenadas GPS (si existen), modelo de cámara/dispositivo',
          'Las capturas de pantalla NO tienen coordenadas GPS pero SÍ tienen timestamp del sistema',
          'Calcular hash SHA-256 de CADA imagen relevante de forma individual',
          'Documentar en tabla: [N° | Nombre Archivo | Hash SHA-256 | Fecha EXIF | Origen | Observaciones]',
          'Verificar coherencia: ¿la fecha del nombre del archivo coincide con la fecha EXIF?',
          'Flagear cualquier discrepancia de fechas — puede indicar manipulación',
          'Preparar impresión de cada imagen con hoja de cadena de custodia adjunta',
        ],
        codigo: [
          {
            lang: 'bash',
            contenido:
              '# Extraer metadatos EXIF de todas las imágenes\nexiftool -r -csv -DateTimeOriginal -GPSLatitude -GPSLongitude \\\n    -Make -Model -FileSize -FileName \\\n    ./WA_Imagenes/ > exif_whatsapp_imagenes.csv\n\n# Hash SHA-256 individual de cada imagen\nfor img in ./WA_Imagenes/*.jpg ./WA_Imagenes/*.png; do\n    echo "$(sha256sum "$img") | $(exiftool -DateTimeOriginal -s3 "$img")" >> hashes_imagenes.txt\ndone\necho "Procesadas: $(wc -l < hashes_imagenes.txt) imágenes"',
          },
        ],
        normativas: [
          { label: 'ISO 27042:2015', color: 'purple' },
          { label: 'LMDF-1999 Art.4', color: 'cyan' },
        ],
        icono: ImageIcon,
      },
      {
        id: 'f4p3',
        numero: '4.3',
        titulo: 'Validación de Audios .opus (Mensajes de Voz WhatsApp)',
        descripcion:
          'Los mensajes de voz WhatsApp se almacenan en formato Opus, un codec de audio libre. Deben validarse con hash, transcribirse y convertirse a formato compatible con reproductores estándar para la presentación en tribunal.',
        items: [
          'Ubicación en extracción: WhatsApp/Media/WhatsApp Voice Notes/[año]/archivo.opus',
          'Calcular hash SHA-256 de CADA archivo .opus relevante',
          'Reproducir para verificar contenido — usar VLC Media Player o ffplay',
          'Transcribir el contenido del audio en acta aparte, identificando el hablante',
          'Convertir a .mp3 o .wav para facilitar reproducción en sala de tribunal (sin perder el original)',
          'OBLIGATORIO: Conservar SIEMPRE el archivo .opus original con su hash — nunca eliminar',
          'Documentar: nombre original, duración, hash SHA-256, fecha en metadatos, transcript',
        ],
        codigo: [
          {
            lang: 'bash',
            contenido:
              '# Calcular hashes de audios .opus\nfind ./WA_Audios/ -name "*.opus" -exec sha256sum {} \\; > hashes_audios_opus.txt\necho "Total audios: $(wc -l < hashes_audios_opus.txt)"\n\n# Convertir .opus a .mp3 para presentación en tribunal\n# (requiere ffmpeg instalado)\nmkdir -p ./WA_Audios_MP3/\nfor audio in ./WA_Audios/*.opus; do\n    nombre_base=$(basename "$audio" .opus)\n    ffmpeg -i "$audio" -codec:a libmp3lame -qscale:a 2 \\\n        "./WA_Audios_MP3/${nombre_base}_COPIA_TRIBUNAL.mp3" 2>/dev/null\n    echo "Convertido: $nombre_base"\ndone\n\n# IMPORTANTE: Verificar que el .opus ORIGINAL no fue modificado\nsha256sum -c hashes_audios_opus.txt',
          },
          {
            lang: 'bash',
            contenido:
              '# Obtener duración y metadatos de los audios con ffprobe\nffprobe -v quiet -print_format json -show_streams audio_importante.opus | \\\n    python3 -c "import sys,json; d=json.load(sys.stdin)[\'streams\'][0]; \\\n    print(f\'Duración: {float(d.get(\"duration\",0)):.1f}s | Codec: {d.get(\"codec_name\")} | Sample rate: {d.get(\"sample_rate\")}Hz\')"',
          },
        ],
        normativas: [
          { label: 'ISO 27042:2015', color: 'purple' },
          { label: 'Art. 225 COPP', color: 'cyan' },
        ],
        advertencias: [
          {
            titulo: 'El archivo .opus original es la prueba primaria',
            cuerpo:
              'El archivo .mp3 o .wav convertido es SOLO para facilitar la reproducción en tribunal. El .opus original con su hash SHA-256 registrado es la evidencia auténtica. Si solo se presenta el convertido, la defensa puede impugnar la autenticidad.',
            nivel: 'warning',
          },
        ],
        icono: Mic,
      },
      {
        id: 'f4p4',
        numero: '4.4',
        titulo: 'Preparación de Capturas de Pantalla como Evidencia',
        descripcion:
          'Las capturas de pantalla tienen el timestamp del sistema operativo codificado en el nombre del archivo. Esto las hace especialmente útiles como evidencia cronológica.',
        items: [
          'Ubicación: DCIM/Screenshots/ con formato Screenshot_YYYYMMDD-HHMMSS.png',
          'El nombre del archivo contiene la fecha y hora exacta de la captura',
          'Verificar coherencia entre nombre del archivo y metadatos EXIF del PNG',
          'Calcular hash SHA-256 de cada captura relevante',
          'Imprimir con hoja de cadena de custodia adjunta por cada imagen — incluir hash impreso',
          'Agrupar por período temporal relevante para la causa',
          'Preparar álbum fotográfico forense (PDF) con todas las capturas numeradas y con hashes',
        ],
        normativas: [
          { label: 'ISO 27042:2015', color: 'purple' },
          { label: 'LMDF-1999', color: 'cyan' },
        ],
        icono: Camera,
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════
  // FASE 5 — DOCUMENTACIÓN PERICIAL Y CADENA DE CUSTODIA
  // ══════════════════════════════════════════════════════════════════
  {
    id: 'f5',
    numero: 5,
    titulo: 'Documentación Pericial y Cadena de Custodia',
    subtitulo: 'Dictamen pericial, tabla de integridad y sellado final',
    icono: FileText,
    color: 'text-[#FF9500]',
    glowColor: 'rgba(255,149,0,0.15)',
    pasos: [
      {
        id: 'f5p1',
        numero: '5.1',
        titulo: 'Elaboración del Dictamen Pericial (Art. 225 COPP)',
        descripcion:
          'El dictamen pericial es el documento técnico-legal central del proceso. Debe cumplir estrictamente con los requisitos del Art. 225 COPP y ser redactado de forma comprensible para jueces y abogados no técnicos.',
        items: [
          '1. MOTIVO DEL PERITAJE — Descripción de lo que se solicitó analizar y por qué',
          '2. DESCRIPCIÓN DEL OBJETO PERITADO — Dispositivo: marca, modelo, IMEI, estado físico, N° de evidencia',
          '3. EXÁMENES PRACTICADOS — Lista detallada de módulos y procedimientos ejecutados',
          '4. RESULTADOS OBTENIDOS — Con capturas de pantalla del proceso como anexos',
          '5. CONCLUSIONES — Formuladas de forma categórica (afirmativa/negativa), con base en los resultados',
          '6. METODOLOGÍA APLICADA — Avilla Forensics + ISO/IEC 27037/27041/27042',
          '7. HASHES SHA-256 — De toda la evidencia procesada, en tabla anexa',
          '8. ANEXOS — Log de Avilla, capturas del proceso, tabla de integridad, acta de cadena de custodia',
          'Firma del perito con número de registro profesional (si aplica)',
        ],
        normativas: [
          { label: 'Art. 225 COPP', color: 'cyan' },
          { label: 'ISO 27042:2015', color: 'purple' },
          { label: 'MUCC-2017', color: 'green' },
        ],
        advertencias: [
          {
            titulo: 'Redacción técnica y jurídicamente precisa',
            cuerpo:
              'El dictamen debe usar lenguaje comprensible para un juez civil o mercantil. Evitar jerga técnica sin explicación. Cada afirmación técnica debe tener su respaldo en metodología documentada e internacionalmente reconocida.',
            nivel: 'info',
          },
        ],
        icono: FileText,
      },
      {
        id: 'f5p2',
        numero: '5.2',
        titulo: 'Tabla de Integridad de Evidencias',
        descripcion:
          'La tabla de integridad es el inventario criptográfico de toda la evidencia. Debe incluirse como anexo obligatorio del dictamen pericial y permite verificar la autenticidad en cualquier momento futuro.',
        items: [
          'Columnas obligatorias: N° | Nombre Archivo | Tipo | Tamaño (bytes) | Hash SHA-256 | Fecha Extracción | Observaciones',
          'Incluir TODOS los archivos relevantes presentados como evidencia',
          'Incluir también los archivos de control: msgstore.db.crypt15 (original cifrado) y archivo key',
          'Firmar la tabla con fecha y nombre del perito',
          'Si el número de archivos es grande, incluir tabla resumen y el CSV completo como anexo en CD/USB sellado',
        ],
        codigo: [
          {
            lang: 'bash',
            contenido:
              '# Generar tabla de integridad en CSV automáticamente\necho "N,Nombre_Archivo,Tipo,Tamaño_bytes,Hash_SHA256,Fecha_Extraccion" > tabla_integridad.csv\nn=1\nfor f in ./04_Analisis/evidencias_relevantes/*; do\n  nombre=$(basename "$f")\n  tipo="${f##*.}"\n  tamaño=$(stat -c%s "$f" 2>/dev/null || stat -f%z "$f")\n  hash=$(sha256sum "$f" | cut -d\' \' -f1)\n  fecha=$(date -r "$f" "+%d/%m/%Y %H:%M" 2>/dev/null || date -j -f "%s" "$(stat -f%m "$f")" "+%d/%m/%Y %H:%M")\n  echo "$n,$nombre,$tipo,$tamaño,$hash,$fecha" >> tabla_integridad.csv\n  n=$((n+1))\ndone\necho "Tabla generada: $((n-1)) archivos registrados"',
          },
        ],
        normativas: [
          { label: 'ISO 27041:2015', color: 'purple' },
          { label: 'Art. 187 COPP', color: 'cyan' },
        ],
        icono: Scale,
      },
      {
        id: 'f5p3',
        numero: '5.3',
        titulo: 'Formulario de Cadena de Custodia (MUCC-2017)',
        descripcion:
          'El Manual Único de Cadena de Custodia de Venezuela 2017 establece los campos obligatorios que debe contener el registro de custodia. Todos los campos son obligatorios.',
        items: [
          'Número del caso / expediente',
          'Descripción detallada de la evidencia (con marca, modelo, IMEI, N° de evidencia)',
          'Lugar, fecha y hora exacta de recolección/consignación',
          'Nombre completo y firma del perito receptor',
          'Nombre completo y firma del consignante (entregante)',
          'Condiciones de almacenamiento (temperatura, lugar, acceso restringido)',
          'Registro cronológico de CADA transferencia de custodia con: fecha, nombre y firma de quien entrega, nombre y firma de quien recibe',
          'Estado de los sellos en cada transferencia',
          'Número del sello utilizado en el embalaje',
        ],
        normativas: [
          { label: 'MUCC-2017 Completo', color: 'green' },
          { label: 'Art. 187 COPP', color: 'cyan' },
        ],
        icono: Fingerprint,
      },
      {
        id: 'f5p4',
        numero: '5.4',
        titulo: 'Sellado y Resguardo de Evidencias Originales',
        descripcion:
          'Las evidencias originales — el dispositivo físico y los medios de almacenamiento con las copias forenses — deben sellarse y almacenarse en condiciones controladas.',
        items: [
          'Dispositivo móvil: embolsar en bolsa de evidencia antiestática, sellar en la apertura con sticker de seguridad, firmar sobre el sello',
          'Medios de almacenamiento: sobre sellado con firma del perito atravesando el sello',
          'Almacenar en lugar seguro: temperatura controlada (15-25°C), sin humedad excesiva',
          'Acceso restringido: registro de entrada/salida del depósito de evidencias',
          'Inventario: registrar en el sistema de gestión de evidencias del perito',
          'NO conectar el dispositivo a corriente después de sellado (puede activar actualizaciones)',
          'Mantener el dispositivo en Modo Avión hasta que el tribunal ordene su devolución',
        ],
        normativas: [
          { label: 'MUCC-2017 §Resguardo', color: 'green' },
          { label: 'ISO 27037 §9', color: 'purple' },
        ],
        advertencias: [
          {
            titulo: 'Firma sobre el sello es OBLIGATORIA',
            cuerpo:
              'La firma del perito debe atravesar el sello de seguridad de forma que cualquier apertura del sobre sea evidente. Sin firma sobre el sello, la integridad del almacenamiento puede ser cuestionada en tribunal.',
            nivel: 'warning',
          },
        ],
        icono: Lock,
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════
  // FASE 6 — PRESENTACIÓN EN TRIBUNALES
  // ══════════════════════════════════════════════════════════════════
  {
    id: 'f6',
    numero: 6,
    titulo: 'Presentación en Tribunales Civiles y Mercantiles',
    subtitulo: 'Consignación judicial, reproducción en sala y demostración de integridad',
    icono: Gavel,
    color: 'text-[#FF3B30]',
    glowColor: 'rgba(255,59,48,0.15)',
    pasos: [
      {
        id: 'f6p1',
        numero: '6.1',
        titulo: 'Consignación Judicial de la Evidencia Digital',
        descripcion:
          'La consignación judicial es el acto procesal mediante el cual la evidencia digital se incorpora formalmente al expediente. Requiere un escrito técnico-jurídico preciso.',
        items: [
          'Redactar escrito de consignación describiendo cada archivo por nombre, tipo y hash SHA-256',
          'Solicitar al tribunal que ordene la incorporación de la evidencia al expediente judicial',
          'Adjuntar: dictamen pericial original firmado, acta de cadena de custodia, tabla de integridad',
          'Consignar físicamente: CD/DVD sellado o USB en sobre sellado con el dictamen, los archivos y el SHA256',
          'Solicitar al secretario del tribunal la certificación de la recepción con fecha y sello',
          'En materia civil/mercantil: seguir los artículos del CPC venezolano sobre prueba de expertos',
          'En materia laboral: respetar el procedimiento del art. 73 y siguientes de la LOPT',
        ],
        normativas: [
          { label: 'Art. 225 COPP', color: 'cyan' },
          { label: 'CPC Venezuela', color: 'red' },
          { label: 'ISO 27042:2015', color: 'purple' },
        ],
        icono: Gavel,
      },
      {
        id: 'f6p2',
        numero: '6.2',
        titulo: 'Reproducción de Evidencias en Sala',
        descripcion:
          'La audiencia de evacuación de prueba requiere preparación técnica específica. El perito debe poder reproducir cada tipo de evidencia de forma inmediata y ordenada.',
        items: [
          'Laptop del perito: con reproductor de .opus / .mp3 (VLC Media Player), visor de imágenes, lector de PDF',
          'Conversaciones WhatsApp: impresas en PDF con timestamps visibles Y en formato digital',
          'Imágenes: en formato JPG/PNG estándar — proyectables en pantalla del tribunal',
          'Audios: versión .opus original PARA EL HASH + versión .mp3 PARA LA REPRODUCCIÓN',
          'Verificador SHA-256 disponible: sha256sum (Linux) o PowerShell (Windows) en la laptop',
          'Tabla de integridad impresa para entregar a cada parte procesal',
          'Tener a mano el dictamen pericial para referencia durante la ratificación',
          'Preparar presentación visual (opcional) explicando el proceso técnico con capturas',
        ],
        normativas: [
          { label: 'CPC Venezuela', color: 'red' },
          { label: 'LOPT Art.73', color: 'red' },
        ],
        icono: Eye,
      },
      {
        id: 'f6p3',
        numero: '6.3',
        titulo: 'Demostración de Integridad ante el Tribunal',
        descripcion:
          'La verificación de integridad en sala es el momento más importante del proceso técnico. Debe realizarse de forma clara, pedagógica y reproducible ante el juez, las partes y sus apoderados.',
        items: [
          'EXPLICACIÓN SIMPLE: "El hash SHA-256 es como la huella digital del archivo. Si el archivo fue cambiado aunque sea en un solo carácter, su huella digital sería completamente diferente"',
          'DEMOSTRACIÓN EN TIEMPO REAL: calcular el hash del archivo presentado ante el tribunal',
          'COMPARACIÓN: mostrar que el hash calculado en sala es IDÉNTICO al registrado en el dictamen',
          'CONCLUSIÓN: la igualdad de hashes demuestra que la evidencia NO ha sido alterada desde su extracción',
          'Si el tribunal o la contraparte solicita verificación adicional: calcular el hash en un equipo distinto para demostrar reproducibilidad',
          'Documentar en el acta de la audiencia la verificación de integridad realizada',
        ],
        codigo: [
          {
            lang: 'powershell',
            contenido:
              '# Demostración de integridad en sala (Windows)\n# Ejecutar en vivo ante el tribunal:\n\n$archivo = ".\\evidencia_presentada\\audio_001.opus"\n$hash_dictamen = "a3f1e8b2c9d7..." # Valor del dictamen\n$hash_actual = (Get-FileHash $archivo -Algorithm SHA256).Hash\n\nWrite-Host ""\nWrite-Host "═══ VERIFICACIÓN DE INTEGRIDAD SHA-256 ═══"\nWrite-Host "Archivo:         $archivo"\nWrite-Host "Hash en dictamen: $hash_dictamen"\nWrite-Host "Hash calculado:   $hash_actual"\nWrite-Host ""\nif ($hash_dictamen.ToUpper() -eq $hash_actual.ToUpper()) {\n  Write-Host "✅ RESULTADO: ÍNTEGRO — Sin alteraciones" -ForegroundColor Green\n} else {\n  Write-Host "❌ RESULTADO: DISCREPANCIA DETECTADA" -ForegroundColor Red\n}',
          },
        ],
        normativas: [
          { label: 'ISO 27042:2015', color: 'purple' },
          { label: 'LMDF-1999 Art.4', color: 'cyan' },
          { label: 'Art. 225 COPP', color: 'cyan' },
        ],
        advertencias: [
          {
            titulo: 'Preparar demostración offline — sin internet en sala',
            cuerpo:
              'La verificación de hash debe realizarse sin conexión a internet para evitar que la contraparte argumente que el archivo fue "descargado en tiempo real". Tener todos los archivos en disco local del perito.',
            nivel: 'info',
          },
        ],
        icono: Scale,
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// SUBCOMPONENTES
// ─────────────────────────────────────────────────────────────────────────────

/** Badge de normativa con color */
function BadgeNormativa({ tag }: { tag: NormativaTag }) {
  const colors: Record<NormativaTag['color'], string> = {
    cyan:   'bg-[#007AFF]/10 border-[#007AFF]/25 text-[#007AFF]',
    green:  'bg-[#34C759]/10 border-[#34C759]/25 text-[#34C759]',
    yellow: 'bg-[#FF9500]/10 border-[#FF9500]/25 text-[#FF9500]',
    red:    'bg-[#FF3B30]/10 border-[#FF3B30]/25 text-[#FF3B30]',
    purple: 'bg-[#AF52DE]/10 border-[#AF52DE]/25 text-[#AF52DE]',
  };
  return (
    <span className={`inline-flex items-center text-[8px] font-bold uppercase tracking-[0.15em] px-2 py-0.5 rounded border ${colors[tag.color]}`}>
      {tag.label}
    </span>
  );
}

/** Alerta forense con colores por nivel */
function AlertaForense({ adv }: { adv: Advertencia }) {
  const cfg = {
    critical: {
      wrapper: 'bg-[#FF3B30]/[0.06] border-[#FF3B30]/25',
      icon:    'text-[#FF3B30]',
      titulo:  'text-[#FF3B30]',
      cuerpo:  'text-[#1D1D1F]',
      Icon:    AlertTriangle,
    },
    warning: {
      wrapper: 'bg-[#FF9500]/[0.06] border-[#FF9500]/25',
      icon:    'text-[#FF9500]',
      titulo:  'text-[#FF9500]',
      cuerpo:  'text-[#1D1D1F]',
      Icon:    AlertTriangle,
    },
    info: {
      wrapper: 'bg-[#007AFF]/[0.06] border-[#007AFF]/25',
      icon:    'text-[#007AFF]',
      titulo:  'text-[#007AFF]',
      cuerpo:  'text-[#1D1D1F]',
      Icon:    Info,
    },
  }[adv.nivel];

  return (
    <div className={`flex items-start gap-3 p-4 rounded-lg border ${cfg.wrapper}`}>
      <cfg.Icon size={14} className={`${cfg.icon} shrink-0 mt-0.5`} />
      <div>
        <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${cfg.titulo}`}>
          {adv.nivel === 'critical' ? '⚠️ CRÍTICO' : adv.nivel === 'warning' ? '⚠️ Advertencia' : 'ℹ️ Nota'}: {adv.titulo}
        </p>
        <p className={`text-[10px] leading-relaxed ${cfg.cuerpo}`}>{adv.cuerpo}</p>
      </div>
    </div>
  );
}

/** Bloque de código con copia al portapapeles */
function BloqueCode({ lang, contenido }: { lang: string; contenido: string }) {
  const [copiado, setCopiado] = useState(false);
  const copiar = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(contenido);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2200);
    } catch {}
  }, [contenido]);

  const LANG_COLOR: Record<string, string> = {
    bash:       'text-green-400/60',
    powershell: 'text-blue-400/60',
    sql:        'text-yellow-400/60',
    python:     'text-cyan-400/60',
  };

  return (
    <div className="rounded-lg overflow-hidden border border-white/[0.07] mt-3">
      {/* Barra de título */}
      <div className="flex items-center justify-between px-4 py-2 bg-black/50 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <Terminal size={11} className="text-white/25" />
          <span className={`text-[9px] font-black uppercase tracking-[0.15em] ${LANG_COLOR[lang] || 'text-white/25'}`}>
            {lang}
          </span>
        </div>
        <button
          onClick={copiar}
          className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded bg-white/[0.05] border border-white/[0.08] text-white/30 hover:text-cyan-400 hover:border-cyan-400/30 transition-all"
        >
          {copiado
            ? <><CheckCheck size={10} className="text-green-400" /> Copiado</>
            : <><Copy size={10} /> Copiar</>}
        </button>
      </div>
      {/* Código */}
      <pre className="overflow-x-auto px-4 py-4 bg-[#1D1D1F] text-[11px] leading-relaxed">
        <code className="text-[#e4e4e7] font-mono whitespace-pre">{contenido}</code>
      </pre>
    </div>
  );
}

/** Tarjeta de un paso individual */
function TarjetaPaso({
  paso,
  completado,
  onToggle,
}: {
  paso: Paso;
  completado: boolean;
  onToggle: (id: string) => void;
}) {
  const [expandido, setExpandido] = useState(false);
  const Icon = paso.icono;

  return (
    <div
      className={`rounded-xl border transition-all duration-300 overflow-hidden ${
        completado
          ? 'border-[#34C759]/20 bg-[#34C759]/[0.03]'
          : expandido
          ? 'border-black/10 bg-white shadow-sm'
          : 'border-black/[0.06] bg-white hover:border-black/10'
      }`}
    >
      {/* Cabecera del paso */}
      <button
        className="w-full flex items-center gap-4 px-5 py-4 text-left group"
        onClick={() => setExpandido(v => !v)}
      >
        {/* Número */}
        <span className="text-[10px] font-bold text-[#86868B] font-mono shrink-0 w-8 tabular-nums">
          {paso.numero}
        </span>
        {/* Ícono */}
        <div className={`p-2 rounded-lg shrink-0 transition-all ${
          completado ? 'bg-[#34C759]/10' : 'bg-black/[0.04] group-hover:bg-black/[0.06]'
        }`}>
          <Icon size={14} className={completado ? 'text-[#34C759]' : 'text-black/40'} />
        </div>
        {/* Título */}
        <span className={`flex-1 text-[11px] font-bold uppercase tracking-wide ${
          completado ? 'text-[#34C759]' : 'text-[#1D1D1F]/70 group-hover:text-[#1D1D1F]/90'
        }`}>
          {paso.titulo}
        </span>
        {/* Badges de normativa (solo cuando colapsado) */}
        {!expandido && paso.normativas && (
          <div className="hidden sm:flex items-center gap-1.5 flex-wrap">
            {paso.normativas.slice(0, 2).map(n => (
              <BadgeNormativa key={n.label} tag={n} />
            ))}
          </div>
        )}
        {/* Chevron */}
        {expandido
          ? <ChevronUp size={14} className="text-black/35 shrink-0" />
          : <ChevronDown size={14} className="text-black/20 shrink-0" />}
      </button>

      {/* Contenido expandido */}
      {expandido && (
        <div className="px-5 pb-5 space-y-5 animate-fade-in">
          {/* Descripción */}
          <p className="text-[11px] text-[#1D1D1F]/60 leading-relaxed border-l-2 border-black/15 pl-4">
            {paso.descripcion}
          </p>

          {/* Lista de ítems */}
          {paso.items && (
            <ul className="space-y-2">
              {paso.items.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-[11px] text-[#1D1D1F]/70 leading-relaxed">
                  <span className="w-5 h-5 rounded-full bg-black/[0.04] border border-black/[0.06] flex items-center justify-center shrink-0 mt-0.5 text-[8px] font-bold text-[#86868B] tabular-nums">
                    {i + 1}
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          )}

          {/* Bloques de código */}
          {paso.codigo?.map((c, i) => (
            <BloqueCode key={i} lang={c.lang} contenido={c.contenido} />
          ))}

          {/* Normativas */}
          {paso.normativas && (
            <div className="flex items-center gap-2 flex-wrap pt-1">
              <span className="text-[9px] font-bold text-black/30 uppercase tracking-widest mr-1">
                Base legal:
              </span>
              {paso.normativas.map(n => (
                <BadgeNormativa key={n.label} tag={n} />
              ))}
            </div>
          )}

          {/* Advertencias */}
          {paso.advertencias?.map((adv, i) => (
            <AlertaForense key={i} adv={adv} />
          ))}

          {/* Botón de marcar como completado */}
          <div className="pt-2 border-t border-black/5 flex justify-end">
            <button
              id={`paso-completado-${paso.id}`}
              onClick={e => { e.stopPropagation(); onToggle(paso.id); }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-200 ${
                completado
                  ? 'bg-[#34C759]/10 border border-[#34C759]/20 text-[#34C759] hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-500'
                  : 'bg-black/[0.04] border border-black/[0.08] text-black/60 hover:bg-[#34C759]/10 hover:border-[#34C759]/20 hover:text-[#34C759]'
              }`}
            >
              {completado
                ? <><CheckCircle2 size={12} /> Completado — Desmarcar</>
                : <><Circle size={12} /> Marcar como completado</>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/** Tarjeta de fase en el stepper */
function StepperFase({
  fase,
  activa,
  completada,
  progreso,
  onClick,
}: {
  fase: Fase;
  activa: boolean;
  completada: boolean;
  progreso: number;
  onClick: () => void;
}) {
  const Icon = fase.icono;
  return (
    <button
      id={`stepper-fase-${fase.id}`}
      onClick={onClick}
      className={`flex flex-col items-center gap-2 group transition-all duration-200 min-w-0 flex-1`}
    >
      {/* Círculo con ícono */}
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 shrink-0 ${
          completada
            ? 'border-[#34C759] bg-[#34C759]/10 shadow-sm'
            : activa
            ? `border-current ${fase.color} bg-white shadow-sm`
            : 'border-black/10 bg-black/[0.03]'
        }`}
      >
        {completada
          ? <CheckCircle2 size={16} className="text-[#34C759]" />
          : <Icon size={16} className={activa ? fase.color : 'text-[#86868B]'} />}
      </div>
      {/* Número + Título */}
      <div className="text-center px-1">
        <p className={`text-[8px] font-bold uppercase tracking-[0.15em] ${
          completada ? 'text-[#34C759]' : activa ? fase.color : 'text-[#86868B]'
        }`}>
          F{fase.numero}
        </p>
        <p className={`text-[9px] font-bold leading-tight hidden sm:block ${
          completada ? 'text-[#1D1D1F]/60' : activa ? 'text-[#1D1D1F]/80' : 'text-[#86868B]'
        }`}>
          {fase.titulo.split(' ').slice(0, 2).join(' ')}
        </p>
      </div>
      {/* Mini barra de progreso */}
      <div className="w-full h-0.5 bg-black/[0.05] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            completada ? 'bg-[#34C759]' : activa ? 'bg-current' : 'bg-transparent'
          }`}
          style={{
            width: `${progreso}%`,
            color: activa ? fase.color.replace('text-', '') : undefined,
            background: completada ? undefined : activa
              ? fase.color.includes('[#0071E3]') || fase.color.includes('cyan') ? '#0071E3'
              : fase.color.includes('[#34C759]') || fase.color.includes('green') ? '#34C759'
              : fase.color.includes('[#30B0C7]') || fase.color.includes('emerald') ? '#30B0C7'
              : fase.color.includes('[#FF9500]') || fase.color.includes('yellow') ? '#FF9500'
              : fase.color.includes('[#007AFF]') || fase.color.includes('blue') ? '#007AFF'
              : fase.color.includes('[#FF9500]') || fase.color.includes('orange') ? '#FF9500'
              : '#FF3B30'
              : undefined,
          }}
        />
      </div>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────────

export default function ManualAvillaForensics() {
  // ── Estado ──────────────────────────────────────────────────────────────
  const [fasActiva, setFaseActiva] = useState<string>('f0');
  const [completados, setCompletados] = useState<Set<string>>(new Set());

  // ── Persistencia localStorage ───────────────────────────────────────────
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_KEY);
      if (saved) setCompletados(new Set(JSON.parse(saved)));
    } catch {}
  }, []);

  const toggleCompletado = useCallback((pasoId: string) => {
    setCompletados(prev => {
      const next = new Set(prev);
      if (next.has(pasoId)) next.delete(pasoId);
      else next.add(pasoId);
      try { localStorage.setItem(LS_KEY, JSON.stringify([...next])); } catch {}
      return next;
    });
  }, []);

  const resetearProgreso = useCallback(() => {
    if (!window.confirm('¿Reiniciar todo el progreso del manual?')) return;
    setCompletados(new Set());
    try { localStorage.removeItem(LS_KEY); } catch {}
  }, []);

  // ── Cálculos de progreso ────────────────────────────────────────────────
  const totalPasos = FASES.reduce((s, f) => s + f.pasos.length, 0);
  const totalCompletados = FASES.reduce(
    (s, f) => s + f.pasos.filter(p => completados.has(p.id)).length,
    0,
  );
  const pctGlobal = Math.round((totalCompletados / totalPasos) * 100);

  const progresoPorFase = (f: Fase) => {
    const c = f.pasos.filter(p => completados.has(p.id)).length;
    return Math.round((c / f.pasos.length) * 100);
  };
  const faseCompletada = (f: Fase) => progresoPorFase(f) === 100;

  const faseActual = FASES.find(f => f.id === fasActiva) ?? FASES[0];

  // ─── RENDER ──────────────────────────────────────────────────────────────
  return (
    <div id="manual-avilla-page" className="space-y-6 pb-20 animate-fade-in text-[#1D1D1F]">

      {/* ── Encabezado principal ─────────────────────────────────── */}
      <div className="apple-card overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#007AFF]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#007AFF]/[0.02] to-transparent pointer-events-none" />

        <div className="p-6 sm:p-8 relative">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#007AFF]/10 rounded-[6px] border border-[#007AFF]/20">
                <BookOpen size={26} className="text-[#007AFF]" strokeWidth={2} />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-[#1D1D1F] uppercase tracking-tight">
                  Manual Operativo — Avilla Forensics
                </h1>
                <p className="text-xs text-[#86868B] font-bold uppercase tracking-[0.15em] mt-1">
                  Software libre para adquisición forense Android · Downgrade multi-app · WhatsApp Evidence
                </p>
                <p className="text-[11px] text-[#6E6E73] leading-relaxed mt-2 max-w-2xl">
                  Avilla Forensics es una herramienta de software libre (código abierto) para la adquisición forense de dispositivos Android, diseñada como alternativa gratuita a soluciones comerciales como Cellebrite UFED, Oxygen Forensics o MSAB XRY. Permite técnicas de downgrade de APK sobre múltiples aplicaciones (WhatsApp, Telegram, Signal, y otras) para extraer datos de zonas privadas sin necesidad de root, usando ADB Backup desde Windows, Linux o macOS.
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {[
                    'Avilla Forensics v4+', 'ISO/IEC 27037:2012', 'ISO/IEC 27041:2015', 'ISO/IEC 27042:2015',
                    'Art. 187 COPP', 'Art. 225 COPP', 'MUCC-2017',
                  ].map(tag => (
                    <span
                      key={tag}
                      className="text-[8px] px-2 py-0.5 rounded bg-[#007AFF]/5 border border-[#007AFF]/15 text-[#007AFF] font-bold uppercase tracking-wider"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            {/* Estado Live */}
            <div className="shrink-0 flex items-center gap-2 text-[9px] font-bold text-[#34C759] bg-[#34C759]/10 border border-[#34C759]/20 px-3 py-1.5 rounded-full">
              <Zap size={10} className="animate-pulse" />
              AVILLA FORENSICS ACTIVO
            </div>
          </div>

          {/* ── Barra de progreso global ── */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] font-bold text-[#86868B] uppercase tracking-widest">
                Progreso Global del Protocolo
              </span>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-[#6E6E73] tabular-nums">
                  {totalCompletados}/{totalPasos} pasos
                </span>
                <span className={`text-sm font-bold tabular-nums ${
                  pctGlobal === 100 ? 'text-[#34C759]' : pctGlobal > 0 ? 'text-[#007AFF]' : 'text-[#86868B]'
                }`}>
                  {pctGlobal}%
                </span>
                {totalCompletados > 0 && (
                  <button
                    onClick={resetearProgreso}
                    className="flex items-center gap-1 text-[8px] font-bold text-[#86868B] hover:text-[#FF3B30] uppercase tracking-wider transition-colors"
                    title="Reiniciar progreso"
                  >
                    <RotateCcw size={10} />
                  </button>
                )}
              </div>
            </div>
            <div className="h-2 w-full bg-black/[0.05] rounded-full overflow-hidden border border-black/[0.02]">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${pctGlobal}%`,
                  background: pctGlobal === 100
                    ? 'linear-gradient(90deg, #34C759, #30D158)'
                    : 'linear-gradient(90deg, #0071E3, #007AFF)',
                  boxShadow: pctGlobal > 0
                    ? pctGlobal === 100
                      ? '0 0 8px rgba(52,199,89,0.2)'
                      : '0 0 8px rgba(0,113,227,0.15)'
                    : 'none',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Stepper de fases ────────────────────────────────────── */}
      <div className="apple-card p-4 sm:p-5">
        <div className="flex items-center gap-2 sm:gap-3">
          {FASES.map((fase, idx) => (
            <div key={fase.id} className="flex items-center flex-1 min-w-0">
              <StepperFase
                fase={fase}
                activa={fasActiva === fase.id}
                completada={faseCompletada(fase)}
                progreso={progresoPorFase(fase)}
                onClick={() => setFaseActiva(fase.id)}
              />
              {idx < FASES.length - 1 && (
                <div className={`hidden sm:block h-px flex-1 mx-1 ${
                  faseCompletada(fase) ? 'bg-[#34C759]/30' : 'bg-black/[0.06]'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Contenido de la fase activa ──────────────────────── */}
      <div className="animate-fade-in" key={fasActiva}>
        {/* Cabecera de fase */}
        <div className="apple-card p-5 sm:p-6 mb-4 relative overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: `radial-gradient(ellipse at top left, ${faseActual.glowColor}, transparent 60%)` }}
          />
          <div className="relative flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-[6px] bg-black/[0.03] border border-black/[0.06] shrink-0">
                {(() => { const Icon = faseActual.icono; return <Icon size={22} className={faseActual.color} />; })()}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className={`text-[9px] font-bold uppercase tracking-[0.2em] ${faseActual.color}`}>
                    Fase {faseActual.numero}
                  </span>
                  <span className={`text-[8px] font-bold px-2 py-0.5 rounded border ${
                    faseCompletada(faseActual)
                      ? 'border-[#34C759]/25 bg-[#34C759]/10 text-[#34C759]'
                      : 'border-black/[0.07] bg-black/[0.02] text-[#86868B]'
                  } uppercase tracking-wider`}>
                    {faseCompletada(faseActual)
                      ? '✓ Completada'
                      : `${progresoPorFase(faseActual)}% completado`}
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-[#1D1D1F] uppercase tracking-tight">
                  {faseActual.titulo}
                </h2>
                <p className="text-[10px] text-[#6E6E73] font-medium mt-1">{faseActual.subtitulo}</p>
              </div>
            </div>
            {/* Navegación entre fases */}
            <div className="shrink-0 flex gap-2">
              <button
                onClick={() => {
                  const idx = FASES.findIndex(f => f.id === fasActiva);
                  if (idx > 0) setFaseActiva(FASES[idx - 1].id);
                }}
                disabled={fasActiva === 'f0'}
                className="text-[9px] font-bold px-3 py-2 rounded-lg border border-black/[0.08] bg-black/[0.02] text-[#86868B] hover:text-[#1D1D1F] hover:bg-black/[0.05] transition-all disabled:opacity-20 disabled:cursor-not-allowed uppercase tracking-wider"
              >
                ← Anterior
              </button>
              <button
                onClick={() => {
                  const idx = FASES.findIndex(f => f.id === fasActiva);
                  if (idx < FASES.length - 1) setFaseActiva(FASES[idx + 1].id);
                }}
                disabled={fasActiva === 'f6'}
                className="text-[9px] font-bold px-3 py-2 rounded-lg border border-black/[0.08] bg-black/[0.02] text-[#86868B] hover:text-[#1D1D1F] hover:bg-black/[0.05] transition-all disabled:opacity-20 disabled:cursor-not-allowed uppercase tracking-wider"
              >
                Siguiente →
              </button>
            </div>
          </div>
        </div>

        {/* Lista de pasos de la fase */}
        <div className="space-y-3">
          {faseActual.pasos.map(paso => (
            <TarjetaPaso
              key={paso.id}
              paso={paso}
              completado={completados.has(paso.id)}
              onToggle={toggleCompletado}
            />
          ))}
        </div>

        {/* CTA siguiente fase */}
        {faseCompletada(faseActual) && fasActiva !== 'f6' && (
          <div
            className="mt-5 p-5 rounded-xl border border-[#34C759]/20 bg-[#34C759]/[0.03] flex items-center justify-between gap-4 animate-fade-in"
          >
            <div className="flex items-center gap-3">
              <CheckCircle2 size={20} className="text-[#34C759] shrink-0" />
              <div>
                <p className="text-sm font-bold text-[#34C759] uppercase tracking-wide">
                  Fase {faseActual.numero} completada
                </p>
                <p className="text-[10px] text-[#34C759]/80">
                  Continúe con la siguiente fase del protocolo forense
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                const idx = FASES.findIndex(f => f.id === fasActiva);
                if (idx < FASES.length - 1) setFaseActiva(FASES[idx + 1].id);
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#34C759]/10 border border-[#34C759]/30 text-[#34C759] text-[10px] font-bold uppercase tracking-wider hover:bg-[#34C759]/20 transition-all shrink-0"
            >
              Siguiente fase <TrendingUp size={12} />
            </button>
          </div>
        )}

        {/* Mensaje final — protocolo completo */}
        {fasActiva === 'f6' && faseCompletada(faseActual) && (
          <div className="mt-5 p-6 rounded-xl border border-[#0071E3]/20 bg-[#0071E3]/[0.02] text-center animate-fade-in relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#0071E3]/[0.02] to-transparent pointer-events-none" />
            <div className="relative">
              <CheckCircle2 size={40} className="text-[#34C759] mx-auto mb-3" />
              <h3 className="text-base font-bold text-[#1D1D1F] uppercase tracking-tight mb-2">
                Protocolo Forense Completado
              </h3>
              <p className="text-[11px] text-[#6E6E73] leading-relaxed max-w-2xl mx-auto mb-4">
                Ha completado las 7 fases del protocolo de consignación forense de dispositivo Android
                conforme a ISO/IEC 27037/27041/27042, Manual Único de Cadena de Custodia Venezuela 2017,
                Art. 187 y 225 COPP. La evidencia digital está lista para presentación judicial.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {['ISO 27037 ✓', 'ISO 27041 ✓', 'ISO 27042 ✓', 'MUCC-2017 ✓', 'COPP ✓'].map(t => (
                  <span key={t} className="text-[9px] px-3 py-1 rounded-full bg-[#34C759]/10 border border-[#34C759]/20 text-[#34C759] font-bold uppercase tracking-wider">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Pie de referencia normativa ──────────────────────── */}
      <div className="apple-card p-5 rounded-xl border border-black/5 mt-8 relative overflow-hidden bg-white">
        <div className="absolute top-0 right-0 opacity-[0.02] pointer-events-none">
          <Scale size={120} className="text-black" />
        </div>
        <div className="flex items-start gap-4 relative">
          <div className="p-3 bg-black/[0.02] rounded-[6px] border border-black/[0.06] shrink-0">
            <BookOpen size={18} className="text-black/30" />
          </div>
          <div>
            <h4 className="font-bold text-[#86868B] text-[10px] uppercase tracking-[0.2em] mb-2">
              Marco Normativo Completo Aplicado
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {[
                { label: 'ISO/IEC 27037:2012', color: 'purple' as const },
                { label: 'ISO/IEC 27041:2015', color: 'purple' as const },
                { label: 'ISO/IEC 27042:2015', color: 'purple' as const },
                { label: 'NIST SP 800-101 r1', color: 'cyan' as const },
                { label: 'Art. 187 COPP', color: 'cyan' as const },
                { label: 'Art. 225 COPP', color: 'cyan' as const },
                { label: 'MUCC-2017 (act. 2022)', color: 'green' as const },
                { label: 'LMDF-1999 Art.4', color: 'cyan' as const },
                { label: 'Compendio PRCC 2022', color: 'green' as const },
                { label: 'Avilla Forensics v4+', color: 'yellow' as const },
              ].map(tag => (
                <BadgeNormativa key={tag.label} tag={tag} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
