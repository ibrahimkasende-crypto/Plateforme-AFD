# Audit — expérience motion premium (site public AFD)

Date : 2026-07-18  
Stack : Next.js 16.2.10 · React 19.2.4 · Motion 12.42.2 · pas de Three.js avant cette phase

## 1. Ancien effet de curseur

| Élément | Détail |
|---|---|
| Composant | `src/components/shared/afd-cursor.tsx` (`AfdCursor`) |
| Intégration | `src/app/(public)/layout.tsx` |
| Comportement | Boule floutée qui suit la souris (lerp 0.16), halo radial bleu / orange / navy |
| CSS | `html.afd-custom-cursor { cursor: none }` dans `globals.css` (classe non toujours appliquée ; curseur système souvent conservé) |
| Listeners | `mousemove`, `mousedown`, `mouseup` + `requestAnimationFrame` permanent |
| Conditions | `(pointer: fine)` + pas de `prefers-reduced-motion` |

Verdict : effet « glow ball » perçu comme traînée / halo bleu — à supprimer entièrement.

## 2. Composants concernés

- Layout public (`AfdCursor`)
- `globals.css` (styles custom cursor + reduced motion)
- Motion existant : `FadeIn` uniquement
- Home : hero (Motion), slideshow, partenaires (CSS track), stats, domaines, zones, impact/news, opportunités, newsletter

## 3. Animations déjà présentes

- `FadeIn` : fade + y:8, once
- Hero / slideshow Motion
- CSS : `afd-hero-glow`, `afd-partners-track`, `afd-donate-float`, heart breathe
- Impact banner : scroll horizontal manuel déjà présent

## 4. Sections trop statiques

- Séparations souvent un simple changement de `bg`
- Peu de variantes d’entrée (quasi tout `FadeIn`)
- Pas de masques / split / stagger structurés

## 5. Séparations trop simples

- Alternance surface / blanc sans forme
- Pas de wave / curve / overlap

## 6. Risques performance

- RAF permanent du curseur même au repos
- Partenaires en animation CSS continue
- Hero glow infini

## 7. Problèmes mobiles

- Grilles multi-colonnes compressées (stats, domaines)
- Scroll horizontal global à éviter
- Impact banner a déjà un rail — modèle à généraliser

## 8. À conserver

- Curseur système natif
- `FadeIn` (base) + Motion
- Hero animations propres
- Reduced motion CSS existant
- Carte RDC verticale (pas de rail)
- Newsletter verticale

## 9. À supprimer

- `AfdCursor` + styles `afd-custom-cursor`
- Listeners / RAF associés

## 10. Stratégie

1. Supprimer curseur glow  
2. Couche effets publics (WebGL liquide + fallback) via dynamic import  
3. Wrappers Motion réutilisables  
4. Séparateurs subtils  
5. Rails mobiles (`HorizontalCardRail`)  
6. Feature flags + tests e2e  

Aucune modification Supabase / contenu métier.
