# Recrutement et onboarding

## Recrutement interne

### `hr_recrutements`

| Statut | Description |
|--------|-------------|
| `brouillon` | En préparation |
| `ouvert` | Candidatures ouvertes |
| `cloture` | Fermé |
| `annule` | Annulé |

Lié à `hr_postes` et `hr_departements`.

### `hr_candidatures_rh`

Pipeline : `recue` → `preselection` → `entretien` → `offre` → `accepte` / `refuse` → `embauche`.

Documents CV / lettre stockés via `cv_path`, `lettre_path` (bucket `hr-private`).

Permission : `hr.manage_recruitment`.

Route : `/admin/rh/recrutement`.

## Onboarding

### `hr_onboarding_taches`

Checklist par employé :

- Statuts : `a_faire`, `en_cours`, `fait`, `bloque`
- `responsable_id`, `date_limite`, `preuve_path`

Route : `/admin/rh/onboarding`.

## Conversion candidat → employé

Lors du statut `embauche`, renseigner `employe_converti_id` et créer :

1. Fiche `hr_employes`
2. Contrat initial `hr_contrats`
3. Tâches onboarding

## Distinction opportunités publiques

Les candidatures publiques (`/admin/candidatures`, module opportunités) restent séparées du pipeline RH interne (`hr_candidatures_rh`).

