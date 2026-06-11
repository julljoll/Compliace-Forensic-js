import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { getPasosPorTipo } from './data/tiposProyecto';
import { ToastProvider } from './components/atoms/Toast';
import {
  initDatabase,
  getCasosDB,
  addCasoDB,
  updateCasoDB,
  deleteCasoDB,
  getAuditLogsDB,
  addAuditLogDB
} from './db/neonClient';

// Inicializar la base de datos de Neon Serverless
initDatabase().catch(err => console.error('Error al inicializar la base de datos Neon:', err));

// Declaración de tipos para el modo PWA
declare global {
  interface Window {
    electronAPI: {
      dialog: {
        selectFile: (filters?: any) => Promise<any>;
      };
      file: {
        writeJson: (filePath: string, data: any) => Promise<any>;
        readJson: (filePath: string) => Promise<any>;
      };
      hash: {
        calculate: (filePath: string, algorithm?: string) => Promise<any>;
      };
      db: {
        getCasos: (userId: number) => Promise<any>;
        addCaso: (caso: any) => Promise<any>;
        updateCaso: (id: string, data: any) => Promise<boolean>;
        deleteCaso: (id: string) => Promise<boolean>;
        saveState: (userId: number, state: string) => Promise<any>;
        loadState: (userId: number) => Promise<any>;
        getUsers: () => Promise<any>;
        addUser: (userIdMaker: number, user: any) => Promise<any>;
        updateUser: (userIdMaker: number, userId: number, data: any) => Promise<any>;
        getAuditLogs: () => Promise<any>;
        addAuditLog: (log: any) => Promise<boolean>;
      };
      auth: {
        login: (credentials: any) => Promise<any>;
        validate: (token: string) => Promise<any>;
        logout: (token: string) => Promise<any>;
        changePassword: (userId: number, newPassword: string) => Promise<any>;
      };
      platform: string;
      operationMode: 'production' | 'simulation';
    };
  }
}

