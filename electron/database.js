/**
 * Base de datos SQLite local — SHA256.US Peritaje Privado
 * Motor: better-sqlite3 (sin servidor, archivo local)
 */
const Database = require('better-sqlite3');
const path = require('path');
const crypto = require('crypto');

let db = null;

/** Hash SHA-256 para passwords */
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

/** Inicializar base de datos en userData del sistema */
function initDatabase(userDataPath) {
  const dbPath = path.join(userDataPath, 'sha256_peritaje.db');
  db = new Database(dbPath);

  // WAL mode para mejor rendimiento
  db.pragma('journal_mode = WAL');

  // ── Tabla de usuarios ──
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      nombre TEXT DEFAULT '',
      rol TEXT DEFAULT 'perito',
      activo INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now')),
      last_login TEXT
    )
  `);

  // ── Tabla de sesiones ──
  db.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      token TEXT UNIQUE NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      expires_at TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // ── Tabla de casos / expedientes ──
  db.exec(`
    CREATE TABLE IF NOT EXISTS casos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
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
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      user_id INTEGER,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // ── Tabla de log de auditoría ──
  db.exec(`
    CREATE TABLE IF NOT EXISTS audit_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      accion TEXT NOT NULL,
      detalle TEXT DEFAULT '',
      timestamp TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // ── Insertar usuario admin si no existe ──
  const adminExists = db.prepare('SELECT id FROM users WHERE username = ?').get('admin');
  if (!adminExists) {
    db.prepare(
      'INSERT INTO users (username, password_hash, nombre, rol) VALUES (?, ?, ?, ?)'
    ).run('admin', hashPassword('julljoll'), 'Administrador', 'perito_lider');
  }

  console.log('[DB] Base de datos inicializada en:', dbPath);
  return db;
}

/** Verificar credenciales */
function authenticateUser(username, password) {
  if (!db) return null;
  const user = db.prepare(
    'SELECT * FROM users WHERE username = ? AND password_hash = ? AND activo = 1'
  ).get(username, hashPassword(password));

  if (user) {
    // Actualizar last_login
    db.prepare('UPDATE users SET last_login = datetime("now") WHERE id = ?').run(user.id);
    // Generar token de sesión
    const token = crypto.randomBytes(32).toString('hex');
    db.prepare(
      'INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, datetime("now", "+7 days"))'
    ).run(user.id, token);
    // Log
    db.prepare(
      'INSERT INTO audit_log (user_id, accion, detalle) VALUES (?, ?, ?)'
    ).run(user.id, 'LOGIN', `Inicio de sesión: ${username}`);

    return { id: user.id, username: user.username, nombre: user.nombre, rol: user.rol, token };
  }
  return null;
}

/** Validar token de sesión */
function validateSession(token) {
  if (!db) return null;
  const session = db.prepare(
    `SELECT s.*, u.username, u.nombre, u.rol FROM sessions s
     JOIN users u ON s.user_id = u.id
     WHERE s.token = ? AND s.expires_at > datetime('now')`
  ).get(token);
  if (session) {
    return { id: session.user_id, username: session.username, nombre: session.nombre, rol: session.rol };
  }
  return null;
}

/** Cerrar sesión */
function logout(token) {
  if (!db) return;
  db.prepare('DELETE FROM sessions WHERE token = ?').run(token);
}

/** Obtener instancia de la base de datos */
function getDb() {
  return db;
}

module.exports = {
  initDatabase,
  authenticateUser,
  validateSession,
  logout,
  getDb,
  hashPassword,
};
