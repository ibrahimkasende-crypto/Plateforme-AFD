# Indicateur Next.js et badge AFD

## Next.js 16.2.10

Dans `next.config.ts` :

```ts
devIndicators: {
  position: "bottom-right",
}
```

L’indicateur de développement ne masque plus le bouton **Voir le site public** (bas gauche).

Absent en `npm run build` / `npm run start`.

## Badge AFD

`src/components/admin/afd-environment-badge.tsx` — affiché dans le header admin uniquement hors production (`NEXT_PUBLIC_APP_ENV` / `NODE_ENV`).
