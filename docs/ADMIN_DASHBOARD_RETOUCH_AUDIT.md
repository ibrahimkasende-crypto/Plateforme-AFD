# Audit retouches dashboard admin (2026-07-19)

## Causes graphiques vides
1. **Secteur** : pas de colonne/valeur `secteur` exploitable ; seed sans projets ; RPC conditionnelle ; fallback vide.
2. **Province** : widget bénéficiaires uniquement ; pas de `projects_by_province` ; mapping partiel.

## Corrections appliquées
- RPC 021 + seed présentation + mapping TS
- Widget « Projets par province » (carte + classement)
- Badge header « Mode présentation »
- Sidebar pliable, photo retirée, bouton site public
- Densité widgets / rangée secondaire
- Login univers Canvas
- Tests e2e charts / sidebar / login / density

## Données manquantes résolues
Programmes, projets, secteurs, provinces, séries mensuelles, budgets, alertes, métriques secondaires.

