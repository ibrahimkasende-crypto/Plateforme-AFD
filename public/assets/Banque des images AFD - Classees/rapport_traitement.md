# Rapport de traitement - Banque Images AFD

- Date du traitement : 2026-08-03T01:11:49
- Dossier source : `D:\Maquette_AFD\Banque des images AFD`
- Dossier de sortie : `D:\Maquette_AFD\Banque des images AFD - Classees`
- Mode : execution avec copie

## Synthese

1. Nombre total de fichiers detectes : 318
2. Nombre total d'images traitees : 316
3. Nombre d'images copiees : 316
4. Nombre d'images non reconnues : 0
5. Nombre d'erreurs : 0
6. Nombre de doublons exacts marques : 2
7. Nombre de doublons visuels probables marques : 2
8. Nombre d'images a verifier : 0
9. Nombre d'images sans date de prise de vue : 0
10. Nombre d'images sans lieu confirme : 183
11. Nombre d'images avec GPS : 0
12. Nombre d'images avec texte visible renseigne : 316

## Images par secteur

- 01_sante : 110
- 02_education : 0
- 03_protection : 0
- 04_vbg : 0
- 05_nutrition : 0
- 06_wash : 65
- 07_agriculture : 0
- 08_securite_alimentaire : 0
- 09_autonomisation_economique : 0
- 10_entrepreneuriat_feminin : 0
- 11_inclusion_handicap : 0
- 12_enfance : 41
- 13_jeunesse : 0
- 14_formation : 0
- 15_renforcement_capacites : 0
- 16_distribution_humanitaire : 0
- 17_missions_terrain : 28
- 18_coordination : 45
- 19_gouvernance : 5
- 20_partenariats : 0
- 21_plaidoyer : 0
- 22_sensibilisation : 7
- 23_reunions : 0
- 24_visites_institutionnelles : 15
- 25_communication : 0
- 26_evenements : 0
- 27_administration : 0
- 28_autres : 0
- 99_a_verifier : 0

## Dossiers crees

- `D:\Maquette_AFD\Banque des images AFD - Classees\01_sante`
- `D:\Maquette_AFD\Banque des images AFD - Classees\02_education`
- `D:\Maquette_AFD\Banque des images AFD - Classees\03_protection`
- `D:\Maquette_AFD\Banque des images AFD - Classees\04_vbg`
- `D:\Maquette_AFD\Banque des images AFD - Classees\05_nutrition`
- `D:\Maquette_AFD\Banque des images AFD - Classees\06_wash`
- `D:\Maquette_AFD\Banque des images AFD - Classees\07_agriculture`
- `D:\Maquette_AFD\Banque des images AFD - Classees\08_securite_alimentaire`
- `D:\Maquette_AFD\Banque des images AFD - Classees\09_autonomisation_economique`
- `D:\Maquette_AFD\Banque des images AFD - Classees\10_entrepreneuriat_feminin`
- `D:\Maquette_AFD\Banque des images AFD - Classees\11_inclusion_handicap`
- `D:\Maquette_AFD\Banque des images AFD - Classees\12_enfance`
- `D:\Maquette_AFD\Banque des images AFD - Classees\13_jeunesse`
- `D:\Maquette_AFD\Banque des images AFD - Classees\14_formation`
- `D:\Maquette_AFD\Banque des images AFD - Classees\15_renforcement_capacites`
- `D:\Maquette_AFD\Banque des images AFD - Classees\16_distribution_humanitaire`
- `D:\Maquette_AFD\Banque des images AFD - Classees\17_missions_terrain`
- `D:\Maquette_AFD\Banque des images AFD - Classees\18_coordination`
- `D:\Maquette_AFD\Banque des images AFD - Classees\19_gouvernance`
- `D:\Maquette_AFD\Banque des images AFD - Classees\20_partenariats`
- `D:\Maquette_AFD\Banque des images AFD - Classees\21_plaidoyer`
- `D:\Maquette_AFD\Banque des images AFD - Classees\22_sensibilisation`
- `D:\Maquette_AFD\Banque des images AFD - Classees\23_reunions`
- `D:\Maquette_AFD\Banque des images AFD - Classees\24_visites_institutionnelles`
- `D:\Maquette_AFD\Banque des images AFD - Classees\25_communication`
- `D:\Maquette_AFD\Banque des images AFD - Classees\26_evenements`
- `D:\Maquette_AFD\Banque des images AFD - Classees\27_administration`
- `D:\Maquette_AFD\Banque des images AFD - Classees\28_autres`
- `D:\Maquette_AFD\Banque des images AFD - Classees\99_a_verifier`
- `tools`

