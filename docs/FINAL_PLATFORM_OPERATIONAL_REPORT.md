# Rapport final — Plateforme AFD administrable depuis le dashboard

Date : 2026-08-04  
Périmètre : `D:\Plateforme-AFD\AFD`

## Objectif

Rendre la plateforme **entièrement administrable** depuis le dashboard : le code ne doit plus servir qu’aux bugs, nouvelles fonctionnalités et mises à jour de dépendances.

## Synthèse

La plateforme dispose déjà d’un **large CMS / CRUD admin** (programmes, projets, partenaires, bibliothèque, histoires, témoignages, appels d’offres, pages CMS, RH, utilisateurs, messagerie phase 1, etc.).

Cette itération a **branché les paramètres institutionnels sur le site public**, **connecté les chiffres d’impact et histoires à Supabase**, et **étendu la revalidation cache** pour que les mutations dashboard se reflètent sans redéploiement.

**Ce n’est pas encore 100 %** : certains textes d’accueil, menus et pages institutionnelles conservent un fallback `src/config/*` tant qu’aucune donnée CMS n’est publiée. Voir section « Restant ».

---

## Fonctionnalités opérationnelles

| Domaine | Statut |
|---------|--------|
| Auth Supabase + rôles | ✓ |
| Profil + photo (Storage) | ✓ |
| Changement MDP / reset | ✓ |
| Admins Direction / IT | ✓ |
| Messagerie pro phase 1 (webmail) | ✓ |
| Paramètres site → public | ✓ (cette itération) |
| Partenaires / projets / programmes | ✓ (DB + revalidate public) |
| Chiffres d’impact | ✓ (DB prioritaire + fallback) |
| Histoires d’impact featured | ✓ (DB si publié) |
| Bibliothèque / médias Storage | ✓ |
| Notifications / messages contact | ✓ |
| OCR / payroll / RH | ✓ (modules présents) |

---

## Modules & pages admin (aperçu)

- Tableau de bord, programmes, projets, activités, stocks, logistique  
- Bénéficiaires, indicateurs, enquêtes, histoires, témoignages  
- Actualités / publications / pages CMS / archives / bibliothèque / médiathèque  
- Newsletter, messages contact, adhésions, partenariats, dons, opportunités  
- RH / paie, utilisateurs, administrateurs principaux, messagerie, sécurité  
- Paramètres, journal, sessions, sauvegardes, système  

---

## CRUD

La plupart des modules métier exposent créer / lire / modifier / archiver (ou soft-delete) / publier.  
Fonctions avancées (dupliquer, restaurer, import/export, historique détaillé) sont **partiellement** présentes selon le module — à homogénéiser progressivement.

---

## Synchronisation & cache

- Helper central : `src/lib/cache/revalidate-public.ts`  
- Branché sur : paramètres, programmes, projets, chiffres d’impact, histoires  
- Footer / contact / mission-vision lisent `parametres_site` via `getResolvedPublicSiteSettings()`  
- ISR / `revalidatePath` / `revalidateTag(..., "max")` utilisés  

Créer un projet / partenaire / chiffre validé → revalidation des routes publiques concernées **sans rebuild**.

---

## Sécurité

- RLS Supabase, gardes `requireAdmin` / permissions  
- Service role serveur uniquement  
- Pas de secrets CyberPanel / mail en `NEXT_PUBLIC_*`  
- Journal d’activité sur actions sensibles  
- Photos profil Storage privé / signed URLs  

---

## Utilisateurs & photos

- Avatar upload sur Mon profil  
- Initiales si pas de photo  
- Header / sidebar / viewer mis à jour via session  
- Photo équipe publique : encore souvent URL manuelle (amélioration restante)  

---

## Paramètres

`/admin/parametres` — onglets élargis : général, identité, **marque** (logo/favicon/hero), coordonnées, réseaux (WhatsApp/TikTok), newsletter, notifications, documents, paiements, etc.

Les valeurs sauvent dans `parametres_site` et revalident le site public.

---

## Bibliothèque

Module admin dédié + Storage `afd-media` (361 images banque uploadées).  
Métadonnées (titre, tags, province, etc.) selon schémas existants.

---

## Dashboard

Widgets avec compteurs / navigation vers listes.  
Temps réel poussé (WebSocket) : **non** — rafraîchissement par navigation / revalidation / polling raisonnable notifications.

---

## API / Supabase / Storage / Auth

- Supabase Auth + Postgres + Storage  
- API REST Next pour modules métier + stubs `/api/mail/*` (phase 2)  
- Domaine prod : afd-rdc.org  

---

## Tests

- `tests/e2e/platform-operational-cms.spec.ts` (paramètres, contact, accueil, profil)  
- Suites e2e existantes modules / admin / messagerie  
- Unit : sanitisation mail  

Exécuter : `npm run typecheck`, `npm run test:unit`, `npm run test:e2e` (avec credentials).

---

## Build

À valider après merge : `npm run build`.  
Typecheck ciblé recommandé après cette livraison.

---

## Éléments restant éventuellement à développer

1. **Navigation publique** encore `public-navigation.ts` (pas d’éditeur de menus).  
2. **CRUD admin domaines d’intervention** (table lue en public, peu d’UI admin).  
3. **Formulaire actualités** : stubs « nouvelle / modifier » à finaliser + `revalidateNewsCache`.  
4. **Upload photo membres équipe** publique (pas seulement URL).  
5. **Homogénéiser** dupliquer / importer / historique sur tous les modules.  
6. **Realtime** stats/widgets (Supabase Realtime) si exigé.  
7. **Messagerie IMAP intégrée** (phase 2) après validation SMTP/IMAP.  
8. Remplacer progressivement les fallbacks `institutional-content` / `migrated-*` dès que le CMS est peuplé.

---

## Critère « 100 % »

**Pas atteint à 100 %** tant que des fallbacks `src/config/*` restent nécessaires pour le hero, la nav et certaines pages institutionnelles.

**Atteint pour le cœur opérationnel** : identité / contact / réseaux / chiffres / projets / programmes / partenaires / histoires / bibliothèque / utilisateurs / paramètres — administrables et synchronisés avec le public via DB + revalidation.

Prochaine priorité : éditeur de menus publics, CRUD domaines, finaliser le formulaire actualités, peupler `parametres_site` + pages CMS pour retirer les derniers fallbacks.
