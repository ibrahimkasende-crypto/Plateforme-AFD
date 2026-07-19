# RLS — Plateforme-AFD

## Principe
Toute table métier exposée a RLS. Les politiques utilisent `has_permission` / `is_active_admin` / ownership.

## Correctif Vague 1
Migration `20260719_051` remplace les politiques `USING (true)` des tables 030.

## Preuves
- `tests/rls/wave1_foundations_rls.sql`
- `docs/HR_RLS_POLICIES.md` (RH/paie)
