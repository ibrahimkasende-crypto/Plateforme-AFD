# Audit d’alignement d’architecture — Plateforme-AFD

**Date :** 17 juillet 2026  
**Branche :** `reconstruction-nextjs`  
**Chemin :** `D:\Plateforme-AFD\AFD`

---

## 1. Routes existantes

| Route | Fichier | État |
|-------|---------|------|
| `/` | `src/app/page.tsx` | Placeholder Create Next App |
| Root layout | `src/app/layout.tsx` | Metadata générique, `lang="en"` |

Aucune route publique métier ni route `/admin/*` dans le socle Next.js actuel.

**Routes historiques (Vite, supprimées du code, présentes dans l’historique git) :**  
`/`, `/about`, `/programs`, `/projects`, `/clusters`, `/news`, `/gallery`, `/contact`, `/membership`, `/donate`, `/admin/*`.

---

## 2. Composants existants

| Zone | État |
|------|------|
| `src/components/` | Absent (composants Vite supprimés) |
| `src/features/` | Absent |
| `src/providers/` | Absent |
| Charts / forms / UI | Dépendances installées, aucun composant |

Assets de marque présents : `public/images/adf-logo.jpg`, `adf1.jpg`, `adf2.png`.

---

## 3. Services existants

| Service | État |
|---------|------|
| Services Vite (`contentService`, `dashboardService`, etc.) | Supprimés |
| Clients Supabase SSR Next.js | Absents |
| Edge Function `supabase/functions/submit-contact` | Présente, non branchée |

---

## 4. Pages fonctionnelles

Aucune page métier fonctionnelle dans le socle Next.js.  
Supabase (migrations + types) et dépendances npm sont prêts.

---

## 5. Pages temporaires

- `src/app/page.tsx` : placeholder Next.js (à remplacer).
- Concept documenté `AdminModulePlaceholder` (Vite) : non reconstruit.

---

## 6. Modules Supabase connectés

**Types dans `src/types/database.types.ts` :**  
`actualites`, `administrateurs`, `clusters`, `dons`, `galerie`, `membres`, `membres_equipe`, `messages`, `parametres_site`, `partenaires`, `programmes`, `projets` (+ tables backup).

**Migrations RBAC (phase 4) :**  
`profils_administrateurs`, `roles`, `permissions`, `roles_permissions`, `utilisateurs_roles` — présentes en SQL, absentes des types générés.

**Connexion runtime Next.js :** non branchée.

---

## 7. Données encore statiques

- Contenu marketing Create Next App sur `/`.
- Aucun `fallbackData` métier reconstruit.
- Seeds SQL historiques dans migrations (côté DB uniquement).

---

## 8. Doublons

| Élément | Problème |
|---------|----------|
| `eslint.config.js` + `eslint.config.mjs` | Config legacy Vite + Next |
| `dist/` | Artefact build Vite |
| Lignées migrations EN / rename / `setup_complet` | Redondance historique |

---

## 9. Fichiers mal placés

- `screenshot_*.png`, `test.js`, `test-screenshot.mjs` à la racine
- `diagnostic.mjs`, `migrate.mjs` (désactivés)
- `.bolt/`
- `docs/schema-distant.sql` vide

---

## 10. Dépendances inutilisées (dans `src/` actuel)

Toutes les deps métier (`@supabase/*`, `@tanstack/react-query`, `recharts`, `lucide-react`, `motion`, `zod`, `react-hook-form`, `sonner`) sont installées mais non importées. Elles restent **nécessaires** pour l’alignement.

---

## 11. Risques de régression

1. Remplacer les anciennes URLs Vite sans redirections → 404 pour liens externes.
2. Modifier des migrations déjà appliquées → interdit.
3. Créer des tables homonymes sans audit → conflit schéma distant.
4. Exposer `service_role` ou secrets SerdiPay côté client.
5. Afficher des chiffres démo comme données réelles.
6. Confirmer un paiement sans webhook serveur.

---

## 12. Plan de réorganisation

1. Documenter l’existant (ce fichier).
2. Centraliser config (site, nav publique/admin, rôles, permissions, statuts).
3. Créer design system + layouts + providers.
4. Aligner routes publiques `(public)/` et admin `/admin`.
5. Préparer features (newsletter, dons, paiements SerdiPay, stats, rapports).
6. Centraliser services / repositories.
7. Documenter schéma cible Supabase (non destructif).
8. Pages temporaires professionnelles.
9. Valider typecheck, lint, build.
10. Commit local + push vers le dépôt GitHub cible.

**Règle :** ne pas supprimer de fichiers utiles avant alignement ; ne pas casser Supabase.

