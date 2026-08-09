# Déploiement Hostinger depuis GitHub (sans ZIP)

Repo : `https://github.com/ibrahimkasende-crypto/Platefrome-AFD`  
Domaine : `https://afd-rdc.org`

## Pourquoi

Chaque `git push` sur la branche connectée déclenche automatiquement :

1. pull du code  
2. `npm ci`  
3. `npm run build`  
4. redémarrage Next.js  

Plus besoin d’uploader un ZIP.

## Connexion (une seule fois)

1. hPanel → **Sites web** → `afd-rdc.org`  
2. Menu **⋮** → **Connect to GitHub**  
   (ou : Ajouter un site → **Node.js web app** → **Import Git repository**)  
3. Autoriser l’app **Hostinger** sur le compte `ibrahimkasende-crypto`  
4. Choisir le dépôt **`Platefrome-AFD`**  
5. Paramètres :

| Paramètre | Valeur |
|---|---|
| Framework | Next.js |
| Branch | `main` |
| Node.js | `22` (ou `24`) |
| Root directory | `./` |
| Install command | `npm ci` |
| Build command | `npm run build` |
| Start command | `npm run start` |
| Output directory | `.next` |

6. Vérifier que les **variables d’environnement** sont déjà renseignées (elles persistent)  
7. Cliquer **Deploy**

Doc officielle : https://docs.hostinger.com/node.js/github

## Redéployer ensuite

```bash
git add …
git commit -m "…"
git push origin main
```

Hostinger rebuild automatiquement. Suivre les logs dans **Deployments**.

## Important pour ce monorepo

- `package.json` est à la **racine** du dépôt → Root = `./`  
- Ne pas committer `.env` / `hostinger.env` / ZIP  
- Les grosses images restent sur **Supabase Storage** (`afd-media`), pas dans Git  

## Si le build échoue

1. Ouvrir le log Hostinger (première erreur)  
2. Vérifier Node 22+  
3. Vérifier `/api/health` après succès  
4. **Redeploy** manuel possible depuis le dashboard sans push  

## Basculer depuis le mode ZIP

Si le site a été créé par upload ZIP :

1. Connecter GitHub (étape ci-dessus)  
2. Choisir la même branche `main`  
3. Lancer un Deploy  
4. Ne plus utiliser l’upload ZIP  
