import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { randomBytes } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));
const publicRoot = resolve(root);
const port = Number(process.env.PORT || 3000);
const jellyfinUrl = (process.env.JELLYFIN_URL || 'https://jf.phantomhex.cc').replace(/\/+$/, '');
const sessionTtlMs = 12 * 60 * 60 * 1000;
const sessions = new Map();
const attempts = new Map();
const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
};

function setSecurityHeaders(res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; form-action 'self'; base-uri 'self'");
  res.setHeader('Strict-Transport-Security', 'max-age=31536000');
}

function sendJson(res, status, body, extraHeaders = {}) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...extraHeaders });
  res.end(JSON.stringify(body));
}

function parseCookies(req) {
  return Object.fromEntries((req.headers.cookie || '').split(';').map((part) => {
    const index = part.indexOf('=');
    return index < 0 ? ['', ''] : [part.slice(0, index).trim(), decodeURIComponent(part.slice(index + 1).trim())];
  }).filter(([key]) => key));
}

function sessionFor(req) {
  const id = parseCookies(req).phx_session;
  const session = id ? sessions.get(id) : null;
  if (!session || session.expiresAt <= Date.now()) {
    if (id) sessions.delete(id);
    return null;
  }
  return { id, ...session };
}

function clientAddress(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length < 512) return forwarded.split(',').at(-1).trim();
  return req.socket.remoteAddress || 'unknown';
}

function originIsSameSite(req) {
  const origin = req.headers.origin;
  if (!origin) return false;
  try {
    return new URL(origin).host === req.headers.host;
  } catch {
    return false;
  }
}

async function readJson(req, maxBytes = 4096) {
  let raw = '';
  for await (const chunk of req) {
    raw += chunk;
    if (Buffer.byteLength(raw) > maxBytes) throw new Error('body-too-large');
  }
  return JSON.parse(raw || '{}');
}

async function readLoginBody(req) {
  const contentType = (req.headers['content-type'] || '').split(';', 1)[0].trim().toLowerCase();
  let raw = '';
  for await (const chunk of req) {
    raw += chunk;
    if (Buffer.byteLength(raw) > 4096) throw new Error('body-too-large');
  }
  if (contentType === 'application/json') return { body: JSON.parse(raw || '{}'), formSubmission: false };
  if (contentType === 'application/x-www-form-urlencoded') {
    return { body: Object.fromEntries(new URLSearchParams(raw)), formSubmission: true };
  }
  throw new Error('unsupported-content-type');
}

function loginError(res, formSubmission, status, code, message) {
  if (formSubmission) {
    return res.writeHead(303, { Location: `/login?error=${encodeURIComponent(code)}`, 'Cache-Control': 'no-store' }).end();
  }
  return sendJson(res, status, { error: message });
}

function allowLoginAttempt(address) {
  const now = Date.now();
  const current = attempts.get(address);
  if (!current || current.resetAt <= now) {
    attempts.set(address, { count: 1, resetAt: now + 15 * 60 * 1000 });
    return true;
  }
  if (current.count >= 8) return false;
  current.count += 1;
  return true;
}

async function serveFile(res, filename, noCache = false) {
  const path = resolve(publicRoot, filename);
  if (path !== publicRoot && !path.startsWith(publicRoot + sep)) {
    res.writeHead(404).end();
    return;
  }
  try {
    const info = await stat(path);
    if (!info.isFile()) throw new Error('not-file');
    res.writeHead(200, {
      'Content-Type': mimeTypes[extname(path)] || 'application/octet-stream',
      'Content-Length': info.size,
      'Cache-Control': noCache ? 'no-store' : 'public, max-age=86400',
    });
    createReadStream(path).pipe(res);
  } catch {
    res.writeHead(404).end();
  }
}

