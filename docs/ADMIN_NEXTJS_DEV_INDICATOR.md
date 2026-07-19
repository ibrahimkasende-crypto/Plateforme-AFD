# Indicateur Next.js et chargement AFD

## Next.js 16.2.10

Dans `next.config.ts` :

```ts
devIndicators: false,
```

Le « N » Next.js est désactivé. Les erreurs de compilation restent affichées par Next.js.

## Badge flottant AFD

`src/components/admin/afd-page-loading-indicator.tsx` — toujours visible en bas à droite dans l’admin (comme le N Next.js).

- **Idle** : logo AFD qui flotte légèrement
- **Navigation** : pastille agrandie + « Chargement… » + voile léger + curseur `wait` pour éviter les reclics

Monté dans `AdminShell` (Suspense).

Écran plein : `src/components/admin/afd-loading-state.tsx` via `src/app/admin/loading.tsx`.

Pour forcer l’indicateur sur un bouton (navigation programmatique) : `data-afd-nav-loading` sur l’élément cliquable.

## Badge environnement

`src/components/admin/afd-environment-badge.tsx` — header admin hors production.
