# Stack Técnico — Node.js Backend + PWA Frontend

## Arquitectura General

```
Cliente PWA (fetch / URLSession-equivalent)
     ↕  HTTP/REST · JSON · JWT
Servidor Node.js (Express/Fastify)
     ↕  ORM/Driver
Base de Datos (PostgreSQL / MongoDB / SQLite)
```

---

## Backend — Node.js con Express

### Estructura base del servidor

```javascript
// server.js — Entry point
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { rateLimit } from 'express-rate-limit';

const app = express();

// Middleware de seguridad
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS']
}));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
app.use('/api', rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutos
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
}));

// Rutas
import { authRouter }    from './routes/auth.js';
import { usersRouter }   from './routes/users.js';
import { resourceRouter } from './routes/resource.js';

app.use('/api/v1/auth',     authRouter);
app.use('/api/v1/users',    usersRouter);
app.use('/api/v1/resource', resourceRouter);

// Error handler global
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    error: { message: err.message, code: err.code }
  });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`🚀 Server on :${PORT}`));
```

### Formato de respuesta JSON — Consistente con iOS

```javascript
// Respuesta exitosa (como Codable en Swift)
const success = (res, data, meta = {}) => {
  res.json({
    success: true,
    data,
    meta: { timestamp: new Date().toISOString(), ...meta }
  });
};

// Respuesta paginada
const paginated = (res, items, total, page, limit) => {
  res.json({
    success: true,
    data: { items, pagination: { total, page, limit, pages: Math.ceil(total/limit) } },
    meta: { timestamp: new Date().toISOString() }
  });
};

// Error
const error = (res, message, status = 400, code = 'ERROR') => {
  res.status(status).json({
    success: false,
    error: { message, code }
  });
};
```

### Route típico con validación

```javascript
// routes/resource.js
import { Router } from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { auth } from '../middleware/auth.js';

const router = Router();

// GET /api/v1/resource — Lista con paginación
router.get('/',
  auth,                                      // JWT middleware
  [query('page').isInt({ min: 1 }).optional(),
   query('limit').isInt({ min: 1, max: 100 }).optional()],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return error(res, 'Validación fallida', 422, 'VALIDATION_ERROR');

    try {
      const page  = parseInt(req.query.page)  || 1;
      const limit = parseInt(req.query.limit) || 20;
      const offset = (page - 1) * limit;

      const [items, total] = await Promise.all([
        db.query('SELECT * FROM resource ORDER BY created_at DESC LIMIT $1 OFFSET $2', [limit, offset]),
        db.query('SELECT COUNT(*) FROM resource')
      ]);

      paginated(res, items.rows, parseInt(total.rows[0].count), page, limit);
    } catch (err) { next(err); }
  }
);

// POST /api/v1/resource — Crear
router.post('/',
  auth,
  [body('title').trim().notEmpty().isLength({ max: 255 }),
   body('description').trim().optional().isLength({ max: 2000 })],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return error(res, errors.array()[0].msg, 422);

    try {
      const { title, description } = req.body;
      const result = await db.query(
        'INSERT INTO resource (title, description, user_id) VALUES ($1,$2,$3) RETURNING *',
        [title, description, req.user.id]
      );
      success(res, result.rows[0]);
    } catch (err) { next(err); }
  }
);

export { router as resourceRouter };
```

### JWT Auth Middleware

```javascript
// middleware/auth.js
import jwt from 'jsonwebtoken';

export const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: { message: 'Sin autorización', code: 'UNAUTHORIZED' } });
  }

  try {
    const token = authHeader.split(' ')[1];
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ success: false, error: { message: 'Token inválido', code: 'INVALID_TOKEN' } });
  }
};
```

---

## Frontend PWA — Equivalente a URLSession

### API Client (equiv. URLSession + Codable)

