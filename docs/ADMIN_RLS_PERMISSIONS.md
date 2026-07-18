# RLS et permissions admin

## Permissions applicatives
Définies dans `src/config/permissions.ts` et vérifiées via `requirePermission` / `hasPermission`.

Nouvelles clés : `clusters:read|write`, `urgences:read|write`.

## RLS
Migration 030 active RLS + policies SELECT/INSERT/UPDATE pour `authenticated` sur les nouvelles tables.

Les documents sensibles (CV, candidatures) restent hors buckets publics.
