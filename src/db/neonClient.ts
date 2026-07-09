import { neon, neonConfig } from '@neondatabase/serverless';

// Configuración necesaria para browser
try {
  neonConfig.fetchConnectionCache = true;
} catch (e) {
  // silent
}

// Neon connection string desde variable de entorno
const NEON_DATABASE_URL: string = process.env.NEXT_PUBLIC_DATABASE_URL || '';
export const isNeonConfigured: boolean = !!NEON_DATABASE_URL && NEON_DATABASE_URL.startsWith('postgresql://');

// Inicializar el cliente Neon con connection string (HTTP queries)
let sqlClient: any = null;
if (isNeonConfigured) {
  try {
    if (typeof fetch !== 'undefined') {
      const rawClient = neon(NEON_DATABASE_URL);
      sqlClient = (query: string, params?: any[]) => {
        return rawClient.query(query, params);
      };
      console.info('[NeonDB] Cliente inicializado con connection string.');
    }
  } catch (e) {
    console.error('[NeonDB] Error al inicializar cliente:', e);
  }
} else {
  console.warn('[NeonDB] NEXT_PUBLIC_DATABASE_URL no configurada — operando en modo local (localStorage/Zustand).');
}

// Verificar conexión a la base de datos Neon
export async function checkConnection(): Promise<boolean> {
  if (!sqlClient) return false;
  try {
    await sqlClient('SELECT 1');
    return true;
  } catch (e) {
    console.error('Error de conexión a Neon:', e);
    return false;
  }
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
        completed_steps TEXT,
        step_metadata TEXT,
        compliance_checklist TEXT,
        tipo_proyecto VARCHAR(100) DEFAULT 'forense_whatsapp',
        solicitante_nombre VARCHAR(255),
        solicitante_cedula VARCHAR(100),
        correo_investigar VARCHAR(255),
        correo_proveedor VARCHAR(255),
        discoduro_serial VARCHAR(255),
        discoduro_capacidad VARCHAR(255),
        discoduro_marca VARCHAR(255),
        discoduro_modelo VARCHAR(255),
        steps TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Migraciones automáticas mediante ALTER TABLE si la tabla ya existía sin estas columnas
    await sqlClient(`ALTER TABLE casos ADD COLUMN IF NOT EXISTS tipo_proyecto VARCHAR(100) DEFAULT 'forense_whatsapp'`);
    await sqlClient(`ALTER TABLE casos ADD COLUMN IF NOT EXISTS solicitante_nombre VARCHAR(255)`);
    await sqlClient(`ALTER TABLE casos ADD COLUMN IF NOT EXISTS solicitante_cedula VARCHAR(100)`);
    await sqlClient(`ALTER TABLE casos ADD COLUMN IF NOT EXISTS correo_investigar VARCHAR(255)`);
    await sqlClient(`ALTER TABLE casos ADD COLUMN IF NOT EXISTS correo_proveedor VARCHAR(255)`);
    await sqlClient(`ALTER TABLE casos ADD COLUMN IF NOT EXISTS discoduro_serial VARCHAR(255)`);
    await sqlClient(`ALTER TABLE casos ADD COLUMN IF NOT EXISTS discoduro_capacidad VARCHAR(255)`);
    await sqlClient(`ALTER TABLE casos ADD COLUMN IF NOT EXISTS discoduro_marca VARCHAR(255)`);
    await sqlClient(`ALTER TABLE casos ADD COLUMN IF NOT EXISTS discoduro_modelo VARCHAR(255)`);
    await sqlClient(`ALTER TABLE casos ADD COLUMN IF NOT EXISTS steps TEXT`);

    // Tabla de usuarios autorizados (login por correo)
    await sqlClient(`
      CREATE TABLE IF NOT EXISTS authorized_users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        nombre VARCHAR(255) DEFAULT '',
        activo BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insertar usuario autorizado por defecto si la tabla está vacía
    const existingUsers = await sqlClient('SELECT COUNT(*) as count FROM authorized_users');
    const count = Number(existingUsers[0]?.count ?? existingUsers[0]?.['count'] ?? 0);
    if (count === 0) {
      await sqlClient(
        "INSERT INTO authorized_users (email, nombre) VALUES ('julljoll@gmail.com', 'Jull Joll') ON CONFLICT (email) DO NOTHING"
      );
      console.info('[NeonDB] Usuario autorizado por defecto insertado: julljoll@gmail.com');
    }

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
        dispositivo_pantalla_estado, user_id, completed_steps, step_metadata, compliance_checklist, created_at, updated_at,
        tipo_proyecto, solicitante_nombre, solicitante_cedula, correo_investigar, correo_proveedor,
        discoduro_serial, discoduro_capacidad, discoduro_marca, discoduro_modelo, steps
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34)
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
      new Date().toISOString(),
      caso.tipo_proyecto || caso.tipoProyecto || 'forense_whatsapp',
      caso.solicitante_nombre || '',
      caso.solicitante_cedula || '',
      caso.correo_investigar || '',
      caso.correo_proveedor || '',
      caso.discoduro_serial || '',
      caso.discoduro_capacidad || '',
      caso.discoduro_marca || '',
      caso.discoduro_modelo || '',
      caso.steps ? JSON.stringify(caso.steps) : '{}'
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
    const updated = await sqlClient(`
      UPDATE casos SET
        titulo = COALESCE($1, titulo),
        descripcion = COALESCE($2, descripcion),
        estado = COALESCE($3, estado),
        prioridad = COALESCE($4, prioridad),
        fiscal = COALESCE($5, fiscal),
        dispositivo_marca = COALESCE($6, dispositivo_marca),
        dispositivo_modelo = COALESCE($7, dispositivo_modelo),
        dispositivo_imei = COALESCE($8, dispositivo_imei),
        dispositivo_imei2 = COALESCE($9, dispositivo_imei2),
        dispositivo_sim_card = COALESCE($10, dispositivo_sim_card),
        dispositivo_numero_tel = COALESCE($11, dispositivo_numero_tel),
        dispositivo_estado_fisico = COALESCE($12, dispositivo_estado_fisico),
        dispositivo_modo_aislamiento = COALESCE($13, dispositivo_modo_aislamiento),
        dispositivo_danos_visibles = COALESCE($14, dispositivo_danos_visibles),
        dispositivo_bateria_estado = COALESCE($15, dispositivo_bateria_estado),
        dispositivo_pantalla_estado = COALESCE($16, dispositivo_pantalla_estado),
        completed_steps = COALESCE($17, completed_steps),
        step_metadata = COALESCE($18, step_metadata),
        compliance_checklist = COALESCE($19, compliance_checklist),
        tipo_proyecto = COALESCE($20, tipo_proyecto),
        solicitante_nombre = COALESCE($21, solicitante_nombre),
        solicitante_cedula = COALESCE($22, solicitante_cedula),
        correo_investigar = COALESCE($23, correo_investigar),
        correo_proveedor = COALESCE($24, correo_proveedor),
        discoduro_serial = COALESCE($25, discoduro_serial),
        discoduro_capacidad = COALESCE($26, discoduro_capacidad),
        discoduro_marca = COALESCE($27, discoduro_marca),
        discoduro_modelo = COALESCE($28, discoduro_modelo),
        steps = COALESCE($29, steps),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $30
    `, [
      data.titulo ?? null,
      data.descripcion ?? null,
      data.estado ?? null,
      data.prioridad ?? null,
      data.fiscal ?? null,
      data.dispositivo_marca ?? null,
      data.dispositivo_modelo ?? null,
      data.dispositivo_imei ?? null,
      data.dispositivo_imei2 ?? null,
      data.dispositivo_sim_card ?? null,
      data.dispositivo_numero_tel ?? null,
      data.dispositivo_estado_fisico ?? null,
      data.dispositivo_modo_aislamiento ?? null,
      data.dispositivo_danos_visibles ?? null,
      data.dispositivo_bateria_estado ?? null,
      data.dispositivo_pantalla_estado ?? null,
      data.completed_steps !== undefined ? JSON.stringify(data.completed_steps) : null,
      data.step_metadata !== undefined ? JSON.stringify(data.step_metadata) : null,
      data.compliance_checklist !== undefined ? JSON.stringify(data.compliance_checklist) : null,
      data.tipo_proyecto ?? null,
      data.solicitante_nombre ?? null,
      data.solicitante_cedula ?? null,
      data.correo_investigar ?? null,
      data.correo_proveedor ?? null,
      data.discoduro_serial ?? null,
      data.discoduro_capacidad ?? null,
      data.discoduro_marca ?? null,
      data.discoduro_modelo ?? null,
      data.steps !== undefined ? JSON.stringify(data.steps) : null,
      id
    ]);
    return (updated?.length ?? 0) > 0;
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

// --- Auth: Validar usuario por correo ---

export async function authUserByEmail(email: string): Promise<{ success: boolean; user?: any; error?: string }> {
  if (!sqlClient) {
    // Modo local: solo permitir julljoll@gmail.com
    const LOCAL_AUTHORIZED = 'julljoll@gmail.com';
    if (email.toLowerCase() === LOCAL_AUTHORIZED) {
      return {
        success: true,
        user: { id: 1, email: LOCAL_AUTHORIZED, nombre: 'Jull Joll', rol: 'admin' }
      };
    }
    return { success: false, error: 'Correo no autorizado' };
  }

  try {
    const rows = await sqlClient(
      "SELECT * FROM authorized_users WHERE LOWER(email) = LOWER($1) AND activo = true",
      [email]
    );
    const row = rows[0] || rows.rows?.[0];
    if (!row) {
      return { success: false, error: 'Correo no autorizado' };
    }
    return {
      success: true,
      user: {
        id: row.id,
        email: row.email,
        nombre: row.nombre || '',
        rol: 'admin'
      }
    };
  } catch (e: any) {
    console.error('[NeonDB] Error validando usuario:', e);
    return { success: false, error: 'Error de conexión con la base de datos' };
  }
}
