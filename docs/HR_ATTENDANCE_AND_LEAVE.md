# Présences et congés

## Présences (`hr_presences`)

Enregistrement journalier par employé :

| Champ | Description |
|-------|-------------|
| `date_jour` | Date (unique par employé/jour) |
| `heure_entree` / `heure_sortie` | Horaires |
| `pause_minutes` | Pause déjeuner |
| `statut` | `present`, `absent`, `retard`, `mission`, `teletravail`, `conge`, `ferie` |
| `heures_sup` | Heures supplémentaires (alimente paie) |
| `valide_par` | Validateur |

Permission : `hr.manage_attendance`.

Route : `/admin/rh/presences`.

## Congés (`hr_conges`)

| Statut workflow | Signification |
|-----------------|---------------|
| `demande` | Soumise |
| `approuve_n1` | Validée N+1 |
| `approuve_rh` | Validée RH |
| `rejete` / `annule` | Refusée / annulée |

Champs : `type_conge`, `date_debut`, `date_fin`, `jours`, `piece_path` (justificatif privé).

Permission : `hr.manage_leave`.

Route : `/admin/rh/conges`.

## Soldes (`hr_soldes_conges`)

Par employé, type et année : `acquis`, `pris`, `report`.

## Impact paie

- Absences non payées : paramètre `absencesAmount` dans `calculatePayroll`.
- Heures sup : `overtimeHours` + règle `DEMO_OT` (démo).

## Seeds démo

Le seed RH crée des présences et congés fictifs pour juin–août 2026 (`scripts/seed-hr-presentation.ts`).
