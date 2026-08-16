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
        <p>Plus besoin de créer un jeton. Clique sur le bouton, puis sur GitHub accepte les écrans <strong>Create GitHub App</strong> et <strong>Installer</strong>.</p>
        <p class="muted">Si GitHub dit que le nom est déjà pris, change-le simplement (par exemple EcoCurieux-amandinejd). C’est gratuit.</p>
        <form action="https://github.com/settings/apps/new" method="post">
          <input type="hidden" name="manifest" id="manifest">
          <button class="btn" type="submit">Continuer avec GitHub</button>
        </form>
        <script>document.getElementById('manifest').value = ${manifestLiteral};</script>
      `,
    })
  );
}
