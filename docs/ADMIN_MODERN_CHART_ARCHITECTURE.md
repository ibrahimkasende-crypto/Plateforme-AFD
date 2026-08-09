# Architecture graphique moderne

## Versions

- **Recharts** `^3.9.2` — dashboard compact
- **ECharts** `^6.x` — pages `/admin/analyse/*` (import dynamique)

## Thème

`src/components/charts/chart-theme.ts` + `chart-colors.ts` + `chart-tooltip.tsx`

## Composants

- `echarts-react.tsx` — wrapper Canvas + ResizeObserver
- `chart-empty-state`, `chart-error-state`, `chart-skeleton`
- `chart-legend`, `chart-actions`, `chart-card`

## Accessibilité

Titre, résumé `sr-only`, vue tableau sur les pages analytiques, tooltips sombres, légendes cliquables, `prefers-reduced-motion`.

