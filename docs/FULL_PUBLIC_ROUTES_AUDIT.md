# Audit complet — routes publiques & header AFD

Date : 2026-07-18  
Projet : `D:\Plateforme-AFD\AFD`  
Source navigation : `src/config/public-navigation.ts`  
Règle : **aucune suppression avant cet audit** (respectée).

---

## 1. Liste exacte des onglets et sous-onglets du header

### Accueil
| Sous-onglet | Route |
|---|---|
| — | `/` |

### Qui sommes-nous
| Sous-onglet | Route |
|---|---|
| Présentation de l’AFD | `/qui-sommes-nous` |
| Notre histoire | `/qui-sommes-nous/histoire` |
| Mission, vision et valeurs | `/qui-sommes-nous/mission-vision-valeurs` |
| Gouvernance | `/qui-sommes-nous/gouvernance` |
| Équipe | `/qui-sommes-nous/equipe` |
| Organigramme | `/qui-sommes-nous/organigramme` |
| Politiques et engagements | `/qui-sommes-nous/politiques-engagements` |

### Nos actions
| Sous-onglet | Route |
|---|---|
| (hub) | `/actions` |
| Domaines d’intervention | `/actions/domaines-intervention` |
| Programmes | `/actions/programmes` |
| Projets | `/actions/projets` |
| Réponses d’urgence | `/actions/urgences` |
| Zones d’intervention | `/actions/zones-intervention` |
| Clusters et groupes de travail | `/actions/clusters` |

### Notre impact
| Sous-onglet | Route |
|---|---|
| Vue générale | `/impact` |
| Résultats | `/impact/resultats` |
| Histoires d’impact | `/impact/histoires` |
| Témoignages | `/impact/temoignages` |
| Rapports et publications | `/impact/rapports` |

### Actualités
| Sous-onglet | Route |
|---|---|
| — | `/actualites` |

### Ressources
| Sous-onglet | Route |
|---|---|
| (hub) | `/ressources` |
| Médiathèque | `/ressources/mediatheque` |
| Documents | `/ressources/documents` |
| Rapports | `/impact/rapports` (lien croisé) |
| Appels d’offres | `/ressources/appels-offres` |
| Opportunités | `/ressources/opportunites` |
| Newsletter | `/ressources/newsletter` |

### Contact
| Sous-onglet | Route |
|---|---|
| — | `/contact` |

### Actions principales (CTAs / footer)
| Action | Route |
|---|---|
| Nous rejoindre | `/rejoindre-equipe` |
| Soutenir l’AFD | `/soutenir` |
| Adhésion | `/adhesion` |
| Partenariat | `/partenariat` |
| Partenaires | `/partenaires` |
| Recherche | `/recherche` |

### Pages légales
| Page | Route |
|---|---|
| Mentions légales | `/mentions-legales` |
| Politique de confidentialité | `/politique-confidentialite` |

---

## 2. Tableau d’audit détaillé

