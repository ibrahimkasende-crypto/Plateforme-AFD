# Baseline d’implémentation admin — Plateforme-AFD

**Vague 0 — Audit forensique**  
**Date :** 2026-07-19  
**Projet :** `D:\Plateforme-AFD\AFD`  
**Matrice :** [MODULE_COMPLETION_MATRIX.md](./MODULE_COMPLETION_MATRIX.md) · [MODULE_COMPLETION_MATRIX.json](./MODULE_COMPLETION_MATRIX.json)

---

## Compteurs (preuve)

| Indicateur | Valeur | Preuve |
|------------|--------|--------|
| Modules détectés / audités | **47** | `MODULE_COMPLETION_MATRIX.json` |
| Absents | **4** | notifications, recherche globale, jobs async hors OCR, sous-routes stocks |
| Maquettes seulement | **5** | stocks hub, logistique hub, exports, sauvegardes, système (et hubs proches) |
| Partiels | **21** | urgences, clusters, messages, finances, rapports, … |
| Fonctionnels non sécurisés | **4** | activités/budgets/dépenses/transactions (RLS 030 `USING true`) |
| Fonctionnels non testés | **11** | dashboard, programmes, projets, enquêtes, OCR, RH, utilisateurs, … |
| Réellement opérationnels (standard strict) | **0** | aucun module ne remplit tous les critères du cahier |
| Bloqués intégration externe | **2** | newsletter envoi, dons/SerdiPay |
| Routes `page.tsx` admin | **174** | glob `src/app/admin/**/page.tsx` |
| Entrées navigation sidebar | **53** | `admin-navigation.ts` |
| Placeholders littéraux UI (« Module en préparation », etc.) | **0** | grep `src` — composant `ModulePlaceholder` sans ce libellé |
| Tables sans RLS / RLS trop permissive | **oui (critique)** | `20260719_030_admin_missing_modules.sql` génère `USING (true)` |
| Actions sans autorisation serveur | **à auditer vague 1** | pattern majoritaire `requirePermission` ; exceptions possibles |
| Tests unitaires | **26/26 OK** | `npm run test` 2026-07-19 |
| Typecheck | **OK** | `npm run typecheck` |
| Migrations locales | **24** | `supabase/migrations/` |
| CLI `migration list --linked` | listées (suivi remote partiel) | sortie CLI 2026-07-19 |

---

## Architecture actuelle (constat)

### Points solides
- Next.js App Router + auth admin Supabase (`requireAdmin` / `requirePermission`)
- Dashboard alimenté par RPC (pas de KPI hardcodés dans la page)
- Studio de publication (actualités, pages, histoires, témoignages, AO)
- Import intelligent OCR (feature + migrations 040/041)
- IAM / RH / paie (migration 050, invitations, seed démo, engine paie)
- Nombreux CRUD métier déjà branchés (programmes, projets, partenaires, opportunités)

### Points faibles
- **Aucun module `operationnel`** au sens du cahier (tests + RLS + workflow + docs par module)
- Stocks / logistique = **maquettes OCR**
- Exports / sauvegardes / santé système = **UI informative**, pas de preuve runtime
- RLS 030 trop ouverte pour finances / activités / urgences
- Doublons : `journal_activite` vs `audit_logs` ; `departements` vs `hr_departements` ; permissions legacy vs nouvelles
- Intégrations externes (email, SerdiPay) non opérationnelles

---

## Risques principaux

1. **Élévation / fuite données** via politiques `USING (true)` authenticated (migration 030)  
2. **Fausse confiance** sur sauvegardes / santé système  
3. **Paiements / emails** annoncés sans provider  
4. **Stock métier absent** → incohérence dashboard / OCR  
5. **Types Supabase** potentiellement désynchronisés après 050  
6. **E2E** largement skippés sans `AFD_E2E_ADMIN_EMAIL` / password  

---

## Ordre recommandé d’implémentation

Conforme au cahier des charges :

| Vague | Focus | Gate |
|-------|--------|------|
| **1** | Fondations : durcir RLS 030, workflows, jobs, notifications, référentiels, composants CRUD partagés | Pas d’élévation ; RLS testée |
| **2** | Opérations : stocks, logistique, chaîne programme→projet→activité | Mouvements cohérents |
| **3** | Suivi et impact | Agrégations + consentements |
| **4** | Communication + engagement | Publication + docs privés |
| **5** | Organisation (RH/users/agents) | Invitations + paie démo |
| **6** | Finances | Totaux + approbations |
| **7** | Rapports / OCR / exports | Jobs + validation humaine |
| **8** | Administration / observabilité | Pas de fake backup |
| **9** | Intégration finale | Tests croisés + docs plateforme |

---

## Plan de migrations (cible)

1. `051_rls_harden_admin_modules_030` — remplacer `USING (true)`  
2. `052_shared_references` — provinces, devises, statuts, unités  
3. `053_stocks_inventory` — articles, entrepôts, mouvements  
4. `054_logistics` — demandes, véhicules, missions  
5. `055_workflows_approvals`  
6. `056_background_jobs`  
7. `057_notifications_center`  
8. Régénération `src/types/database.types.ts`

---

## Tests anti-placeholder

Créés / renforcés :

- `tests/e2e/admin-no-placeholder.spec.ts`  
- `tests/e2e/admin-all-routes.spec.ts` (déjà présent avec patterns interdits)

---

## Décision vague 0

**Ne pas commencer par le polish UI.**  
Priorité vague 1 : sécurité RLS + fondations partagées avant d’étendre stocks/logistique.

