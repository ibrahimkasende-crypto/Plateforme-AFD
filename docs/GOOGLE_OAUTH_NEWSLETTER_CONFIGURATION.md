# Configuration Google OAuth — Newsletter AFD

Site : https://afd-rdc.org  
Projet Supabase : `mxxuxnoqnwjygawvvhcb`

## Principe

Le **Client Secret Google** est configuré **uniquement dans Supabase**, jamais dans Next.js / Hostinger.

Le navigateur utilise seulement :

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (ou `ANON_KEY`)

Ne jamais créer `NEXT_PUBLIC_GOOGLE_CLIENT_SECRET`.

## 1. Google Cloud Console / Google Auth Platform

Créer (ou réutiliser) un client OAuth de type **Web application**.

### Authorized JavaScript origins

```
https://afd-rdc.org
https://www.afd-rdc.org
http://localhost:3000
```

### Authorized redirect URI

Utiliser **exactement** l’URL callback affichée dans :

Supabase Dashboard → Authentication → Providers → Google

Elle ressemble à :

```
https://mxxuxnoqnwjygawvvhcb.supabase.co/auth/v1/callback
```

**Ne pas** mettre `https://afd-rdc.org/auth/callback` comme redirect URI Google.  
Google redirige vers Supabase ; Supabase redirige ensuite vers `/auth/callback` du site.

### Autres réglages Google

- Branding (nom d’appli, logo)
- Audience (externe / test users en mode Testing)
- Data Access : scopes `openid`, `email`, `profile` uniquement
- Créer le Client ID + Client Secret
- Ne jamais exposer le Client Secret côté front

## 2. Supabase — Provider Google

Supabase Dashboard → Authentication → Providers → Google

1. Activer Google
2. Coller le Google Client ID
3. Coller le Google Client Secret
4. Enregistrer

## 3. Supabase — URL Configuration

Authentication → URL Configuration

**Site URL**

```
https://afd-rdc.org
```

**Redirect URLs**

```
https://afd-rdc.org/auth/callback
https://afd-rdc.org/**
https://www.afd-rdc.org/auth/callback
https://www.afd-rdc.org/**
http://localhost:3000/auth/callback
http://localhost:3000/**
```

En production, préférer des URL précises lorsque possible.

## 4. Variables d’environnement (Hostinger / local)

Requis :

```
NEXT_PUBLIC_SUPABASE_URL=https://mxxuxnoqnwjygawvvhcb.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
```

Optionnel :

```
NEXT_PUBLIC_NEWSLETTER_GOOGLE_OAUTH_ENABLED=true
```

(`false` masque le bouton « Continuer avec Google ».)

Non requis pour Google via Supabase :

- Google Client Secret
- `NEXT_PUBLIC_GOOGLE_*`

## 5. Flux applicatif

1. Bouton → `signInWithOAuth({ provider: 'google', redirectTo: …/auth/callback?next=/?newsletter=google-success&newsletter=1 })`
2. Callback Next.js échange le `code`
3. Retour `/?newsletter=google-success`
4. Fenêtre Newsletter : consentement + `POST /api/newsletter/google-subscribe`
5. Aucun rôle admin créé
