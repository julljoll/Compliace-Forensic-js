import { neon } from '@neondatabase/serverless';

// URL de conexión desde .env o fallback hardcoded
const DATABASE_URL = 'postgresql://neondb_owner:npg_ihDl8tNV2WfU@ep-snowy-queen-aiztzvtv-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

// Inicializar el cliente Neon si fetch está disponible (entorno navegador)
let sqlClient: any = null;
try {
  if (typeof fetch !== 'undefined') {
    sqlClient = neon(DATABASE_URL);
  }
} catch (e) {
  console.error('Error al inicializar el cliente Neon:', e);
}

// Inicializar tablas en la base de datos
export async function initDatabase() {
  if (!sqlClient) return false;
  try {
    // Tabla de casos / proyectos
    await sqlClient(`
      CREATE TABLE IF NOT EXISTS casos (
        id VARCHAR(255) PRIMARY KEY,
        numero_caso VARCHAR(100) UNIQUE NOT NULL,
        titulo VARCHAR(255) NOT NULL,
        descripcion TEXT,
        estado VARCHAR(50) NOT NULL,
        prioridad VARCHAR(50) DEFAULT 'media',
        fiscal VARCHAR(255),
        dispositivo_marca VARCHAR(255),
        dispositivo_modelo VARCHAR(255),
        dispositivo_imei VARCHAR(255),
        dispositivo_imei2 VARCHAR(255),
        dispositivo_sim_card VARCHAR(255),
        dispositivo_numero_tel VARCHAR(255),
        dispositivo_estado_fisico TEXT,
        dispositivo_modo_aislamiento VARCHAR(100),
        dispositivo_danos_visibles TEXT,
        dispositivo_bateria_estado VARCHAR(50),
        dispositivo_pantalla_estado VARCHAR(50),
        user_id INTEGER NOT NULL DEFAULT 1,
        completed_steps TEXT, -- Almacenará JSON serializado de steps completados
        step_metadata TEXT,    -- Almacenará JSON serializado de metadatos de steps
        compliance_checklist TEXT, -- Almacenará JSON serializado del checklist de compliance
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabla de logs de auditoría
    await sqlClient(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id VARCHAR(255) PRIMARY KEY,
        user_id INTEGER NOT NULL DEFAULT 1,
        accion VARCHAR(100) NOT NULL,
        detalle TEXT NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        nombre VARCHAR(100),
        apellido VARCHAR(100),
        username VARCHAR(100)
      )
    `);

    console.log('Tablas en Neon Serverless inicializadas correctamente.');
    return true;
  } catch (e) {
    console.error('Error al inicializar la base de datos Neon:', e);
    return false;
  }
}

// --- Casos (Proyectos) ---

