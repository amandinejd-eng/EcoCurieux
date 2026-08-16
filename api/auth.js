function siteOrigin(req) {
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  return `${proto}://${host}`;
}

export default async function handler(req, res) {
  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(`<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><title>Connexion CMS</title>
<style>
  body { font-family: Georgia, serif; background: #fdf5e6; color: #2c4f2a; padding: 2.5rem; line-height: 1.6; }
  .box { max-width: 520px; margin: 0 auto; background: #fff; padding: 2rem; border-radius: 16px; border: 2px solid #e8c98a; }
  h1 { font-family: Arial, sans-serif; font-size: 1.3rem; }
  code { background: #f3deb4; padding: 0.1rem 0.4rem; border-radius: 4px; }
</style>
</head>
<body>
  <div class="box">
    <h1>Connexion au back-office</h1>
    <p>La connexion « GitHub » automatique n’est pas encore configurée.</p>
    <p>Fermez cette fenêtre, puis cliquez sur <strong>Sign in with Token</strong> (connexion avec un jeton) dans l’écran du CMS.</p>
    <p>Le CMS ouvrira GitHub pour créer un jeton : copiez-le, collez-le, et vous pourrez modifier le site.</p>
  </div>
</body>
</html>`);
    return;
  }

  const params = new URLSearchParams({
    client_id: clientId,
    scope: 'repo user',
    redirect_uri: `${siteOrigin(req)}/callback`,
  });

  res.redirect(302, `https://github.com/login/oauth/authorize?${params.toString()}`);
}
