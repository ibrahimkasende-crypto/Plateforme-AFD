/**
 * Actualités migrées depuis la source éditoriale afd-rdc.org.
 * Aucune date, auteur ni statistique inventés.
 * Utilisé comme secours local si Supabase ne contient pas encore ces articles.
 */

export type MigratedNewsArticle = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  /** Aperçu dépliable (≈100–150 mots), pas l’article complet. */
  preview: string;
  content: string;
  image_url: string | null;
  category: string | null;
  /** null = date non vérifiée — ne pas inventer. */
  published_at: string | null;
  author: string | null;
  source: "afd-rdc.org";
  migrationNote: string;
  themes: readonly string[];
};

const newsImages = {
  vbg: encodeURI("/images/afd/actualites/Urgence a Ituri.jpg"),
  economie: encodeURI("/images/afd/actualites/Expension AFD.jpg"),
  sante: encodeURI("/images/afd/actualites/Amelioration de la sante.jpg"),
} as const;

export const MIGRATED_NEWS_ARTICLES: readonly MigratedNewsArticle[] = [
  {
    id: "migrated-afd-actions-vbg-est-rdc",
    slug: "afd-actions-vbg-est-rdc",
    title: "L’AFD renforce ses actions contre les VBG dans l’Est de la RDC",
    excerpt:
      "L’Alliance des Femmes pour le Développement intensifie ses actions de protection, de sensibilisation et d’accompagnement des survivantes face aux violences basées sur le genre dans l’Est de la RDC.",
    preview:
      "Dans l’Est de la République démocratique du Congo, l’AFD renforce ses interventions liées à la protection et à la lutte contre les violences basées sur le genre. Les actions portent notamment sur la sensibilisation communautaire, l’accompagnement des survivantes et la promotion des droits des femmes et des filles. Cette orientation vise à améliorer l’accès à une réponse protectrice, digne et adaptée aux besoins des personnes concernées. Les contenus détaillés peuvent être complétés et validés depuis l’administration.",
    content: `## Contexte

L’Alliance des Femmes pour le Développement renforce ses actions contre les violences basées sur le genre dans l’Est de la République démocratique du Congo.

## Axes d’intervention

Les interventions s’articulent autour de :

- la sensibilisation des communautés ;
- l’accompagnement des survivantes ;
- la prévention des violences et des abus ;
- la promotion des droits et de la dignité des femmes et des filles.

## Suite éditoriale

Le détail opérationnel, les dates et les résultats mesurables seront publiés après validation institutionnelle. Les administrateurs peuvent compléter cet article depuis le Studio de publication.`,
    image_url: newsImages.vbg,
    category: "Protection",
    published_at: null,
    author: null,
    source: "afd-rdc.org",
    migrationNote:
      "Sujet éditorial migré depuis afd-rdc.org — date et auteur non vérifiés (laissés vides).",
    themes: [
      "protection",
      "VBG",
      "Est de la RDC",
      "sensibilisation",
      "accompagnement des survivantes",
    ],
  },
  {
    id: "migrated-formation-entrepreneuriale-kinshasa",
    slug: "formation-entrepreneuriale-kinshasa",
    title: "Lancement du programme de formation entrepreneuriale à Kinshasa",
    excerpt:
      "L’AFD lance un programme de formation entrepreneuriale à Kinshasa pour renforcer les compétences des femmes en gestion et en création d’activités économiques.",
    preview:
      "À Kinshasa, l’AFD met en avant un programme de formation entrepreneuriale destiné à renforcer l’autonomisation économique des femmes. L’approche privilégie l’acquisition de compétences en gestion, l’initiation à l’entrepreneuriat féminin et l’accompagnement vers des activités génératrices de revenus. Ce sujet institutionnel pourra être enrichi avec le calendrier, les modalités d’inscription et les résultats une fois ces informations officiellement validées.",
    content: `## Annonce

L’Alliance des Femmes pour le Développement annonce le lancement d’un programme de formation entrepreneuriale à Kinshasa.

## Thématiques

- autonomisation économique ;
- entrepreneuriat féminin ;
- formation ;
- gestion ;
- Kinshasa.

## Compléments à valider

Les dates de sessions, le nombre de participantes et les résultats seront ajoutés uniquement après validation officielle par l’équipe AFD.`,
    image_url: newsImages.economie,
    category: "Autonomisation économique",
    published_at: null,
    author: null,
    source: "afd-rdc.org",
    migrationNote:
      "Sujet éditorial migré depuis afd-rdc.org — aucune statistique inventée.",
    themes: [
      "autonomisation économique",
      "entrepreneuriat féminin",
      "formation",
      "gestion",
      "Kinshasa",
    ],
  },
  {
    id: "migrated-sensibilisation-sante-maternelle",
    slug: "sensibilisation-sante-maternelle",
    title:
      "Sensibilisation et accompagnement médical pour réduire la mortalité maternelle",
    excerpt:
      "L’AFD met l’accent sur la sensibilisation et l’accompagnement médical afin de contribuer à la réduction de la mortalité maternelle et au renforcement de la santé communautaire.",
    preview:
      "La santé maternelle constitue un axe prioritaire des actions de l’AFD. À travers la sensibilisation, l’orientation vers les soins et l’accompagnement communautaire, l’organisation contribue à renforcer l’accès des femmes aux informations et aux services essentiels. Cet article présente les orientations éditoriales du sujet ; les données chiffrées et le calendrier d’activités seront publiés uniquement lorsqu’ils auront été validés.",
    content: `## Orientation

L’AFD s’engage dans des actions de sensibilisation et d’accompagnement médical visant à contribuer à la réduction de la mortalité maternelle.

## Thématiques

- santé maternelle ;
- sensibilisation ;
- accompagnement médical ;
- prévention ;
- santé communautaire.

## Note de migration

Aucune date de publication, aucun auteur et aucune statistique n’ont été inventés lors de la migration éditoriale depuis afd-rdc.org.`,
    image_url: newsImages.sante,
    category: "Santé",
    published_at: null,
    author: null,
    source: "afd-rdc.org",
    migrationNote:
      "Sujet éditorial migré depuis afd-rdc.org — champs incertains laissés vides.",
    themes: [
      "santé maternelle",
      "sensibilisation",
      "accompagnement médical",
      "prévention",
      "santé communautaire",
    ],
  },
] as const;

export function getMigratedNewsArticles(): MigratedNewsArticle[] {
  return MIGRATED_NEWS_ARTICLES.map((article) => ({ ...article }));
}

export function getMigratedNewsBySlug(
  slug: string,
): MigratedNewsArticle | undefined {
  return MIGRATED_NEWS_ARTICLES.find((article) => article.slug === slug);
}
