# Audit final pré-déploiement — Plateforme-AFD

Date : 2026-08-04  
Projet : `D:\Plateforme-AFD\AFD`

Légende : **OK** | **corrigé** | **incomplet** | **bloquant** | **N/A**

## 1. Structure projet

| Point | Statut | Note |
|-------|--------|------|
| package.json / lock | OK | Next 16.2, React 19 |
| next.config.ts | corrigé | Redirects alias FR + /admin/journaux |
| middleware Auth | OK | Session + pathname |
| src/app public + admin | OK | Routes réelles + aliases |
| supabase/migrations | OK | Incl. mailboxes, admins, bibliothèque |
| scripts deploy zip | OK | `npm run deploy:zip` |

## 2. Routes publiques

| Route demandée | Cible réelle | Statut |
|----------------|--------------|--------|
| `/` | `/` | OK |
| `/a-propos` | → `/qui-sommes-nous` | corrigé (redirect) |
| `/domaines-intervention` | → `/actions/domaines-intervention` | corrigé |
| `/programmes` | → `/actions/programmes` | corrigé |
| `/projets` | → `/actions/projets` | corrigé |
| `/actualites` | `/actualites` | OK |
| `/bibliotheque` (+ sous-routes) | OK | photothèque, vidéothèque, docs, archives |
| `/opportunites` | → `/ressources/opportunites` | corrigé |
| `/nous-soutenir` | → `/soutenir` | corrigé |
| `/contact` | OK | paramètres site branchés |
| `/connexion` | OK | |
| `/mot-de-passe-oublie` | OK | |
| `/auth/reset-password` | OK | |

## 3. Routes admin

| Route | Statut |
|-------|--------|
| `/admin` | OK |
| `/admin/administrateurs-principaux` | OK |
| `/admin/administrateur-principal` | OK (legacy) |
| `/admin/utilisateurs` | OK |
| `/admin/employes` | OK (alias RH) |
| `/admin/programmes` `/projets` `/activites` | OK |
| `/admin/bibliotheque/*` | OK |
| `/admin/messagerie` + `/comptes` | OK |
| `/admin/mon-profil` + `/securite` | OK |
| `/admin/securite/changer-mot-de-passe` | OK |
| `/admin/parametres` | OK |
| `/admin/journaux` | corrigé → `/admin/journal-activite` |

## 4. Supabase / env

| Variable | Utilisée | Statut |
|----------|----------|--------|
| NEXT_PUBLIC_SUPABASE_URL | Oui | OK |
| NEXT_PUBLIC_SUPABASE_ANON_KEY / PUBLISHABLE_KEY | Oui (l’une des deux) | OK |
| SUPABASE_SERVICE_ROLE_KEY | Oui serveur | OK |
| SUPABASE_SECRET_KEY | Alias | OK |
| DATABASE_URL | Scripts only | OK (doc) |
| DIRECT_URL / POSTGRES_URL / SUPABASE_DB_URL | Non runtime | N/A |
| MAIL_* / CYBERPANEL_* | Phase 1 | OK |
| Secrets dans Git | Aucun réel trouvé | OK |

## 5. Messagerie Phase 1

| Point | Statut |
|-------|--------|
| Webmail nouvel onglet | OK |
| Pas d’iframe CyberPanel | OK |
| `/comptes` IT + super_admin | OK |
| API `/api/mail/*` 501 si intégré off | OK |
| MAIL_INTEGRATED_ENABLED=false | OK |

## 6. Administrateurs

| Point | Statut |
|-------|--------|
| Rôles direction / IT | OK (migration 070) |
| Christian / Esther créés Auth | OK (rapport dédié, sans MDP) |
| Pas super_admin pour eux | OK |
| must_change_password | OK (flux) |

## 7. Photos / profils

| Point | Statut |
|-------|--------|
| Upload Mon profil | OK |
| Initiales | OK |
| Header / sidebar | OK |
| Photo équipe publique upload | incomplet | URL manuelle souvent |

## 8. Sync dashboard → public

| Point | Statut |
|-------|--------|
| parametres_site → footer/contact/hero | corrigé |
| chiffres_impact | corrigé |
| programmes/projets revalidate | corrigé |
| Actualités formulaire | incomplet | stubs possibles |
| Menus publics CMS | incomplet |

## 9. Sécurité

Voir `docs/FINAL_SECURITY_CHECK.md`.

## 10. Restant non bloquant

- Éditeur menus publics  
- CRUD domaines admin  
- Formulaire actualités complet  
- IMAP Phase 2  
- Homogénéisation dupliquer/import  

**Verdict audit :** prêt pour ZIP / Hostinger sous réserve de variables Hostinger correctes et peuplement CMS.
