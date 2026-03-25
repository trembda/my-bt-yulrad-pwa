# PWA — Générateur BT CM & Relâche TOC

## Contenu du package
- `index.html` : ton fichier (inchangé côté logique), avec l'ajout du manifest + registration service worker.
- `manifest.webmanifest` : manifest PWA.
- `sw.js` : service worker (cache offline).
- `icons/` : icônes PNG (dont maskable).

## Installation (GitHub Pages)
1. Crée un repo (ou utilise ton repo existant).
2. Copie **tout** le contenu de ce dossier à la racine du repo.
3. Active GitHub Pages (Settings → Pages → Branch: main / root).
4. Ouvre l'URL du site.
5. Chrome/Edge: menu ⋮ → **Installer l'application**.

## Installation (serveur local)
> Un PWA + service worker ne marche pas via `file://`.
- VS Code: extension **Live Server** → "Go Live", puis ouvre l'URL.
- Ou Node:
  - `npx http-server .` (dans le dossier) puis ouvre l'URL indiquée.

## Mise à jour
- Si tu modifies `index.html`/assets, incrémente `CACHE_NAME` dans `sw.js` (ex: `bt-relache-v2`) pour forcer le refresh.

## Notes
- Les données utilisateur restent dans `localStorage` (autosave). Le service worker ne change rien à ça.
