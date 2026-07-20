import { NextResponse } from 'next/server';
import { initLocalSQLiteDatabase, queryLocalSQLite } from '@/db/sqliteClient';

export async function GET() {
  try {
    const initialized = await initLocalSQLiteDatabase();
    const casos = await queryLocalSQLite('SELECT * FROM casos ORDER BY fecha_actualizacion DESC');
    
    return NextResponse.json({
      status: 'online',
      mode: process.env.VERCEL ? 'vercel_cloud' : 'local_node',
      sqlite_ready: initialized,
      total_casos: casos ? casos.length : 0,
      casos: casos || [],
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'fallback_indexeddb',
      mode: process.env.VERCEL ? 'vercel_cloud' : 'local_node',
      sqlite_ready: false,
      error: error?.message || 'IndexedDB client-side fallback active',
    }, { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, caso, log } = body;

    if (action === 'init') {
      const ok = await initLocalSQLiteDatabase();
      return NextResponse.json({ success: ok });
    }

    if (action === 'save_caso' && caso) {
      await initLocalSQLiteDatabase();
      await queryLocalSQLite(`
        INSERT INTO casos (id, numero_caso, titulo, descripcion, estado, prioridad, fiscal, perito_lider, compliance, fases_completadas, total_fases, porcentaje_completado, total_evidencias, datos_json, fecha_creacion, fecha_actualizacion)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          titulo=excluded.titulo,
          descripcion=excluded.descripcion,
          estado=excluded.estado,
          prioridad=excluded.prioridad,
          fiscal=excluded.fiscal,
          perito_lider=excluded.perito_lider,
          compliance=excluded.compliance,
          fases_completadas=excluded.fases_completadas,
          total_fases=excluded.total_fases,
          porcentaje_completado=excluded.porcentaje_completado,
          total_evidencias=excluded.total_evidencias,
          datos_json=excluded.datos_json,
          fecha_actualizacion=excluded.fecha_actualizacion
      `, [
        caso.id,
        caso.numeroCaso || caso.numero_caso || `CASO-${Date.now()}`,
        caso.titulo || 'Caso Forense',
        caso.descripcion || '',
        caso.estado || 'iniciado',
        caso.prioridad || 'media',
        caso.fiscal || '',
        caso.peritoLider || '',
        caso.compliance || 'Pendiente',
        caso.fasesCompletadas || 0,
        caso.totalFases || 0,
        caso.porcentajeCompletado || 0,
        caso.totalEvidencias || 0,
        JSON.stringify(caso),
        caso.fechaCreacion || new Date().toISOString(),
        new Date().toISOString()
      ]);
      return NextResponse.json({ success: true });
    }

    if (action === 'add_audit_log' && log) {
      await initLocalSQLiteDatabase();
      await queryLocalSQLite(`
        INSERT INTO audit_logs (id, timestamp, accion, usuario, rol, detalles, hash, prev_hash, caso_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO NOTHING
      `, [
        log.id || `LOG-${Date.now()}`,
        log.timestamp || new Date().toISOString(),
        log.accion || 'ACCION',
        log.usuario || 'Perito System',
        log.rol || 'perito',
        typeof log.detalles === 'object' ? JSON.stringify(log.detalles) : (log.detalles || ''),
        log.hash || '',
        log.prevHash || log.prev_hash || '',
        log.casoId || log.caso_id || null
      ]);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: 'Acción no soportada' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}
