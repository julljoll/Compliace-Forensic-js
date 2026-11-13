/**
 * Neon REST Client — usa la API Key para descubrir la connection URL
 * y luego ejecutar queries SQL via el driver serverless.
 */

const NEON_API_KEY = process.env.NEXT_PUBLIC_NEON_API_KEY || '';
const NEON_API_BASE = 'https://console.neon.tech/api/v2';

let cachedConnectionString: string | null = null;

async function neonFetch(path: string): Promise<any> {
  const res = await fetch(`${NEON_API_BASE}${path}`, {
    headers: {
      'Authorization': `Bearer ${NEON_API_KEY}`,
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) {
    throw new Error(`Neon API error ${res.status}: ${await res.text()}`);
  }
  return res.json();
}

/**
 * Descubre la connection URL del proyecto Neon associado a la API Key.
 * Cachea el resultado para no repetir llamadas.
 */
export async function discoverConnectionString(): Promise<string | null> {
  if (cachedConnectionString) return cachedConnectionString;

  try {
    // 1. Listar proyectos
    const projectsRes = await neonFetch('/projects');
    const projects = projectsRes.projects || [];
    if (projects.length === 0) {
      console.error('[NeonREST] No se encontraron proyectos');
      return null;
    }
    const project = projects[0];
    const projectId = project.id;

    // 2. Listar branches del proyecto
    const branchesRes = await neonFetch(`/projects/${projectId}/branches`);
    const branches = branchesRes.branches || [];
    const mainBranch = branches.find((b: any) => b.name === 'main') || branches[0];
    if (!mainBranch) {
      console.error('[NeonREST] No se encontraron branches');
      return null;
    }
    const branchId = mainBranch.id;

    // 3. Listar databases
    const dbsRes = await neonFetch(`/projects/${projectId}/branches/${branchId}/databases`);
    const databases = dbsRes.databases || [];
    if (databases.length === 0) {
      console.error('[NeonREST] No se encontraron databases');
      return null;
    }
    const db = databases[0];
    const dbName = db.name;

    // 4. Obtener connection URI (pooled)
    const uriRes = await neonFetch(`/projects/${projectId}/connection_uri?database_name=${dbName}&branch_id=${branchId}&pooled=true`);
    const connUri = uriRes.uri;

    if (connUri) {
      cachedConnectionString = connUri;
      console.info('[NeonREST] Connection string descubierta correctamente');
      return connUri;
    }

    // Fallback: construir manualmente
    const host = project.host || `ep-${projectId}-pooler.us-east-2.aws.neon.tech`;
    const roles = await neonFetch(`/projects/${projectId}/branches/${branchId}/roles`);
    const role = roles.roles?.[0];
    if (role) {
      const uri = `postgresql://${role.name}:${role.password}@${host}/${dbName}?sslmode=require`;
      cachedConnectionString = uri;
      return uri;
    }

    return null;
  } catch (e: any) {
    console.error('[NeonREST] Error descubriendo connection string:', e.message);
    return null;
  }
}

/**
 * Ejecuta un query SQL usando el driver serverless de Neon.
 * Descubre la connection string automáticamente.
 */
export async function queryNeon(sqlQuery: string, params?: any[]): Promise<any> {
  const connStr = await discoverConnectionString();
  if (!connStr) {
    throw new Error('No se pudo obtener la connection string de Neon');
  }

  const { neon } = await import('@neondatabase/serverless');
  const sql = neon(connStr);
  return sql.query(sqlQuery, params);
}

/**
 * Valida si un correo está autorizado en la tabla authorized_users.
 */
export async function authUserByEmail(email: string): Promise<{ success: boolean; user?: any; error?: string }> {
  try {
    const result = await queryNeon(
      'SELECT * FROM authorized_users WHERE LOWER(email) = LOWER($1) AND activo = true',
      [email]
    );
    const rows = result.rows || result;
    const row = Array.isArray(rows) ? rows[0] : rows;
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
    console.error('[NeonREST] Error validando usuario:', e.message);
    return { success: false, error: 'Error de conexión con la base de datos' };
  }
}

/**
 * Inicializa las tablas necesarias en Neon.
 */
export async function initDatabase(): Promise<boolean> {
  try {
    await queryNeon(`
      CREATE TABLE IF NOT EXISTS authorized_users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        nombre VARCHAR(255) DEFAULT '',
        activo BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const countResult = await queryNeon('SELECT COUNT(*) as count FROM authorized_users');
    const rows = countResult.rows || countResult;
    const count = Number(Array.isArray(rows) ? rows[0]?.count : rows?.count ?? 0);
    if (count === 0) {
      await queryNeon(
        "INSERT INTO authorized_users (email, nombre) VALUES ('julljoll@gmail.com', 'Jull Joll') ON CONFLICT (email) DO NOTHING"
      );
      console.info('[NeonREST] Usuario autorizado insertado: julljoll@gmail.com');
    }

    console.info('[NeonREST] Tablas inicializadas correctamente');
    return true;
  } catch (e: any) {
    console.error('[NeonREST] Error inicializando tablas:', e.message);
    return false;
  }
}

export { cachedConnectionString };
