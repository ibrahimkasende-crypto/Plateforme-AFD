# Rapport final — Continuer avec Google (Newsletter)

Date : 2026-08-06  
Projet : `D:\Plateforme-AFD\AFD`

## 1. Cause initiale du bouton non fonctionnel

1. Consentement exigé **avant** Google (clic sans case = toast / effet perçu comme « ne marche pas »).
2. Callback qui **inscrivait silencieusement** puis `signOut`, sans étape de confirmation.
3. Retour URL legacy (`subscribed` / `already`) au lieu de `/?newsletter=google-success` + réouverture de la fenêtre.

## 2. Composant corrigé

- `src/components/newsletter/newsletter-google-button.tsx`
- `src/components/newsletter/newsletter-popup-form.tsx` (étapes initial / googleConfirm / success)
- `src/components/newsletter/newsletter-google-block.tsx`
- `src/hooks/use-newsletter-popup.ts`
- `src/components/newsletter/newsletter-google-return.tsx`

## 3. OAuth Google activé dans le code

`src/lib/newsletter/google-oauth.ts` appelle :

```ts
supabase.auth.signInWithOAuth({
  provider: "google",
  options: {
    redirectTo: `${origin}/auth/callback?next=…&newsletter=1`,
    scopes: "openid email profile",
    skipBrowserRedirect: true,
    queryParams: { prompt: "select_account" },
  },
});
```

Cookie court `newsletter_oauth_intent` (SameSite=Lax).

## 4. Callback corrigé

`src/app/auth/callback/route.ts` :

- échange le `code` ;
- pour `newsletter=1` : **ne s’inscrit pas**, conserve la session, redirige vers `/?newsletter=google-success` ;
- `safeAuthNext` refuse les URL externes ;
- les flux admin non-newsletter restent inchangés (`next` → `/admin` par défaut).

## 5. Récupération e-mail

Après retour : `getUser()` → `user.email` (secours `user_metadata.email`).  
Confirmation via `POST /api/newsletter/google-subscribe` qui relit l’e-mail **serveur** uniquement.

## 6. Consentement ajouté

Étape post-Google : case obligatoire + « Confirmer mon inscription » + lien politique de confidentialité.  
Pas d’inscription silencieuse après choix du compte Google.

## 7. Abonnement créé

Table réutilisée : `public.abonnes_newsletter`  
Source : `public_newsletter_modal`  
API : `/api/newsletter/google-subscribe`

## 8. Doublons gérés

Upsert logique dans `newsletter.service.ts` : unique email, message « déjà inscrite », réactivation si `desinscrit` (via service role si disponible).

## 9. Accès admin protégé

- Aucun rôle / `profils_administrateurs` / employé créé.
- Middleware + `requireAdmin` inchangés.
- Après inscription Google, `signOut` sauf si profil admin interne actif déjà présent.
- Tests : `/admin` → `/connexion` pour visiteur.

## 10. Configuration Google requise

Voir `docs/GOOGLE_OAUTH_NEWSLETTER_CONFIGURATION.md`  
Redirect URI Google = callback **Supabase** (`…supabase.co/auth/v1/callback`), pas `/auth/callback` du site.

## 11. Configuration Supabase requise

Provider Google activé + Site URL / Redirect URLs documentés dans le même fichier.

## 12. Tests

| Suite | Résultat |
|---|---|
| `npm run test` (vitest) | 62 passed |
| E2E newsletter Google (desktop-1440 + mobile-375) | 25 passed, 1 skipped |

Fichiers :

- `tests/e2e/newsletter-google-oauth-button.spec.ts`
- `tests/e2e/newsletter-google-callback.spec.ts`
- `tests/e2e/newsletter-google-subscribe.spec.ts`
- `tests/e2e/newsletter-google-duplicate.spec.ts`
- `tests/e2e/newsletter-google-no-admin-access.spec.ts`
- `tests/e2e/newsletter-google-mobile.spec.ts`
- `tests/unit/safe-auth-next.test.ts`

## 13. Typecheck

`npm run typecheck` → **OK**

## 14. Lint

Erreurs `react/no-unescaped-entities` corrigées dans `home-hero.tsx`.  
Warnings préexistants hors périmètre (mail stubs, RHF watch).

## 15. Build

`npm run build` → **OK** (routes `/auth/callback` et `/api/newsletter/google-subscribe` présentes)

## 16. Problèmes restants / actions manuelles

1. **Activer Google** dans Supabase Dashboard + coller Client ID/Secret Google (si pas déjà fait).
2. Vérifier Redirect URLs Supabase pour `https://afd-rdc.org/auth/callback`.
3. Test manuel local : ouvrir la fenêtre Newsletter → Continuer avec Google → consentir → confirmer.
4. Après déploiement Hostinger : même parcours sur https://afd-rdc.org.
5. Ne pas exposer le Google Client Secret dans Next.js / Hostinger.

## Docs associées

- `docs/NEWSLETTER_GOOGLE_OAUTH_AUDIT.md`
- `docs/GOOGLE_OAUTH_NEWSLETTER_CONFIGURATION.md`
