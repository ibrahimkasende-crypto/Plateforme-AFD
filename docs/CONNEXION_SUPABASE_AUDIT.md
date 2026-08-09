# Audit de connexion Supabase — Next.js

## État actuel

- Next.js App Router ne contient actuellement que `src/app/layout.tsx`, `page.tsx` et `globals.css`.
- Aucune page métier, formulaire public, client Supabase SSR, service de données ou authentification Next.js n’est encore présent.
- Les migrations et une Edge Function Deno historiques sont conservées dans `supabase/` mais ne sont pas encore reliées au nouveau socle.

## Variables

- `.env.local` utilise le Project URL et la Publishable key fournis.
- Aucune clé `service_role`, mot de passe PostgreSQL ou URL de connexion directe n’est présente.
- `.env.example` ne contient que des emplacements publics.

## Tables attendues

Les migrations locales mentionnent notamment `programmes`, `projets`, `actualites`, `galerie`, `membres_equipe`, `partenaires`, `clusters`, `membres`, `dons`, `messages`, `parametres_site`, `administrateurs` et les tables RBAC phase 4.

Le schéma distant reste à récupérer avec Supabase CLI avant de créer les requêtes Next.js.

## Risques

- Le dépôt contient plusieurs lignées de migrations et le schéma distant peut différer.
- Les anciennes routes et formulaires React/Vite ont été retirés du socle principal ; rien ne doit être reconnecté en supposant les anciens champs.
- La CLI doit être liée et authentifiée avant `db pull` et génération des types.

