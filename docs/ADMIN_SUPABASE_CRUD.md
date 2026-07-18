# CRUD Supabase — conventions admin

## Pattern
1. `requirePermission("domaine:read|write")`
2. Query `getAdmin*` via `createClientSafe`
3. Formulaire `<form action={save*}>`
4. Zod + insert/update
5. `revalidatePath` (+ tags publics si besoin)

## Colonnes présentation
`is_demo`, `demo_batch_id` sur lignes de démo uniquement.
