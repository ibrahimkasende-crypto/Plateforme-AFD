# Organisation des assets médias — Plateforme-AFD

**Date :** 17 juillet 2026

## Emplacement

`public/assets/` (servi sous `/assets/...`)

## Classification effectuée

| Ancien chemin | Nouveau chemin |
|---------------|----------------|
| `public/brand/logo-afd.jpg` | `public/assets/brand/logo-afd.jpg` |
| `public/images/adf1.jpg` | `public/assets/home/hero-afd.jpg` |
| `public/images/adf2.png` | `public/assets/home/presentation-afd.png` |

Doublons historiques de logos supprimés (un seul logo officiel conservé).

## Dossiers préparés (à venir)

- `programmes/`
- `projets/`
- `impact/`
- `actualites/`
- `partenaires/`
- `mediatheque/`
- `newsletter/`
- `equipe/`
- `zones/`
- `placeholders/`
- `og/`

## Code

- Config : `src/config/assets.ts`
- Utilisé par : `site.ts`, `home-content.ts`
- Redirections permanentes des anciens chemins dans `next.config.ts`
