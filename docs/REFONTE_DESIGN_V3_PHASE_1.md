# Refonte Design V3 — Phase 1

## Fichiers modifiés

- `tailwind.config.js` : tokens V3, rayons et ombres.
- `src/index.css` : variables de design V3 et mouvement réduit.
- `src/main.tsx` : provider TanStack Query.
- `src/pages/Home.tsx` : Hero éditorial premium avec Motion.

## Dépendances ajoutées

- `motion` pour les animations sobres respectant `prefers-reduced-motion`.
- `@tanstack/react-query` pour préparer la centralisation et le cache des requêtes.

## Composants et animation

Le Hero remplace toute logique de carrousel automatique par une image de terrain, une composition éditoriale, un mouvement d’image discret et une révélation progressive du contenu.

## Données

L’accueil conserve les requêtes Supabase existantes et ses données de secours. Sans `.env`, le client utilise une origine injoignable contrôlée pour permettre aux contenus de secours de s’afficher.

## À vérifier manuellement

- Hero à 320, 375, 768, 1024 et 1440 px.
- Navigation clavier et focus des CTA.
- Affichage sans `.env` et avec Supabase configuré.
- Absence d’animation lorsque la préférence de mouvement réduit est active.

## Suite

Valider la direction V3 sur l’accueil, puis appliquer les tokens et composants aux pages internes sans toucher à l’administration.
