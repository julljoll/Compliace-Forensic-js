export default async function handler(
  req: { method: string; headers: Record<string, string | string[] | undefined>; body?: any },
  res: { setHeader: (k: string, v: string) => void; status: (c: number) => any; redirect: (u: string) => void; end: () => void }
) {
  const origin = typeof req.headers.origin === 'string' ? req.headers.origin : 'https://sha256.vercel.app';

  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const clientId = process.env.VERCEL_OAUTH_CLIENT_ID;
  const clientSecret = process.env.VERCEL_OAUTH_CLIENT_SECRET;
  const redirectUri = process.env.VERCEL_OAUTH_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    res.status(500).json({ error: 'Vercel OAuth no está configurado. Faltan variables de entorno.' });
    return;
  }

  if (req.method === 'GET') {
    const url = new URL('https://vercel.com/oauth/authorize');
    url.searchParams.set('client_id', clientId);
    url.searchParams.set('redirect_uri', redirectUri);
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('scope', '');
    url.searchParams.set('state', crypto.randomUUID());
    res.redirect(url.toString());
    return;
  }

  if (req.method === 'POST') {
    const body = req.body || {};
    const code = body.code;
    if (!code) {
      res.status(400).json({ error: 'Código de autorización requerido' });
      return;
    }

    try {
      const tokenRes = await fetch('https://api.vercel.com/v2/oauth/access_token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          code,
          redirect_uri: redirectUri,
        }),
      });

      if (!tokenRes.ok) {
        const errText = await tokenRes.text();
        console.error('[Vercel OAuth] Error exchanging code:', tokenRes.status, errText);
        res.status(401).json({ error: 'Error al intercambiar el código de autorización' });
        return;
      }

      const tokenData = await tokenRes.json();
      const accessToken = tokenData.access_token;

      const userRes = await fetch('https://api.vercel.com/v2/user', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!userRes.ok) {
        res.status(401).json({ error: 'Error al obtener información del usuario' });
        return;
      }

      const userData = await userRes.json();
      const vercelUser = userData.user;

      const authUser = {
        id: Date.now(),
        username: vercelUser.username,
        nombre: vercelUser.name || vercelUser.username,
        rol: 'perito',
        token: accessToken,
        profileImage: vercelUser.avatar || undefined,
      };

      const teamsRes = await fetch('https://api.vercel.com/v2/teams', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      let teams: any[] = [];
      if (teamsRes.ok) {
        const teamsData = await teamsRes.json();
        teams = teamsData.teams || [];
      }

      res.status(200).json({ user: authUser, teams });
    } catch (e: any) {
      console.error('[Vercel OAuth] Error:', e);
      res.status(500).json({ error: e.message || 'Error interno del servidor' });
    }
  }
}
