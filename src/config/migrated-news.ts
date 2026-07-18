/**
 * Actualités institutionnelles AFD (source éditoriale afd-rdc.org / contenus validés).
 * Images : public/images/afd/actualites
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
  published_at: string | null;
  author: string | null;
  source: "afd-rdc.org";
  migrationNote: string;
  themes: readonly string[];
};

const newsImages = {
  sante: encodeURI("/images/afd/actualites/Amelioration de la sante.jpg"),
  ituri: encodeURI("/images/afd/actualites/Urgence a Ituri.jpg"),
  expansion: encodeURI("/images/afd/actualites/Expension AFD.jpg"),
} as const;

export const MIGRATED_NEWS_ARTICLES: readonly MigratedNewsArticle[] = [
  {
    id: "migrated-lutte-contre-ebola",
    slug: "lutte-contre-ebola-sensibilisation-prevention",
    title:
      "Lutte contre Ebola : l’AFD ASBL renforce la sensibilisation et la prévention communautaire",
    excerpt:
      "Face aux risques épidémiques, l’AFD ASBL mobilise les communautés autour de la prévention, de l’information et de la protection, avec une attention particulière aux femmes, aux filles et aux familles.",
    preview:
      "Dans le cadre de la lutte contre Ebola, l’AFD ASBL renforce ses actions de sensibilisation et de prévention communautaire. L’approche privilégie l’information claire, l’adoption de gestes protecteurs et l’orientation vers les services de santé, afin de limiter la propagation et de protéger les femmes, les filles et les communautés les plus exposées.",
    content: `## Contexte

L’Alliance des Femmes pour le Développement (AFD ASBL) s’engage dans la lutte contre Ebola à travers des actions de sensibilisation, de prévention et d’accompagnement communautaire.

Les épidémies mettent sous pression les familles, les structures de santé et les dynamiques communautaires. Les femmes et les filles, souvent en première ligne des soins et de la vie familiale, doivent être pleinement prises en compte dans les réponses de prévention.

## Notre approche

L’AFD ASBL agit pour :

- diffuser des messages de prévention adaptés et compréhensibles ;
- renforcer les pratiques d’hygiène et les gestes barrières au niveau communautaire ;
- faciliter l’orientation vers les services de santé en cas de symptômes ou de suspicion ;
- protéger la dignité et la sécurité des femmes, des filles et des familles ;
- soutenir le dialogue avec les leaders et les acteurs communautaires.

## Axes prioritaires

### Sensibilisation

Des séances d’information permettent d’expliquer les modes de transmission, les signes d’alerte et les conduites à tenir, afin de réduire les rumeurs et de favoriser des décisions éclairées.

### Prévention

La prévention communautaire s’appuie sur l’hygiène, la protection des ménages et la mobilisation des relais locaux pour faire adopter des comportements protecteurs au quotidien.

### Accompagnement

L’AFD ASBL accompagne les communautés pour qu’elles puissent accéder à temps à l’information et aux services utiles, tout en veillant à ne pas stigmatiser les personnes concernées.

## Attention aux femmes et aux filles

Dans les contextes épidémiques, les femmes assurent souvent une part importante des soins familiaux et de l’organisation du quotidien. Les actions de l’AFD intègrent cette réalité pour renforcer leur protection, leur accès à l’information et leur participation aux réponses communautaires.

## Engagement

La lutte contre Ebola exige une réponse collective, claire et responsable. L’AFD ASBL poursuit son engagement aux côtés des communautés pour prévenir, informer et protéger, dans le respect de la dignité de chaque personne.`,
    image_url: newsImages.sante,
    category: "Article",
    published_at: "2026-07-16T08:00:00.000Z",
    author: null,
    source: "afd-rdc.org",
    migrationNote:
      "Sujet réorienté vers la lutte contre Ebola — image Amelioration de la sante.jpg.",
    themes: [
      "Ebola",
      "prévention",
      "sensibilisation",
      "santé communautaire",
      "protection",
    ],
  },
  {
    id: "migrated-urgence-ituri-ceca-20-makoko",
    slug: "urgence-ituri-deplaces-ceca-20-makoko-mambasa",
    title:
      "Urgence en Ituri : L’AFD évalue les besoins des déplacés du site CECA-20 MAKOKO à Mambasa",
    excerpt:
      "Face à la crise humanitaire en Ituri, l’équipe de l’AFD ASBL s’est rendue sur le site de déplacés CECA-20 MAKOKO pour identifier les besoins critiques en protection, santé, WASH et VBG.",
    preview:
      "En Ituri, l’AFD ASBL a évalué les besoins des personnes déplacées sur le site CECA-20 MAKOKO à Mambasa. Cette mission vise à identifier les priorités critiques en protection, santé, WASH et violences basées sur le genre, afin d’orienter une réponse humanitaire adaptée aux réalités du terrain et aux besoins spécifiques des femmes et des filles.",
    content: `## Contexte

Face à la crise humanitaire en Ituri, l’équipe de l’AFD ASBL s’est rendue sur le site de déplacés CECA-20 MAKOKO à Mambasa.

## Objectif de la mission

Évaluer les besoins des populations déplacées et identifier les priorités d’intervention.

## Domaines évalués

- protection ;
- santé ;
- eau, hygiène et assainissement (WASH) ;
- violences basées sur le genre (VBG).

## Orientation

Cette évaluation permet d’orienter une réponse humanitaire attentive à la dignité et aux besoins spécifiques des femmes et des filles.`,
    image_url: newsImages.ituri,
    category: "Article",
    published_at: "2026-06-03T08:00:00.000Z",
    author: null,
    source: "afd-rdc.org",
    migrationNote:
      "Contenu institutionnel publié — image Urgence a Ituri.jpg.",
    themes: [
      "Ituri",
      "Mambasa",
      "déplacés",
      "protection",
      "WASH",
      "VBG",
      "santé",
    ],
  },
  {
    id: "migrated-expansion-maillage-7-provinces",
    slug: "expansion-afd-maillage-territorial-7-provinces",
    title:
      "Expansion de l’AFD ASBL : Un maillage territorial renforcé à travers 7 provinces de la RDC",
    excerpt:
      "De Kinshasa à la Tshuapa, découvrez comment l’AFD ASBL déploie ses bureaux de représentation pour être au plus près des communautés rurales et urbaines.",
    preview:
      "L’AFD ASBL renforce son maillage territorial à travers sept provinces de la République démocratique du Congo. De Kinshasa à la Tshuapa, le déploiement de bureaux de représentation vise à rapprocher l’action de l’organisation des communautés rurales et urbaines, pour une présence plus proche, plus réactive et mieux ancrée dans les réalités locales.",
    content: `## Annonce

L’AFD ASBL renforce son maillage territorial à travers sept provinces de la République démocratique du Congo.

## Déploiement

De Kinshasa à la Tshuapa, l’organisation déploie des bureaux de représentation afin d’être au plus près des communautés rurales et urbaines.

## Finalité

Ce renforcement territorial vise à améliorer la proximité, la coordination et la qualité des interventions auprès des femmes, des filles et des communautés accompagnées.`,
    image_url: newsImages.expansion,
    category: "Article",
    published_at: "2026-05-09T08:00:00.000Z",
    author: null,
    source: "afd-rdc.org",
    migrationNote:
      "Contenu institutionnel publié — image Expension AFD.jpg.",
    themes: [
      "expansion",
      "maillage territorial",
      "provinces",
      "Kinshasa",
      "Tshuapa",
    ],
  },
] as const;

export function getMigratedNewsArticles(): MigratedNewsArticle[] {
  return MIGRATED_NEWS_ARTICLES.map((article) => ({ ...article })).sort(
    (a, b) => {
      const da = a.published_at ? Date.parse(a.published_at) : 0;
      const db = b.published_at ? Date.parse(b.published_at) : 0;
      return db - da;
    },
  );
}

export function getMigratedNewsBySlug(
  slug: string,
): MigratedNewsArticle | undefined {
  return MIGRATED_NEWS_ARTICLES.find((article) => article.slug === slug);
}
