/**
 * Base de datos híbrida (SQLite + Neon PostgreSQL) — SHA256.US Peritaje Privado
 * Permite funcionamiento local 100% offline y sincroniza con la nube al detectar conexión.
 */
require('dotenv').config();
const { neon } = require('@neondatabase/serverless');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const { DatabaseSync } = require('node:sqlite');

let app;
try {
  const electron = require('electron');
  app = electron.app;
} catch (e) {
  // Entorno de test/consola fuera de Electron
}

// Instancias de base de datos
let sql = null;      // Neon DB (PostgreSQL)
let localDb = null; // SQLite DB

// Estado de conexión y sincronización
let isOnline = false;
let isSyncing = false;

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

/**
 * Verifica de forma rápida si hay conexión a internet y acceso a Neon DB.
 */
async function checkConnectivity() {
  if (!process.env.DATABASE_URL) {
    isOnline = false;
    return false;
  }
  try {
    // Usamos el cliente Neon para hacer una consulta ultrarápida de verificación
    const tempSql = neon(process.env.DATABASE_URL);
    await tempSql`SELECT 1`;
    if (!isOnline) {
      console.log('[Sync] Conexión establecida con Neon DB.');
      isOnline = true;
      // Lanzar sincronización en segundo plano al recuperar conexión
      syncData().catch(err => console.error('[Sync] Error en sincronización inicial:', err));
    }
    return true;
  } catch (err) {
    if (isOnline) {
      console.log('[Sync] Se ha perdido la conexión. Operando en modo Offline.');
      isOnline = false;
    }
    return false;
  }
}

/**
 * Inicializa y crea las tablas necesarias en la base de datos SQLite local.
 */
