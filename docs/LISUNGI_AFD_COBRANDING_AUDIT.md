# Audit co-branding LISUNGI / AFD

Date : 2026-07-20  
Périmètre : espace administrateur + site public AFD

## Hiérarchie de marque cible

| Niveau | Entité | Rôle |
|--------|--------|------|
| Éditeur | Lisungi Hub | Startup éditrice (pas une ONG) |
| Produit | LISUNGI | SaaS de gestion humanitaire / organisationnelle |
| Client | AFD ASBL | Organisation utilisatrice (première instance) |

## Occurrences auditées

### Identité publique AFD — à conserver

| Emplacement | Occurrences | Décision |
|-------------|-------------|----------|
| `src/config/site.ts` | name, shortName, logo, description | Conserver |
| `src/app/layout.tsx` | metadata, favicon `/icon.png`, `/favicon.ico` | Conserver |
| `src/components/public/*` | header, footer, mobile nav | Conserver |
| Pages `(public)/*` | contenus institutionnels | Conserver |
| Mentions légales / confidentialité | AFD ASBL | Conserver |

### Identité organisation cliente — à conserver (admin)

| Emplacement | Avant | Décision |
|-------------|-------|----------|
| Sidebar (sous-bloc) | AFD comme titre principal | AFD = organisation active |
| Header | absent | Badge organisation active |
| Paramètres | « Paramètres du site » | Section Organisation |
| Rapports PDF | En-tête AFD | En-tête AFD (client) + pied LISUNGI |

### Identité produit — à remplacer par LISUNGI

| Emplacement | Avant | Après |
|-------------|-------|-------|
| `admin-sidebar.tsx` | Logo + « AFD ASBL » | Logo LISUNGI + titre produit |
| `connexion/page.tsx` | « Administration Plateforme-AFD » | « Connexion à LISUNGI » |
| `auth-brand-panel.tsx` | Logo AFD seul | Logo LISUNGI + logo AFD secondaire |
| `admin-dashboard-view.tsx` | Pas d’en-tête produit | « Bienvenue dans LISUNGI » |
| Metadata `/admin` | héritage Plateforme-AFD | `LISUNGI \| Administration AFD` |
| Exports PDF pied | « AFD ASBL — plateforme admin » | « Généré avec LISUNGI — un produit Lisungi Hub » |
| `siteConfig.appName` (admin only) | Plateforme-AFD | Non modifié public ; admin via `product-brand.ts` |

### Identité éditeur — à remplacer / introduire par Lisungi Hub

| Emplacement | Avant | Après |
|-------------|-------|-------|
| Pied sidebar | absent | « Un produit Lisungi Hub » |
| Connexion | « Alliance… R.D. Congo » | powered-by Lisungi Hub |
| Dashboard | — | « Propulsé par Lisungi Hub » (discret) |
| Paramètres produit | — | Éditeur + support |
| Page `/admin/abonnement` | — | Contact Support Lisungi Hub |

## Assets logos

| Asset | Chemin | Usage |
|-------|--------|-------|
| Logo AFD | `/assets/brand/Logo_AFD.jpeg` | Public + org active admin |
| Logo LISUNGI / Lisungi Hub | `/images/afd/LisungiHub/logo_lisungi.png` | Produit + éditeur admin |

## Fichiers de configuration créés

- `src/config/product-brand.ts`
- `src/config/organization-brand.ts`
- `src/config/platform-roles.ts`

## Risques maîtrisés

- Site public non modifié pour la marque produit
- Favicon public inchangé
- Auth / routes / Supabase non cassés
- Migrations progressives (pas de `db reset`)
