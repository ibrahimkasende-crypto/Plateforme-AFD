# Déploiement Hostinger — Plateforme AFD

## Configuration Node.js Web App

| Paramètre | Valeur |
|---|---|
| Type | Node.js Web App |
| GitHub | `ibrahimkasende-crypto` |
| Dépôt | `Platefrome-AFD` *(orthographe réelle du remote)* |
| Branche | `main` |
| Installation | `npm ci` |
| Build | `npm run build` |
| Démarrage | `npm run start` |
| Domaine | `afd-rdc.org` |
| Node | **24** (voir `.nvmrc` et `package.json` engines `>=20 <=24`) |

## Important

- **Ne pas** utiliser `output: "export"` : l’app dépend de SSR, Auth Supabase, Server Actions et routes API.
- Après déploiement, tester `https://afd-rdc.org/api/health`.
- Configurer les variables documentées dans `HOSTINGER_ENVIRONMENT_VARIABLES.md`.
- Configurer Supabase Auth (URLs) via `SUPABASE_PRODUCTION_AUTH_CONFIGURATION.md`.

## Checklist hPanel

1. Sites web → Ajouter un site → Node.js Web App  
2. Continuer avec GitHub → autoriser `ibrahimkasende-crypto`  
3. Sélectionner `Platefrome-AFD` → branche `main`  
4. Domaine `afd-rdc.org`  
5. Ajouter les variables d’environnement  
6. Lancer le déploiement et lire les logs  
7. Vérifier HTTPS + `/api/health` + `/connexion` + `/admin`

## Statut

Sans accès authentifié hPanel : **PRÊT_POUR_DÉPLOIEMENT_HOSTINGER**  
Ne pas annoncer un succès uniquement parce que le push GitHub a réussi.