function initLocalDatabase() {
  try {
    const userDataPath = app ? app.getPath('userData') : process.cwd();
    const dbPath = path.join(userDataPath, 'sha256_local.db');
    console.log(`[Local DB] Inicializando SQLite en: ${dbPath}`);
    
    localDb = new DatabaseSync(dbPath);
    
    // Habilitar claves foráneas
    localDb.exec('PRAGMA foreign_keys = ON');

    // Crear tablas locales si no existen
    localDb.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        nombre TEXT DEFAULT '',
        apellido TEXT DEFAULT '',
        rol TEXT DEFAULT 'perito_asistente',
        activo INTEGER DEFAULT 1,
        ci TEXT DEFAULT '',
        cargo TEXT DEFAULT '',
        email TEXT DEFAULT '',
        telefono TEXT DEFAULT '',
        despacho TEXT DEFAULT '',
        ranking INTEGER DEFAULT 0,
        profile_image TEXT DEFAULT '',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        last_login TEXT
      );

      CREATE TABLE IF NOT EXISTS sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        token TEXT UNIQUE NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        expires_at TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS casos (
        local_id INTEGER PRIMARY KEY AUTOINCREMENT,
        id INTEGER, -- ID remoto en Neon DB (NULL si es nuevo offline)
        numero_caso TEXT UNIQUE NOT NULL,
        titulo TEXT NOT NULL,
        descripcion TEXT DEFAULT '',
        estado TEXT DEFAULT 'iniciado',
        tipo TEXT DEFAULT 'whatsapp',
        solicitante_nombre TEXT DEFAULT '',
        solicitante_ci TEXT DEFAULT '',
        dispositivo_marca TEXT DEFAULT '',
        dispositivo_modelo TEXT DEFAULT '',
        dispositivo_imei TEXT DEFAULT '',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        user_id INTEGER,
        dirty INTEGER DEFAULT 0 -- 1 si tiene cambios locales pendientes de subir
      );

      CREATE TABLE IF NOT EXISTS audit_log (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        accion TEXT NOT NULL,
        detalle TEXT DEFAULT '',
        timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
        synced INTEGER DEFAULT 0 -- 0 si no se ha subido a Neon
      );

      CREATE TABLE IF NOT EXISTS cms_state (
        user_id INTEGER PRIMARY KEY,
        state TEXT NOT NULL, -- JSON Stringificado del estado Zustand
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        dirty INTEGER DEFAULT 0 -- 1 si se actualizó offline
      );
    `);

    // Insertar administrador local por defecto si no existe
    const admin = localDb.prepare("SELECT id FROM users WHERE username = 'admin'").get();
    if (!admin) {
      localDb.prepare(`
        INSERT INTO users (username, password_hash, nombre, apellido, rol, cargo, email, activo) 
        VALUES ('admin', ?, 'Administrador', 'Local', 'perito_lider', 'Superusuario', 'admin@sha256.us', 1)
      `).run(hashPassword('julljoll'));
    }

    console.log('[Local DB] Base de datos SQLite local lista.');
    return true;
  } catch (err) {
    console.error('[Local DB] Error inicializando SQLite:', err);
    return false;
  }
}

/**
 * Inicializa la base de datos remota Neon y la base de datos local SQLite.
 */
async function initDatabase() {
  // 1. Inicializar base de datos local obligatoriamente
  initLocalDatabase();

  // 2. Comprobar conectividad con Neon
  await checkConnectivity();

  if (isOnline) {
    sql = neon(process.env.DATABASE_URL);
    try {
      // Crear tablas remotas en Neon PostgreSQL si no existen (esquema idéntico)
      await sql`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          username VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          nombre VARCHAR(255) DEFAULT '',
          apellido VARCHAR(255) DEFAULT '',
          rol VARCHAR(50) DEFAULT 'perito_asistente',
          activo INTEGER DEFAULT 1,
          ci VARCHAR(50) DEFAULT '',
          cargo VARCHAR(255) DEFAULT '',
          email VARCHAR(255) DEFAULT '',
          telefono VARCHAR(50) DEFAULT '',
          despacho VARCHAR(255) DEFAULT '',
          ranking INTEGER DEFAULT 0,
          profile_image TEXT DEFAULT '',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          last_login TIMESTAMP
        )
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS sessions (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id),
          token VARCHAR(255) UNIQUE NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          expires_at TIMESTAMP
        )
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS casos (
          id SERIAL PRIMARY KEY,
          numero_caso VARCHAR(255) UNIQUE NOT NULL,
          titulo VARCHAR(255) NOT NULL,
          descripcion TEXT DEFAULT '',
          estado VARCHAR(50) DEFAULT 'iniciado',
          tipo VARCHAR(50) DEFAULT 'whatsapp',
          solicitante_nombre VARCHAR(255) DEFAULT '',
          solicitante_ci VARCHAR(255) DEFAULT '',
          dispositivo_marca VARCHAR(255) DEFAULT '',
          dispositivo_modelo VARCHAR(255) DEFAULT '',
          dispositivo_imei VARCHAR(255) DEFAULT '',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          user_id INTEGER REFERENCES users(id)
        )
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS audit_log (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id),
          accion VARCHAR(255) NOT NULL,
          detalle TEXT DEFAULT '',
          timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS cms_state (
          user_id INTEGER PRIMARY KEY REFERENCES users(id),
          state JSONB NOT NULL,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;

      // Crear administrador por defecto en remoto si no existe
      const existingAdmins = await sql`SELECT id FROM users WHERE username = 'admin'`;
      if (existingAdmins.length === 0) {
        await sql`
          INSERT INTO users (username, password_hash, nombre, apellido, rol, cargo, email) 
          VALUES ('admin', ${hashPassword('julljoll')}, 'Administrador', 'Principal', 'perito_lider', 'Superusuario', 'admin@sha256.us')
        `;
      }
      console.log('[Remote DB] Neon PostgreSQL inicializado exitosamente.');

      // Ejecutar primera sincronización
      await syncData();
    } catch (error) {
      console.error('[Remote DB] Error inicializando Neon PostgreSQL (operando offline):', error);
      isOnline = false;
    }
  }

  // Configurar monitoreo periódico de conexión
  setInterval(async () => {
    await checkConnectivity();
  }, 15000); // Cada 15 segundos

  return isOnline ? sql : localDb;
}

/**
 * Sincroniza datos bidireccionalmente entre SQLite y Neon PostgreSQL
 */
