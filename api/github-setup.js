import {
  siteOrigin,
  getOAuthCreds,
  setOAuthCookies,
  githubAuthorizeUrl,
  pageHtml,
  escapeHtml,
} from '../lib/github-oauth.js';

function htmlError(res, message) {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(200).send(
    pageHtml({
      title: 'Connexion GitHub — Écocurieux',
      body: `<h1>Connexion interrompue</h1><p>${escapeHtml(message)}</p><p class="muted">Ferme cette fenêtre, puis réessaie depuis le back-office.</p>`,
    })
  );
}

export default async function handler(req, res) {
  const origin = siteOrigin(req);
  const query = req.query || {};
  const code = query.code;
  const installed = query.installed;
  const error = query.error;
  const errorDescription = query.error_description;

  if (error) {
    return htmlError(res, errorDescription || error);
  }

  if (installed) {
    const { clientId } = getOAuthCreds(req);
    if (!clientId) {
      res.redirect(302, `${origin}/auth`);
      return;
    }
    res.redirect(302, githubAuthorizeUrl(clientId, origin));
    return;
  }

  if (!code) {
    return htmlError(res, 'GitHub n’a pas renvoyé de code de configuration.');
  }

  try {
    const conv = await fetch(
      `https://api.github.com/app-manifests/${encodeURIComponent(code)}/conversions`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
        },
      }
    );
    const data = await conv.json();
    if (!data.client_id || !data.client_secret) {
      return htmlError(
        res,
        data.message || 'Impossible de terminer la création de l’application GitHub.'
      );
    }

    setOAuthCookies(res, data.client_id, data.client_secret);

    const slug = data.slug;
    const targetId = data.owner && data.owner.id;
    const nextUrl = slug
      ? `https://github.com/apps/${encodeURIComponent(slug)}/installations/new${
          targetId ? `?target_id=${encodeURIComponent(targetId)}` : ''
        }`
      : githubAuthorizeUrl(data.client_id, origin);

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(
      pageHtml({
        title: 'Connexion GitHub — Écocurieux',
        body: `
          <h1>Presque terminé</h1>
          <p>GitHub va maintenant te demander d’installer l’application sur le dépôt Écocurieux.</p>
          <p class="muted">Choisis le compte <strong>amandinejd-eng</strong>, puis uniquement le dépôt <strong>EcoCurieux</strong>.</p>
          <a class="btn" href="${escapeHtml(nextUrl)}" style="text-align:center;text-decoration:none;">Installer sur GitHub</a>
          <script>location.replace(${JSON.stringify(nextUrl)});</script>
        `,
      })
    );
  } catch (err) {
    return htmlError(res, err.message || 'Erreur pendant la configuration GitHub.');
  }
}
