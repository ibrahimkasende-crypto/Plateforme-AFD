# Typographie, layout, newsletter popup et loader — Plateforme-AFD

**Date :** 17 juillet 2026

## 1. Polices

- **Manrope** → titres (`--font-heading`)
- **Inter** → corps, menus, boutons, formulaires (`--font-body`)
- Chargement via `next/font/google` dans `src/app/layout.tsx`

## 2. Échelle typographique

Classes utilitaires dans `globals.css` :

- `.afd-h1-hero` — clamp ~34–60px, weight 800
- `.afd-h2` — clamp ~24–34px, navy, weight 800
- `.afd-h3` — ~17–20px, weight 700
- `.afd-prose`, `.afd-nav-link`, `.afd-btn-text`, `.afd-label`

## 3. Couleurs

Palette centralisée (`--afd-blue`, `--afd-navy`, `--afd-orange`, etc.) avec alias de compatibilité (`--afd-accent`, …).

## 4. Conteneurs

- Largeur max : `1360px` (`--afd-container`)
- Padding horizontal : 18 → 48px selon breakpoints
- Sections : `py` via `--afd-section-y` (≈56–112px)

## 5. Espacements

- Gap section titre / contenu : `--afd-section-gap`
- Cartes programmes : gap 24–28px
- Nav desktop : gap 28–32px dès `min-width: 1200px`

## 6. Header

- Hauteur 84–88px
- Logo 56–64px
- Breakpoint menu desktop : `1200px`
- CTAs orange / bleu
- Sous-menus aérés

## 7. Hero

- Hauteur ~600–660px
- Badge ONG nationale congolaise
- CTAs : Découvrir nos actions / Devenir partenaire
- Carte institutionnelle 80 % (pas un KPI bénéficiaires)
- Stats en chevauchement

## 8. Sections

- Domaines : grille jusqu’à 6 colonnes
- Programmes : 4 cartes alignées
- Histoire + actualités : composition 5/7 desktop (`impact-and-news.tsx`)
- Newsletter bandeau bleu + CTA orange
- Support actions 4 colonnes

## 9. Popup newsletter

- Composants : `newsletter-popup.tsx`, `newsletter-popup-form.tsx`, `use-newsletter-popup.ts`
- Dialog Radix (`@radix-ui/react-dialog`)
- Délai ~1200 ms après fin du loader
- Exclusions admin / login / confidentialité / paiements

## 10. Cookies / session

- `afd_newsletter_subscribed`
- `afd_newsletter_dismissed_at` (7 jours)
- `afd_newsletter_seen_session`
- `afd_loader_seen` (sessionStorage)

## 11. Utilisateurs authentifiés

`getNewsletterPopupEligibilityAction` : lit `auth.getUser()`, vérifie l’email côté serveur via `isEmailSubscribed` — aucune liste d’abonnés exposée au client.

## 12. Table Supabase

Migration : `supabase/migrations/20260717_004_abonnes_newsletter.sql`  
Table : `abonnes_newsletter` (email unique, consentement, centres d’intérêt, source).  
À déployer sur le projet Supabase.

## 13. Loader

- `afd-heart-loader.tsx` + `app-entry-loader.tsx`
- Durée ~1200 ms (400 ms si reduced-motion)
- Une fois par session

## 14. Reduced motion

Animations CSS/Motion ralenties ou désactivées ; loader raccourci.

## 15. Images manquantes

- `/images/home/hero-afd.webp`
- `/images/programmes/*.webp`
- `/images/impact/histoire-principale.webp`
- `/images/actualites/*.webp`  
Fallback actuel : `/images/adf1.jpg`, `/images/adf2.png`

## 16. Tests responsive

Structure adaptée 320 → 1600px (nav, hero, stats 2/3/6, programmes 1/2/4, popup 1→2 colonnes). Contrôle visuel recommandé sur `http://localhost:3000`.

## 17–19. Validation

- typecheck : OK
- lint : OK (1 warning RHF `watch` / React Compiler — non bloquant)
- build : OK
- push GitHub : non exécuté

## 20. À valider par le directeur

- Photos terrain définitives
- Déploiement migration newsletter
- Fréquence popup (7 jours)
- Contenu exact des centres d’intérêt
