import { createClient } from '@libsql/client';
import path from 'path';

let sqliteClient: any = null;
let isInitialized = false;

export function getLocalSQLiteClient() {
  if (sqliteClient) return sqliteClient;

  try {
    // Garantizar que la base de datos se ubique SIEMPRE en la raíz absoluta del repositorio
    const absolutePath = path.resolve(process.cwd(), 'sha256_forense.sqlite');
    const dbPath = process.env.SQLITE_DB_PATH || `file:${absolutePath}`;
    sqliteClient = createClient({
      url: dbPath,
    });
    console.info(`[SQLite Local] Cliente SQLite inicializado en path absoluto: ${dbPath}`);
    return sqliteClient;
  } catch (e: any) {
    console.warn('[SQLite Local] Error al inicializar cliente SQLite local:', e?.message || e);
    return null;
  }
}


export async function initLocalSQLiteDatabase() {
  if (isInitialized) return true;
  const client = getLocalSQLiteClient();
  if (!client) return false;

  try {
    // 1. Tabla de Casos
    await client.execute(`
      CREATE TABLE IF NOT EXISTS casos (
        id TEXT PRIMARY KEY,
        numero_caso TEXT UNIQUE NOT NULL,
        titulo TEXT NOT NULL,
        descripcion TEXT,
        estado TEXT NOT NULL,
        prioridad TEXT DEFAULT 'media',
        fiscal TEXT,
        perito_lider TEXT,
        compliance TEXT DEFAULT 'Pendiente',
        fases_completadas INTEGER DEFAULT 0,
        total_fases INTEGER DEFAULT 0,
        porcentaje_completado INTEGER DEFAULT 0,
        total_evidencias INTEGER DEFAULT 0,
        nivel_cumplimiento_general TEXT DEFAULT 'no_aplica',
        tipo_proyecto TEXT DEFAULT 'forense_whatsapp',
        user_id INTEGER DEFAULT 1,
        solicitante_nombre TEXT,
        solicitante_cedula TEXT,
        correo_investigar TEXT,
        correo_proveedor TEXT,
        discoduro_serial TEXT,
        discoduro_capacidad TEXT,
        discoduro_marca TEXT,
        discoduro_modelo TEXT,
        steps TEXT,
        completed_steps TEXT,
        step_metadata TEXT,
        compliance_checklist TEXT,
        datos_json TEXT,
        fecha_creacion TEXT,
        fecha_actualizacion TEXT
      );
    `);

    // 2. Tabla de Logs de Auditoría (Hash Chain Inmutable)
    await client.execute(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id TEXT PRIMARY KEY,
        timestamp TEXT NOT NULL,
        accion TEXT NOT NULL,
        usuario TEXT NOT NULL,
        rol TEXT NOT NULL,
        detalles TEXT,
        hash TEXT NOT NULL,
        prev_hash TEXT NOT NULL,
        caso_id TEXT
      );
    `);

    // 3. Tabla de Evidencias
    await client.execute(`
      CREATE TABLE IF NOT EXISTS evidencias (
        id TEXT PRIMARY KEY,
        caso_id TEXT NOT NULL,
        nombre TEXT NOT NULL,
        tipo TEXT NOT NULL,
        hash_sha256 TEXT NOT NULL,
        cadena_custodia TEXT,
        fecha_registro TEXT NOT NULL
      );
    `);

    // 4. Tabla de Personal / Peritos
    await client.execute(`
      CREATE TABLE IF NOT EXISTS personal (
        id TEXT PRIMARY KEY,
        nombre TEXT NOT NULL,
        apellido TEXT NOT NULL,
        cedula TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        cargo TEXT,
        rol TEXT NOT NULL,
        organismo TEXT,
        despacho TEXT,
        telefono TEXT,
        username TEXT,
        activo INTEGER DEFAULT 1,
        ranking INTEGER DEFAULT 5,
        profile_image TEXT
      );
    `);

    // Migraciones automáticas mediante ALTER TABLE si la tabla ya existía sin estas columnas
    const columnasCasos = [
      'perito_lider TEXT',
      'compliance TEXT DEFAULT "Pendiente"',
      'fases_completadas INTEGER DEFAULT 0',
      'total_fases INTEGER DEFAULT 0',
      'porcentaje_completado INTEGER DEFAULT 0',
      'total_evidencias INTEGER DEFAULT 0',
      'nivel_cumplimiento_general TEXT DEFAULT "no_aplica"',
      'tipo_proyecto TEXT DEFAULT "forense_whatsapp"',
      'user_id INTEGER DEFAULT 1',
      'solicitante_nombre TEXT',
      'solicitante_cedula TEXT',
      'correo_investigar TEXT',
      'correo_proveedor TEXT',
      'discoduro_serial TEXT',
      'discoduro_capacidad TEXT',
      'discoduro_marca TEXT',
      'discoduro_modelo TEXT',
      'steps TEXT',
      'completed_steps TEXT',
      'step_metadata TEXT',
      'compliance_checklist TEXT',
      'datos_json TEXT',
      'fecha_creacion TEXT',
      'fecha_actualizacion TEXT'
    ];

    for (const col of columnasCasos) {
      await client.execute(`ALTER TABLE casos ADD COLUMN ${col}`).catch(() => {});
    }

    const columnasPersonal = [
      'apellido TEXT',
      'email TEXT',
      'cargo TEXT',
      'organismo TEXT',
      'despacho TEXT',
      'telefono TEXT',
      'username TEXT',
      'activo INTEGER DEFAULT 1',
      'ranking INTEGER DEFAULT 5',
      'profile_image TEXT'
    ];

    for (const col of columnasPersonal) {
      await client.execute(`ALTER TABLE personal ADD COLUMN ${col}`).catch(() => {});
    }

    isInitialized = true;
    console.info('[SQLite Local] Base de datos local inicializada automáticamente con esquema completo y migraciones.');
    return true;

  } catch (e: any) {
    console.error('[SQLite Local] Error al crear tablas locales:', e?.message || e);
    return false;
  }
}

export async function queryLocalSQLite(sql: string, args: any[] = []) {
  const client = getLocalSQLiteClient();
  if (!client) return null;
  try {
    await initLocalSQLiteDatabase();
    const result = await client.execute({ sql, args });
    return result.rows;
  } catch (e: any) {
    console.error('[SQLite Local] Error ejecutando consulta:', e?.message || e);
    return null;
  }
}

// ─── CRUD Casos SQLite Local ──────────────────────────────────────────────────

export async function getCasosSQLite(): Promise<any[]> {
  const rows = await queryLocalSQLite('SELECT * FROM casos ORDER BY fecha_creacion DESC');
  return rows || [];
}

export async function addCasoSQLite(caso: any): Promise<{ success: boolean; id: string; error?: string }> {
  const id = caso.id || `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  const sql = `
    INSERT OR REPLACE INTO casos (
      id, numero_caso, titulo, descripcion, estado, prioridad, fiscal, perito_lider,
      compliance, fases_completadas, total_fases, porcentaje_completado, total_evidencias,
      nivel_cumplimiento_general, tipo_proyecto, user_id, solicitante_nombre, solicitante_cedula,
      correo_investigar, correo_proveedor, discoduro_serial, discoduro_capacidad, discoduro_marca,
      discoduro_modelo, steps, completed_steps, step_metadata, compliance_checklist, fecha_creacion, fecha_actualizacion
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const nowStr = new Date().toISOString();
  const args = [
    id,
    caso.numero_caso || caso.numeroCaso || '',
    caso.titulo || '',
    caso.descripcion || '',
    caso.estado || 'iniciado',
    caso.prioridad || 'media',
    caso.fiscal || '',
    caso.perito_lider || caso.peritoLider || '',
    caso.compliance || 'Pendiente',
    caso.fases_completadas || 0,
    caso.total_fases || 0,
    caso.porcentaje_completado || 0,
    caso.total_evidencias || 0,
    caso.nivel_cumplimiento_general || 'no_aplica',
    caso.tipo_proyecto || caso.tipoProyecto || 'forense_whatsapp',
    caso.user_id || 1,
    caso.solicitante_nombre || '',
    caso.solicitante_cedula || '',
    caso.correo_investigar || '',
    caso.correo_proveedor || '',
    caso.discoduro_serial || '',
    caso.discoduro_capacidad || '',
    caso.discoduro_marca || '',
    caso.discoduro_modelo || '',
    typeof caso.steps === 'string' ? caso.steps : JSON.stringify(caso.steps || {}),
    typeof caso.completed_steps === 'string' ? caso.completed_steps : JSON.stringify(caso.completed_steps || {}),
    typeof caso.step_metadata === 'string' ? caso.step_metadata : JSON.stringify(caso.step_metadata || {}),
    typeof caso.compliance_checklist === 'string' ? caso.compliance_checklist : JSON.stringify(caso.compliance_checklist || []),
    caso.fecha_creacion || nowStr,
    nowStr
  ];

  const res = await queryLocalSQLite(sql, args);
  if (res !== null) {
    return { success: true, id };
  }
  return { success: false, id, error: 'Error SQLite local' };
}

export async function updateCasoSQLite(id: string, data: any): Promise<boolean> {
  const sql = `
    UPDATE casos SET
      titulo = COALESCE(?, titulo),
      descripcion = COALESCE(?, descripcion),
      estado = COALESCE(?, estado),
      prioridad = COALESCE(?, prioridad),
      fiscal = COALESCE(?, fiscal),
      perito_lider = COALESCE(?, perito_lider),
      tipo_proyecto = COALESCE(?, tipo_proyecto),
      solicitante_nombre = COALESCE(?, solicitante_nombre),
      solicitante_cedula = COALESCE(?, solicitante_cedula),
      correo_investigar = COALESCE(?, correo_investigar),
      correo_proveedor = COALESCE(?, correo_proveedor),
      discoduro_serial = COALESCE(?, discoduro_serial),
      discoduro_capacidad = COALESCE(?, discoduro_capacidad),
      discoduro_marca = COALESCE(?, discoduro_marca),
      discoduro_modelo = COALESCE(?, discoduro_modelo),
      steps = COALESCE(?, steps),
      completed_steps = COALESCE(?, completed_steps),
      step_metadata = COALESCE(?, step_metadata),
      compliance_checklist = COALESCE(?, compliance_checklist),
      fecha_actualizacion = ?
    WHERE id = ?
  `;
  const args = [
    data.titulo ?? null,
    data.descripcion ?? null,
    data.estado ?? null,
    data.prioridad ?? null,
    data.fiscal ?? null,
    data.perito_lider ?? data.peritoLider ?? null,
    data.tipo_proyecto ?? data.tipoProyecto ?? null,
    data.solicitante_nombre ?? null,
    data.solicitante_cedula ?? null,
    data.correo_investigar ?? null,
    data.correo_proveedor ?? null,
    data.discoduro_serial ?? null,
    data.discoduro_capacidad ?? null,
    data.discoduro_marca ?? null,
    data.discoduro_modelo ?? null,
    data.steps !== undefined ? (typeof data.steps === 'string' ? data.steps : JSON.stringify(data.steps)) : null,
    data.completed_steps !== undefined ? (typeof data.completed_steps === 'string' ? data.completed_steps : JSON.stringify(data.completed_steps)) : null,
    data.step_metadata !== undefined ? (typeof data.step_metadata === 'string' ? data.step_metadata : JSON.stringify(data.step_metadata)) : null,
    data.compliance_checklist !== undefined ? (typeof data.compliance_checklist === 'string' ? data.compliance_checklist : JSON.stringify(data.compliance_checklist)) : null,
    new Date().toISOString(),
    id
  ];

  const res = await queryLocalSQLite(sql, args);
  return res !== null;
}

export async function deleteCasoSQLite(id: string): Promise<boolean> {
  const res = await queryLocalSQLite('DELETE FROM casos WHERE id = ?', [id]);
  return res !== null;
}

// ─── CRUD Personal / Usuarios SQLite Local ────────────────────────────────────

export async function getUsersSQLite(): Promise<any[]> {
  const rows = await queryLocalSQLite('SELECT * FROM personal WHERE activo = 1 ORDER BY nombre ASC');
  return rows || [];
}

export async function addUserSQLite(user: any): Promise<{ success: boolean; id: string }> {
  const id = user.id ? String(user.id) : `${Date.now()}`;
  const sql = `
    INSERT OR REPLACE INTO personal (
      id, nombre, apellido, cedula, email, cargo, rol, organismo, despacho, telefono, username, activo, ranking, profile_image
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const args = [
    id,
    user.nombre || '',
    user.apellido || '',
    user.ci || user.cedula || '',
    user.email || '',
    user.cargo || '',
    user.rol || 'perito_asistente',
    user.organismo || 'Ministerio Público',
    user.despacho || '',
    user.telefono || '',
    user.username || '',
    user.activo !== false ? 1 : 0,
    user.ranking || 5,
    user.profile_image || user.profileImage || ''
  ];
  const res = await queryLocalSQLite(sql, args);
  return { success: res !== null, id };
}

export async function updateUserSQLite(id: string, data: any): Promise<boolean> {
  const sql = `
    UPDATE personal SET
      nombre = COALESCE(?, nombre),
      apellido = COALESCE(?, apellido),
      cargo = COALESCE(?, cargo),
      rol = COALESCE(?, rol),
      despacho = COALESCE(?, despacho),
      telefono = COALESCE(?, telefono),
      activo = COALESCE(?, activo),
      ranking = COALESCE(?, ranking),
      profile_image = COALESCE(?, profile_image)
    WHERE id = ?
  `;
  const args = [
    data.nombre ?? null,
    data.apellido ?? null,
    data.cargo ?? null,
    data.rol ?? null,
    data.despacho ?? null,
    data.telefono ?? null,
    data.activo !== undefined ? (data.activo ? 1 : 0) : null,
    data.ranking ?? null,
    data.profile_image ?? data.profileImage ?? null,
    id
  ];
  const res = await queryLocalSQLite(sql, args);
  return res !== null;
}

export async function deleteUserSQLite(id: string): Promise<boolean> {
  const res = await queryLocalSQLite('DELETE FROM personal WHERE id = ?', [id]);
  return res !== null;
}

// ─── Logs de Auditoría SQLite Local ───────────────────────────────────────────


export async function getAuditLogsSQLite(): Promise<any[]> {
  const rows = await queryLocalSQLite('SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 500');
  return rows || [];
}

export async function addAuditLogSQLite(log: any): Promise<boolean> {
  const id = log.id || `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  const sql = `
    INSERT INTO audit_logs (id, timestamp, accion, usuario, rol, detalles, hash, prev_hash, caso_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const args = [
    id,
    log.timestamp || new Date().toISOString(),
    log.accion || 'ACCION',
    log.usuario || 'admin',
    log.rol || 'admin',
    log.detalle || log.detalles || '',
    log.hash || log.hashActual || '',
    log.prev_hash || log.hashAnterior || '',
    log.casoId || log.caso_id || ''
  ];
  const res = await queryLocalSQLite(sql, args);
  return res !== null;
}

