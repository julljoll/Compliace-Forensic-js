import { createClient } from '@libsql/client';

let sqliteClient: any = null;
let isInitialized = false;

export function getLocalSQLiteClient() {
  if (sqliteClient) return sqliteClient;

  try {
    // En entorno servidor / local Node.js se crea la base de datos local SQLite
    const dbPath = process.env.SQLITE_DB_PATH || 'file:sha256_forense.sqlite';
    sqliteClient = createClient({
      url: dbPath,
    });
    console.info(`[SQLite Local] Cliente SQLite inicializado en: ${dbPath}`);
    return sqliteClient;
  } catch (e: any) {
    console.warn('[SQLite Local] No se pudo inicializar archivo SQLite local (modo Vercel / Serverless sin filesystem):', e?.message || e);
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
        cedula TEXT UNIQUE NOT NULL,
        rol TEXT NOT NULL,
        civ TEXT,
        inpreabogado TEXT,
        activo INTEGER DEFAULT 1
      );
    `);

    isInitialized = true;
    console.info('[SQLite Local] Base de datos local inicializada automáticamente con esquema completo.');
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
