# Matrice de preuve des modules — Plateforme-AFD

**Date d’audit :** 2026-07-19  
**Vague :** 0 — Audit forensique  
**Chemin :** `D:\Plateforme-AFD\AFD`  
**Branche :** `reconstruction-nextjs`  
**Commit de référence avant vague 0 :** `ece58be` (IAM/RH/paie)

## Méthode

Un module n’est marqué `operationnel` que s’il dispose de preuves pour : routes, navigation, tables, RLS, permissions, services, types, Zod, liste/recherche/filtres/pagination, CRUD, workflow, journal, tests, docs.

**Résultat global :** **0 module `operationnel`** selon ce standard strict. Plusieurs modules sont `fonctionnel_non_teste` ou `partiel`.

Sources :

- `src/config/admin-navigation.ts` (53 entrées sidebar)
- 174 fichiers `src/app/admin/**/page.tsx`
- 24 migrations `supabase/migrations/`
- `src/features/*` (44 dossiers)
- `src/lib/queries/admin/*` (30 fichiers)
- `npm run typecheck` OK ; `npm run test` 26/26 OK
- Politiques permissives : `20260719_030_admin_missing_modules.sql` (`USING (true)` pour tables admin manquantes)

## Synthèse par statut

| Statut | Nombre |
|--------|--------|
| absent | 4 |
| maquette_seulement | 5 |
| partiel | 21 |
| fonctionnel_non_securise | 4 |
| fonctionnel_non_teste | 11 |
| operationnel | 0 |
| bloque_integration_externe | 2 |
| **Total entrées matrice** | **47** |

> Le cahier des charges parle d’environ 42 points d’entrée. La matrice en compte **47** en incluant les modules transversaux (notifications, recherche, jobs) et le découpage finances / stocks.

---

## Domaine 1 — Tableau de bord

| Champ | Valeur |
|-------|--------|
| nom | Tableau de bord |
| route | `/admin` |
| statut | fonctionnel_non_teste |
| navigation | oui |
| page | `src/app/admin/page.tsx` |
| service | `src/services/dashboard.service.ts` + RPC `20260718_020_admin_dashboard_rpc.sql` |
| preuves | Bundle RPC ; filtres ; widgets |
| restant | Tests E2E dashboard ; cohérence totale avec tous modules ; exports |

---

## Domaine 2 — Opérations

### 2.1 Programmes — `fonctionnel_non_teste`
- Routes : `/admin/programmes`, `/nouvelle`, `/[id]/modifier`, `/[id]/analyse`
- Tables : `programmes` (+ migrations fondations)
- Service/actions : `src/features/programmes/`, `src/lib/queries/admin/programmes.ts`
- Preuves : liste + CRUD + requirePermission
- Restant : workflow complet, pagination serveur systématique, tests module, RLS granulaire

### 2.2 Projets — `fonctionnel_non_teste`
- Routes : liste, nouveau/nouvelle, détail, modifier, analyse
- Tables : `projets`
- Preuves : `src/app/admin/projets/page.tsx` (query+action)
- Restant : onglets complets (stocks, risques, jalons), tests

### 2.3 Activités — `fonctionnel_non_teste`
- Routes : `/admin/activites`, `/nouvelle`
- Tables : `activites` (`20260719_030`)
- Preuves : query+action ; RLS 030 trop permissive (`USING true`) → aussi `fonctionnel_non_securise` partiel
- Restant : détail `[id]`, preuves terrain, RLS stricte

### 2.4 Zones d’intervention — `fonctionnel_non_teste`
- Routes : liste, nouvelle, modifier
- Tables / queries : `zones-intervention.ts`
- Restant : carte unifiée, stats croisées, slug public

### 2.5 Urgences — `partiel` → `fonctionnel_non_teste`
- Routes : liste, nouvelle, `[id]`, `[id]/modifier`
- Tables : `urgences`, `urgence_sitreps` (052)
- Preuves : create/update/close + sitreps + audit
- Restant : stocks liés, distributions, tests E2E

### 2.6 Clusters — `partiel` → `fonctionnel_non_teste`
- Table `clusters` créée (était absente du projet lié) + `cluster_membres`, `cluster_reunions`
- Routes : liste + `[id]` (membres, réunions)
- Restant : engagements, zones, tests

### 2.7 Stocks — `maquette_seulement` → `fonctionnel_non_teste`
- Tables 051 + inventaires 052 ; seed entrepôts/catégories
- Routes : `/admin/stocks`, `/entrepots`, `/categories`, `/mouvements`
- Preuves : CRUD articles/entrepôts/catégories ; mouvements ; transferts ; dispo via `v_stock_disponibles` ; garde stock insuffisant
- Restant : inventaires UI, lots/séries complets, tests E2E/RLS

### 2.8 Logistique — `maquette_seulement` → `fonctionnel_non_teste`
- Demandes avec transitions statut ; véhicules ; missions + véhicule/dates
- Restant : lignes articles UI, fournisseurs/achats, preuves livraison

---

## Domaine 3 — Suivi et impact

