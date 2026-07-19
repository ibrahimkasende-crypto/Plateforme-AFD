# Matrice de preuve des modules — Plateforme-AFD

**Date d'audit :** 2026-07-19  
**Vague :** 0 (forensique)  
**Source navigation :** `src/config/admin-navigation.ts`  
**Total modules :** 55

## Synthèse des statuts

| Statut | Nombre |
|--------|-------:|
| `fonctionnel_non_teste` | 13 |
| `partiel` | 35 |
| `maquette_seulement` | 4 |
| `bloque_integration_externe` | 3 |

**Règle :** aucun module n'est `operationnel` sans preuves techniques complètes (CRUD, RLS granulaire, tests auth, journal, pagination serveur).

## Matrice

| Domaine | Module | Route | Statut | Preuves principales | Travaux restants |
|---------|--------|-------|--------|---------------------|------------------|
| Tableau de bord | Tableau de bord | `/admin` | `fonctionnel_non_teste` | src/app/admin/page.tsx; supabase/migrations/20260718_020_admin_dashboard_rpc.sql | widgets RH/OCR/stocks reliés; export widgets |
| Opérations | Programmes | `/admin/programmes` | `fonctionnel_non_teste` | src/features/programmes/actions/manage-programme.ts; src/lib/queries/admin/programmes.ts | analyse complète; pagination serveur |
| Opérations | Projets | `/admin/projets` | `fonctionnel_non_teste` | src/features/projets/actions/manage-projet.ts; src/lib/queries/admin/projets.ts | onglets complets; jalons/risques |
| Opérations | Activités | `/admin/activites` | `partiel` | src/lib/queries/admin/activites.ts; src/features/activites | preuves photos; validation workflow |
| Opérations | Zones d'intervention | `/admin/zones-intervention` | `partiel` | src/lib/queries/admin/zones-intervention.ts | carte interactive données live; stats liées |
| Opérations | Urgences | `/admin/urgences` | `partiel` | src/lib/queries/admin/urgences.ts; src/features/urgences | distributions; sitrep |
| Opérations | Clusters | `/admin/clusters` | `partiel` | src/lib/queries/admin/clusters.ts | réunions; décisions |
| Opérations | Stocks | `/admin/stocks` | `maquette_seulement` | src/app/admin/stocks/page.tsx (OCR only, 24 lignes) | tables mouvements; CRUD articles/entrepôts |
| Opérations | Logistique | `/admin/logistique` | `maquette_seulement` | src/app/admin/logistique/page.tsx | demandes/achats/véhicules; CRUD complet |
| Suivi et impact | Bénéficiaires | `/admin/beneficiaires` | `partiel` | src/features/beneficiaires/actions/manage-beneficiaire.ts; src/lib/queries/admin/beneficiaires.ts | import; doublons |
| Suivi et impact | Indicateurs et résultats | `/admin/indicateurs` | `partiel` | src/features/indicateurs; src/lib/queries/admin | cadre logique; validation pièces |
| Suivi et impact | Enquêtes | `/admin/enquetes` | `partiel` | src/features/enquetes; migration 011 | constructeur complet; offline réel |
| Suivi et impact | Histoires d'impact | `/admin/histoires-impact` | `partiel` | src/lib/queries/admin/histoires.ts | consentement workflow; publication contrôlée |
| Suivi et impact | Témoignages | `/admin/temoignages` | `partiel` | src/lib/queries/admin/temoignages.ts | retrait consentement; médias |
| Communication | Actualités | `/admin/actualites` | `fonctionnel_non_teste` | src/features/actualites; publications/actualites | SEO/planification; révisions |
| Communication | Médiathèque | `/admin/mediatheque` | `partiel` | src/app/admin/mediatheque/page.tsx; src/features/mediatheque | versions; doublons |
| Communication | Newsletter | `/admin/newsletter` | `bloque_integration_externe` | src/features/newsletter; NewsletterProviderNotConfiguredError | provider email; envoi réel |
| Communication | Pages publiques | `/admin/publications/pages` | `partiel` | src/features/pages; src/lib/queries/admin/pages.ts | blocs CMS; historique versions |
| Engagement | Messages | `/admin/messages` | `partiel` | src/lib/queries/admin/messages.ts; src/features/messages | affectation; réponse PJ |
| Engagement | Adhésions | `/admin/adhesions` | `partiel` | src/lib/queries/admin/adhesions.ts | renouvellement; documents |
| Engagement | Partenariats | `/admin/partenariats` | `partiel` | src/lib/queries/admin/partenariats.ts | convention; conversion partenaire |
| Engagement | Dons | `/admin/dons` | `bloque_integration_externe` | src/features/dons; src/features/paiements/providers/serdipay | SerdiPay credentials; rapprochement auto |
| Engagement | Opportunités | `/admin/opportunites` | `fonctionnel_non_teste` | src/features/opportunites; migrations 006/007 | tests unitaires; clôture auto |
| Engagement | Candidatures | `/admin/candidatures` | `fonctionnel_non_teste` | src/lib/queries/admin/candidatures.ts; bucket candidatures-privees | notation/entretiens; pipeline RH |
| Engagement | Appels d'offres | `/admin/appels-offres` | `partiel` | src/lib/queries/admin/appels-offres.ts | soumissions privées; évaluation |
| Organisation | Partenaires institutionnels | `/admin/partenaires` | `fonctionnel_non_teste` | src/features/partenaires; Storage partenaires | conventions liées projets |
| Organisation | Équipe publique | `/admin/equipe` | `fonctionnel_non_teste` | src/features/equipe; src/lib/queries/admin/equipe.ts | séparer clairement de RH |
| Organisation | Tableau de bord RH | `/admin/rh` | `partiel` | src/app/admin/rh/page.tsx; getHrDashboardStats | graphiques; masse salariale permissionnée |
| Organisation | Personnel | `/admin/rh/personnel` | `fonctionnel_non_teste` | src/features/hr; migration 050 | pagination; documents Storage |
| Organisation | Départements et postes | `/admin/rh/departements` | `partiel` | hr_departements; hr_postes | organigramme dynamique complet |
| Organisation | Recrutement | `/admin/rh/recrutement` | `partiel` | hr_recrutements; hr_candidatures_rh | pipeline complet; conversion employé |
| Organisation | Présences | `/admin/rh/presences` | `partiel` | hr_presences page | RLS policies; validation supérieur |
| Organisation | Congés | `/admin/rh/conges` | `partiel` | hr_conges | soldes versionnés; workflow N+1/RH |
| Organisation | Performance | `/admin/rh/performance` | `partiel` | hr_evaluations | cycles objectifs; confidentialité |
| Organisation | Formation | `/admin/rh/formations` | `partiel` | hr_formations | certificats; besoins |
| Organisation | Paie | `/admin/rh/paie` | `partiel` | src/features/payroll; legal_payroll_rules DEMO | validation légale; RLS tables manquantes |
| Organisation | Utilisateurs et accès | `/admin/utilisateurs` | `fonctionnel_non_teste` | inviteUserAction; privilege-guards | scopes en RLS; MFA enforced prod |
| Organisation | Invitations | `/admin/invitations` | `fonctionnel_non_teste` | admin_invitations; inviteUserAction | renvoi invitation UI; expiration |
| Organisation | Périmètres d'accès | `/admin/acces` | `partiel` | access_scopes tables 050 | RLS sur scopes; UI attribution complète |
| Organisation | Agents terrain | `/admin/agents` | `partiel` | src/features/agents; migration 011 | sync appareils; performance collecte |
| Finances | Vue financière | `/admin/finances` | `partiel` | src/lib/queries/admin/finances.ts | agrégations cohérentes; alertes budget |
| Finances | Budgets | `/admin/finances/budgets` | `partiel` | finances_budgets; manage-finances | lignes budgétaires; amendements |
| Finances | Dépenses | `/admin/finances/depenses` | `partiel` | finances_depenses | workflow approbation; OCR liaison |
| Finances | Transactions | `/admin/finances/transactions` | `partiel` | page réutilise getAdminDons | ledger dédié; rapprochement |
| Rapports et documents | Rapports | `/admin/rapports` | `partiel` | src/features/rapports; rapports_generes | génération PDF async; modèles versionnés |
| Rapports et documents | Documents | `/admin/documents` | `partiel` | src/features/documents; buckets documents-* | versions; hash |
| Rapports et documents | Import intelligent OCR | `/admin/import-intelligent` | `fonctionnel_non_teste` | migration 040/041; src/features/document-intelligence | antivirus; tests e2e auth |
| Rapports et documents | Générateur de rapports | `/admin/rapports/nouveau` | `partiel` | src/app/admin/rapports/nouveau/page.tsx | job async; aperçu données live |
| Rapports et documents | Exports | `/admin/exports` | `maquette_seulement` | src/app/admin/exports/page.tsx liens seulement | jobs persistants; fichiers signés |
| Administration | Journal d'activité | `/admin/journal-activite` | `partiel` | journal.ts fusion audit_logs; append_audit_log | filtres sensibilité; export autorisé |
| Administration | Sessions | `/admin/securite/sessions` | `partiel` | security_events query | révocation Auth Admin API; appareils actifs |
| Administration | Sécurité | `/admin/securite` | `partiel` | src/app/admin/securite/page.tsx | politiques MFA; verrouillages |
| Administration | Mon profil | `/admin/mon-profil` | `fonctionnel_non_teste` | avatar.ts; admin-avatars | recadrage; MFA UI |
| Administration | Sauvegardes | `/admin/sauvegardes` | `bloque_integration_externe` | page recommandations seulement | API statut backups Supabase; jamais afficher réussie sans preuve |
| Administration | Santé du système | `/admin/systeme` | `maquette_seulement` | hub informatif | OpenTelemetry; métriques réelles |

## Détail JSON

Voir [`MODULE_COMPLETION_MATRIX.json`](./MODULE_COMPLETION_MATRIX.json) pour les booléens (liste, Zod, RLS, tests, etc.).

## Risques majeurs identifiés (Vague 0)

1. Policies `USING (true)` sur modules admin 030 (`finances_*`, `activites`, etc.) — migration `20260719_030`.
2. ~30 tables IAM/RH/paie sans RLS ou sans policies (`20260719_050`).
3. Stocks / Logistique / Exports / Système = coquilles (pas de CRUD métier).
4. Newsletter et Dons bloqués par intégrations externes (email, SerdiPay).
5. Sauvegardes : UI informative uniquement — ne jamais afficher « réussie » sans preuve.
