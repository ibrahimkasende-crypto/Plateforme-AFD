# Architecture complète — Plateforme-AFD

## Stack
- Next.js App Router + TypeScript strict
- Supabase Auth / PostgreSQL / Storage + `@supabase/ssr`
- TanStack Query, RHF, Zod, Lucide, Recharts/ECharts

## Couches
1. **Présentation** — `src/app/admin/**`, composants `src/components/admin/**`
2. **Domaines** — `src/features/**` (actions, services, schemas)
3. **AuthZ** — `requirePermission`, `has_permission` SQL, scopes
4. **Données** — migrations `supabase/migrations/**`, RLS, RPC dashboard
5. **Jobs** — `background_jobs` + workers (OCR, exports)
6. **Audit** — `audit_logs` append-only + vue `v_audit_unified`

## Domaines métier
Opérations · Suivi/Impact · Communication · Engagement · Organisation/RH · Finances · Rapports/OCR · Administration

Voir aussi la matrice : `docs/MODULE_COMPLETION_MATRIX.md`.
