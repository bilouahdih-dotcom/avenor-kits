// Convertit les guides .md de chaque kit en pages HTML stylées (nav commune, boutons Copier).
// Usage : cd tools && npm install && node build-guides.js
const { marked } = require('marked');
const fs = require('fs');
const path = require('path');

const DOCS = 'C:/Users/bilel/Documents';
const KITS = ['kit-site-restaurant', 'kit-site-fastfood', 'kit-site-coiffeur', 'kit-site-artisan', 'kit-site-boulangerie'];

const GUIDES = [
  { md: 'LISEZ-MOI.md', html: 'LISEZ-MOI.html', title: 'Lisez-moi — Démarrage rapide', icon: '🚀' },
  { md: 'PERSONNALISATION.md', html: 'PERSONNALISATION.html', title: 'Personnalisation', icon: '✏️' },
  { md: 'GUIDE-DEPLOIEMENT.md', html: 'GUIDE-DEPLOIEMENT.html', title: 'Mise en ligne gratuite', icon: '🌐' },
  { md: 'GUIDE-PROSPECTION.md', html: 'GUIDE-PROSPECTION.html', title: 'Trouver des clients', icon: '🎯' },
  { md: 'images/AJOUTER-VOS-PHOTOS.md', html: 'images/AJOUTER-VOS-PHOTOS.html', title: 'Ajouter vos photos', icon: '📷' },
];

// remplace les références .md par .html dans les contenus
function fixRefs(mdText) {
  return mdText
    .replace(/LISEZ-MOI\.md/g, 'LISEZ-MOI.html')
    .replace(/PERSONNALISATION\.md/g, 'PERSONNALISATION.html')
    .replace(/GUIDE-DEPLOIEMENT\.md/g, 'GUIDE-DEPLOIEMENT.html')
    .replace(/GUIDE-PROSPECTION\.md/g, 'GUIDE-PROSPECTION.html')
    .replace(/(images\/)?AJOUTER-VOS-PHOTOS\.md/g, (m, p) => (p || '') + 'AJOUTER-VOS-PHOTOS.html');
}

function template(title, icon, bodyHtml, navHtml) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${icon} ${title} — Avenor Kits</title>
<style>
  :root{--ink:#1c1e24;--muted:#5c6270;--accent:#4f46e5;--bg:#f6f7fa;--card:#ffffff;--line:#e4e7ee;}
  *{box-sizing:border-box}
  body{margin:0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;background:var(--bg);color:var(--ink);line-height:1.7}
  .topbar{background:#0f1115;color:#fff;padding:14px 24px;display:flex;align-items:center;gap:14px;flex-wrap:wrap}
  .topbar .brand{font-weight:800;letter-spacing:2px;font-size:13px;margin-right:auto}
  .topbar .brand span{opacity:.55;font-weight:500;letter-spacing:0}
  .topbar a{color:#c9cdd8;text-decoration:none;font-size:13px;padding:6px 12px;border-radius:8px}
  .topbar a:hover{background:rgba(255,255,255,.1);color:#fff}
  .topbar a.active{background:#fff;color:#0f1115;font-weight:700}
  main{max-width:840px;margin:0 auto;padding:40px 24px 80px}
  .doc{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:48px;box-shadow:0 10px 40px rgba(20,24,40,.06)}
  h1{font-size:30px;line-height:1.25;margin:0 0 18px}
  h2{font-size:21px;margin:38px 0 12px;padding-top:22px;border-top:1px solid var(--line)}
  h3{font-size:17px;margin:26px 0 8px}
  p{margin:12px 0}
  a{color:var(--accent)}
  ul,ol{padding-left:24px}
  li{margin:6px 0}
  code{background:#eef0f6;border:1px solid var(--line);border-radius:6px;padding:1px 7px;font-size:.9em;font-family:Consolas,Menlo,monospace}
  pre{background:#0f1115;color:#e8eaf2;border-radius:12px;padding:18px 20px;overflow-x:auto;font-size:13.5px;line-height:1.6}
  pre code{background:none;border:none;color:inherit;padding:0}
  table{border-collapse:collapse;width:100%;margin:18px 0;font-size:14.5px}
  th,td{border:1px solid var(--line);padding:10px 14px;text-align:left;vertical-align:top}
  th{background:#f0f2f7}
  tr:nth-child(even) td{background:#fafbfd}
  blockquote{margin:16px 0;padding:14px 20px;background:#f0f2ff;border-left:4px solid var(--accent);border-radius:0 10px 10px 0;color:#333a52}
  blockquote p{margin:6px 0}
  hr{border:none;border-top:1px solid var(--line);margin:32px 0}
  .foot{text-align:center;color:var(--muted);font-size:12.5px;margin-top:28px}
  .copy-btn{margin-left:8px;font-size:11px;padding:3px 10px;border-radius:6px;border:1px solid var(--line);background:#fff;cursor:pointer;color:var(--accent);font-weight:700;vertical-align:middle}
  .copy-btn:hover{background:#eef0ff}
  @media(max-width:640px){.doc{padding:26px 18px}h1{font-size:24px}}
  @media print{.topbar{display:none}.doc{border:none;box-shadow:none}.copy-btn{display:none}}
</style>
</head>
<body>
<nav class="topbar">
  <span class="brand">AVENOR KITS <span>· Guides</span></span>
  ${navHtml}
</nav>
<main>
  <div class="doc">
${bodyHtml}
  </div>
  <p class="foot">Avenor Kits — guides inclus avec votre kit. Une question ? Répondez à votre email de commande.</p>
</main>
<script>
// Bouton "Copier" sur chaque texte à rechercher (1re colonne des tableaux)
document.querySelectorAll('td:first-child > code').forEach(function (c) {
  var b = document.createElement('button');
  b.textContent = 'Copier';
  b.className = 'copy-btn';
  b.addEventListener('click', function () {
    function done() { b.textContent = '✓ Copié'; setTimeout(function () { b.textContent = 'Copier'; }, 1500); }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(c.textContent).then(done, function () { fallback(); });
    } else { fallback(); }
    function fallback() {
      var t = document.createElement('textarea');
      t.value = c.textContent; document.body.appendChild(t); t.select();
      try { document.execCommand('copy'); done(); } catch (e) {}
      document.body.removeChild(t);
    }
  });
  c.after(b);
});
</script>
</body>
</html>`;
}

for (const kit of KITS) {
  const kitDir = path.join(DOCS, kit);
  for (const g of GUIDES) {
    const mdPath = path.join(kitDir, g.md);
    if (!fs.existsSync(mdPath)) { console.log('SKIP', kit, g.md); continue; }
    const raw = fs.readFileSync(mdPath, 'utf8').replace(new RegExp('^\\uFEFF'), '');
    const body = marked(fixRefs(raw));
    // nav : liens relatifs corrects selon que le fichier est dans images/ ou non
    const inImages = g.md.startsWith('images/');
    const nav = GUIDES.map(x => {
      let href = inImages ? (x.md.startsWith('images/') ? path.basename(x.html) : '../' + x.html)
                          : x.html;
      const active = x.md === g.md ? ' class="active"' : '';
      return `<a href="${href}"${active}>${x.icon} ${x.title}</a>`;
    }).join('\n  ');
    fs.writeFileSync(path.join(kitDir, g.html), template(g.title, g.icon, body, nav), 'utf8');
  }
  console.log('OK', kit);
}
console.log('DONE');
