import {
  siteOrigin,
  getOAuthCreds,
  githubAuthorizeUrl,
  githubAppManifest,
  pageHtml,
} from '../lib/github-oauth.js';

export default async function handler(req, res) {
  const origin = siteOrigin(req);
  const { clientId } = getOAuthCreds(req);

  if (clientId) {
    res.redirect(302, githubAuthorizeUrl(clientId, origin));
    return;
  }

  const manifestLiteral = JSON.stringify(JSON.stringify(githubAppManifest(origin)));

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(200).send(
    pageHtml({
      title: 'Connexion GitHub — Écocurieux',
      body: `
        <h1>Se connecter avec GitHub</h1>
        <p>Première connexion seulement : clique, puis sur GitHub valide <strong>Create GitHub App</strong> et <strong>Installer</strong>.</p>
        <p class="muted">Si le nom est déjà pris, remplace-le par n’importe quel nom libre, par exemple EcoCurieux-site16. C’est gratuit, et tu n’auras plus à le refaire.</p>
        <form action="https://github.com/settings/apps/new" method="post">
          <input type="hidden" name="manifest" id="manifest">
          <button class="btn" type="submit">Continuer avec GitHub</button>
        </form>
        <script>document.getElementById('manifest').value = ${manifestLiteral};</script>
      `,
    })
  );
}