async function syncData() {
  if (isSyncing || !isOnline || !sql || !localDb) return;
  isSyncing = true;
  console.log('[Sync] Iniciando sincronización de base de datos...');

  try {
    // 1. Sincronizar usuarios (Descargar de la nube para login offline)
    const remoteUsers = await sql`SELECT id, username, password_hash, nombre, apellido, rol, activo, ci, cargo, email, telefono, despacho, ranking, profile_image FROM users`;
    for (const rUser of remoteUsers) {
      localDb.prepare(`
        INSERT INTO users (id, username, password_hash, nombre, apellido, rol, activo, ci, cargo, email, telefono, despacho, ranking, profile_image)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(username) DO UPDATE SET
          password_hash = excluded.password_hash,
          nombre = excluded.nombre,
          apellido = excluded.apellido,
          rol = excluded.rol,
          activo = excluded.activo,
          ci = excluded.ci,
          cargo = excluded.cargo,
          email = excluded.email,
          telefono = excluded.telefono,
          despacho = excluded.despacho,
          ranking = excluded.ranking,
          profile_image = excluded.profile_image
      `).run(rUser.id, rUser.username, rUser.password_hash, rUser.nombre, rUser.apellido, rUser.rol, rUser.activo, rUser.ci, rUser.cargo, rUser.email, rUser.telefono, rUser.despacho, rUser.ranking, rUser.profile_image);
    }

    // 2. Subir casos nuevos creados localmente mientras se estaba offline
    const localNewCasos = localDb.prepare("SELECT * FROM casos WHERE id IS NULL").all();
    for (const lCaso of localNewCasos) {
      try {
        const result = await sql`
          INSERT INTO casos (
            numero_caso, titulo, descripcion, estado, tipo, 
            solicitante_nombre, solicitante_ci, dispositivo_marca, 
            dispositivo_modelo, dispositivo_imei, user_id, created_at, updated_at
          )
          VALUES (
            ${lCaso.numero_caso}, ${lCaso.titulo}, ${lCaso.descripcion}, 
            ${lCaso.estado}, ${lCaso.tipo}, ${lCaso.solicitante_nombre}, 
            ${lCaso.solicitante_ci}, ${lCaso.dispositivo_marca}, 
            ${lCaso.dispositivo_modelo}, ${lCaso.dispositivo_imei}, 
            ${lCaso.user_id}, ${lCaso.created_at}, ${lCaso.updated_at}
          )
          ON CONFLICT(numero_caso) DO UPDATE SET
            titulo = EXCLUDED.titulo,
            descripcion = EXCLUDED.descripcion,
            estado = EXCLUDED.estado,
            updated_at = EXCLUDED.updated_at
          RETURNING id
        `;
        if (result && result.length > 0) {
          localDb.prepare("UPDATE casos SET id = ?, dirty = 0 WHERE local_id = ?").run(result[0].id, lCaso.local_id);
        }
      } catch (err) {
        console.error(`[Sync] Error subiendo caso nuevo ${lCaso.numero_caso}:`, err.message);
      }
    }

    // 3. Subir modificaciones de casos existentes
    const localDirtyCasos = localDb.prepare("SELECT * FROM casos WHERE dirty = 1 AND id IS NOT NULL").all();
    for (const lCaso of localDirtyCasos) {
      try {
        await sql`
          UPDATE casos SET
            titulo = ${lCaso.titulo},
            descripcion = ${lCaso.descripcion},
            estado = ${lCaso.estado},
            solicitante_nombre = ${lCaso.solicitante_nombre},
            solicitante_ci = ${lCaso.solicitante_ci},
            dispositivo_marca = ${lCaso.dispositivo_marca},
            dispositivo_modelo = ${lCaso.dispositivo_modelo},
            dispositivo_imei = ${lCaso.dispositivo_imei},
            updated_at = ${lCaso.updated_at}
          WHERE id = ${lCaso.id}
        `;
        localDb.prepare("UPDATE casos SET dirty = 0 WHERE local_id = ?").run(lCaso.local_id);
      } catch (err) {
        console.error(`[Sync] Error subiendo actualización de caso ${lCaso.numero_caso}:`, err.message);
      }
    }

    // 4. Descargar casos nuevos o modificados de la nube
    const remoteCasos = await sql`SELECT * FROM casos`;
    for (const rCaso of remoteCasos) {
      const localMatch = localDb.prepare("SELECT * FROM casos WHERE numero_caso = ?").get(rCaso.numero_caso);
      const isoCreatedAt = new Date(rCaso.created_at).toISOString();
      const isoUpdatedAt = new Date(rCaso.updated_at).toISOString();

      if (!localMatch) {
        // No existe en local, insertar
        localDb.prepare(`
          INSERT INTO casos (
            id, numero_caso, titulo, descripcion, estado, tipo, 
            solicitante_nombre, solicitante_ci, dispositivo_marca, 
            dispositivo_modelo, dispositivo_imei, user_id, created_at, updated_at, dirty
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
        `).run(
          rCaso.id, rCaso.numero_caso, rCaso.titulo, rCaso.descripcion, rCaso.estado, rCaso.tipo,
          rCaso.solicitante_nombre, rCaso.solicitante_ci, rCaso.dispositivo_marca,
          rCaso.dispositivo_modelo, rCaso.dispositivo_imei, rCaso.user_id, isoCreatedAt, isoUpdatedAt
        );
      } else if (localMatch.dirty === 0 && new Date(rCaso.updated_at) > new Date(localMatch.updated_at)) {
        // Existe en local, no es sucio y es más antiguo que el de la nube, actualizar
        localDb.prepare(`
          UPDATE casos SET
            id = ?, titulo = ?, descripcion = ?, estado = ?, tipo = ?, 
            solicitante_nombre = ?, solicitante_ci = ?, dispositivo_marca = ?, 
            dispositivo_modelo = ?, dispositivo_imei = ?, user_id = ?, 
            created_at = ?, updated_at = ?, dirty = 0
          WHERE local_id = ?
        `).run(
          rCaso.id, rCaso.titulo, rCaso.descripcion, rCaso.estado, rCaso.tipo,
          rCaso.solicitante_nombre, rCaso.solicitante_ci, rCaso.dispositivo_marca,
          rCaso.dispositivo_modelo, rCaso.dispositivo_imei, rCaso.user_id, 
          isoCreatedAt, isoUpdatedAt, localMatch.local_id
        );
      }
    }

    // 5. Sincronizar estado global (cms_state de Zustand)
    const localState = localDb.prepare("SELECT * FROM cms_state WHERE user_id = 1").get();
    let remoteState = null;
    try {
      const res = await sql`SELECT state, updated_at FROM cms_state WHERE user_id = 1`;
      if (res && res.length > 0) remoteState = res[0];
    } catch (e) {
      console.error('[Sync] Error leyendo estado remoto:', e.message);
    }

    if (localState && localState.dirty === 1) {
      // El estado local está marcado como sucio (modificado offline)
      if (!remoteState || new Date(localState.updated_at) > new Date(remoteState.updated_at)) {
        // El local es más nuevo o no existe en remoto, subir a la nube
        await sql`
          INSERT INTO cms_state (user_id, state, updated_at)
          VALUES (1, ${JSON.stringify(JSON.parse(localState.state))}, ${localState.updated_at})
          ON CONFLICT(user_id) DO UPDATE SET 
            state = EXCLUDED.state, 
            updated_at = EXCLUDED.updated_at
        `;
        localDb.prepare("UPDATE cms_state SET dirty = 0 WHERE user_id = 1").run();
        console.log('[Sync] Estado local de Zustand subido a la nube.');
      } else {
        // Conflicto: Remoto es más nuevo que el local dirty. Prevalece la nube.
        localDb.prepare("UPDATE cms_state SET state = ?, updated_at = ?, dirty = 0 WHERE user_id = 1")
          .run(JSON.stringify(remoteState.state), new Date(remoteState.updated_at).toISOString());
        console.log('[Sync] Conflicto de estado resuelto: Sobrescrito local con remoto (más reciente).');
      }
    } else if (remoteState) {
      // El local no está sucio, actualizar si el remoto es más nuevo o si no hay local
      const remoteIsoTime = new Date(remoteState.updated_at).toISOString();
      if (!localState || new Date(remoteState.updated_at) > new Date(localState.updated_at)) {
        localDb.prepare(`
          INSERT INTO cms_state (user_id, state, updated_at, dirty)
          VALUES (1, ?, ?, 0)
          ON CONFLICT(user_id) DO UPDATE SET state = excluded.state, updated_at = excluded.updated_at, dirty = 0
        `).run(JSON.stringify(remoteState.state), remoteIsoTime);
        console.log('[Sync] Estado local de Zustand actualizado desde la nube.');
      }
    }

    // 6. Subir logs de auditoría locales pendientes
    const pendingLogs = localDb.prepare("SELECT * FROM audit_log WHERE synced = 0").all();
    for (const log of pendingLogs) {
      try {
        await sql`
          INSERT INTO audit_log (user_id, accion, detalle, timestamp)
          VALUES (${log.user_id}, ${log.accion}, ${log.detalle}, ${log.timestamp})
        `;
        localDb.prepare("UPDATE audit_log SET synced = 1 WHERE id = ?").run(log.id);
      } catch (err) {
        console.error('[Sync] Error subiendo log de auditoría:', err.message);
      }
    }

    console.log('[Sync] Sincronización finalizada con éxito.');
  } catch (err) {
    console.error('[Sync] Error catastrófico en la sincronización:', err);
  } finally {
    isSyncing = false;
  }
}

