# Progression d’implémentation — Plateforme-AFD

**Dernière mise à jour :** 2026-07-19  
**Branche :** `reconstruction-nextjs`  
**Validations courantes :** typecheck OK · 40 tests unitaires OK · lint warnings only · build OK (session précédente)

## Synthèse vagues

| Vague | Statut | Notes |
|-------|--------|-------|
| 0 Audit | Terminée | Matrice 47 modules |
| 1 Fondations | Terminée (gate technique) | Migration 051, RLS, workflows/jobs/notif |
| 2 Opérations | Avancée | Stocks/logistique/urgences/clusters/activités |
| 3 Suivi & impact | Avancée | Import bénéficiaires, indicateurs valeurs, sync offline helpers, consentements |
| 4 Communication | Partielle | Newsletter bloquée correctement ; SerdiPay non simulé |
| 5 Organisation | Avancée | RH/paie 050 existants ; appareils agents |
| 6 Finances | Avancée | Budgets amendables, dépenses workflow, transactions/rapprochement |
| 7 Rapports/OCR/exports | Avancée | CSV/XLSX réels, jobs async, OCR existant |
| 8 Administration | Avancée | Santé réelle, recherche globale, sauvegardes sans faux succès |
| 9 Intégration | Partielle | Scripts seed/verify ; dashboard RPC existant ; preuves `operationnel` encore incomplètes |

## Modules `operationnel`
Toujours **0** au standard strict (E2E + RLS automatisés + preuves complètes). De nombreux modules sont `fonctionnel_non_teste`.

## Blocages externes
- Newsletter email — `bloque_integration_externe`
- SerdiPay — `bloque_integration_externe`
- OCR cloud — `bloque_integration_externe` (fallback local limité)

## Commits locaux (extrait)
- `feat(admin): complete secure platform foundations`
- `feat(admin): complete operations management`
- `feat(admin): complete monitoring impact and surveys`
- `feat(admin): complete reports documents OCR and exports`
- (vagues 5–9 à committer dans cette session)

## Prochaine priorité preuves
- Suite RLS SQL automatisée CI
- E2E Playwright par module
- Marquage `operationnel` uniquement avec preuves fichier/tests