| Module | Statut | Preuves / restant |
|--------|--------|-------------------|
| Bénéficiaires | partiel | Liste + nouveau ; agrégats ; pas import/doublons complets |
| Indicateurs | partiel | Liste/nouveau/modifier ; cadre logique incomplet |
| Résultats | partiel | Redirect vers indicateurs |
| Enquêtes | fonctionnel_non_teste | CRUD + réponses ; hors-ligne non opérationnel |
| Histoires d’impact | partiel | Alias publications ; Studio publication |
| Témoignages | partiel | Liste admin + publications |

---

## Domaine 4 — Communication

| Module | Statut | Preuves / restant |
|--------|--------|-------------------|
| Actualités | partiel | Redirect Studio publications |
| Médiathèque | partiel | `listMedia` + upload ; UI preview limitée |
| Newsletter | bloque_integration_externe | Campagnes/abonnés OK ; envoi réel bloqué sans provider |
| Pages publiques | fonctionnel_non_teste | Studio pages CRUD |

---

## Domaine 5 — Engagement

| Module | Statut | Preuves / restant |
|--------|--------|-------------------|
| Messages | partiel | Liste queries |
| Adhésions | partiel | Liste + workflow partiel |
| Partenariats | partiel | Demandes |
| Dons | bloque_integration_externe | Intentions/transactions UI ; SerdiPay non validé |
| Opportunités | fonctionnel_non_teste | CRUD + documents privés |
| Candidatures | partiel | Liste liée opportunités |
| Appels d’offres | partiel | Redirect publications |

---

## Domaine 6 — Organisation

| Module | Statut | Preuves / restant |
|--------|--------|-------------------|
| Partenaires | fonctionnel_non_teste | CRUD + logos Storage |
| Équipe publique | partiel | Vitrine site ≠ RH |
| RH (suite) | fonctionnel_non_teste | Migration 050 + pages `/admin/rh/*` ; seed démo ; **pas opérationnel** (tests E2E skip, règles paie draft) |
| Utilisateurs / accès | fonctionnel_non_teste | Invitations, RBAC, avatars, MFA gates code |
| Agents terrain | partiel | Liste/nouveau/détail |

---

## Domaine 7 — Finances

| Module | Statut | Preuves / restant |
|--------|--------|-------------------|
| Vue financière | partiel | Summary query + OCR entry |
| Budgets | partiel | Tables 030 ; CRUD basique ; RLS `USING true` → `fonctionnel_non_securise` |
| Dépenses | partiel | Idem |
| Transactions | partiel | Idem ; journal comptable non revendiqué |

---

## Domaine 8 — Rapports et documents

| Module | Statut | Preuves / restant |
|--------|--------|-------------------|
| Rapports | partiel | Liste/historique/modèles ; générateur incomplet |
| Documents | partiel | CRUD documents |
| Import intelligent OCR | fonctionnel_non_teste | Feature complète + migrations 040/041 ; cloud providers = stubs |
| Générateur | partiel | `/admin/rapports/nouveau` |
| Exports | maquette_seulement | Liens vers modules ; pas de jobs async |

---

## Domaine 9 — Administration

| Module | Statut | Preuves / restant |
|--------|--------|-------------------|
| Journal d’activité | partiel | `journal_activite` + `audit_logs` fusionnés query |
| Sécurité | partiel | Paramètres session/MFA ; sessions page |
| Sauvegardes | maquette_seulement | Recommandations texte — **aucune preuve backup** |
| Santé système | maquette_seulement | Hub de liens — pas d’OpenTelemetry live |
| Mon profil | fonctionnel_non_teste | Avatar upload + infos |
| Rôles / permissions | fonctionnel_non_teste | Pages dédiées |
| Périmètres `/admin/acces` | maquette_seulement | Hub de liens |
| Paramètres | partiel | Site params |

---

## Modules absents (écarts catalogue vs code)

| Module catalogue | Statut | Note |
|------------------|--------|------|
| Stocks (sous-routes articles/entrepôts/…) | absent | Seule page hub OCR |
| Logistique (sous-routes achats/véhicules/…) | absent | Seule page hub OCR |
| Centre notifications unifié | absent | Pas de feature `notifications/` complète |
| Recherche admin globale | absent | Header recherche non branchée multi-modules |
| Background jobs génériques (hors OCR) | absent | Pas de table jobs universelle pour exports/PDF |

---

## Doublons / incohérences détectés

1. `projets/nouveau` et `projets/nouvelle` coexistent  
2. `departements` (équipe) vs `hr_departements` (RH)  
3. `journal_activite` vs `audit_logs`  
4. Permissions legacy (`utilisateurs:write`) vs granulaires (`users.invite`)  
5. RLS 030 `USING (true)` vs RLS 050 plus stricte sur RH  

---

## Plan de migrations recommandé (post-vague 0)

1. `051` — durcir RLS tables 030 (retirer `USING true` authenticated)  
2. `052` — référentiels unifiés (provinces, devises, statuts)  
3. `053` — stocks + mouvements + inventaires  
4. `054` — logistique (demandes, véhicules)  
5. `055` — workflows / approvals génériques  
6. `056` — jobs async exports/PDF  
7. `057` — notifications centre  
8. Régénérer `src/types/database.types.ts`

Voir aussi `docs/MODULE_COMPLETION_MATRIX.json` pour la version machine-lisible.
