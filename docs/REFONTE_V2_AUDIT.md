# Audit de refonte V2 — Plateforme AFD

Date : 15 juillet 2026
Périmètre audité : `src/`, `package.json` et les migrations `supabase/migrations/`. Aucune migration ni table n’a été modifiée pendant cet audit.

## 1. Pages publiques existantes

| Route | Page | État fonctionnel constaté |
| --- | --- | --- |
| `/` | `Home` | Lit programmes, actualités, partenaires et paramètres ; bascule sur des données de secours. |
| `/about` | `About` | Présentation, équipe et paramètres de site. |
| `/programs`, `/programs/:slug` | `Programs`, `ProgramDetail` | Listing et détail des programmes. |
| `/projects`, `/projects/:slug` | `Projects`, `ProjectDetail` | Listing, filtre et détail des projets. |
| `/clusters`, `/clusters/:type` | `Clusters` | Clusters et groupes de travail. |
| `/news`, `/news/:slug` | `News`, `NewsDetail` | Listing, filtre et détail des actualités. |
| `/gallery` | `Gallery` | Consultation de la médiathèque. |
| `/contact` | `Contact` | Envoie les messages vers `messages`. |
| `/membership` | `Membership` | Envoie les demandes vers `membres`. |
| `/donate` | `Donate` | Enregistre un don dans `dons`, mais marque actuellement un don comme `completed` sans prestataire de paiement. |
| `*` | `NotFound` | Page de secours. |

## 2. Pages administratives existantes

Toutes les pages sont protégées par `RouteProtegee` et utilisent `LayoutAdmin`.

- `/admin/login` : authentification e-mail / mot de passe Supabase.
- `/admin/dashboard` : indicateurs d’administration.
- `/admin/projets` : CRUD projets.
- `/admin/programmes` : CRUD programmes.
- `/admin/actualites` : CRUD actualités.
- `/admin/partenaires` : CRUD partenaires.
- `/admin/membres` : consultation et validation/rejet des demandes.
- `/admin/galerie` : CRUD des médias.
- `/admin/parametres` : gestion de paramètres du site.

## 3. Composants réutilisables

- À conserver : `ProgramImage`, `TeamCarousel`, `ImageUploader`, `RouteProtegee`, `LayoutAdmin`, `ThemeContext`, `ContexteAuth`, `useInView`, `useCountUp`.
- Ajoutés en V2 : primitives `src/components/ui/index.tsx` (boutons, champs, cartes, modal, drawer, tableau, états de retour, pagination et confirmation) et `src/layouts/PublicLayout.tsx`.
- Les anciens `Navbar` et `Footer` restent présents, mais ne sont plus utilisés par les routes publiques ; ils sont conservés pour une migration réversible.

## 4. Composants à remplacer progressivement

- `Navbar` et `Footer` : navigation, contraste, structure et liens institutionnels incomplets.
- Les formulaires publics dupliquent styles, gestion d’erreurs et états de soumission.
- Les pages administratives dupliquent modales, notifications, tableaux et boutons.
- `Home` regroupait données, chargements, présentation et une liste géographique en un seul fichier.
- `ThemeContext` et les styles `dark:*` sont cohérents avec l’ancienne interface mais ne font pas encore partie du système visuel V2.

## 5. Fonctionnalités Supabase déjà connectées

- Auth : session, connexion, déconnexion et contrôle du rôle dans `administrateurs`.
- Base : lecture publique de programmes, projets, actualités, galerie, clusters et paramètres ; formulaires contact, adhésion et dons ; gestion administrative de contenus.
- Storage : `ImageUploader` importe des images dans le bucket `gallery` et obtient une URL publique.
- Résilience : `queryWithRetry` retente certaines requêtes de lecture.
- Attention : les scripts auxiliaires et les migrations référencent plusieurs projets Supabase. `migrate.mjs` et `diagnostic.mjs` contiennent une clé anon en dur ; ils ne doivent pas être exécutés ni conserver cette clé avant la consolidation de l’environnement.

## 6. Données statiques ou de secours