/**
 * Autentica usuario local u online
 */
async function authenticateUser(username, password) {
  const hash = hashPassword(password);
  
  if (isOnline && sql) {
    try {
      const users = await sql`
        SELECT * FROM users 
        WHERE username = ${username} AND password_hash = ${hash} AND activo = 1
      `;
      
      if (users.length > 0) {
        const user = users[0];
        const token = crypto.randomBytes(32).toString('hex');
        
        // Registrar en remoto
        await sql`UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ${user.id}`;
        await sql`
          INSERT INTO sessions (user_id, token, expires_at) 
          VALUES (${user.id}, ${token}, CURRENT_TIMESTAMP + INTERVAL '7 days')
        `;
        
        // Cachear localmente
        localDb.prepare(`
          INSERT INTO users (id, username, password_hash, nombre, apellido, rol, activo, ci, cargo, email, telefono, despacho, ranking, profile_image, last_login)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
          ON CONFLICT(username) DO UPDATE SET last_login = datetime('now')
        `).run(user.id, user.username, user.password_hash, user.nombre, user.apellido || '', user.rol, user.activo, user.ci || '', user.cargo || '', user.email || '', user.telefono || '', user.despacho || '', user.ranking || 0, user.profile_image || '');
        
        localDb.prepare(`
          INSERT INTO sessions (user_id, token, expires_at)
          VALUES (?, ?, datetime('now', '+7 days'))
        `).run(user.id, token);

        // Audit Log
        await addAuditLog(user.id, 'LOGIN', `Inicio de sesión: ${username}`);

        return { id: user.id, username: user.username, nombre: user.nombre, rol: user.rol, token };
      }
    } catch (err) {
      console.error('[Auth] Error online, intentando offline:', err.message);
    }
  }

  // Fallback offline (SQLite)
  const user = localDb.prepare("SELECT * FROM users WHERE username = ? AND password_hash = ? AND activo = 1")
    .get(username, hash);
    
  if (user) {
    const token = crypto.randomBytes(32).toString('hex');
    localDb.prepare("UPDATE users SET last_login = datetime('now') WHERE id = ?").run(user.id);
    localDb.prepare("INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, datetime('now', '+7 days'))")
      .run(user.id, token);
      
    // Audit Log local
    await addAuditLog(user.id, 'LOGIN_OFFLINE', `Inicio de sesión offline: ${username}`);
    
    return { id: user.id, username: user.username, nombre: user.nombre, rol: user.rol, token };
  }

  return null;
}