| Onglet | Sous-onglet | Route | Page existante | Contenu disponible | Source données | CRUD admin | Statut | Actions nécessaires |
|---|---|---|---|---|---|---|---|---|
| Accueil | — | `/` | Oui | Hero, stats, piliers, zones, impact, opportunités, newsletter, partenaires | Supabase + `home-content` | Partiel (publications) | **OK partiel** | Migrer KPI / intro hors constantes |
| Qui sommes-nous | Présentation | `/qui-sommes-nous` | Oui | Texte institutionnel | `institutional-content` | Non | **Statique** | Table `pages` + CRUD |
| Qui sommes-nous | Histoire | `/qui-sommes-nous/histoire` | Oui | Chronologie | Config | Non | **Statique** | Idem |
| Qui sommes-nous | Mission / vision / valeurs | `/qui-sommes-nous/mission-vision-valeurs` | Oui | Blocs texte | Config | Non | **Statique** | Idem |
| Qui sommes-nous | Gouvernance | `/qui-sommes-nous/gouvernance` | Oui | Instances | Config | Non | **Statique** | Table gouvernance + CRUD |
| Qui sommes-nous | Équipe | `/qui-sommes-nous/equipe` | Oui | Membres ou EmptyState | `membres_equipe` | Placeholder admin | **Partiel** | Finaliser CRUD `/admin/equipe` |
| Qui sommes-nous | Organigramme | `/qui-sommes-nous/organigramme` | Oui | Structure | Config | Non | **Statique** | Lier départements Supabase |
| Qui sommes-nous | Politiques | `/qui-sommes-nous/politiques-engagements` | Oui | Liste politiques | Config | Non | **Statique** | Documents liés + CRUD |
| Nos actions | Hub | `/actions` | Oui | Cartes de navigation | Hardcode page | Non | **Statique** | Pages CMS |
| Nos actions | Domaines | `/actions/domaines-intervention` | Oui (+ `[slug]`) | Domaines | Supabase + fallback config | Studio partiel | **OK** | CRUD domaines complet |
| Nos actions | Programmes | `/actions/programmes` | Oui (+ `[slug]`) | Liste / détail | Supabase | Studio liste | **OK** | CRUD création/édition riche |
| Nos actions | Projets | `/actions/projets` | Oui (+ `[slug]`) | Liste / détail | Supabase | Placeholder `/admin/projets` | **OK public** | CRUD admin complet |
| Nos actions | Urgences | `/actions/urgences` | Oui | Projets filtrés + texte | Supabase + hardcode | Non dédié | **Partiel** | Page CMS + filtre |
| Nos actions | Zones | `/actions/zones-intervention` | Oui | Carte + provinces | Supabase / demo flag | Studio zones | **OK** | Enrichir fiches provinces |
| Nos actions | Clusters | `/actions/clusters` | Oui | Liste | Supabase | Placeholder | **Partiel** | CRUD clusters |
| Notre impact | Vue générale | `/impact` | Oui | Stats + hubs | Supabase + hardcode | Studio impact | **Partiel** | Chiffres validés uniquement |
| Notre impact | Résultats | `/impact/resultats` | Oui | Stats + EmptyState | Supabase | Studio | **Partiel** | Indicateurs détaillés |
| Notre impact | Histoires | `/impact/histoires` | Oui | **EmptyState uniquement** | Aucune query | Studio stub | **VIDE** | Query + liste + détail + CRUD |
| Notre impact | Témoignages | `/impact/temoignages` | Oui | **EmptyState uniquement** | Aucune | Non | **VIDE** | Table + CRUD + page |
| Notre impact | Rapports | `/impact/rapports` | Oui (+ `[slug]`) | Documents type rapport | Supabase `documents` | Studio docs/rapports | **OK** | — |
| Actualités | Liste | `/actualites` | Oui (+ `[slug]`) | Articles | Supabase | Studio actualités | **OK** | Enrichir relations |
| Ressources | Hub | `/ressources` | Oui | Cartes | Hardcode | Non | **Statique** | CMS |
| Ressources | Médiathèque | `/ressources/mediatheque` | Oui | Galerie | Supabase `galerie`/`medias` | Médiathèque admin | **OK** | Unifier sur `medias` |
| Ressources | Documents | `/ressources/documents` | Oui (+ `[slug]`) | Documents publics | Supabase | Studio documents | **OK** | — |
| Ressources | Appels d’offres | `/ressources/appels-offres` | Oui | **EmptyState** ; `[slug]` → `notFound()` | Aucune | Studio stub | **VIDE** | Table + CRUD + pages |
| Ressources | Opportunités | `/ressources/opportunites` | Oui (+ postuler) | Offres | Supabase | CRUD opportunites | **OK** | — |
| Ressources | Newsletter | `/ressources/newsletter` | Oui | Formulaire | Config + écriture | Placeholder newsletter | **OK public** | Admin abonnés |
| Contact | — | `/contact` | Oui | Formulaire | site + `messages` | Placeholder messages | **OK public** | Admin messages |
| CTA | Adhésion | `/adhesion` | Oui | Formulaire | `membres` | Placeholder | **OK public** | Admin adhésions |
| CTA | Partenariat | `/partenariat` | Oui | Formulaire | hardcode + table | Non | **OK public** | Admin demandes |
| CTA | Soutenir | `/soutenir` | Oui | Formulaire | `dons` | Placeholder | **OK public** | Admin dons |
| CTA | Rejoindre | `/rejoindre-equipe` | Oui | Offres + spontanée | Supabase | Opportunités | **OK** | Ajouter metadata SEO |
| CTA | Recherche | `/recherche` | Oui | Multi-tables | Supabase | — | **OK** | — |
| Footer | Partenaires | `/partenaires` | Oui | Logos | Supabase | CRUD partenaires | **OK** | Upload Storage |
| Légal | Mentions | `/mentions-legales` | Oui | Texte | Hardcode | Non | **Partiel** | Siège à renseigner + CMS |
| Légal | Confidentialité | `/politique-confidentialite` | Oui | Texte | Hardcode | Non | **OK** | CMS optionnel |