`src/lib/fallbackData.ts` contient programmes, projets, équipe, partenaires, actualités, clusters et paramètres de secours. Ces données sont utilisées par plusieurs pages publiques lorsqu’une requête est vide ou échoue.

Restent directement statiques dans des composants : coordonnées de contact, messages institutionnels, montants indicatifs de dons, zones d’intervention, témoignage et contenus de navigation. Les nouveaux contenus de page d’accueil ont été centralisés dans `src/services/homeContent.ts`.

## 7. Incohérences frontend / base

1. Les migrations historiques décrivent des tables anglaises (`programs`, `news`, etc.), puis une migration les renomme en français. Le frontend cible les noms français.
2. La migration `20260224_setup_complet.sql` est la référence la plus proche du frontend, mais les migrations précédentes ne sont pas idempotentes entre elles et certaines ont des incohérences de syntaxe/ordre.
3. `Member` et le formulaire public attendent `full_name`, `gender`, `address`, `member_type`, alors que le schéma français le plus récent définit `first_name`, `last_name`, `profession`, `province`.
4. `Donation` et `Donate` attendent `donor_name`, `donor_email`, `donor_phone`, `payment_method` ; le schéma français le plus récent définit `first_name`, `last_name`, `email`, sans `payment_method`.
5. `GalleryItem` prévoit `program_id` et `project_id`, tandis que le schéma français récent prévoit `category` à la place.
6. Le type `News.category` limite les valeurs à `article | communique | evenement`, alors que les données initiales françaises insèrent `programme`, `activite` et `partenariat`.
7. Les politiques RLS publiées ne couvrent pas explicitement tous les droits CRUD d’administration. Le fonctionnement dépend donc de politiques déjà présentes en production ou d’une configuration non visible dans ce dépôt.
8. Les scripts `migrate.mjs`, `diagnostic.mjs` et les migrations ne pointent pas tous vers le même identifiant de projet Supabase.

## 8. Risques de régression

- Modifier les formulaires sans résoudre les écarts de schéma peut faire échouer les insertions.
- Changer les politiques RLS ou les migrations sans inventaire de l’instance Supabase peut interrompre l’administration.
- Le don est une intention enregistrée et non un paiement confirmé : son statut ne doit pas être assimilé à une transaction réelle.
- Le bucket `gallery` et ses politiques de stockage doivent être validés sur l’environnement connecté.
- Des clés anon et plusieurs identifiants de projet Supabase sont présents dans des scripts auxiliaires versionnés : risque de confusion d’environnement et de fuite de configuration.
- La conversion complète des noms de tables, composants et routes en une fois casserait de nombreux imports et liens partagés.
- Les données de secours peuvent masquer une panne Supabase ou un schéma incompatible sur l’interface publique.

## 9. Dépendances réellement utilisées

- Runtime : React 18, React DOM, React Router DOM, Supabase JS, Lucide React, Fontsource Inter.
- Build/style : Vite, TypeScript, Tailwind CSS, PostCSS, Autoprefixer.
- Qualité : ESLint, TypeScript ESLint, plugins React Hooks et React Refresh.
- Présente mais non observée dans `src/` : Playwright (à confirmer lorsque les tests E2E seront introduits).

## 10. Prochaines étapes ordonnées

1. Installer les dépendances et établir une baseline `typecheck`, `lint`, `build`.
2. Retirer les clés versionnées des scripts, créer un `.env.example`, puis valider l’unique projet Supabase cible et ses politiques RLS avant toute migration.
3. Centraliser les services Supabase typés par domaine, sans renommer les tables à ce stade.
4. Migrer progressivement les pages publiques vers les primitives UI et les données de service.
5. Refondre les formulaires publics avec contrats correspondant au schéma validé.
6. Faire évoluer l’administration vers `AdminLayout`, des tableaux, modales et notifications réutilisables.
7. Ajouter des tests de parcours pour navigation, auth admin, contenus, contact, adhésion et don.
8. Préparer une migration Supabase séparée, documentée et réversible pour résoudre les écarts identifiés.
