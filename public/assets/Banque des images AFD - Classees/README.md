# Banque Images AFD - Classees

Ce dossier contient une copie classee et renommee de la banque d'images AFD.
Les originaux restent dans le dossier source et ne sont ni modifies, ni deplaces, ni supprimes.

## Relancer en dry-run

```powershell
python ".\tools\organiser_banque_images.py" --source "D:\Maquette_AFD\Banque des images AFD" --output "D:\Maquette_AFD\Banque des images AFD - Classees" --dry-run --detect-duplicates
```

## Relancer en execution

```powershell
python ".\tools\organiser_banque_images.py" --source "D:\Maquette_AFD\Banque des images AFD" --output "D:\Maquette_AFD\Banque des images AFD - Classees" --execute --resume --detect-duplicates
```

## Fichiers principaux

- `catalogue_images.csv` : catalogue complet pour tableur ou import CMS.
- `catalogue_images.json` : catalogue structure pour integration web.
- `renommage_correspondance.csv` : lien entre l'ancien nom et le nouveau nom.
- `rapport_traitement.md` : bilan du traitement et recommandations.
- `journal_erreurs.log` : erreurs eventuelles et actions prises.
- `inventaire_images.csv` : inventaire technique des originaux.
- `plan_renommage.csv` : plan de nommage avant ou apres copie.

## Notes

Les classifications utilisent l'analyse visuelle des planches-contact et le contexte des dossiers comme information complementaire.
Les images de confiance faible sont envoyees dans `99_a_verifier`.
