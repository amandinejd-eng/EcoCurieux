import { siteOrigin, getOAuthCreds } from '../lib/github-oauth.js';

function sendMessage(res, kind, payload) {
  const json = JSON.stringify(payload).replace(/</g, '\\u003c');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(200).send(`<!DOCTYPE html><html lang="fr"><body><script>
    (function () {
      var payload = ${json};
      function receiveMessage(e) {
        window.opener.postMessage('authorization:github:${kind}:' + JSON.stringify(payload), e.origin);
        window.removeEventListener('message', receiveMessage, false);
      }
      window.addEventListener('message', receiveMessage, false);
      if (window.opener) {
        window.opener.postMessage('authorizing:github', '*');
      } else {
        document.body.innerHTML = '<p style="font-family:sans-serif;padding:2rem">Connexion GitHub terminée. Tu peux fermer cette fenêtre et revenir au back-office.</p>';
      }
    })();
  </script></body></html>`);
}

export default async function handler(req, res) {
  const { code, error, error_description: errorDescription } = req.query || {};
  const origin = siteOrigin(req);
  const { clientId, clientSecret } = getOAuthCreds(req);

  if (error) {
    return sendMessage(res, 'error', { message: errorDescription || error });
  }

  if (!code || !clientId || !clientSecret) {
    return sendMessage(res, 'error', {
      message: 'Connexion GitHub incomplète. Ferme cette fenêtre et réessaie « Se connecter avec GitHub ».',
    });
  }

  try {
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: `${origin}/callback`,
      }),
    });
    const data = await tokenRes.json();
    if (!data.access_token) {
      return sendMessage(res, 'error', {
        message: data.error_description || data.error || 'Impossible d’obtenir l’accès GitHub.',
      });
    }

    return sendMessage(res, 'success', {
      token: data.access_token,
      provider: 'github',
    });
  } catch (err) {
    return sendMessage(res, 'error', { message: err.message || 'Erreur OAuth' });
  }
}
