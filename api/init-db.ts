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
    res.status(500).json({ error: 'Database connection not available (missing DATABASE_URL)' });
    return;
  }

  try {
    const success = await ensureDbInitialized();
    if (success) {
      res.status(200).json({ success: true, message: 'Database initialized/migrated successfully' });
    } else {
      res.status(500).json({ success: false, error: 'Database initialization failed' });
    }
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}