// ─── WEB BROWSER PWA API LAYER ───────────────────────────────────────────────
async function sha256Local(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const buffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

if (typeof window !== 'undefined' && !window.electronAPI) {
  const getStorage = <T,>(key: string, defaultValue: T): T => {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : defaultValue;
  };
  const setStorage = <T,>(key: string, value: T): void => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  // ── Migración de datos entre versiones ──
  const DATA_VERSION = 3;
  const storedVersion = getStorage<number>('sha256_data_version', 0);
  if (storedVersion < DATA_VERSION) {
    // De v1 a v2: reset completo (destructivo)
    if (storedVersion < 2) {
      const keysToRemove = [
        'sha256_pwa_casos', 'sha256_pwa_audit_logs', 'sha256_pwa_state_1',
        'sha256_completed_steps', 'sha256_completed_steps_metadata',
        'cms-neon-storage', 'sha256-auth', 'sha256-forense-storage'
      ];
      keysToRemove.forEach(k => localStorage.removeItem(k));
      try {
        const req = indexedDB.deleteDatabase('sha256_forense');
        req.onsuccess = () => console.log('IndexedDB limpiada');
        req.onerror = () => console.warn('No se pudo limpiar IndexedDB');
      } catch {}
    }
    // De v2 a v3: la migración de completed_steps → steps se hace en cmsStore.migrateStepsData()
    // No destructivo — preserva datos existentes
    
    setStorage('sha256_data_version', DATA_VERSION);
  }

  async function seedInitialUsers() {
    const existing = getStorage<any[]>('sha256_pwa_users', []);
    if (existing.some((u: any) => u.username === 'carlos.mendoza')) return;
    const adminHash = await sha256Local('admin');
    const userHash = await sha256Local('password123');
    const users = [...existing];
    if (!existing.some((u: any) => u.username === 'admin')) {
      users.push({ id: 1, username: 'admin', nombre: 'Administrador', apellido: 'Local', rol: 'perito_lider', cargo: 'Superusuario', email: 'admin@sha256.us', activo: 1, ranking: 5, profile_image: '', password_hash: adminHash, _created: true, created_at: new Date().toISOString() });
    }
    users.push({ id: 2, username: 'carlos.mendoza', nombre: 'Carlos', apellido: 'Mendoza', rol: 'perito_lider', cargo: 'Perito Informático Principal', email: 'carlos.mendoza@sha256.us', activo: 1, ranking: 5, profile_image: '', password_hash: userHash, ci: 'V-15.340.293', telefono: '+58 414-1234567', despacho: 'Laboratorio de Informática Forense', created_at: new Date().toISOString() });
    users.push({ id: 3, username: 'mariana.silva', nombre: 'Mariana', apellido: 'Silva', rol: 'fiscal', cargo: 'Fiscal Adscrita', email: 'mariana.silva@fiscalia.mp.gob.ve', activo: 1, ranking: 4, profile_image: '', password_hash: userHash, ci: 'V-16.749.102', telefono: '+58 424-9876543', despacho: 'Fiscalía 23° Nacional', created_at: new Date().toISOString() });
    users.push({ id: 4, username: 'jose.pena', nombre: 'José Alirio', apellido: 'Peña', rol: 'fiscal', cargo: 'Fiscal de Control', email: 'jose.pena@fiscalia.mp.gob.ve', activo: 1, ranking: 4, profile_image: '', password_hash: userHash, ci: 'V-12.839.401', telefono: '+58 416-5554321', despacho: 'Fiscalía 5° contra Extorsión', created_at: new Date().toISOString() });
    setStorage('sha256_pwa_users', users);
  }

  async function seedInitialCasos() {
    const existingCasos = getStorage<any[]>('sha256_pwa_casos', []);
    if (existingCasos.some((c: any) => c.id === 'caso_discoduro_2026' || c.id === 'caso_whatsapp_2026')) return;

    // 1. Raw DB cases
    const casoDiscoDuroDB = {
      id: 'caso_discoduro_2026',
      numero_caso: 'SHA-2026-0087',
      titulo: 'Análisis Forense de Unidad de Almacenamiento - Caso Transacciones Sospechosas',
      descripcion: 'Análisis forense digital y recuperación de datos borrados del disco duro extraído del servidor principal de la empresa Inversiones del Centro C.A., relacionado con presunta legitimación de capitales y desvío de fondos. Se requiere identificar archivos de contabilidad en formato XLSX y PDF eliminados intencionalmente, así como registros de bases de datos locales.',
      estado: 'analisis',
      prioridad: 'alta',
      fiscal: 'Abg. Mariana Silva (Fiscalía 23° con Competencia Plena Nacional)',
      dispositivo_marca: '',
      dispositivo_modelo: '',
      dispositivo_imei: '',
      dispositivo_imei2: '',
      dispositivo_sim_card: '',
      dispositivo_numero_tel: '',
      dispositivo_estado_fisico: '',
      dispositivo_modo_aislamiento: '',
      dispositivo_danos_visibles: '',
      dispositivo_bateria_estado: '',
      dispositivo_pantalla_estado: '',
      user_id: 1,
      completed_steps: '{}',
      step_metadata: '{}',
      compliance_checklist: JSON.stringify([
        { stageId: 'n8__187', normativaId: 'n8', checked: true, fechaCheck: '2026-06-05T10:30:00Z', observacion: 'Acta de recepción del disco duro SATA firmada.' },
        { stageId: 'n4__fase_inicial', normativaId: 'n4', checked: true, fechaCheck: '2026-06-05T10:40:00Z', observacion: 'Documentación física preliminar completada en laboratorio.' },
        { stageId: 'n1__identificacion', normativaId: 'n1', checked: true, fechaCheck: '2026-06-05T11:00:00Z', observacion: 'Identificación física de serial W461XYZ8 y marca Seagate.' },
        { stageId: 'n8__188', normativaId: 'n8', checked: true, fechaCheck: '2026-06-05T11:15:00Z', observacion: 'Asentamiento en planilla PRCC del precinto de seguridad.' },
        { stageId: 'n3__preservacion', normativaId: 'n3', checked: true, fechaCheck: '2026-06-05T12:00:00Z', observacion: 'Conectado a bloqueador de escritura de hardware Tableau T8u.' },
        { stageId: 'n1__preservacion', normativaId: 'n1', checked: true, fechaCheck: '2026-06-05T12:05:00Z', observacion: 'Montaje de disco en modo de solo lectura verificado.' },
        { stageId: 'n3__adquisicion', normativaId: 'n3', checked: true, fechaCheck: '2026-06-05T14:00:00Z', observacion: 'Imagen bit-a-bit E01 creada con FTK Imager.' },
        { stageId: 'n1__adquisicion', normativaId: 'n1', checked: true, fechaCheck: '2026-06-05T14:10:00Z', observacion: 'Integridad hash verificado pre y post imagen.' }
      ]),
      tipo_proyecto: 'forense_discoduro',
      solicitante_nombre: 'Ing. Luis Eduardo Rivas (Director de TI)',
      solicitante_cedula: 'V-14.829.382',
      correo_investigar: '',
      correo_proveedor: '',
      discoduro_serial: 'W461XYZ8',
      discoduro_capacidad: '2 TB',
      discoduro_marca: 'Seagate Barracuda',
      discoduro_modelo: 'ST2000DM008',
      steps: JSON.stringify({
        hd_step1: { estado: 'completado', fechaInicio: '2026-06-05T10:00:00Z', fechaCompletado: '2026-06-05T10:45:00Z', responsable: 'Carlos Mendoza', observaciones: 'Recepción del disco SATA, inspección física y firma del acta correspondiente.' },
        hd_step2: { estado: 'completado', fechaInicio: '2026-06-05T11:00:00Z', fechaCompletado: '2026-06-05T11:30:00Z', responsable: 'Carlos Mendoza', observaciones: 'Planilla PRCC llenada. Dispositivo etiquetado y sellado en bolsa antiestática con precinto de seguridad.' },
        hd_step3: { estado: 'completado', fechaInicio: '2026-06-05T12:00:00Z', fechaCompletado: '2026-06-05T12:30:00Z', responsable: 'Carlos Mendoza', observaciones: 'Conexión a write-blocker Tableau T8u validada. Unidad montada en modo solo lectura.' },
        hd_step4: { estado: 'completado', fechaInicio: '2026-06-05T13:00:00Z', fechaCompletado: '2026-06-05T14:15:00Z', responsable: 'Carlos Mendoza', observaciones: 'Imagen forense bit-a-bit E01 completada. Hash SHA256 verificado e inmutable.' },
        hd_step5: { estado: 'en_progreso', fechaInicio: '2026-06-11T10:00:00Z' },
        hd_step6: { estado: 'disponible' },
        hd_step7: { estado: 'bloqueado' },
        hd_step8: { estado: 'bloqueado' }
      }),
      created_at: '2026-06-05T09:00:00.000Z',
      updated_at: '2026-06-11T14:30:00.000Z'
    };

    const casoWhatsAppDB = {
      id: 'caso_whatsapp_2026',
      numero_caso: 'SHA-2026-0088',
      titulo: 'Análisis Forense Digital de Imágenes de WhatsApp - Caso Extorsión Telefónica',
      descripcion: 'Extracción lógica y análisis de metadatos, geolocalización y datos EXIF de archivos fotográficos enviados a través de la aplicación de mensajería instantánea WhatsApp Messenger desde un teléfono inteligente Android. La víctima recibió imágenes con amenazas y armas de fuego desde la línea investigada. Se requiere determinar marca del dispositivo capturador original, fecha de captura y georreferenciación de las fotos en caso de existir.',
      estado: 'en_proceso',
      prioridad: 'critica',
      fiscal: 'Abg. José Alirio Peña (Fiscalía de Control 5° del Área Metropolitana de Caracas)',
      dispositivo_marca: 'Xiaomi',
      dispositivo_modelo: 'Redmi Note 12 Pro',
      dispositivo_imei: '860293049102948',
      dispositivo_imei2: '860293049102955',
      dispositivo_sim_card: '895802102938491029F',
      dispositivo_numero_tel: '+58 412-5551234',
      dispositivo_estado_fisico: 'Operativo, pantalla táctil con marcas leves de uso, puerto USB-C libre de obstrucciones.',
      dispositivo_modo_aislamiento: 'Modo Avión y empaque Faraday',
      dispositivo_danos_visibles: 'Pequeño golpe en la esquina inferior izquierda del chasis, que no afecta el funcionamiento.',
      dispositivo_bateria_estado: '82%',
      dispositivo_pantalla_estado: 'Vidrio templado protector fisurado, pantalla LCD original intacta.',
      user_id: 1,
      completed_steps: '{}',
      step_metadata: '{}',
      compliance_checklist: JSON.stringify([
        { stageId: 'n8__187', normativaId: 'n8', checked: true, fechaCheck: '2026-06-08T09:45:00Z', observacion: 'Acta de consignación firmada e incorporada.' },
        { stageId: 'n4__prcc', normativaId: 'n4', checked: true, fechaCheck: '2026-06-08T10:00:00Z', observacion: 'Planilla PRCC debidamente llenada.' },
        { stageId: 'n7__eficacia', normativaId: 'n7', checked: true, fechaCheck: '2026-06-08T09:50:00Z', observacion: 'Integridad formal de firma de consignación validada.' },
        { stageId: 'n1__identificacion', normativaId: 'n1', checked: true, fechaCheck: '2026-06-08T10:10:00Z', observacion: 'Dispositivo identificado físicamente con serial e IMEI.' },
        { stageId: 'n3__adquisicion', normativaId: 'n3', checked: true, fechaCheck: '2026-06-08T11:20:00Z', observacion: 'Adquisición lógica realizada con Andriller. Log de extracción guardado.' },
        { stageId: 'n1__adquisicion', normativaId: 'n1', checked: true, fechaCheck: '2026-06-08T11:25:00Z', observacion: 'Imagen forense lógica creada sin alteraciones en el dispositivo.' },
        { stageId: 'n1__preservacion', normativaId: 'n1', checked: true, fechaCheck: '2026-06-08T12:00:00Z', observacion: 'Dispositivo embalado en bolsa antiestática Faraday con precinto.' },
        { stageId: 'n4__resguardo', normativaId: 'n4', checked: true, fechaCheck: '2026-06-08T12:05:00Z', observacion: 'Ingresado formalmente a Bóveda de Resguardo, código B-04.' }
      ]),
      tipo_proyecto: 'forense_whatsapp',
      solicitante_nombre: 'S/1. Wilmer Daniel Castro',
      solicitante_cedula: 'V-18.293.001',
      correo_investigar: '',
      correo_proveedor: '',
      discoduro_serial: '',
      discoduro_capacidad: '',
      discoduro_marca: '',
      discoduro_modelo: '',
      steps: JSON.stringify({
        wp_step1: { estado: 'completado', fechaInicio: '2026-06-08T09:30:00Z', fechaCompletado: '2026-06-08T10:15:00Z', responsable: 'Carlos Mendoza', observaciones: 'Dispositivo consignado por funcionario del CONAS. Acta de entrevista levantada.' },
        wp_step2: { estado: 'completado', fechaInicio: '2026-06-08T10:15:00Z', fechaCompletado: '2026-06-08T10:45:00Z', responsable: 'Carlos Mendoza', observaciones: 'Planilla PRCC llenada y firmada. Dispositivo guardado en bolsa antiestática Faraday con precinto número 8710.' },
        wp_step3: { estado: 'completado', fechaInicio: '2026-06-08T11:00:00Z', fechaCompletado: '2026-06-08T11:45:00Z', responsable: 'Carlos Mendoza', observaciones: 'Extracción lógica finalizada con Andriller. Integridad SHA-256 calculada.' },
        wp_step4: { estado: 'completado', fechaInicio: '2026-06-08T11:45:00Z', fechaCompletado: '2026-06-08T12:15:00Z', responsable: 'Carlos Mendoza', observaciones: 'Dispositivo original resguardado en bóveda de evidencias físicas.' },
        wp_step5: { estado: 'en_progreso', fechaInicio: '2026-06-11T11:00:00Z' },
        wp_step6: { estado: 'disponible' },
        wp_step7: { estado: 'bloqueado' },
        wp_step8: { estado: 'bloqueado' },
        wp_step9: { estado: 'bloqueado' }
      }),
      created_at: '2026-06-08T08:15:00.000Z',
      updated_at: '2026-06-11T15:20:00.000Z'
    };

    const newCasos = [...existingCasos, casoDiscoDuroDB, casoWhatsAppDB];
    setStorage('sha256_pwa_casos', newCasos);

    const mappedDiscoDuro = {
      id: 'caso_discoduro_2026',
      tipoProyecto: 'forense_discoduro',
      numeroCaso: 'SHA-2026-0087',
      titulo: 'Análisis Forense de Unidad de Almacenamiento - Caso Transacciones Sospechosas',
      descripcion: 'Análisis forense digital y recuperación de datos borrados del disco duro extraído del servidor principal de la empresa Inversiones del Centro C.A., relacionado con presunta legitimación de capitales y desvío de fondos. Se requiere identificar archivos de contabilidad en formato XLSX y PDF eliminados intencionalmente, así como registros de bases de datos locales.',
      estado: 'analisis',
      prioridad: 'alta',
      fechaCreacion: '2026-06-05T09:00:00.000Z',
      fechaUltimaActualizacion: '2026-06-11T14:30:00.000Z',
      peritoLider: 'Carlos Mendoza',
      fiscal: 'Abg. Mariana Silva (Fiscalía 23° con Competencia Plena Nacional)',
      despachoFiscal: 'Fiscalía General de la República - Dirección de Delitos Comunes',
      organismoOrdenante: 'Cuerpo de Investigaciones Científicas, Penales y Criminalísticas (CICPC) - División de Delitos Informáticos',
      solicitante_nombre: 'Ing. Luis Eduardo Rivas (Director de TI)',
      solicitante_cedula: 'V-14.829.382',
      discoduro_serial: 'W461XYZ8',
      discoduro_capacidad: '2 TB',
      discoduro_marca: 'Seagate Barracuda',
      discoduro_modelo: 'ST2000DM008',
      fasesCompletadas: 4,
      totalFases: 8,
      porcentajeCompletado: 50,
      totalEvidencias: 1,
      nivelCumplimientoGeneral: 'parcial',
      etiquetas: ['Legitimación', 'Servidor', 'Disco Duro', 'SATA', 'Recuperación'],
      notas: 'Se ha verificado la integridad del disco duro. Copia bit-a-bit realizada con éxito y almacenada en servidor seguro del laboratorio forense. Se inicia la fase de análisis de particiones y file carving en busca de archivos borrados.',
      steps: JSON.parse(casoDiscoDuroDB.steps),
      compliance_checklist: JSON.parse(casoDiscoDuroDB.compliance_checklist)
    };

    const mappedWhatsApp = {
      id: 'caso_whatsapp_2026',
      tipoProyecto: 'forense_whatsapp',
      numeroCaso: 'SHA-2026-0088',
      titulo: 'Análisis Forense Digital de Imágenes de WhatsApp - Caso Extorsión Telefónica',
      descripcion: 'Extracción lógica y análisis de metadatos, geolocalización y datos EXIF de archivos fotográficos enviados a través de la aplicación de mensajería instantánea WhatsApp Messenger desde un teléfono inteligente Android. La víctima recibió imágenes con amenazas y armas de fuego desde la línea investigada. Se requiere determinar marca del dispositivo capturador original, fecha de captura y georreferenciación de las fotos en caso de existir.',
      estado: 'en_proceso',
      prioridad: 'critica',
      fechaCreacion: '2026-06-08T08:15:00.000Z',
      fechaUltimaActualizacion: '2026-06-11T15:20:00.000Z',
      peritoLider: 'Carlos Mendoza',
      fiscal: 'Abg. José Alirio Peña (Fiscalía de Control 5° del Área Metropolitana de Caracas)',
      despachoFiscal: 'Ministerio Público - Fiscalía Especial contra la Extorsión y el Secuestro',
      organismoOrdenante: 'Comando Nacional Antiextorsión y Secuestro (CONAS - GNB)',
      solicitante_nombre: 'S/1. Wilmer Daniel Castro',
      solicitante_cedula: 'V-18.293.001',
      dispositivo_marca: 'Xiaomi',
      dispositivo_modelo: 'Redmi Note 12 Pro',
      dispositivo_imei: '860293049102948',
      dispositivo_imei2: '860293049102955',
      dispositivo_sim_card: '895802102938491029F',
      dispositivo_numero_tel: '+58 412-5551234',
      dispositivo_estado_fisico: 'Operativo, pantalla táctil con marcas leves de uso, puerto USB-C libre de obstrucciones.',
      dispositivo_modo_aislamiento: 'Modo Avión y empaque Faraday',
      dispositivo_danos_visibles: 'Pequeño golpe en la esquina inferior izquierda del chasis, que no afecta el funcionamiento.',
      dispositivo_bateria_estado: '82%',
      dispositivo_pantalla_estado: 'Vidrio templado protector fisurado, pantalla LCD original intacta.',
      fasesCompletadas: 4,
      totalFases: 9,
      porcentajeCompletado: 44,
      totalEvidencias: 1,
      nivelCumplimientoGeneral: 'parcial',
      etiquetas: ['Extorsión', 'WhatsApp', 'Fotos', 'EXIF', 'Xiaomi', 'Android'],
      notas: 'Se ha completado la extracción lógica del Redmi Note 12 Pro usando Andriller. La imagen se encuentra resguardada en el servidor central del laboratorio. Se procede a cargar la extracción en ALEAPP e IPED para procesar la base de datos de WhatsApp y extraer los adjuntos (imágenes y metadatos).',
      steps: JSON.parse(casoWhatsAppDB.steps),
      compliance_checklist: JSON.parse(casoWhatsAppDB.compliance_checklist)
    };

    const generateTareasForCaso = (casoId: string, tipo: 'forense_discoduro' | 'forense_whatsapp', stepsState: any, perito: string) => {
      const list: any[] = [];
      const pasos = getPasosPorTipo(tipo);
      pasos.forEach(paso => {
        const stepState = stepsState[paso.id] || { estado: 'bloqueado' };
        paso.tareas.forEach((tTitulo, idx) => {
          let estado = 'pendiente';
          let porcentaje = 0;
          let fechaCompletada = undefined;

          if (stepState.estado === 'completado') {
            estado = 'completada';
            porcentaje = 100;
            fechaCompletada = stepState.fechaCompletado;
          } else if (stepState.estado === 'en_progreso') {
            if (idx === 0) {
              estado = 'completada';
              porcentaje = 100;
              fechaCompletada = stepState.fechaInicio;
            } else if (idx === 1) {
              estado = 'en_progreso';
              porcentaje = 50;
            } else {
              estado = 'pendiente';
              porcentaje = 0;
            }
          }

          list.push({
            id: `t_${casoId}_${paso.id}_${idx}`,
            casoId,
            pasoId: paso.id,
            titulo: tTitulo,
            descripcion: `Procedimiento de compliance para la etapa: ${paso.titulo}`,
            asignadoA: perito,
            estado,
            prioridad: 'media',
            porcentaje,
            fechaCreacion: stepState.fechaInicio || '2026-06-05T09:00:00.000Z',
            fechaVencimiento: undefined,
            fechaCompletada,
            normativasRelacionadas: paso.normativas.map(n => n.label),
            observaciones: estado === 'completada' ? 'Verificado satisfactoriamente.' : ''
          });
        });
      });
      return list;
    };

    const tareasDiscoDuro = generateTareasForCaso('caso_discoduro_2026', 'forense_discoduro', mappedDiscoDuro.steps, 'Carlos Mendoza');
    const tareasWhatsApp = generateTareasForCaso('caso_whatsapp_2026', 'forense_whatsapp', mappedWhatsApp.steps, 'Carlos Mendoza');

    const evidenciasSeeded = [
      {
        id: 'evidencia_discoduro_2026',
        casoId: 'caso_discoduro_2026',
        numero: 'EXP-0087-E1',
        tipo: 'computador',
        descripcion: 'Disco duro interno de 3.5 pulgadas, marca Seagate Barracuda de 2TB, extraído de Workstation marca HP modelo Z4.',
        marca: 'Seagate',
        modelo: 'ST2000DM008',
        serial: 'W461XYZ8',
        estadoFisico: 'Buen estado de conservación, sin daños físicos externos visibles en la tarjeta lógica ni en los puertos de conexión SATA.',
        hashSHA256: 'f2ca1bb6c7e907d06dafe4687e579fce76b377f93e90085a639ef1f56b50a273',
        hashMD5: '3d6a2fcf88b5efbc496fae21334c9c1b',
        fechaRecepcion: '2026-06-05T10:15:00.000Z',
        ubicacionFisica: 'Bóveda de Evidencias - Gaveta A-12',
        sellado: true,
        etiquetado: true
      },
      {
        id: 'evidencia_whatsapp_2026',
        casoId: 'caso_whatsapp_2026',
        numero: 'EXP-0088-E1',
        tipo: 'dispositivo_movil',
        descripcion: 'Teléfono inteligente Xiaomi Redmi Note 12 Pro, color azul, con tarjeta SIM Digitel y estuche protector de silicona transparente.',
        marca: 'Xiaomi',
        modelo: 'Redmi Note 12 Pro',
        serial: 'REDMI12P9832',
        imei: '860293049102948',
        estadoFisico: 'Operativo, pantalla táctil con marcas leves de uso, puerto USB-C libre de obstrucciones.',
        hashSHA256: 'a45c3de71c08ff94e09f2d18476bb13a693ef2b89d41ea896ea2f9c8ef78201a',
        hashMD5: '8d5e1b212fdf8c7a6e1a49ab293fdf91',
        fechaRecepcion: '2026-06-08T09:30:00.000Z',
        ubicacionFisica: 'Bóveda de Evidencias - Caja Faraday F-3',
        sellado: true,
        etiquetado: true
      }
    ];

    const personalSeeded = [
      {
        id: 'carlos_mendoza',
        nombre: 'Carlos',
        apellido: 'Mendoza',
        ci: 'V-15.340.293',
        cargo: 'Perito Informático Principal',
        rol: 'perito_lider',
        organismo: 'MP',
        despacho: 'Laboratorio de Informática Forense',
        email: 'carlos.mendoza@sha256.us',
        telefono: '+58 414-1234567',
        activo: true,
        ranking: 5
      },
      {
        id: 'mariana_silva',
        nombre: 'Mariana',
        apellido: 'Silva',
        ci: 'V-16.749.102',
        cargo: 'Fiscal Adscrita',
        rol: 'fiscal',
        organismo: 'MP',
        despacho: 'Fiscalía 23° Nacional',
        email: 'mariana.silva@fiscalia.mp.gob.ve',
        telefono: '+58 424-9876543',
        activo: true,
        ranking: 4
      },
      {
        id: 'jose_pena',
        nombre: 'José Alirio',
        apellido: 'Peña',
        ci: 'V-12.839.401',
        cargo: 'Fiscal de Control',
        rol: 'fiscal',
        organismo: 'MP',
        despacho: 'Fiscalía 5° contra Extorsión',
        email: 'jose.pena@fiscalia.mp.gob.ve',
        telefono: '+58 416-5554321',
        activo: true,
        ranking: 4
      }
    ];

    const auditLogsSeeded = [
      { id: 'log_dd_1', casoId: 'caso_discoduro_2026', usuario: 'Carlos Mendoza', accion: 'CASO_CREADO', detalle: 'Caso SHA-2026-0087 creado exitosamente en base de datos local PWA.', timestamp: '2026-06-05T09:05:00.000Z', nivel: 'success' },
      { id: 'log_dd_2', casoId: 'caso_discoduro_2026', usuario: 'Carlos Mendoza', accion: 'PASO_COMPLETADO', detalle: 'Paso hd_step1 completado — Recepción y Documentación del Dispositivo', timestamp: '2026-06-05T10:45:00.000Z', nivel: 'success' },
      { id: 'log_dd_3', casoId: 'caso_discoduro_2026', usuario: 'Carlos Mendoza', accion: 'PASO_COMPLETADO', detalle: 'Paso hd_step2 completado — Cadena de Custodia y PRCC', timestamp: '2026-06-05T11:30:00.000Z', nivel: 'success' },
      { id: 'log_dd_4', casoId: 'caso_discoduro_2026', usuario: 'Carlos Mendoza', accion: 'PASO_COMPLETADO', detalle: 'Paso hd_step3 completado — Conexión con Write-Blocker', timestamp: '2026-06-05T12:30:00.000Z', nivel: 'success' },
      { id: 'log_dd_5', casoId: 'caso_discoduro_2026', usuario: 'Carlos Mendoza', accion: 'PASO_COMPLETADO', detalle: 'Paso hd_step4 completado — Creación de Imagen Bit-a-Bit (DD / E01)', timestamp: '2026-06-05T14:15:00.000Z', nivel: 'success' },
      { id: 'log_dd_6', casoId: 'caso_discoduro_2026', usuario: 'Carlos Mendoza', accion: 'PASO_INICIADO', detalle: 'Paso hd_step5 iniciado — Análisis de Particiones y Sistema de Archivos', timestamp: '2026-06-11T10:00:00.000Z', nivel: 'info' },
      { id: 'log_wa_1', casoId: 'caso_whatsapp_2026', usuario: 'Carlos Mendoza', accion: 'CASO_CREADO', detalle: 'Caso SHA-2026-0088 creado exitosamente en base de datos local PWA.', timestamp: '2026-06-08T08:20:00.000Z', nivel: 'success' },
      { id: 'log_wa_2', casoId: 'caso_whatsapp_2026', usuario: 'Carlos Mendoza', accion: 'PASO_COMPLETADO', detalle: 'Paso wp_step1 completado — Recepción, Entrevista y Consignación', timestamp: '2026-06-08T10:15:00.000Z', nivel: 'success' },
      { id: 'log_wa_3', casoId: 'caso_whatsapp_2026', usuario: 'Carlos Mendoza', accion: 'PASO_COMPLETADO', detalle: 'Paso wp_step2 completado — Cadena de Custodia Inicial (PRCC)', timestamp: '2026-06-08T10:45:00.000Z', nivel: 'success' },
      { id: 'log_wa_4', casoId: 'caso_whatsapp_2026', usuario: 'Carlos Mendoza', accion: 'PASO_COMPLETADO', detalle: 'Paso wp_step3 completado — Extracción Forense con Avilla / Andriller', timestamp: '2026-06-08T11:45:00.000Z', nivel: 'success' },
      { id: 'log_wa_5', casoId: 'caso_whatsapp_2026', usuario: 'Carlos Mendoza', accion: 'PASO_COMPLETADO', detalle: 'Paso wp_step4 completado — Resguardo y Sellado de Evidencia Original', timestamp: '2026-06-08T12:15:00.000Z', nivel: 'success' },
      { id: 'log_wa_6', casoId: 'caso_whatsapp_2026', usuario: 'Carlos Mendoza', accion: 'PASO_INICIADO', detalle: 'Paso wp_step5 iniciado — Procesamiento con ALEAPP e IPED Digital Forensic Tool', timestamp: '2026-06-11T11:00:00.000Z', nivel: 'info' }
    ];

    const storeData = getStorage<any>('cms-neon-storage', null);
    if (storeData && storeData.state) {
      const state = storeData.state;
      if (!state.casos) state.casos = [];
      if (!state.casos.some((c: any) => c.id === 'caso_discoduro_2026')) {
        state.casos.push(mappedDiscoDuro);
      }
      if (!state.casos.some((c: any) => c.id === 'caso_whatsapp_2026')) {
        state.casos.push(mappedWhatsApp);
      }

      if (!state.evidencias) state.evidencias = [];
      evidenciasSeeded.forEach(e => {
        if (!state.evidencias.some((x: any) => x.id === e.id)) {
          state.evidencias.push(e);
        }
      });

      if (!state.tareas) state.tareas = [];
      const allNewTareas = [...tareasDiscoDuro, ...tareasWhatsApp];
      allNewTareas.forEach(t => {
        if (!state.tareas.some((x: any) => x.id === t.id)) {
          state.tareas.push(t);
        }
      });

      if (!state.personal) state.personal = [];
      personalSeeded.forEach(p => {
        if (!state.personal.some((x: any) => x.id === p.id)) {
          state.personal.push(p);
        }
      });

      if (!state.auditLogs) state.auditLogs = [];
      auditLogsSeeded.forEach(l => {
        if (!state.auditLogs.some((x: any) => x.id === l.id)) {
          state.auditLogs.unshift(l);
        }
      });

      if (!state.complianceChecklist) state.complianceChecklist = [];
      const globalComplianceSeeded = [...mappedDiscoDuro.compliance_checklist, ...mappedWhatsApp.compliance_checklist];
      globalComplianceSeeded.forEach(item => {
        if (!state.complianceChecklist.some((x: any) => x.stageId === item.stageId && x.normativaId === item.normativaId)) {
          state.complianceChecklist.push(item);
        }
      });

      setStorage('cms-neon-storage', storeData);
    } else {
      const initialStore = {
        state: {
          casos: [mappedDiscoDuro, mappedWhatsApp],
          evidencias: evidenciasSeeded,
          tareas: [...tareasDiscoDuro, ...tareasWhatsApp],
          fases: [],
          personal: personalSeeded,
          normativas: [],
          auditLogs: auditLogsSeeded,
          complianceChecklist: [...mappedDiscoDuro.compliance_checklist, ...mappedWhatsApp.compliance_checklist],
          casoSeleccionado: null,
          filtroEstado: 'todos',
          filtroPrioridad: 'todos',
          busqueda: '',
          _dataMigrated: true
        },
        version: 0
      };
      setStorage('cms-neon-storage', initialStore);
    }
  }

  seedInitialUsers();
  seedInitialCasos();

  const selectedFilesMap = new Map<string, File>();

  window.electronAPI = {
    platform: 'browser',
    operationMode: 'production',
    dialog: {
      selectFile: async (filters) => {
        return new Promise((resolve) => {
          const input = document.createElement('input');
          input.type = 'file';
          if (filters && filters.length > 0) {
            const extensions = filters.map((f: any) => f.extensions.map((ext: string) => `.${ext}`).join(',')).join(',');
            input.accept = extensions;
          }
          input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
              selectedFilesMap.set(file.name, file);
              resolve({ canceled: false, filePaths: [file.name] });
            } else {
              resolve({ canceled: true, filePaths: [] });
            }
          };
          input.click();
        });
      }
    },
    file: {
      writeJson: async (filePath, data) => {
        setStorage(`sha256_file_${filePath}`, data);
        return { success: true };
      },
      readJson: async (filePath) => {
        const data = localStorage.getItem(`sha256_file_${filePath}`);
        if (data) {
          return { success: true, data: JSON.parse(data) };
        }
        return { success: false, error: 'Archivo no encontrado en local storage' };
      }
    },
    hash: {
      calculate: async (filePath, algorithm = 'sha256') => {
        const file = selectedFilesMap.get(filePath);
        if (file) {
          try {
            const buffer = await file.arrayBuffer();
            const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            return { success: true, hash: hashHex, algorithm, verified: true };
          } catch (e) {
            console.error('Error calculando hash nativo:', e);
            return { success: false, hash: '', algorithm, verified: false, error: 'Error al calcular hash con Web Crypto' };
          }
        }
        return { success: false, hash: '', algorithm, verified: false, error: 'Archivo no disponible para cálculo de hash.' };
      }
    },
    db: {
      getCasos: async (userId: number) => {
        return getCasosDB(userId);
      },
      addCaso: async (caso: any) => {
        return addCasoDB(caso);
      },
      updateCaso: async (id: string, data: any) => {
        return updateCasoDB(id, data);
      },
      deleteCaso: async (id: string) => {
        return deleteCasoDB(id);
      },
      saveState: async (userId, state) => {
        setStorage(`sha256_pwa_state_${userId}`, state);
        return { success: true };
      },
      loadState: async (userId) => {
        return getStorage(`sha256_pwa_state_${userId}`, null);
      },
      getUsers: async () => {
        return getStorage('sha256_pwa_users', []);
      },
      addUser: async (userIdMaker, user) => {
        const users = getStorage<any[]>('sha256_pwa_users', []);
        
        if (users.some(u => u.username.toLowerCase() === user.username.toLowerCase())) {
          return { success: false, error: 'El nombre de usuario ya está registrado' };
        }

        const newId = Date.now();
        const nuevo = {
          id: newId,
          username: user.username,
          nombre: user.nombre,
          apellido: user.apellido,
          rol: user.rol || 'perito_asistente',
          activo: 1,
          ci: user.ci || '',
          cargo: user.cargo || '',
          email: user.email || '',
          telefono: user.telefono || '',
          despacho: user.despacho || '',
          ranking: user.ranking || 0,
          profile_image: user.profile_image || '',
          created_at: new Date().toISOString()
        };
        users.push(nuevo);
        setStorage('sha256_pwa_users', users);

        const adminUser = users.find(u => u.id === userIdMaker) || users[0];
        const logDetail = `Usuario ${user.username} creado exitosamente en modo PWA por ${adminUser.username}`;
        await addAuditLogDB({
          id: Date.now().toString(),
          user_id: adminUser.id,
          accion: 'USUARIO_CREADO',
          detalle: logDetail,
          timestamp: new Date().toISOString(),
          nombre: adminUser.nombre,
          apellido: adminUser.apellido,
          username: adminUser.username
        });

        return { success: true, id: newId };
      },
      updateUser: async (userIdMaker, userId, data) => {
        const users = getStorage<any[]>('sha256_pwa_users', []);
        const idx = users.findIndex(u => u.id === userId);
        if (idx !== -1) {
          users[idx] = { ...users[idx], ...data };
          setStorage('sha256_pwa_users', users);
          
          const adminUser = users.find(u => u.id === userIdMaker) || users[0];
          const logDetail = `Usuario ID ${userId} actualizado en base de datos local PWA`;
          await addAuditLogDB({
            id: Date.now().toString(),
            user_id: adminUser.id,
            accion: 'USUARIO_ACTUALIZADO',
            detalle: logDetail,
            timestamp: new Date().toISOString(),
            nombre: adminUser.nombre,
            apellido: adminUser.apellido,
            username: adminUser.username
          });
          return { success: true };
        }
        return { success: false, error: 'Usuario no encontrado' };
      },
      getAuditLogs: async () => {
        return getAuditLogsDB();
      },
      addAuditLog: async (log) => {
        return addAuditLogDB(log);
      }
    },
    auth: {
      login: async ({ username, password }) => {
        const users = getStorage<any[]>('sha256_pwa_users', []);
        const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());
        if (!user) {
          return { success: false, message: 'Credenciales inválidas. Acceso denegado.' };
        }
        const hashPass = await sha256Local(password);
        if (hashPass !== user.password_hash) {
          return { success: false, message: 'Credenciales inválidas. Acceso denegado.' };
        }
        const token = `session-token-${Date.now()}`;
        const sessionUser = {
          id: user.id,
          username: user.username,
          nombre: `${user.nombre} ${user.apellido}`.trim(),
          rol: user.rol,
          profileImage: user.profile_image || '',
          token
        };
        setStorage('sha256_active_session', sessionUser);
        
        return { success: true, user: sessionUser };
      },
      validate: async (token) => {
        const session = getStorage<any>('sha256_active_session', null);
        if (session && session.token === token) {
          return { success: true, user: session };
        }
        return { success: false };
      },
      logout: async () => {
        localStorage.removeItem('sha256_active_session');
        return { success: true };
      },
      changePassword: async (userId, newPassword) => {
        const users = getStorage<any[]>('sha256_pwa_users', []);
        const idx = users.findIndex(u => u.id === userId);
        if (idx !== -1) {
          const hashNew = await sha256Local(newPassword);
          users[idx].password_hash = hashNew;
          setStorage('sha256_pwa_users', users);
          return { success: true };
        }
        return { success: false, error: 'Usuario no encontrado' };
      }
    }
  };
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ToastProvider>
      <HashRouter>
        <App />
      </HashRouter>
    </ToastProvider>
  </React.StrictMode>
);
