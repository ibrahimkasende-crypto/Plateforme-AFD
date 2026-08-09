# Enquêtes dynamiques

## Admin

- `/admin/enquetes`
- `/admin/enquetes/nouvelle`
- `/admin/enquetes/[id]`
- `/admin/enquetes/[id]/modifier`
- `/admin/enquetes/[id]/reponses`

## Public

- `/enquetes/[slug]` uniquement si `statut = publiee` et `visibilite = publique`

## Tables

- `enquetes`
- `questions_enquete`
- `options_questions`
- `reponses_enquete`
- `reponses_questions`

## Types de questions supportés (création admin)

texte court/long, nombre, date, téléphone, email, choix unique/multiple, liste, oui/non, note, échelle, fichier, photo, localisation.

## Soumission publique

- React Hook Form non obligatoire ici : server action + Zod + honeypot
- Consentement si requis
- Pas de `eval()` pour la logique conditionnelle (champ JSON prévu, non exécuté)
- Architecture compatible collecte mobile future (pas de mode offline revendiqué)