```javascript
// src/api/client.js — El "URLSession" del frontend web

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

class APIClient {
  #token = null;

  setToken(token) { this.#token = token; localStorage.setItem('auth_token', token); }
  clearToken()    { this.#token = null;  localStorage.removeItem('auth_token'); }
  loadToken()     { this.#token = localStorage.getItem('auth_token'); }

  async #request(method, path, body = null, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(this.#token ? { Authorization: `Bearer ${this.#token}` } : {}),
      ...options.headers
    };

    const config = { method, headers, signal: options.signal };
    if (body) config.body = JSON.stringify(body);

    const response = await fetch(`${BASE_URL}${path}`, config);

    // Decode (equiv. JSONDecoder en Swift)
    const data = await response.json();
    if (!response.ok) throw new APIError(data.error?.message, response.status, data.error?.code);
    return data;
  }

  get(path, params = {})       { const qs = new URLSearchParams(params).toString(); return this.#request('GET',    `${path}${qs ? '?'+qs : ''}`); }
  post(path, body)              { return this.#request('POST',   path, body); }
  put(path, body)               { return this.#request('PUT',    path, body); }
  patch(path, body)             { return this.#request('PATCH',  path, body); }
  delete(path)                  { return this.#request('DELETE', path); }
}

export class APIError extends Error {
  constructor(message, status, code) {
    super(message); this.status = status; this.code = code;
  }
}

export const api = new APIClient();
api.loadToken();
```

### Uso del cliente (como llamar a URLSession)

```javascript
// Autenticación
const loginUser = async (email, password) => {
  const { data } = await api.post('/auth/login', { email, password });
  api.setToken(data.token);
  return data.user;
};

// Obtener lista
const fetchItems = async (page = 1) => {
  const { data } = await api.get('/resource', { page, limit: 20 });
  return data; // { items: [...], pagination: {...} }
};

// Crear item
const createItem = async (title, description) => {
  const { data } = await api.post('/resource', { title, description });
  return data;
};
```

### Service Worker (PWA Offline)

```javascript
// sw.js — Service Worker para PWA iOS
const CACHE_NAME = 'app-v1';
const STATIC_ASSETS = [
  '/', '/index.html', '/styles/tokens.css',
  '/styles/base.css', '/src/app.js'
];

// Instalar y cachear assets estáticos
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(c => c.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Network-first para API, cache-first para assets
self.addEventListener('fetch', (e) => {
  const { url } = e.request;
  if (url.includes('/api/')) {
    // API: network first, fallback a cache
    e.respondWith(
      fetch(e.request).then(r => {
        const clone = r.clone();
        caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
        return r;
      }).catch(() => caches.match(e.request))
    );
  } else {
    // Assets: cache first
    e.respondWith(
      caches.match(e.request).then(r => r || fetch(e.request))
    );
  }
});
```

### manifest.json — PWA Instalable

```json
{
  "name": "App Name",
  "short_name": "App",
  "description": "Descripción de la app",
  "start_url": "/",
  "display": "standalone",
  "orientation": "portrait",
  "background_color": "#FFFFFF",
  "theme_color": "#007AFF",
  "categories": ["utilities"],
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "maskable" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any maskable" }
  ],
  "screenshots": [],
  "related_applications": []
}
```

### SPA Router Simple (equiv. NavigationView)

```javascript
// src/router.js
const routes = {
  '/':           () => import('./views/Home.js'),
  '/detail/:id': () => import('./views/Detail.js'),
  '/settings':   () => import('./views/Settings.js'),
  '/login':      () => import('./views/Login.js'),
};

const router = {
  currentView: null,

  async navigate(path, params = {}) {
    const entry = Object.entries(routes).find(([pattern]) => matchPath(pattern, path));
    if (!entry) return this.navigate('/');

    const [pattern, loader] = entry;
    const viewParams = extractParams(pattern, path);
    const module = await loader();
    const view = await module.default({ ...viewParams, ...params });

    // Transición iOS — slide
    const main = document.getElementById('main-content');
    main.style.transform = 'translateX(100%)';
    main.style.opacity = '0';
    main.innerHTML = view;
    requestAnimationFrame(() => {
      main.style.transition = 'transform .35s cubic-bezier(.25,.46,.45,.94), opacity .3s ease';
      main.style.transform = 'translateX(0)';
      main.style.opacity = '1';
    });

    history.pushState({ path, params }, '', path);
  },

  back() {
    history.back();
  }
};

window.addEventListener('popstate', (e) => {
  if (e.state?.path) router.navigate(e.state.path, e.state.params);
});
```

---

## package.json Base

```json
{
  "type": "module",
  "scripts": {
    "dev": "nodemon server.js",
    "start": "node server.js",
    "dev:frontend": "vite",
    "build": "vite build"
  },
  "dependencies": {
    "express": "^4.21.0",
    "cors": "^2.8.5",
    "helmet": "^8.0.0",
    "compression": "^1.7.4",
    "express-rate-limit": "^7.4.0",
    "express-validator": "^7.2.0",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3",
    "dotenv": "^16.4.5",
    "pg": "^8.13.0"
  },
  "devDependencies": {
    "nodemon": "^3.1.0",
    "vite": "^5.4.0"
  }
}
```
