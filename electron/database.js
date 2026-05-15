/**
 * Base de datos PostgreSQL Serverless — SHA256.US Peritaje Privado
 * Motor: Neon Database (@neondatabase/serverless)
 */
require('dotenv').config();
const { neon } = require('@neondatabase/serverless');
const crypto = require('crypto');

let sql = null;

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

/** Inicializar base de datos en Neon */
async function initDatabase() {
  if (!process.env.DATABASE_URL) {
    console.error('[DB] Error: No DATABASE_URL found in .env');
    return null;
  }
  
  sql = neon(process.env.DATABASE_URL);
  
  try {
    // ── Tabla de usuarios ──
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        nombre VARCHAR(255) DEFAULT '',
        rol VARCHAR(50) DEFAULT 'perito',
        activo INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP
      )
    `;

    // ── Tabla de sesiones ──
    await sql`
      CREATE TABLE IF NOT EXISTS sessions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        token VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP
      )
    `;

    // ── Tabla de casos / expedientes ──
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

    // ── Tabla de log de auditoría ──
    await sql`
      CREATE TABLE IF NOT EXISTS audit_log (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        accion VARCHAR(255) NOT NULL,
        detalle TEXT DEFAULT '',
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // ── Tabla de Estado Global CMS (Persistencia Remota Zustand) ──
    await sql`
      CREATE TABLE IF NOT EXISTS cms_state (
        user_id INTEGER PRIMARY KEY REFERENCES users(id),
        state JSONB NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // ── Insertar usuario admin si no existe ──
    const existingAdmins = await sql`SELECT id FROM users WHERE username = 'admin'`;
    if (existingAdmins.length === 0) {
      await sql`
        INSERT INTO users (username, password_hash, nombre, rol) 
        VALUES ('admin', ${hashPassword('julljoll')}, 'Administrador', 'perito_lider')
      `;
    }

    console.log('[DB] Conexión a Neon PostgreSQL inicializada exitosamente.');
    return sql;
  } catch (error) {
    console.error('[DB] Error inicializando Neon:', error);
    return null;
  }
}

/** Verificar credenciales */
async function authenticateUser(username, password) {
  if (!sql) return null;
  
  try {
    const users = await sql`
      SELECT * FROM users 
      WHERE username = ${username} AND password_hash = ${hashPassword(password)} AND activo = 1
    `;
    
    if (users.length > 0) {
      const user = users[0];
      
      // Actualizar last_login
      await sql`UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ${user.id}`;
      
      // Generar token de sesión
      const token = crypto.randomBytes(32).toString('hex');
      await sql`
        INSERT INTO sessions (user_id, token, expires_at) 
        VALUES (${user.id}, ${token}, CURRENT_TIMESTAMP + INTERVAL '7 days')
      `;
      
      // Log
      await sql`
        INSERT INTO audit_log (user_id, accion, detalle) 
        VALUES (${user.id}, 'LOGIN', ${'Inicio de sesión: ' + username})
      `;

      return { id: user.id, username: user.username, nombre: user.nombre, rol: user.rol, token };
    }
    return null;
  } catch (err) {
    console.error('[DB] Error auth:', err);
    return null;
  }
}

/** Validar token de sesión */
async function validateSession(token) {
  if (!sql) return null;
  
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
    return null;
  } catch (err) {
    return null;
  }
}

/** Cerrar sesión */
async function logout(token) {
  if (!sql) return;
  try {
    await sql`DELETE FROM sessions WHERE token = ${token}`;
  } catch (err) {
    console.error('[DB] Error logout:', err);
  }
}

/** Obtener instancia de la base de datos (neon tag) */
function getDb() {
  return sql;
}

module.exports = {
  initDatabase,
  authenticateUser,
  validateSession,
  logout,
  getDb,
  hashPassword,
};
