import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

const COOKIE_ID = 'ec_gh_id';
const COOKIE_SECRET = 'ec_gh_secret';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365 * 5;
const REPO = 'amandinejd-eng/EcoCurieux';
const CREDENTIALS_REPO_PATH = 'lib/oauth-credentials.json';
const CREDENTIALS_FILE = join(process.cwd(), 'lib', 'oauth-credentials.json');

export function siteOrigin(req) {
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  return `${proto}://${host}`;
}

export function readCookie(req, name) {
  const header = req.headers.cookie || '';
  const parts = header.split(';');
  for (const part of parts) {
    const [rawName, ...rest] = part.trim().split('=');
    if (rawName === name) {
      return decodeURIComponent(rest.join('=') || '');
    }
  }
  return '';
}

function fileCreds() {
  try {
    if (!existsSync(CREDENTIALS_FILE)) return {};
    const parsed = JSON.parse(readFileSync(CREDENTIALS_FILE, 'utf8'));
    return {
      clientId: parsed.clientId || '',
      clientSecret: parsed.clientSecret || '',
    };
  } catch {
    return {};
  }
}

export function getOAuthCreds(req) {
  const stored = fileCreds();
  return {
    clientId:
      process.env.GITHUB_CLIENT_ID || stored.clientId || readCookie(req, COOKIE_ID),
    clientSecret:
      process.env.GITHUB_CLIENT_SECRET || stored.clientSecret || readCookie(req, COOKIE_SECRET),
  };
}

export async function saveOAuthCredentials({ token, clientId, clientSecret }) {
  if (!token || !clientId || !clientSecret) return;
  const headers = {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${token}`,
    'X-GitHub-Api-Version': '2022-11-28',
    'Content-Type': 'application/json',
  };
  const url = `https://api.github.com/repos/${REPO}/contents/${CREDENTIALS_REPO_PATH}`;
  let sha;
  const existing = await fetch(url, { headers });
  if (existing.ok) {
    const data = await existing.json();
    sha = data.sha;
    try {
      const current = JSON.parse(Buffer.from(data.content || '', 'base64').toString('utf8'));
      if (current.clientId === clientId && current.clientSecret === clientSecret) return;
    } catch {
      // Replace an unreadable file.
    }
  }
  await fetch(url, {
    method: 'PUT',
    headers,
    body: JSON.stringify({
      message: 'CMS : enregistrer la connexion GitHub',
      content: Buffer.from(JSON.stringify({ clientId, clientSecret }, null, 2), 'utf8').toString(
        'base64'
      ),
      sha,
    }),
  });
}

export function setOAuthCookies(res, clientId, clientSecret) {
  const attrs = `Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${COOKIE_MAX_AGE}`;
  res.setHeader('Set-Cookie', [
    `${COOKIE_ID}=${encodeURIComponent(clientId)}; ${attrs}`,
    `${COOKIE_SECRET}=${encodeURIComponent(clientSecret)}; ${attrs}`,
  ]);
}

export function githubAuthorizeUrl(clientId, origin) {
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: `${origin}/callback`,
  });
  if (!String(clientId).startsWith('Iv1.')) {
    params.set('scope', 'repo user');
  }
  return `https://github.com/login/oauth/authorize?${params.toString()}`;
}

export function uniqueUrls(urls) {
  return [...new Set(urls.filter(Boolean))];
}

export function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function githubAppManifest(origin) {
  return {
    name: `EcoCurieux-${Date.now().toString(36)}`,
    url: origin,
    description: 'Connexion simple au back-office Écocurieux',
    public: false,
    redirect_url: `${origin}/github-setup`,
    setup_url: `${origin}/github-setup?installed=1`,
    callback_urls: uniqueUrls([
      `${origin}/callback`,
      'https://ecocurieux.com/callback',
      'https://eco-curieux.vercel.app/callback',
    ]),
    request_oauth_on_install: true,
    default_permissions: {
      contents: 'write',
      metadata: 'read',
    },
    hook_attributes: {
      url: `${origin}/api/github-webhook`,
      active: false,
    },
  };
}

export function pageHtml({ title, body }) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <style>
    :root { --green: #467b43; --green-dark: #2c4f2a; --beige: #f3deb4; --beige-2: #e8c98a; --cream: #fdf5e6; }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: Georgia, "Times New Roman", serif;
      background: var(--cream);
      color: var(--green-dark);
      padding: 1.5rem;
    }
    .box {
      width: min(34rem, 100%);
      background: #fff;
      padding: 2rem 2.1rem 2.2rem;
      border-radius: 18px;
      border: 2px solid var(--beige-2);
      box-shadow: 0 10px 30px rgba(44, 79, 42, 0.08);
    }
    img { display: block; height: 58px; width: auto; margin: 0 auto 1.1rem; }
    h1 { font-family: Arial, Helvetica, sans-serif; font-size: 1.35rem; margin: 0 0 0.8rem; text-align: center; }
    p { line-height: 1.6; margin: 0 0 0.85rem; }
    .btn {
      display: block;
      width: 100%;
      margin-top: 1.1rem;
      background: var(--green);
      color: #fff;
      border: 0;
      border-radius: 999px;
      padding: 0.9rem 1.2rem;
      font-size: 1.05rem;
      font-family: Arial, Helvetica, sans-serif;
      font-weight: 700;
      cursor: pointer;
    }
    .btn:hover { background: var(--green-dark); }
    .muted { color: #5d6b5c; font-size: 0.95rem; }
  </style>
</head>
<body>
  <div class="box">
    <img src="/images-creation-de-site/logo.png" alt="Écocurieux">
    ${body}
  </div>
</body>
</html>`;
}
