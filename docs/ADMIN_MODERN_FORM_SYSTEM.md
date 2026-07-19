# Système de formulaires admin moderne

## Composants

`src/components/admin/forms/` :
- `modern-admin-form.tsx`
- `admin-form-header.tsx`
- `admin-form-section.tsx`
- `admin-form-grid.tsx`
- `admin-form-footer.tsx`
- `admin-form-stepper.tsx`
- `admin-field-*`, `form-validation-summary.tsx`
- `unsaved-changes-dialog.tsx`, `autosave-indicator.tsx`

## Formulaires migrés

- `/admin/projets/nouvelle`
- `/admin/rapports/nouveau`

Pattern : labels au-dessus, hauteur 44px, rayon 8–10, focus bleu AFD, sections en cartes blanches, footer sticky.

Validation : Zod + Server Actions existants ; champs sensibles non acceptés côté client.
