// En el cliente, no instanciamos @neondatabase/serverless directamente para evitar exponer las credenciales en el bundle.
// Hacemos peticiones HTTP a los endpoints locales /api/* creados en Vercel.

// Inicializar tablas en la base de datos a través de la API
export async function initDatabase() {
  try {
    const res = await fetch('/api/init-db');
    if (!res.ok) throw new Error('API initialization failed');
    console.log('Tablas en Neon Serverless inicializadas correctamente a través del backend.');
    return true;
  } catch (e) {
    console.error('Error al inicializar la base de datos remota (usando fallback local):', e);
    return false;
  }
}

// --- Casos (Proyectos) ---

export async function getCasosDB(userId: number = 1): Promise<any[]> {
  try {
    const res = await fetch(`/api/casos?userId=${userId}`);
    if (!res.ok) throw new Error('Error al obtener casos del API');
    const rows = await res.json();
    // Guardar en local para soporte offline
    localStorage.setItem('sha256_pwa_casos', JSON.stringify(rows));
    return rows;
  } catch (e) {
    console.error('Error al obtener casos de Neon API, cargando locales:', e);
    return loadCasosLocal();
  }
}

export async function addCasoDB(caso: any): Promise<{ success: boolean; id: string; error?: string }> {
  const newId = caso.id || `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  try {
    const res = await fetch('/api/casos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...caso, id: newId }),
    });
    if (!res.ok) throw new Error('Error al añadir caso en el API');
    const data = await res.json();
    return { success: true, id: data.id };
  } catch (e: any) {
    console.error('Error al insertar caso en Neon API, usando fallback local:', e);
    saveCasoLocal({ ...caso, id: newId });
    return { success: true, id: newId, error: e.message };
  }
}

export async function updateCasoDB(id: string, data: any): Promise<boolean> {
  try {
    const res = await fetch(`/api/casos?id=${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error al actualizar caso en el API');
    const responseData = await res.json();
    return responseData.success;
  } catch (e) {
    console.error('Error al actualizar caso en Neon API, usando fallback local:', e);
    updateCasoLocal(id, data);
    return true;
  }
}

export async function deleteCasoDB(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/casos?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Error al eliminar caso en el API');
    deleteCasoLocal(id);
    return true;
  } catch (e) {
    console.error('Error al eliminar caso en Neon API, usando fallback local:', e);
    deleteCasoLocal(id);
    return true;
  }
}

// --- Logs de Auditoría ---

export async function getAuditLogsDB(): Promise<any[]> {
  try {
    const res = await fetch('/api/audit-logs');
    if (!res.ok) throw new Error('Error al obtener audit logs del API');
    const rows = await res.json();
    localStorage.setItem('sha256_pwa_audit_logs', JSON.stringify(rows));
    return rows;
  } catch (e) {
    console.error('Error al obtener audit logs de Neon API, cargando locales:', e);
    return loadLogsLocal();
  }
}

export async function addAuditLogDB(log: any): Promise<boolean> {
  const newId = log.id || `${Date.now()}`;
  try {
    const res = await fetch('/api/audit-logs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...log, id: newId }),
    });
    if (!res.ok) throw new Error('Error al añadir log en el API');
    return true;
  } catch (e) {
    console.error('Error al agregar audit log a Neon API, usando fallback local:', e);
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

// --- Logs auxiliares para Auditoría local ---

function loadLogsLocal(): any[] {
  const stored = localStorage.getItem('sha256_pwa_audit_logs');
  return stored ? JSON.parse(stored) : [];
}

function saveLogLocal(log: any) {
  const logs = loadLogsLocal();
  logs.unshift(log);
  localStorage.setItem('sha256_pwa_audit_logs', JSON.stringify(logs));
}