export async function getCasosDB(userId: number = 1): Promise<any[]> {
  if (!sqlClient) {
    return loadCasosLocal();
  }
  try {
    const rows = await sqlClient('SELECT * FROM casos WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    // Guardar en local para soporte offline
    localStorage.setItem('sha256_pwa_casos', JSON.stringify(rows));
    return rows;
  } catch (e) {
    console.error('Error al obtener casos de Neon, cargando locales:', e);
    return loadCasosLocal();
  }
}

export async function addCasoDB(caso: any): Promise<{ success: boolean; id: string; error?: string }> {
  const newId = caso.id || `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  if (!sqlClient) {
    saveCasoLocal({ ...caso, id: newId });
    return { success: true, id: newId };
  }
  try {
    await sqlClient(`
      INSERT INTO casos (
        id, numero_caso, titulo, descripcion, estado, prioridad, fiscal,
        dispositivo_marca, dispositivo_modelo, dispositivo_imei, dispositivo_imei2,
        dispositivo_sim_card, dispositivo_numero_tel, dispositivo_estado_fisico,
        dispositivo_modo_aislamiento, dispositivo_danos_visibles, dispositivo_bateria_estado,
        dispositivo_pantalla_estado, user_id, completed_steps, step_metadata, compliance_checklist, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24)
    `, [
      newId,
      caso.numero_caso || caso.numeroCaso || '',
      caso.titulo || '',
      caso.descripcion || '',
      caso.estado || 'iniciado',
      caso.prioridad || 'media',
      caso.fiscal || '',
      caso.dispositivo_marca || '',
      caso.dispositivo_modelo || '',
      caso.dispositivo_imei || '',
      caso.dispositivo_imei2 || '',
      caso.dispositivo_sim_card || '',
      caso.dispositivo_numero_tel || '',
      caso.dispositivo_estado_fisico || '',
      caso.dispositivo_modo_aislamiento || '',
      caso.dispositivo_danos_visibles || '',
      caso.dispositivo_bateria_estado || '',
      caso.dispositivo_pantalla_estado || '',
      caso.user_id || 1,
      caso.completed_steps ? JSON.stringify(caso.completed_steps) : '{}',
      caso.step_metadata ? JSON.stringify(caso.step_metadata) : '{}',
      caso.compliance_checklist ? JSON.stringify(caso.compliance_checklist) : '[]',
      caso.created_at || new Date().toISOString(),
      new Date().toISOString()
    ]);
    return { success: true, id: newId };
  } catch (e: any) {
    console.error('Error al insertar caso en Neon:', e);
    saveCasoLocal({ ...caso, id: newId });
    return { success: true, id: newId, error: e.message };
  }
}

export async function updateCasoDB(id: string, data: any): Promise<boolean> {
  if (!sqlClient) {
    updateCasoLocal(id, data);
    return true;
  }
  try {
    // Determinar qué campos se van a actualizar dinámicamente o hacer una actualización completa
    const current = await sqlClient('SELECT * FROM casos WHERE id = $1', [id]);
    if (current.length === 0) return false;

    const row = current[0];
    const merged = {
      titulo: data.titulo !== undefined ? data.titulo : row.titulo,
      descripcion: data.descripcion !== undefined ? data.descripcion : row.descripcion,
      estado: data.estado !== undefined ? data.estado : row.estado,
      prioridad: data.prioridad !== undefined ? data.prioridad : row.prioridad,
      fiscal: data.fiscal !== undefined ? data.fiscal : row.fiscal,
      dispositivo_marca: data.dispositivo_marca !== undefined ? data.dispositivo_marca : row.dispositivo_marca,
      dispositivo_modelo: data.dispositivo_modelo !== undefined ? data.dispositivo_modelo : row.dispositivo_modelo,
      dispositivo_imei: data.dispositivo_imei !== undefined ? data.dispositivo_imei : row.dispositivo_imei,
      dispositivo_imei2: data.dispositivo_ime2 !== undefined ? data.dispositivo_ime2 : row.dispositivo_imei2,
      dispositivo_sim_card: data.dispositivo_sim_card !== undefined ? data.dispositivo_sim_card : row.dispositivo_sim_card,
      dispositivo_numero_tel: data.dispositivo_numero_tel !== undefined ? data.dispositivo_numero_tel : row.dispositivo_numero_tel,
      dispositivo_estado_fisico: data.dispositivo_estado_fisico !== undefined ? data.dispositivo_estado_fisico : row.dispositivo_estado_fisico,
      dispositivo_modo_aislamiento: data.dispositivo_modo_aislamiento !== undefined ? data.dispositivo_modo_aislamiento : row.dispositivo_modo_aislamiento,
      dispositivo_danos_visibles: data.dispositivo_danos_visibles !== undefined ? data.dispositivo_danos_visibles : row.dispositivo_danos_visibles,
      dispositivo_bateria_estado: data.dispositivo_bateria_estado !== undefined ? data.dispositivo_bateria_estado : row.dispositivo_bateria_estado,
      dispositivo_pantalla_estado: data.dispositivo_pantalla_estado !== undefined ? data.dispositivo_pantalla_estado : row.dispositivo_pantalla_estado,
      completed_steps: data.completed_steps !== undefined ? JSON.stringify(data.completed_steps) : row.completed_steps,
      step_metadata: data.step_metadata !== undefined ? JSON.stringify(data.step_metadata) : row.step_metadata,
      compliance_checklist: data.compliance_checklist !== undefined ? JSON.stringify(data.compliance_checklist) : row.compliance_checklist,
    };

    await sqlClient(`
      UPDATE casos SET
        titulo = $1, descripcion = $2, estado = $3, prioridad = $4, fiscal = $5,
        dispositivo_marca = $6, dispositivo_modelo = $7, dispositivo_imei = $8, dispositivo_imei2 = $9,
        dispositivo_sim_card = $10, dispositivo_numero_tel = $11, dispositivo_estado_fisico = $12,
        dispositivo_modo_aislamiento = $13, dispositivo_danos_visibles = $14, dispositivo_bateria_estado = $15,
        dispositivo_pantalla_estado = $16, completed_steps = $17, step_metadata = $18, compliance_checklist = $19, updated_at = CURRENT_TIMESTAMP
      WHERE id = $20
    `, [
      merged.titulo, merged.descripcion, merged.estado, merged.prioridad, merged.fiscal,
      merged.dispositivo_marca, merged.dispositivo_modelo, merged.dispositivo_imei, merged.dispositivo_imei2,
      merged.dispositivo_sim_card, merged.dispositivo_numero_tel, merged.dispositivo_estado_fisico,
      merged.dispositivo_modo_aislamiento, merged.dispositivo_danos_visibles, merged.dispositivo_bateria_estado,
      merged.dispositivo_pantalla_estado, merged.completed_steps, merged.step_metadata, merged.compliance_checklist, id
    ]);
    return true;
  } catch (e) {
    console.error('Error al actualizar caso en Neon:', e);
    updateCasoLocal(id, data);
    return true;
  }
}

export async function deleteCasoDB(id: string): Promise<boolean> {
  if (!sqlClient) {
    deleteCasoLocal(id);
    return true;
  }
  try {
    await sqlClient('DELETE FROM casos WHERE id = $1', [id]);
    deleteCasoLocal(id);
    return true;
  } catch (e) {
    console.error('Error al eliminar caso en Neon:', e);
    deleteCasoLocal(id);
    return true;
  }
}

// --- Logs de Auditoría ---

export async function getAuditLogsDB(): Promise<any[]> {
  if (!sqlClient) {
    return loadLogsLocal();
  }
  try {
    const rows = await sqlClient('SELECT * FROM audit_logs ORDER BY timestamp DESC');
    localStorage.setItem('sha256_pwa_audit_logs', JSON.stringify(rows));
    return rows;
  } catch (e) {
    console.error('Error al obtener audit logs de Neon:', e);
    return loadLogsLocal();
  }
}

export async function addAuditLogDB(log: any): Promise<boolean> {
  const newId = log.id || `${Date.now()}`;
  if (!sqlClient) {
    saveLogLocal({ ...log, id: newId });
    return true;
  }
  try {
    await sqlClient(`
      INSERT INTO audit_logs (id, user_id, accion, detalle, timestamp, nombre, apellido, username)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [
      newId,
      log.user_id || 1,
      log.accion,
      log.detalle,
      log.timestamp || new Date().toISOString(),
      log.nombre || '',
      log.apellido || '',
      log.username || ''
    ]);
    return true;
  } catch (e) {
    console.error('Error al agregar audit log a Neon:', e);
    saveLogLocal({ ...log, id: newId });
    return true;
  }
}

