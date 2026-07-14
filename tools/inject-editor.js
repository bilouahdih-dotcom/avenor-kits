// Injecte (ou remplace) l'éditeur visuel AVENOR-EDITOR dans l'index.html de chaque kit,
// et (re)génère le lanceur MODIFIER-MON-SITE.html.
// Usage : node inject-editor.js  (idempotent — remplace le bloc existant)
const fs = require('fs');
const path = require('path');

const DOCS = 'C:/Users/bilel/Documents';
const SCRATCH = __dirname;

// requêtes banques d'images par secteur
const KITS = {
  'kit-site-restaurant':  { pexels: 'restaurant%20plat', unsplash: 'restaurant-food' },
  'kit-site-fastfood':    { pexels: 'burger%20frites',   unsplash: 'burger' },
  'kit-site-coiffeur':    { pexels: 'barbier%20coiffure', unsplash: 'barber-shop' },
  'kit-site-artisan':     { pexels: 'serrurier%20cl%C3%A9', unsplash: 'locksmith' },
  'kit-site-boulangerie': { pexels: 'boulangerie%20pain', unsplash: 'bakery' },
};

const START = '<!-- AVENOR-EDITOR -->';
const END = '<!-- /AVENOR-EDITOR -->';
const template = fs.readFileSync(path.join(SCRATCH, 'editor-template.html'), 'utf8');

const LAUNCHER = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8" />
<title>Ouverture de l'éditeur…</title>
<style>
  body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;display:grid;place-items:center;min-height:90vh;color:#1c1e24;background:#f6f7fa;margin:0;padding:20px}
  .card{background:#fff;border:1px solid #e4e7ee;border-radius:16px;padding:36px;max-width:520px;line-height:1.7;box-shadow:0 10px 40px rgba(20,24,40,.08)}
  h1{font-size:22px;margin:0 0 12px}
  ol{padding-left:22px}
  li{margin:8px 0}
  a{color:#4f46e5;font-weight:700}
  .hidden{display:none}
</style>
</head>
<body>
<div class="card">
  <div id="go"><h1>✏️ Ouverture de l'éditeur…</h1><p><a href="index.html#edition">Cliquez ici si rien ne se passe.</a></p></div>
  <div id="warn" class="hidden">
    <h1>⚠️ Une étape avant de commencer</h1>
    <p>Vous avez ouvert ce fichier <b>depuis l'intérieur du fichier ZIP</b>. Il faut d'abord décompresser le dossier (30 secondes) :</p>
    <ol>
      <li>Fermez cette fenêtre.</li>
      <li>Faites un <b>clic droit sur le fichier ZIP</b> téléchargé → <b>« Extraire tout... »</b> → Extraire.</li>
      <li>Ouvrez le <b>nouveau dossier</b> créé.</li>
      <li>Double-cliquez à nouveau sur <b>MODIFIER-MON-SITE.html</b> — l'éditeur s'ouvrira.</li>
    </ol>
  </div>
</div>
<script>
  var p = '';
  try { p = decodeURIComponent(location.pathname); } catch (e) { p = location.pathname; }
  // Ouvert depuis l'intérieur d'un zip : Windows extrait le fichier seul dans un dossier temporaire
  if (/[\\/\\\\]Temp[\\/\\\\]/i.test(p) || /\\.zip[\\/\\\\]/i.test(p)) {
    document.getElementById('go').className = 'hidden';
    document.getElementById('warn').className = '';
  } else {
    location.replace('index.html#edition');
  }
</script>
</body>
</html>
`;

for (const [kit, cfg] of Object.entries(KITS)) {
  const file = path.join(DOCS, kit, 'index.html');
  let html = fs.readFileSync(file, 'utf8');
  const block = template
    .replace('__PEXELS__', 'https://www.pexels.com/fr-fr/chercher/' + cfg.pexels + '/')
    .replace('__UNSPLASH__', 'https://unsplash.com/s/photos/' + cfg.unsplash);

  const s = html.indexOf(START);
  if (s > -1) {
    const e = html.indexOf(END);
    html = html.slice(0, s) + block + html.slice(e + END.length);
  } else {
    html = html.replace('</body>', block + '\n</body>');
  }
  fs.writeFileSync(file, html, 'utf8');
  fs.writeFileSync(path.join(DOCS, kit, 'MODIFIER-MON-SITE.html'), LAUNCHER, 'utf8');
  console.log('OK', kit);
}
console.log('DONE');