/**
 * Valida sesión local u online
 */
async function validateSession(token) {
  if (isOnline && sql) {
    try {
      const sessions = await sql`
        SELECT s.*, u.username, u.nombre, u.rol 
        FROM sessions s
        JOIN users u ON s.user_id = u.id
        WHERE s.token = ${token} AND s.expires_at > CURRENT_TIMESTAMP
      `;
      if (sessions.length > 0) {
        const session = sessions[0];
        return { id: session.user_id, username: session.username, nombre: session.nombre, rol: session.rol };
      }
    } catch (err) {
      console.error('[Auth] Error validando sesión online, intentando offline:', err.message);
    }
  }

  // Validar localmente en SQLite
  const session = localDb.prepare(`
    SELECT s.*, u.username, u.nombre, u.rol 
    FROM sessions s
    JOIN users u ON s.user_id = u.id
    WHERE s.token = ? AND datetime(s.expires_at) > datetime('now')
  `).get(token);

  if (session) {
    return { id: session.user_id, username: session.username, nombre: session.nombre, rol: session.rol };
  }
  return null;
}

/**
 * Cierra la sesión
 */
async function logout(token) {
  if (isOnline && sql) {
    try {
      await sql`DELETE FROM sessions WHERE token = ${token}`;
    } catch (err) {
      console.error('[Auth] Error logout remoto:', err.message);
    }
  }
  localDb.prepare("DELETE FROM sessions WHERE token = ?").run(token);
}

