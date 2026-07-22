import { NextResponse } from 'next/server';
import {
  initLocalSQLiteDatabase,
  getCasosSQLite,
  addCasoSQLite,
  updateCasoSQLite,
  deleteCasoSQLite,
  getUsersSQLite,
  addUserSQLite,
  updateUserSQLite,
  deleteUserSQLite,
  getAuditLogsSQLite,
  addAuditLogSQLite
} from '@/db/sqliteClient';

export async function GET() {
  try {
    await initLocalSQLiteDatabase();
    const casos = await getCasosSQLite();
    const users = await getUsersSQLite();
    const logs = await getAuditLogsSQLite();
    
    return NextResponse.json({
      status: 'online',
      mode: process.env.VERCEL ? 'vercel_cloud' : 'local_node',
      sqlite_ready: true,
      total_casos: casos ? casos.length : 0,
      casos: casos || [],
      users: users || [],
      logs: logs || []
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      mode: process.env.VERCEL ? 'vercel_cloud' : 'local_node',
      sqlite_ready: false,
      error: error?.message || 'Error en servidor local SQLite',
      casos: []
    }, { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    await initLocalSQLiteDatabase();
    const body = await request.json();
    const { action, caso, id, data, user, log } = body;

    if (action === 'init') {
      const ok = await initLocalSQLiteDatabase();
      return NextResponse.json({ success: ok });
    }

    if (action === 'save_caso' && caso) {
      const res = await addCasoSQLite(caso);
      return NextResponse.json(res);
    }

    if (action === 'update_caso' && id) {
      const ok = await updateCasoSQLite(id, data || {});
      return NextResponse.json({ success: ok });
    }

    if (action === 'delete_caso' && id) {
      const ok = await deleteCasoSQLite(id);
      return NextResponse.json({ success: ok });
    }

    if (action === 'get_casos') {
      const casos = await getCasosSQLite();
      return NextResponse.json({ success: true, casos });
    }

    if (action === 'get_users') {
      const users = await getUsersSQLite();
      return NextResponse.json({ success: true, users });
    }

    if (action === 'add_user' && user) {
      const res = await addUserSQLite(user);
      return NextResponse.json(res);
    }

    if (action === 'update_user' && id) {
      const ok = await updateUserSQLite(id, data || {});
      return NextResponse.json({ success: ok });
    }

    if (action === 'delete_user' && id) {
      const ok = await deleteUserSQLite(id);
      return NextResponse.json({ success: ok });
    }

    if (action === 'add_audit_log' && log) {
      const ok = await addAuditLogSQLite(log);
      return NextResponse.json({ success: ok });
    }

    return NextResponse.json({ success: false, error: 'Acción no soportada' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}
