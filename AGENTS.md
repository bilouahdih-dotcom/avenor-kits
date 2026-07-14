# AGENTS.md — Avenor Kits (drop digital)

> Cerveau partagé entre agents (Claude Code, Codex) et l'humain. Lis-le avant de
> coder. Mets-le à jour uniquement sur un changement structurant.

## Produit

Vente de produits numériques : 5 kits de sites vitrines (templates HTML autonomes
+ guides) pour freelances et commerçants. Vendus sur Lemon Squeezy : 1 kit au
choix **29,99 €** (produit à 5 variantes) et bundle 5 kits **79 €**. Ce repo est
la **landing de vente + les démos publiques** (GitHub Pages). L'utilisateur
(Bilel) est débutant, parle français : expliquer clairement, livrer complet.

## Stack & topologie

- **Ce repo** : HTML/CSS/JS statique, zéro framework, zéro build pour le site.
  - `index.html` = landing (branding argent/noir Avenor).
  - `demo-*/` = démos publiques des 5 kits (copies des sources avec photos).
  - `tools/` = scripts Node de build des kits (voir plus bas).
- **Live** : https://bilouahdih-dotcom.github.io/avenor-kits/ (GitHub Pages,
  branche `main`, racine). Un push sur `main` = déploiement (~1 min).
- **Sources des kits** (hors repo, sur la machine de Bilel) :
  `C:\Users\bilel\Documents\kit-site-{restaurant,fastfood,coiffeur,artisan,boulangerie}\`
  → zippées en `C:\Users\bilel\Documents\kit-site-*-v1.zip` + `bundle-5-kits-v1.zip`,
  uploadées manuellement sur Lemon Squeezy.
- **Vidéos TikTok** : `C:\Users\bilel\Documents\tiktok-renovation\` (Remotion +
  Playwright, compositions `Reel` et `StoryReel`).
- **Boutique** : Lemon Squeezy `avenorkits.lemonsqueezy.com` (en review, test
  mode). Aucun secret dans ce repo ; identifiants boutique gérés par Bilel.

## ⚠️ Invariants — NE PAS CASSER

1. **Liens checkout Lemon Squeezy** dans `index.html` (2 boutons pricing) :
   `/checkout/buy/277823b0-...` (kit) et `/checkout/buy/eded333d-...` (bundle).
   Ne pas les modifier sans nouveau lien fourni par Bilel.
2. **Bloc `<!-- AVENOR-EDITOR --> ... <!-- /AVENOR-EDITOR -->`** dans chaque
   `index.html` de kit et de démo = éditeur visuel intégré (activé par
   `#edition` via `MODIFIER-MON-SITE.html`). Ne jamais l'éditer à la main :
   modifier `tools/editor-template.html` puis relancer `node tools/inject-editor.js`.
3. **Guides des kits** : la source est le `.md` dans chaque dossier kit ; les
   `.html` sont générés par `tools/build-guides.js`. Éditer le `.md`, jamais le
   `.html` directement, puis re-générer et re-zipper.
4. **Les zips vendus ne contiennent JAMAIS les photos .jpg** (licence Pexels :
   pas de redistribution comme asset). Contenu d'un zip : `index.html`,
   `MODIFIER-MON-SITE.html`, 4 guides `.html`, `images/AJOUTER-VOS-PHOTOS.html`.
5. **Prix affichés** : 29,99 € le kit, 79 € le bundle (« au lieu de 150 € »).
   Cohérence landing ↔ Lemon Squeezy obligatoire.
6. **Serveurs locaux : jamais les ports 5060/5061** (bloqués par Chrome/Edge,
   ERR_UNSAFE_PORT). La landing se sert sur 5062, kit-restaurant sur 5059.
7. Rendus Remotion : passer `--browser-executable="C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"`
   (le headless shell Remotion est cassé sur cette machine). Playwright :
   toujours `channel: "msedge"` (le Chromium bundlé n'est pas installé).

## Workflows courants

- **Modifier un guide** : éditer le `.md` du kit → `cd tools && node build-guides.js`
  → re-zipper (PowerShell `Compress-Archive`, structure : dossier kit avec
  fichiers listés à l'invariant 4) → Bilel re-uploade sur Lemon Squeezy.
- **Modifier l'éditeur visuel** : `tools/editor-template.html` →
  `node tools/inject-editor.js` → recopier les `index.html` des kits vers les
  `demo-*/` du repo → commit + push.
- **Nouvelle vidéo TikTok** : dans `tiktok-renovation/` — capture frames :
  `SITE_URL=<url démo> node capture/record-kit.mjs` ; voix off :
  `node capture/make-voix.mjs` (msedge-tts, voix fr-FR-RemyMultilingualNeural) ;
  rendu : `npx remotion render StoryReel out/<nom>.mp4 --codec=h264 --browser-executable="..."`.

## Vérifs

- Landing locale : `npx -y serve . -l 5062` puis http://localhost:5062
- Démos : chaque `demo-*/` doit répondre et l'éditeur s'ouvrir via `#edition`.
- Après push : vérifier `https://bilouahdih-dotcom.github.io/avenor-kits/` (200)
  et que les 2 liens checkout sont présents dans le HTML servi.

## Reste à faire

- Approbation Lemon Squeezy (en review) ; à l'approbation, vérifier un achat réel.
- Vérifier côté LS que les 6 zips uploadés = dernière version (celle avec
  éditeur visuel + guide prospection).
- Vidéos TikTok : 1/jour ; prochaine = clips IA (Kling) fournis par Bilel à
  monter dans `StoryReel`, puis déclinaisons coiffeur/fastfood/boulangerie/artisan.
- Plus tard : TVA « prices include tax » à vérifier dans LS, lead magnet +
  capture email n8n, version EN.

## Coordination multi-agents

- `git pull --rebase` avant de bosser, push souvent, 1 branche/agent si travail parallèle.
- Jamais 2 agents sur le même fichier. Un seul serveur dev par port.
- Les sources des kits sont HORS repo : si tu modifies un kit, dis-le
  explicitement à l'humain (les zips Lemon Squeezy ne se mettent pas à jour
  tout seuls) et recopie l'`index.html` vers la démo correspondante du repo.
- Gros changement → mettre à jour ce fichier.
