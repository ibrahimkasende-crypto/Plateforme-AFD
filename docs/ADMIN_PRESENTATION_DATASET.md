# Jeu de données de présentation — dashboard admin

## Identifiant
`demo_batch_id = afd-presentation-2024-2026`

## Période
Juillet 2024 → juin 2026 (24 mois)

## Volumes
| Entité | Quantité |
|---|---|
| Programmes | 10 |
| Projets | 30 |
| Stats mensuelles | 192 (24×8 provinces) |
| Activités mensuelles | 144 (24×6 catégories) |
| Budgets mensuels | 24 |
| Alertes | 20 |
| Métriques secondaires | 6 snapshots |
| Abonnés newsletter (factices) | ~1840 |

## Provinces
Kinshasa, Kwilu, Kwango, Haut-Katanga, Ituri, Tshopo, Tshuapa, Nord-Kivu

## Secteurs
Santé/WASH, Protection VBG, Autonomisation économique, Éducation, Sécurité alimentaire, Urgences/cohésion

## Commandes
```bash
CONFIRM=yes npm run seed:presentation
CONFIRM=yes npm run seed:presentation:clean
```

La purge ne touche que `demo_batch_id` — aucune donnée officielle.