const server = createServer(async (req, res) => {
  setSecurityHeaders(res);
  const url = new URL(req.url || '/', 'http://localhost');
  const session = sessionFor(req);

  if (req.method === 'GET' && url.pathname === '/health') {
    return sendJson(res, 200, { status: 'ok' });
  }

  // Strip legacy/native-GET credentials from the address bar and referrer chain.
  if (req.method === 'GET' && ['/', '/login'].includes(url.pathname) && (url.searchParams.has('username') || url.searchParams.has('password'))) {
    return res.writeHead(303, { Location: url.pathname, 'Cache-Control': 'no-store' }).end();
  }

  if (req.method === 'POST' && url.pathname === '/api/login') {
    const formSubmission = (req.headers['content-type'] || '').toLowerCase().startsWith('application/x-www-form-urlencoded');
    if (!originIsSameSite(req)) return loginError(res, formSubmission, 403, 'request', 'Requête refusée. Rechargez la page et réessayez.');
    const address = clientAddress(req);
    if (!allowLoginAttempt(address)) return loginError(res, formSubmission, 429, 'rate-limit', 'Trop de tentatives. Patientez 15 minutes avant de réessayer.');
    let username;
    let password;
    let isFormSubmission;
    try {
      const { body, formSubmission: isForm } = await readLoginBody(req);
      isFormSubmission = isForm;
      username = typeof body.username === 'string' ? body.username.trim() : '';
      password = typeof body.password === 'string' ? body.password : '';
    } catch {
      return loginError(res, formSubmission, 400, 'invalid', 'Formulaire invalide.');
    }
    if (!username || !password || username.length > 128 || password.length > 1024) {
      return loginError(res, isFormSubmission, 400, 'invalid', 'Saisissez votre identifiant et votre mot de passe Jellyfin.');
    }

    const deviceId = randomBytes(12).toString('hex');
    try {
      const authResponse = await fetch(`${jellyfinUrl}/Users/AuthenticateByName`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Emby-Authorization': `MediaBrowser Client="Phant0mhex Portal", Device="Web", DeviceId="${deviceId}", Version="1.0"`,
        },
        body: JSON.stringify({ Username: username, Pw: password }),
        signal: AbortSignal.timeout(10_000),
      });
      if (!authResponse.ok) {
        const invalidCredentials = authResponse.status === 401 || authResponse.status === 403;
        return loginError(res, isFormSubmission, invalidCredentials ? 401 : 503,
          invalidCredentials ? 'credentials' : 'unavailable',
          invalidCredentials ? 'Identifiants Jellyfin invalides ou compte indisponible.' : 'Jellyfin ne peut pas terminer la connexion. Réessayez dans un instant.');
      }
      const auth = await authResponse.json();
      if (!auth.AccessToken || !auth.User?.Id || !auth.User?.Name) {
        return loginError(res, isFormSubmission, 503, 'unavailable', 'Réponse Jellyfin inattendue. Réessayez dans un instant.');
      }
      const id = randomBytes(32).toString('base64url');
      sessions.set(id, {
        userId: auth.User.Id,
        username: auth.User.Name,
        accessToken: auth.AccessToken,
        expiresAt: Date.now() + sessionTtlMs,
      });
      attempts.delete(address);
      const cookie = `phx_session=${id}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${Math.floor(sessionTtlMs / 1000)}`;
      if (isFormSubmission) return res.writeHead(303, { Location: '/', 'Cache-Control': 'no-store', 'Set-Cookie': cookie }).end();
      return sendJson(res, 200, { ok: true, username: auth.User.Name }, {
        'Set-Cookie': cookie,
      });
    } catch {
      return loginError(res, isFormSubmission, 503, 'unavailable', 'Impossible de joindre Jellyfin. Vérifiez sa disponibilité puis réessayez.');
    } finally {
      password = '';
    }
  }

  if (req.method === 'GET' && url.pathname === '/api/session') {
    if (!session) return sendJson(res, 401, { authenticated: false });
    return sendJson(res, 200, { authenticated: true, username: session.username });
  }

  if (req.method === 'POST' && url.pathname === '/api/logout') {
    if (!originIsSameSite(req)) return sendJson(res, 403, { error: 'Requête refusée.' });
    if (session) sessions.delete(session.id);
    return sendJson(res, 200, { ok: true }, { 'Set-Cookie': 'phx_session=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0' });
  }

  if (req.method === 'GET' && url.pathname === '/') {
    return serveFile(res, session ? 'index.html' : 'login.html', true);
  }
  if (req.method === 'GET' && url.pathname === '/login') {
    return serveFile(res, session ? 'index.html' : 'login.html', true);
  }
  if (req.method === 'GET' && (url.pathname === '/index.html' || url.pathname === '/app.js')) {
    if (!session) return res.writeHead(302, { Location: '/login', 'Cache-Control': 'no-store' }).end();
    return serveFile(res, url.pathname.slice(1), true);
  }
  if (req.method === 'GET' && url.pathname === '/login.js') return serveFile(res, 'login.js', true);
  if (req.method === 'GET' && (url.pathname === '/styles.css' || url.pathname.startsWith('/assets/'))) {
    return serveFile(res, url.pathname.slice(1));
  }
  return res.writeHead(404, { 'Cache-Control': 'no-store' }).end();
});

server.listen(port, '0.0.0.0', () => process.stdout.write(`Phant0mhex portal listening on ${port}\n`));

setInterval(() => {
  const now = Date.now();
  for (const [id, session] of sessions) if (session.expiresAt <= now) sessions.delete(id);
  for (const [address, attempt] of attempts) if (attempt.resetAt <= now) attempts.delete(address);
}, 60 * 60 * 1000).unref();