// --- Funciones auxiliares de LocalStorage ---

function loadCasosLocal(): any[] {
  const stored = localStorage.getItem('sha256_pwa_casos');
  return stored ? JSON.parse(stored) : [];
}

function saveCasoLocal(caso: any) {
  const casos = loadCasosLocal();
  casos.push(caso);
  localStorage.setItem('sha256_pwa_casos', JSON.stringify(casos));
}

function updateCasoLocal(id: string, data: any) {
  const casos = loadCasosLocal();
  const index = casos.findIndex(c => c.id === id);
  if (index !== -1) {
    casos[index] = { ...casos[index], ...data, updated_at: new Date().toISOString() };
    localStorage.setItem('sha256_pwa_casos', JSON.stringify(casos));
  }
}

function deleteCasoLocal(id: string) {
  const casos = loadCasosLocal();
  const filtered = casos.filter(c => c.id !== id);
  localStorage.setItem('sha256_pwa_casos', JSON.stringify(filtered));
}

function loadLogsLocal(): any[] {
  const stored = localStorage.getItem('sha256_pwa_audit_logs');
  return stored ? JSON.parse(stored) : [];
}

function saveLogLocal(log: any) {
  const logs = loadLogsLocal();
  logs.unshift(log);
  localStorage.setItem('sha256_pwa_audit_logs', JSON.stringify(logs));
}
