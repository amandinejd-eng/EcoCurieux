function siteOrigin(req) {
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  return `${proto}://${host}`;
}

export default async function handler(req, res) {
  const { code, error, error_description: errorDescription } = req.query || {};

  const fail = (message) => {
    const payload = JSON.stringify({
      message: message || 'Authorization failed',
    }).replace(/</g, '\\u003c');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(`<!DOCTYPE html><html><body><script>
      (function () {
        function receiveMessage(e) {
          window.opener.postMessage('authorization:github:error:' + ${JSON.stringify(payload)}, e.origin);
          window.removeEventListener('message', receiveMessage, false);
        }
        window.addEventListener('message', receiveMessage, false);
        window.opener.postMessage('authorizing:github', '*');
      })();
    </script></body></html>`);
  };

  if (error) {
    return fail(errorDescription || error);
  }

  if (!code || !process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
    return fail('Code OAuth manquant ou identifiants GitHub non configurés.');
  }

  try {
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: `${siteOrigin(req)}/callback`,
      }),
    });
    const data = await tokenRes.json();
    if (!data.access_token) {
      return fail(data.error_description || data.error || 'Impossible d’obtenir le jeton GitHub.');
    }

    const success = JSON.stringify({
      token: data.access_token,
      provider: 'github',
    }).replace(/</g, '\\u003c');

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(`<!DOCTYPE html><html><body><script>
      (function () {
        function receiveMessage(e) {
          window.opener.postMessage('authorization:github:success:' + ${JSON.stringify(success)}, e.origin);
          window.removeEventListener('message', receiveMessage, false);
        }
        window.addEventListener('message', receiveMessage, false);
        window.opener.postMessage('authorizing:github', '*');
      })();
    </script></body></html>`);
  } catch (err) {
    return fail(err.message || 'Erreur OAuth');
  }
}