/**
 * Obtiene todos los casos
 */
async function getCasos(userId) {
  // Siempre leemos de SQLite para velocidad, la sincronización en segundo plano mantiene SQLite actualizado.
  try {
    const casos = localDb.prepare("SELECT * FROM casos ORDER BY updated_at DESC").all();
    // Normalizar nombres de columnas a la convención del frontend
    return casos.map(c => ({
      id: c.id,
      local_id: c.local_id,
      numero_caso: c.numero_caso,
      titulo: c.titulo,
      descripcion: c.descripcion,
      estado: c.estado,
      tipo: c.tipo,
      solicitante_nombre: c.solicitante_nombre,
      solicitante_ci: c.solicitante_ci,
      dispositivo_marca: c.dispositivo_marca,
      dispositivo_modelo: c.dispositivo_modelo,
      dispositivo_imei: c.dispositivo_imei,
      created_at: c.created_at,
      updated_at: c.updated_at,
      user_id: c.user_id
    }));
  } catch (err) {
    console.error('[DB] Error leyendo casos locales:', err);
    return [];
  }
}

/**
 * Crea un nuevo caso
 */
async function addCaso(caso) {
  const nowStr = new Date().toISOString();
  
  // 1. Guardar siempre en local primero con bandera dirty = 1
  try {
    const stmt = localDb.prepare(`
      INSERT INTO casos (
        numero_caso, titulo, descripcion, estado, tipo, 
        solicitante_nombre, solicitante_ci, dispositivo_marca, 
        dispositivo_modelo, dispositivo_imei, user_id, created_at, updated_at, dirty
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `);
    const info = stmt.run(
      caso.numero_caso, caso.titulo, caso.descripcion || '', caso.estado || 'iniciado',
      caso.tipo || 'whatsapp', caso.solicitante_nombre || '', caso.solicitante_ci || '',
      caso.dispositivo_marca || '', caso.dispositivo_modelo || '', caso.dispositivo_imei || '',
      caso.user_id, nowStr, nowStr
    );
    const localId = info.lastInsertRowid;

    // 2. Si hay conexión, intentar guardar en remoto de inmediato
    if (isOnline && sql) {
      try {
        const res = await sql`
          INSERT INTO casos (
            numero_caso, titulo, descripcion, estado, tipo, 
            solicitante_nombre, solicitante_ci, dispositivo_marca, 
            dispositivo_modelo, dispositivo_imei, user_id, created_at, updated_at
          ) VALUES (
            ${caso.numero_caso}, ${caso.titulo}, ${caso.descripcion || ''}, 
            ${caso.estado || 'iniciado'}, ${caso.tipo || 'whatsapp'}, 
            ${caso.solicitante_nombre || ''}, ${caso.solicitante_ci || ''},
            ${caso.dispositivo_marca || ''}, ${caso.dispositivo_modelo || ''}, 
            ${caso.dispositivo_imei || ''}, ${caso.user_id}, ${nowStr}, ${nowStr}
          )
          RETURNING id
        `;
        if (res && res.length > 0) {
          // Limpiar bandera dirty y guardar ID remoto
          localDb.prepare("UPDATE casos SET id = ?, dirty = 0 WHERE local_id = ?").run(res[0].id, localId);
          await addAuditLog(caso.user_id, 'CASO_CREADO', `Caso ${caso.numero_caso} creado y sincronizado.`);
          return { success: true, id: res[0].id };
        }
      } catch (err) {
        console.error('[DB] Error creando caso en Neon, guardado local offline:', err.message);
      }
    }

    await addAuditLog(caso.user_id, 'CASO_CREADO_LOCAL', `Caso ${caso.numero_caso} creado en modo offline.`);
    return { success: true, id: `local_${localId}` };
  } catch (err) {
    console.error('[DB] Error agregando caso:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Guarda el estado global de la app
 */
async function saveState(userId, state) {
  const nowStr = new Date().toISOString();
  const stateStr = JSON.stringify(state);
  
  // 1. Guardar localmente
  try {
    localDb.prepare(`
      INSERT INTO cms_state (user_id, state, updated_at, dirty)
      VALUES (?, ?, ?, 1)
      ON CONFLICT(user_id) DO UPDATE SET state = excluded.state, updated_at = excluded.updated_at, dirty = 1
    `).run(userId, stateStr, nowStr);

    // 2. Intentar guardar en la nube
    if (isOnline && sql) {
      try {
        await sql`
          INSERT INTO cms_state (user_id, state, updated_at) 
          VALUES (${userId}, ${stateStr}, ${nowStr})
          ON CONFLICT (user_id) DO UPDATE SET state = EXCLUDED.state, updated_at = EXCLUDED.updated_at
        `;
        localDb.prepare("UPDATE cms_state SET dirty = 0 WHERE user_id = ?").run(userId);
      } catch (err) {
        console.error('[DB] Error guardando estado remoto:', err.message);
      }
    }
    return { success: true };
  } catch (err) {
    console.error('[DB] Error guardando estado:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Carga el estado global de la app
 */
async function loadState(userId) {
  // Siempre devolvemos el local por velocidad y consistencia offline,
  // el background sync se encargará de mantenerlo coordinado.
  try {
    const row = localDb.prepare("SELECT state FROM cms_state WHERE user_id = ?").get(userId);
    return row ? JSON.parse(row.state) : null;
  } catch (err) {
    console.error('[DB] Error cargando estado local:', err);
    return null;
  }
}

/**
 * Agrega una acción al log de auditoría
 */
async function addAuditLog(userId, accion, detalle) {
  const nowStr = new Date().toISOString();
  
  // Guardar en SQLite
  try {
    localDb.prepare(`
      INSERT INTO audit_log (user_id, accion, detalle, timestamp, synced)
      VALUES (?, ?, ?, ?, 0)
    `).run(userId, accion, detalle, nowStr);
    
    // Si estamos online, intentar guardar de inmediato en remoto
    if (isOnline && sql) {
      try {
        await sql`
          INSERT INTO audit_log (user_id, accion, detalle, timestamp) 
          VALUES (${userId}, ${accion}, ${detalle}, ${nowStr})
        `;
        // Marcar como sincronizado
        localDb.prepare("UPDATE audit_log SET synced = 1 WHERE user_id = ? AND timestamp = ?").run(userId, nowStr);
      } catch (err) {
        // Queda con synced = 0 para subida posterior
      }
    }
  } catch (err) {
    console.error('[DB] Error en audit log:', err.message);
  }
}

function getDb() {
  return sql;
}

async function changePassword(userId, newPassword) {
  const hash = hashPassword(newPassword);
  try {
    localDb.prepare("UPDATE users SET password_hash = ? WHERE id = ?").run(hash, userId);
    if (isOnline && sql) {
      try {
        await sql`UPDATE users SET password_hash = ${hash} WHERE id = ${userId}`;
      } catch (err) {
        console.error('[DB] Error actualizando contraseña remota:', err.message);
      }
    }
    await addAuditLog(userId, 'CONTRASENA_CAMBIADA', `El usuario ID ${userId} cambió su contraseña.`);
    return { success: true };
  } catch (err) {
    console.error('[DB] Error cambiando contraseña:', err);
    return { success: false, error: err.message };
  }
}

async function getUsers() {
  try {
    const users = localDb.prepare("SELECT id, username, nombre, apellido, rol, activo, ci, cargo, email, telefono, despacho, ranking, profile_image, created_at, last_login FROM users ORDER BY created_at DESC").all();
    return users;
  } catch (err) {
    console.error('[DB] Error leyendo usuarios locales:', err);
    return [];
  }
}

async function addUser(userIdMaker, user) {
  const hash = hashPassword(user.password || '123456');
  try {
    // Local
    const stmt = localDb.prepare(`
      INSERT INTO users (
        username, password_hash, nombre, apellido, rol, activo, ci, cargo, email, telefono, despacho, ranking, profile_image
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(
      user.username, hash, user.nombre, user.apellido, user.rol, 1, 
      user.ci, user.cargo, user.email, user.telefono, user.despacho, user.ranking || 0, user.profile_image || ''
    );
    const localId = info.lastInsertRowid;

    if (isOnline && sql) {
      try {
        const res = await sql`
          INSERT INTO users (
            username, password_hash, nombre, apellido, rol, activo, ci, cargo, email, telefono, despacho, ranking, profile_image
          ) VALUES (
            ${user.username}, ${hash}, ${user.nombre}, ${user.apellido}, ${user.rol}, 1,
            ${user.ci}, ${user.cargo}, ${user.email}, ${user.telefono}, ${user.despacho}, ${user.ranking || 0}, ${user.profile_image || ''}
          ) RETURNING id
        `;
        if (res && res.length > 0) {
           await addAuditLog(userIdMaker, 'USUARIO_CREADO', \`Usuario \${user.username} creado exitosamente.\`);
           // Note: In a real advanced sync, we'd wait for next sync to get ID or update SQLite ID,
           // but since our sqlite and remote IDs might diverge slightly on first insert without explicit sync,
           // we just return the remote ID if online. Sincronizacion bidireccional de users ya actualiza on conflict username.
           return { success: true, id: res[0].id };
        }
      } catch (err) {
        console.error('[DB] Error insertando usuario en remoto:', err.message);
      }
    }
    
    await addAuditLog(userIdMaker, 'USUARIO_CREADO_LOCAL', \`Usuario \${user.username} creado offline.\`);
    return { success: true, id: localId };
  } catch(err) {
    console.error('[DB] Error creando usuario:', err);
    return { success: false, error: err.message };
  }
}

async function updateUser(userIdMaker, userId, data) {
  try {
    // Si la data incluye password, lo manejamos aparte si queremos
    let setsLocal = [];
    let paramsLocal = [];
    let updatesNeon = {};
    
    const fields = ['nombre', 'apellido', 'rol', 'activo', 'ci', 'cargo', 'email', 'telefono', 'despacho', 'ranking', 'profile_image'];
    for(let f of fields) {
      if(data[f] !== undefined) {
        setsLocal.push(\`\${f} = ?\`);
        paramsLocal.push(data[f]);
        updatesNeon[f] = data[f];
      }
    }
    
    if(data.password) {
       const hash = hashPassword(data.password);
       setsLocal.push('password_hash = ?');
       paramsLocal.push(hash);
       updatesNeon['password_hash'] = hash;
    }

    if (setsLocal.length > 0) {
      paramsLocal.push(userId);
      localDb.prepare(\`UPDATE users SET \${setsLocal.join(', ')} WHERE id = ?\`).run(...paramsLocal);
      
      if(isOnline && sql) {
         try {
           // We do individual sets using Neon.js dynamic query or standard mapped
           // Since Neon serverless `sql` tag doesn't easily do dynamic updates out of the box nicely like Prisma,
           // we can do a workaround or just update the explicit fields:
           await sql\`
              UPDATE users SET
                nombre = COALESCE(\${updatesNeon.nombre}, nombre),
                apellido = COALESCE(\${updatesNeon.apellido}, apellido),
                rol = COALESCE(\${updatesNeon.rol}, rol),
                activo = COALESCE(\${updatesNeon.activo}, activo),
                ci = COALESCE(\${updatesNeon.ci}, ci),
                cargo = COALESCE(\${updatesNeon.cargo}, cargo),
                email = COALESCE(\${updatesNeon.email}, email),
                telefono = COALESCE(\${updatesNeon.telefono}, telefono),
                despacho = COALESCE(\${updatesNeon.despacho}, despacho),
                ranking = COALESCE(\${updatesNeon.ranking}, ranking),
                profile_image = COALESCE(\${updatesNeon.profile_image}, profile_image),
                password_hash = COALESCE(\${updatesNeon.password_hash}, password_hash)
              WHERE id = \${userId}
           \`;
         } catch(err) {
            console.error('[DB] Error actualizando usuario remoto:', err.message);
         }
      }
    }

    await addAuditLog(userIdMaker, 'USUARIO_ACTUALIZADO', \`El usuario con ID \${userId} fue modificado.\`);
    return { success: true };
  } catch (err) {
    console.error('[DB] Error actualizando usuario:', err);
    return { success: false, error: err.message };
  }
}

async function getAuditLogs() {
  try {
    return localDb.prepare(\`
      SELECT a.*, u.nombre, u.apellido, u.username
      FROM audit_log a
      LEFT JOIN users u ON a.user_id = u.id
      ORDER BY a.timestamp DESC
      LIMIT 100
    \`).all();
  } catch (err) {
    console.error('[DB] Error obteniendo audit logs:', err);
    return [];
  }
}

module.exports = {
  initDatabase,
  authenticateUser,
  validateSession,
  logout,
  getDb,
  getCasos,
  addCaso,
  saveState,
  loadState,
  changePassword,
  getUsers,
  addUser,
  updateUser,
  getAuditLogs,
};
