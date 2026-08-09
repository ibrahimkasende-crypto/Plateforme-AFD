# Audit — Continuer avec Google (Newsletter)

Date : 2026-08-06  
Projet : `D:\Plateforme-AFD\AFD`  
Site : https://afd-rdc.org

## Composants concernés

| Élément | Fichier |
|---|---|
| Fenêtre Newsletter | `src/components/newsletter/newsletter-popup.tsx` |
| Formulaire + Google | `src/components/newsletter/newsletter-popup-form.tsx` |
| Bouton Google | `src/components/newsletter/newsletter-google-button.tsx` |
| Logique OAuth client | `src/lib/newsletter/google-oauth.ts` |
| Retour URL | `src/components/newsletter/newsletter-google-return.tsx` |
| Ouverture popup | `src/hooks/use-newsletter-popup.ts` + `app-entry-experience.tsx` |
| Callback OAuth | `src/app/auth/callback/route.ts` |
| Inscription | `src/features/newsletter/services/newsletter.service.ts` |
| Table | `public.abonnes_newsletter` (`supabase/migrations/20260717_004_abonnes_newsletter.sql`) |

## Cause initiale du bouton « non fonctionnel »

1. **Consentement obligatoire avant Google** — le bouton refusait de démarrer OAuth tant que la case n’était pas cochée (`toast.error`). L’utilisateur pouvait cliquer sans effet visible clair si le toast était manqué.
2. **Flux incorrect** — le callback inscrivait immédiatement puis faisait `signOut`, sans étape « adresse détectée + confirmer ».
3. **Redirection** — retour via `/?newsletter=subscribed|already|…` au lieu de `/?newsletter=google-success` avec réouverture de la fenêtre.
4. **Flag env** — `NEXT_PUBLIC_NEWSLETTER_GOOGLE_OAUTH_ENABLED=false` masque le bouton.
5. **Provider Google** — si non activé dans Supabase, l’erreur pouvait rester peu lisible après le probe `fetch`.

## Flux historique (à remplacer)

Visiteur → coche consentement → Google → `/auth/callback?newsletter=1` → insert immédiat → `signOut` → toast page d’accueil.

## Flux cible

Visiteur → Google → callback (session) → `/?newsletter=google-success` → fenêtre rouverte → e-mail prérempli → consentement → `POST /api/newsletter/google-subscribe` → succès.  
Aucun rôle admin, aucun accès dashboard.