---

## 3. Pages temporaires / vides (priorité)

### Public — vides ou stubs
1. `/impact/histoires` — EmptyState, pas de query  
2. `/impact/histoires/[slug]` — `notFound()` stub  
3. `/impact/temoignages` — EmptyState  
4. `/ressources/appels-offres` — EmptyState  
5. `/ressources/appels-offres/[slug]` — `notFound()` stub  

### Public — aucun `ModulePlaceholder`
Confirmé : **0** page publique n’utilise `ModulePlaceholder`.

### Admin — encore en `ModulePlaceholder` (29+)
Programmes, projets, activités, bénéficiaires, indicateurs, zones, finances, clusters, équipe, départements, newsletter (×6), messages, adhésions, dons (×4), statistiques, rapports (×3), utilisateurs, roles, paramètres, journal-activite.

---

## 4. Tables / buckets existants

### Tables typées (`database.types.ts`)
`actualites`, `administrateurs`, `clusters`, `dons`, `galerie`, `medias`, `membres`, `membres_equipe`, `messages`, `parametres_site`, `partenaires`, `programmes`, `projets`, `opportunites`, `candidatures`, `documents`, `documents_candidature`, `telechargements_documents`, `categories_documents`

### Tables migrations (pas toutes typées)
`abonnes_newsletter`, `domaines_intervention`, `chiffres_impact`, `histoires_impact`, `journal_publication`, `zones_intervention`, `departements`, `roles`, `permissions`, `utilisateurs_roles`, `journal_activite`, …

### Manquantes pour la demande complète
`pages`, `sections_pages`, `blocs_contenu`, `temoignages`, `appels_offres`, `gouvernance`, `politiques`, `enquetes`, `questions_enquete`, `options_questions`, `reponses_enquete`, `reponses_questions`, `agents_terrain`, …

### Buckets (migration 008)
`site-public`, `programmes`, `projets`, `actualites`, `histoires-impact`, `zones-intervention`, `equipe`, `partenaires`, `opportunites`, `appels-offres`, `documents-publics`, `rapports-publics`, `documents-prives`, `candidatures-privees`

---

## 5. Plan d’exécution (ordre)

1. ~~Audit~~ (ce document)  
2. Corriger pages publiques **vides** (histoires, témoignages, appels d’offres)  
3. Migration non destructive : `temoignages`, `appels_offres`, `pages`/`sections_pages`, enquêtes, agents  
4. Connecter queries publiques → EmptyState professionnel  
5. CRUD admin manquants (priorité contenu public)  
6. Utilisateurs / rôles / agents  
7. Module enquêtes  
8. Migrer contenus `institutional-content` vers `pages`  
9. SEO `generateMetadata` manquants  
10. Tests e2e + typecheck/lint/build  
11. Commit local (sans push)

---

## 6. Synthèse

| Indicateur | Valeur |
|---|---|
| Onglets header | 7 (+ CTAs) |
| Sous-onglets header | 26 |
| Routes publiques page.tsx | ~47 |
| Pages publiques en placeholder | **0** |
| Pages publiques vides / stubs | **5** |
| Pages quasi-statiques (config) | ~10 |
| Admin encore placeholder | **~29** |
| CRUD studio publications | Partiel (12 routes) |

**Conclusion :** le header ne mène pas à des 404, mais plusieurs sections restent vides ou purement statiques, et la majorité du CRUD admin n’est pas finalisée. La suite commence par les 5 pages publiques vides + fondations dynamiques.
