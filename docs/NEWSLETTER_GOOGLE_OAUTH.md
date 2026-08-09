# Newsletter — Google OAuth

## Erreur fréquente

```json
{"code":400,"error_code":"validation_failed","msg":"Unsupported provider: provider is not enabled"}
```

**Cause :** le provider **Google** n’est pas activé dans Supabase Auth.  
Le navigateur affichait alors la réponse JSON brute de `/auth/v1/authorize`.

## Comportement actuel de l’app

- Bouton « Continuer avec Google » **visible par défaut**
- Pour le masquer : `NEXT_PUBLIC_NEWSLETTER_GOOGLE_OAUTH_ENABLED=false`
- L’inscription **par e-mail** reste toujours disponible
- Si Google n’est pas activé dans Supabase, un toast FR remplace le JSON brut

## Activer Google (dev + production)

Projet actuel : `https://ancien-projet-supabase.supabase.co`

1. **Google Cloud Console** → [APIs & Services → Credentials](https://console.cloud.google.com/apis/credentials)
   - Créer un client OAuth **Application Web**
   - URI de redirection autorisée (obligatoire) :  
     `https://ancien-projet-supabase.supabase.co/auth/v1/callback`
   - Copier **Client ID** et **Client Secret**

2. **Supabase Dashboard** → projet AFD → **Authentication** → **Providers** → **Google**
   - Activer (**Enable**)
   - Coller Client ID + Client Secret
   - Enregistrer

3. **Supabase** → **Authentication** → **URL Configuration**
   - Site URL (dev) : `http://localhost:3000`
   - Redirect URLs (ajouter les deux) :
     - `http://localhost:3000/auth/callback`
     - `https://afd-rdc.org/auth/callback`

4. Redémarrer `next dev` si besoin, puis tester sur la newsletter

## Test

1. Cocher le consentement newsletter  
2. Cliquer « Continuer avec Google »  
3. Choisir le compte Gmail  
4. Retour sur le site avec toast de succès  
5. Vérifier l’abonné dans `/admin/newsletter/abonnes`

