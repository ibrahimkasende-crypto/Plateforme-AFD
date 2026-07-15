# Refonte V2 — Phase 2 : pages publiques

## Pages terminées dans cette itération

- `/organisation` et les sections dédiées histoire, mission/valeurs et gouvernance.
- `/organisation/equipe`, connecté à `membres_equipe` avec données de secours.
- `/programmes`, connecté à `programmes` avec recherche.
- `/impact`, connecté aux paramètres et partenaires.
- `/partenaires`, connecté à `partenaires` avec filtre.
- `/mentions-legales` et `/politique-confidentialite`.
- Page 404 modernisée.
- Alias français non destructifs : `/programmes`, `/projets`, `/actualites`, `/mediatheque`, `/adhesion` et `/don`.

## Composants et services créés

- `src/components/common/index.tsx` : hero, fil d’Ariane, cartes de contenus, filtres, galerie, CTA, états de formulaire et skeleton.
- `src/services/contentService.ts` : accès centralisé aux contenus Supabase avec données de secours.
- `src/hooks/useContentResource.ts` : cycle chargement/résultat/erreur.
- `src/hooks/usePageMeta.ts` : titres et métadonnées Open Graph réutilisables.
- `src/services/institutionalContent.ts` : contenus institutionnels temporaires centralisés.

## Données encore statiques

- Présentation institutionnelle, valeurs, témoignage, zones d’intervention et mentions légales à valider.
- Coordonnées complètes, responsables légaux, hébergeur, réseaux sociaux et informations de gouvernance.
- Les données de secours de `fallbackData.ts` restent utilisées lorsque Supabase est vide ou indisponible.

## Formulaires

- Le parcours de don enregistre désormais une intention `pending` et ne prétend plus confirmer un paiement.
- Les formulaires contact et adhésion conservent le contrat de données existant, car le schéma Supabase doit être validé avant toute évolution non compatible.

## Limites et recommandations

- Les détails programmes, projets, actualités, la médiathèque et les formulaires publics doivent encore être harmonisés avec les composants communs dans l’itération suivante.
- Aucun paiement réel, aucune inscription newsletter et aucune protection anti-robot ne sont encore connectés.
- Les informations légales et institutionnelles marquées comme à compléter doivent être fournies par l’AFD.
- L’administration doit ensuite adopter les composants partagés et des services typés, sans modifier les politiques RLS avant la validation du schéma.

## Validation effectuée

- `npm run typecheck` : succès.
- `npm run lint` : succès avec 13 avertissements préexistants.
- `npm run build` : succès, avec avertissement de bundle JavaScript supérieur à 500 kB.
