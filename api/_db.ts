import { neon } from '@neondatabase/serverless';

const DATABASE_URL: string = process.env.DATABASE_URL || '';

// Inicializar el cliente Neon utilizando la variable de entorno segura del backend
export const sqlClient = DATABASE_URL ? neon(DATABASE_URL) : null;

let isInitialized = false;

// Inicializar tablas en la base de datos de forma perezosa y segura
export async function ensureDbInitialized() {
  if (isInitialized) return true;
  if (!sqlClient) {
    console.warn('Conexión de Neon no disponible: DATABASE_URL vacía.');
    return false;
  }

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
    isInitialized = true;
    return true;
  } catch (e) {
    console.error('Error al inicializar la base de datos Neon:', e);
    return false;
  }
}
