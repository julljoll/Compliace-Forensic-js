import { sqlClient, ensureDbInitialized } from './_db';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (!sqlClient) {
    res.status(500).json({ error: 'Database connection not available' });
    return;
  }

  try {
    await ensureDbInitialized();

    const { method } = req;

    if (method === 'GET') {
      const rows = await sqlClient('SELECT * FROM audit_logs ORDER BY timestamp DESC');
      res.status(200).json(rows);
      return;
    }

    if (method === 'POST') {
      const log = req.body;
      const newId = log.id || `${Date.now()}`;
      await sqlClient(`
        INSERT INTO audit_logs (id, user_id, accion, detalle, timestamp, nombre, apellido, username)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `, [
        newId,
        log.user_id || 1,
        log.accion,
        log.detalle,
        log.timestamp || new Date().toISOString(),
        log.nombre || '',
        log.apellido || '',
        log.username || ''
      ]);
      res.status(200).json({ success: true, id: newId });
      return;
    }

    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).json({ error: `Method ${method} Not Allowed` });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}
