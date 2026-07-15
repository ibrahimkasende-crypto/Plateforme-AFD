# Plateforme-ADF

Plateforme web de l'**Alliance des Femmes pour le Développement (AFD)**. Elle a pour objectif de présenter l'organisation, ses programmes et ses actions en République démocratique du Congo, tout en offrant un espace d'administration pour gérer les contenus du site.

> État actuel : prototype avancé / MVP. L'interface publique et l'administration sont largement développées, mais la base de données, la sécurité et la mise en production doivent encore être consolidées avant un lancement public.

## Objectif du site

La Plateforme-ADF est conçue pour :

- valoriser la mission, les valeurs et les résultats de l'AFD ;
- rendre accessibles les programmes, projets, actualités, partenaires et actions de terrain ;
- présenter les clusters et groupes de travail auxquels l'organisation contribue ;
- permettre au public d'envoyer un message, une demande d'adhésion ou une intention de don ;
- permettre aux administrateurs autorisés de mettre à jour le contenu sans modifier le code source.

## Fonctionnalités

### Site public

- Page d'accueil avec chiffres clés, programmes, actualités et partenaires
- Présentation de l'organisation et de son équipe
- Catalogue des programmes et pages de détail
- Catalogue des projets et pages de détail
- Actualités avec filtres et pages de détail
- Galerie médias avec filtres photo / vidéo
- Clusters et groupes de travail
- Formulaire de contact
- Formulaire de demande d'adhésion
- Page de don avec choix de devise et de moyen de paiement
- Thème clair / sombre
- Page 404

### Espace d'administration

- Connexion par email et mot de passe avec Supabase Auth
- Contrôle du rôle administrateur
- Tableau de bord
- Gestion des programmes
- Gestion des projets
- Gestion des actualités et de leur publication
- Gestion des partenaires
- Gestion de la galerie et import d'images
- Gestion des demandes d'adhésion
- Gestion des paramètres généraux du site

## Ce que le site est censé faire

Le site doit servir à la fois de **vitrine institutionnelle** et de **système léger de gestion de contenu** :

1. Un visiteur découvre l'AFD, ses domaines d'intervention et ses projets.
2. Il peut consulter les programmes, les projets réalisés ou en cours, les actualités et les partenaires.
3. Il peut contacter l'organisation, demander à adhérer ou manifester son intention de faire un don.
4. Un administrateur connecté gère les contenus affichés publiquement : création, modification, publication ou suppression.
5. Les données sont stockées dans Supabase, avec un accès public limité aux contenus publiés et un accès d'écriture réservé aux administrateurs.

## Technologies

- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Supabase Auth, Database et Storage
- ESLint
- Playwright (dépendance installée, tests à configurer)

## Architecture

```text
src/
├── admin/          # Authentification, pages et composants d'administration
├── components/     # Composants partagés : navigation, pied de page, carrousels…
├── contexts/       # Contexte de thème
├── hooks/          # Hooks personnalisés
├── lib/            # Client Supabase et données de secours
├── pages/          # Pages publiques
├── types/          # Types TypeScript métier
├── App.tsx         # Routes publiques et routes d'administration
└── main.tsx        # Point d'entrée de l'application

supabase/
└── migrations/     # Schéma et évolutions de la base de données
```

## Installation

### Prérequis

- Node.js 20 ou version ultérieure
- Un projet Supabase
- npm

### Démarrage local

```bash
cd D:\projet-adf-main\project
npm install
```

Créez ensuite un fichier `.env` à la racine du projet :

```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre_cle_anon_supabase
```

Lancez l'application :

```bash
npm run dev
```

## Commandes disponibles

```bash
npm run dev        # Serveur de développement Vite
npm run build      # Génération du build de production
npm run preview    # Prévisualisation du build de production
npm run lint       # Vérification ESLint
npm run typecheck  # Vérification TypeScript
```

## Base de données et sécurité

Supabase stocke les contenus, les demandes publiques et les comptes administrateurs.

Les principales tables prévues sont :

- `programmes`, `projets`, `actualites`
- `galerie`, `partenaires`, `membres_equipe`, `clusters`
- `membres`, `messages`, `dons`
- `parametres_site`, `administrateurs`

Les variables `VITE_*` sont exposées au navigateur par conception : seule la clé **anon** Supabase doit être utilisée côté frontend. Les clés de service, mots de passe et tokens secrets ne doivent jamais être ajoutés au dépôt.

## État actuel et limites connues

Les écrans et parcours principaux sont codés, mais les points suivants sont nécessaires avant une utilisation professionnelle :

- Unifier les migrations Supabase : certaines utilisent d'anciens noms anglais et d'autres des noms français.
- Aligner le schéma de `membres` et `dons` avec les champs réellement envoyés par les formulaires.
- Ajouter les politiques RLS permettant aux administrateurs autorisés de lire et modifier les contenus.
- Configurer le bucket Supabase Storage et ses politiques pour l'import sécurisé des images.
- Intégrer un véritable prestataire de paiement avant de considérer un don comme payé. La page de don actuelle ne réalise pas de transaction financière.
- Ajouter les images et logos attendus par l'interface.
- Installer les dépendances puis valider systématiquement le projet avec `typecheck`, `lint` et `build`.
- Mettre en place des tests automatisés, une intégration continue et un processus de déploiement.
- Ajouter une protection anti-spam et une validation serveur pour les formulaires publics.
- Finaliser les contenus institutionnels : coordonnées, réseaux sociaux, mentions légales et politique de confidentialité.

## Feuille de route recommandée

### Priorité 1 — rendre le produit fonctionnel et sûr

1. Choisir et appliquer un schéma Supabase unique.
2. Corriger les politiques RLS pour les rôles public et administrateur.
3. Vérifier tous les formulaires sur une base de données neuve.
4. Configurer Supabase Storage.
5. Ajouter les ressources graphiques manquantes.

### Priorité 2 — rendre le produit fiable

1. Mettre en place un paiement réel avec confirmation côté serveur.
2. Ajouter une gestion des messages et des dons dans l'administration.
3. Ajouter CAPTCHA / limitation de débit pour les formulaires publics.
4. Créer des tests unitaires et des tests de parcours utilisateur.

### Priorité 3 — rendre le projet professionnel

1. Renommer les éléments techniques restants avec `Plateforme-ADF`.
2. Ajouter un fichier `.env.example`.
3. Créer une CI GitHub Actions exécutant `lint`, `typecheck`, `build` et les tests.
4. Préparer les environnements de préproduction et de production.
5. Ajouter le suivi des erreurs, les sauvegardes et la documentation de déploiement.

## Validation avant publication

Après avoir installé les dépendances et configuré `.env` :

```bash
npm run typecheck
npm run lint
npm run build
npm run preview
```

Le projet ne doit être déployé que lorsque ces commandes réussissent et que les règles RLS ont été testées avec un compte public et un compte administrateur.
