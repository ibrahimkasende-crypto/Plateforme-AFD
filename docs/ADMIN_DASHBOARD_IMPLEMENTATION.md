# Implémentation — Dashboard administrateur AFD

Date : 2026-07-17  
Maquette : `Maquette_AFD/Maquette_AFD_Admin.png`

## 1–3. Layout, sidebar, header

- `AdminShell` : fond `#f0f2f5`, sidebar navy desktop, drawer mobile
- Sidebar `#0d254e`, actif `#2563eb`, badges, pied « Voir le site public »
- Header sticky ~72px : menu, titre, recherche, notifications, messages, fullscreen, profil

## 4–10. Dashboard

- Filtres URL (`period`, `programme`, `province`, `project`) + export (impression, CSV, rapport)
- 6 KPI avec variations / états « — »
- Graphiques Recharts (palette AFD) : évolution, statut (anneau), secteurs, provinces (barres — SVG RDC à intégrer), activités, budget
- Top 5 projets, alertes, accès rapides, stats secondaires

## 11–12. Services et hooks

- `src/services/dashboard.service.ts` — agrégations Supabase + mode démo dev
- Hooks TanStack Query sous `src/features/statistiques/hooks/`
- Types : `src/features/statistiques/types/dashboard.ts`

## 13–15. Données

**Utilisées :** projets, programmes, partenaires, messages, membres, dons, abonnés newsletter (si table).  
**Manquantes :** activités, indicateurs MEAL, budgets structurés, SVG RDC officiel, rapports générés.  
**Démo :** `src/config/demo-data/admin-dashboard.ts` — badge « Mode démonstration » en développement si données insuffisantes (jamais en production).

## 16. Permissions

- `getAdminViewer()` + `finances:read` pour masquer le graphique budget
- Auth stricte `/admin` : prochaine phase

## 17–21. Qualité

- Responsive : drawer &lt; 1024px
- Tests e2e : `admin-dashboard`, `admin-dashboard-responsive`, `admin-permissions`
- Validation : typecheck OK · lint OK (1 warning RHF public) · build OK · e2e admin OK

## 22. Prochaines étapes

1. Authentification obligatoire `/admin`
2. Modules CRUD (programmes, projets, …)
3. SVG officiel carte RDC
4. Exports PDF réels
5. Personnalisation du tableau de bord
