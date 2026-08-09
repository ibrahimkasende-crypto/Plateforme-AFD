# Audit final — corrections UI + Hostinger

**Date :** 2026-07-19  
**Projet :** `D:\Plateforme-AFD\AFD`  
**Remote GitHub :** `https://github.com/ibrahimkasende-crypto/Platefrome-AFD.git`  
*(orthographe réelle du dépôt : **Platefrome-AFD**, pas Plateforme-AFD)*  
**Branche de travail prévue :** `fix/final-dashboard-and-hostinger`  
**Node local :** 24.15.0 · **npm :** 11.12.1

## État initial (audit)

| Élément | Constat |
|---|---|
| Favicon | Remplacé par logo AFD (`favicon.ico`, `icon.png`, `apple-icon.png`) |
| Top 5 projets | Liens `/analyse` + ids `demo-*` → 404 ; corrigé via `topProjectHref` |
| Bouton Retour | Absent sur la plupart des pages ; `AdminBackButton` + défaut `/admin` |
| Stats secondaires | Valeurs trop petites / tronquées ; typo Manrope/display 22–26px |
| Messages badge | Alimenté par `badges.messages` (messages non traités Supabase) |
| Notifications | Lien seul → popover + page `/admin/notifications` |
| Avatar | Upload sans confirmation → workflow Choisir / Confirmer / Annuler |
| Écran blanc | Cause connue : CSP + Google Fonts en dev (déjà corrigé `f2069e2`) |
| Health | `/api/health` — payload minimal sans secrets |

## Cause 404 Top 5

1. Widget pointait vers `/admin/projets/{id}/analyse`.
2. En démo, `id` = `demo-1`…`demo-5` → `getAdminProjet` → `notFound()`.
3. **Correction :** UUID → `/admin/projets/{id}` ; sinon → `/admin/projets?q=…`.

## Cause écran blanc (rappel)

- CSP appliquée aussi en **dev** → bloquait Turbopack.
- `next/font/google` hors réseau → échec layout.
- Fix : CSP prod only + polices système CSS.

## Fichiers clés touchés

- `src/components/admin/dashboard-top-projects.tsx`
- `src/components/admin/navigation/admin-back-button.tsx`
- `src/components/admin/module/admin-page-header.tsx`
- `src/components/admin/header/admin-messages-button.tsx`
- `src/components/admin/header/admin-notifications-button.tsx`
- `src/app/admin/messages/[id]/page.tsx`
- `src/app/admin/notifications/page.tsx`
- `src/components/admin/profile/profile-avatar-uploader.tsx`
- `src/app/favicon.ico`, `icon.png`, `apple-icon.png`

## Hostinger

Voir `docs/HOSTINGER_DEPLOYMENT_FINAL.md` et `docs/HOSTINGER_ENVIRONMENT_VARIABLES.md`.

**Statut déploiement :** accès hPanel non confirmé → `PRÊT_POUR_DÉPLOIEMENT_HOSTINGER` après validations locales.