## Fichiers non traites

- `D:\Maquette_AFD\Banque des images AFD\Banque Images 1.zip`
- `D:\Maquette_AFD\Banque des images AFD\Banque Images 2.zip`

## Problemes rencontres

- Aucune erreur bloquante.
- Aucun moteur OCR local n'a ete detecte; le champ `visible_text` combine les textes confirmes par inspection visuelle des planches-contact et le contexte dossier.

## Validation finale

- Chaque image source possede une entree catalogue : True
- Aucun nouveau nom duplique : True
- Noms compatibles Web : False
- Copies manquantes : 0
- Hashs copies identiques aux originaux : True
- JSON valide : True
- CSV presents : True
- Images faible confiance dans `99_a_verifier` : True

## Recommandations pour la mediatheque web

- Importer `catalogue_images.json` comme source structuree pour les pages, filtres et fiches media.
- Utiliser `website.category`, `tags`, `primarySector` et `secondaryCategories` pour les filtres du site.
- Afficher `altText` pour l'accessibilite et `caption` comme legende sous les photos.
- Conserver `renommage_correspondance.csv` comme fichier de tracabilite entre originaux et copies classees.
- Revoir manuellement tout element marque `review_required=true` avant publication.
- Eviter d'afficher les noms de personnes; les descriptions restent volontairement non nominatives.

## Apercu du plan de renommage

- `DSC_0626.jpg` -> `afd_enfance_activites_enfants_site_communautaire_001.jpg` (enfance, moyen)
- `DSC_0627.jpg` -> `afd_enfance_activites_enfants_site_communautaire_002.jpg` (enfance, moyen)
- `DSC_0628.jpg` -> `afd_enfance_activites_enfants_site_communautaire_003.jpg` (enfance, moyen)
- `DSC_0957.jpg` -> `afd_enfance_activites_enfants_site_communautaire_004.jpg` (enfance, moyen)
- `DSC_0962.jpg` -> `afd_enfance_activites_enfants_site_communautaire_005.jpg` (enfance, moyen)
- `DSC_0964.jpg` -> `afd_enfance_activites_enfants_site_communautaire_006.jpg` (enfance, moyen)
- `DSC_0970.jpg` -> `afd_enfance_activites_enfants_site_communautaire_007.jpg` (enfance, moyen)
- `DSC_1255.jpg` -> `afd_enfance_activites_enfants_site_communautaire_008.jpg` (enfance, moyen)
- `DSC_1257.jpg` -> `afd_enfance_activites_enfants_site_communautaire_009.jpg` (enfance, moyen)
- `DSC_1258.jpg` -> `afd_enfance_activites_enfants_site_communautaire_010.jpg` (enfance, moyen)
- `DSC_1259.jpg` -> `afd_enfance_activites_enfants_site_communautaire_011.jpg` (enfance, moyen)
- `DSC_1260.jpg` -> `afd_enfance_activites_enfants_site_communautaire_012.jpg` (enfance, moyen)
- `DSC_1319.jpg` -> `afd_enfance_activites_enfants_site_communautaire_013.jpg` (enfance, moyen)
- `DSC_1324.jpg` -> `afd_enfance_activites_enfants_site_communautaire_014.jpg` (enfance, moyen)
- `DSC_1325.jpg` -> `afd_enfance_activites_enfants_site_communautaire_015.jpg` (enfance, moyen)
- `DSC_1326.jpg` -> `afd_enfance_activites_enfants_site_communautaire_016.jpg` (enfance, moyen)
- `DSC_1327.jpg` -> `afd_enfance_activites_enfants_site_communautaire_017.jpg` (enfance, moyen)
- `DSC_1328.jpg` -> `afd_enfance_activites_enfants_site_communautaire_018.jpg` (enfance, moyen)
- `DSC_1329.jpg` -> `afd_enfance_activites_enfants_site_communautaire_019.jpg` (enfance, moyen)
- `DSC_1423.jpg` -> `afd_enfance_activites_enfants_site_communautaire_020.jpg` (enfance, moyen)
