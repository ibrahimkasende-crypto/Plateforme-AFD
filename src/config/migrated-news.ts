/**
 * Actualités institutionnelles AFD (source éditoriale afd-rdc.org / contenus validés).
 * Images : banque AFD classée, sélectionnées selon le sujet de chaque article.
 */
import { afdBankImage } from "@/config/afd-images";

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
  source: "afd-rdc.org" | "rapport-terrain-afd";
  migrationNote: string;
  themes: readonly string[];
};

const newsImages = {
  capPreparation: afdBankImage(
    "02_education/afd_education_preparation_enquete_cap_enfants_deplaces_kinshasa_2026_002.jpeg",
  ),
  capFormation: afdBankImage(
    "02_education/afd_education_formation_enqueteurs_cap_enfants_deplaces_kinshasa_2026_001.jpeg",
  ),
  mveTshopo: afdBankImage(
    "01_sante/afd_sante_reunion_suivi_evaluation_mve_dps_tshopo_2026_001.jpeg",
  ),
  plaidoyerSantePublique: afdBankImage(
    "21_plaidoyer/afd_plaidoyer_mobilisation_osc_loi_sante_publique_kinshasa_2026_001.jpeg",
  ),
  santeIntimeGogynax: afdBankImage(
    "01_sante/afd_sante_sensibilisation_sante_intime_femmes_gogynax_2026_004.jpeg",
  ),
  sante: afdBankImage(
    "01_sante/afd_sante_sensibilisation_cpn_salama_011.jpg",
  ),
  ituri: afdBankImage(
    "17_missions_terrain/afd_missions_terrain_visite_evaluation_site_deplaces_site_ceca_20_makoko_1_010.jpg",
  ),
  expansion: afdBankImage(
    "24_visites_institutionnelles/afd_visites_institutionnelles_visite_mcz_hgr_mambasa_012.jpg",
  ),
} as const;

export const MIGRATED_NEWS_ARTICLES: readonly MigratedNewsArticle[] = [
  {
    id: "field-sante-intime-gogynax",
    slug: "sensibilisation-sante-intime-femmes-gogynax",
    title:
      "Santé intime des femmes : une sensibilisation axée sur la prévention et la dignité",
    excerpt:
      "L’AFD documente une séance d’information consacrée à la santé intime des femmes, avec des échanges communautaires autour de la prévention, de la dignité et de l’accès à des produits adaptés.",
    preview:
      "Cette activité met en avant la santé intime des femmes comme un enjeu de prévention, de dignité et d’accès à l’information. Les images montrent une rencontre avec les participantes, des échanges en salle et la présentation de supports Gogynax liés à la prévention des infections.",
    content: `## Contexte

L’AFD ASBL documente une activité de sensibilisation consacrée à la santé intime des femmes. Les supports visibles pendant la rencontre mettent l’accent sur la prévention, l’information et l’accès à des produits adaptés.

## Déroulement

La séance a réuni des femmes autour d’échanges pratiques animés en salle. Les intervenants ont présenté des messages de prévention et des supports liés à la santé intime, afin de renforcer la compréhension des participantes et de favoriser des choix éclairés.

## Enjeu pour l’AFD

La santé des femmes est directement liée à leur dignité, à leur autonomie et à leur participation sociale. Cette archive permettra de conserver la preuve visuelle de l’activité et de compléter les informations exactes dans le dashboard lorsque la date et le lieu définitifs seront validés.`,
    image_url: newsImages.santeIntimeGogynax,
    category: "Santé",
    published_at: "2026-08-04T08:00:00.000Z",
    author: "AFD ASBL",
    source: "rapport-terrain-afd",
    migrationNote:
      "Lot photo renommé depuis Nauveau/18-25 — date et lieu exacts à confirmer dans le dashboard.",
    themes: ["santé intime", "femmes", "prévention", "dignité"],
  },
  {
    id: "field-mobilisation-osc-loi-sante-publique",
    slug: "mobilisation-osc-revision-loi-sante-publique",
    title:
      "L’AFD participe à la mobilisation des OSC sur la loi relative à la santé publique",
    excerpt:
      "L’AFD ASBL a pris part à une mobilisation des organisations de la société civile sur la révision de l’article 81, alinéa 2, afin de soutenir des dispositions plus réalistes et accessibles.",
    preview:
      "Lors d’une matinée organisée par la CGND avec Si Jeunesse Savait, les OSC ont échangé sur la modification de la loi relative à la santé publique. L’enjeu principal portait sur l’accès aux méthodes de contraception non réversibles dans les zones où les médecins spécialisés sont peu disponibles.",
    content: `## Contexte

L’AFD ASBL a participé à la matinée de mobilisation des organisations de la société civile sur la proposition de modification de la loi relative à la santé publique, organisée par la CGND avec Si Jeunesse Savait.

## Points clés

Les échanges ont principalement porté sur l’article 81, alinéa 2, notamment l’exigence actuelle liée à l’avis de plusieurs médecins pour certaines méthodes de contraception non réversibles.

Une enquête présentée pendant la rencontre a montré que cette exigence est difficilement applicable en République démocratique du Congo, surtout dans les zones reculées, en raison du nombre limité de médecins et de psychiatres.

## Proposition soutenue

Les organisations présentes ont proposé une révision de cette disposition afin de la rendre plus réaliste et plus accessible, notamment en réduisant l’exigence à l’avis d’un seul médecin. Les OSC ont marqué leur adhésion au processus par la signature du document prévu à cet effet.`,
    image_url: newsImages.plaidoyerSantePublique,
    category: "Plaidoyer",
    published_at: "2026-08-03T08:00:00.000Z",
    author: "AFD ASBL",
    source: "rapport-terrain-afd",
    migrationNote:
      "Lot photo renommé depuis Nauveau/17 — mobilisation OSC santé publique.",
    themes: ["plaidoyer", "santé publique", "droits des femmes", "OSC"],
  },
  {
    id: "field-suivi-evaluation-mve-dps-tshopo",
    slug: "suivi-evaluation-mve-dps-tshopo",
    title:
      "Suivi et évaluation de la MVE : l’AFD participe à la coordination sanitaire à la DPS Tshopo",
    excerpt:
      "Le 1er août 2026, l’AFD a pris part à une réunion de suivi et d’évaluation de la maladie à virus Ebola à la Division provinciale de la santé de la Tshopo.",
    preview:
      "La réunion de suivi et d’évaluation de la MVE a permis de revenir sur la situation épidémiologique, les problèmes identifiés, les recommandations, les échantillons en laboratoire et les fiches d’investigation. L’AFD poursuit son engagement dans la prévention communautaire et la circulation d’informations fiables.",
    content: `## Réunion de coordination

Le samedi 1er août 2026, l’AFD ASBL a participé à une réunion de suivi et d’évaluation de la maladie à virus Ebola dans la salle de réunion de la Division provinciale de la santé de la Tshopo.

## Sujets abordés

L’exposé a porté sur les problèmes identifiés, les recommandations, la persistance des échantillons au laboratoire et les fiches d’investigation.

## Situation épidémiologique

Les points saillants présentés pour la situation du 30 juillet 2026 mentionnaient sept cas confirmés, quatre cas suspects, cinq décès et cinq alertes, dont un militaire venant de l’Ituri qui aurait pris fuite.

## Recommandations

Les recommandations ont insisté sur la nécessité de remonter les messages au niveau national, de répondre rapidement aux rumeurs et publications sur les réseaux sociaux, et de protéger la dignité des familles en évitant le partage d’images de personnes atteintes ou décédées.`,
    image_url: newsImages.mveTshopo,
    category: "Santé",
    published_at: "2026-08-01T08:00:00.000Z",
    author: "AFD ASBL",
    source: "rapport-terrain-afd",
    migrationNote:
      "Lot photo renommé depuis Nauveau/5-8 — réunion MVE DPS Tshopo.",
    themes: ["MVE", "Ebola", "santé publique", "prévention", "Tshopo"],
  },
  {
    id: "field-formation-enqueteurs-cap-kinshasa",
    slug: "formation-enqueteurs-cap-rentree-scolaire-kinshasa",
    title:
      "Formation des enquêteurs CAP pour faciliter le retour à l’école",
    excerpt:
      "Le 27 juillet 2026 à Kinshasa, le consortium AFD, CSDI et AJDP a formé onze enquêteurs sur le formulaire de l’enquête CAP liée aux besoins d’appui à la rentrée scolaire.",
    preview:
      "La formation a permis de renforcer les capacités des enquêteurs avant la collecte prévue dans les sites de Maluku, Pakadjuma/Nsele et Lutendele/Mont-Ngafula. L’objectif est d’identifier les besoins réels des enfants déplacés afin de soutenir leur retour à l’école dès la rentrée 2026-2027.",
    content: `## Formation à Kinshasa

Le lundi 27 juillet 2026, dans la salle de réunion de la CONEPT RDC à Kinshasa, le consortium AFD, CSDI et AJDP a organisé une session de formation à l’intention des enquêteurs.

## Objectif

La formation portait sur l’utilisation du formulaire de l’enquête CAP consacrée aux besoins d’appui à la rentrée scolaire 2026-2027 des enfants en âge scolaire vivant dans les sites de déplacés de Maluku, Pakadjuma/Nsele et Lutendele/Mont-Ngafula.

## Participants

Au total, onze enquêteurs, dont cinq femmes, ont bénéficié de cette formation. L’activité visait à garantir une collecte de données de qualité, harmonisée et conforme à la méthodologie retenue.

## Prochaine étape

Prévue du 28 juillet au 1er août 2026, l’enquête permettra d’identifier les besoins réels des enfants en matière d’appui à la rentrée scolaire, afin de favoriser leur retour à l’école dès le mois de septembre.`,
    image_url: newsImages.capFormation,
    category: "Éducation",
    published_at: "2026-07-27T08:00:00.000Z",
    author: "Daniella AWA",
    source: "rapport-terrain-afd",
    migrationNote:
      "Lot photo renommé depuis Nauveau/9-16 — formation enquêteurs CAP.",
    themes: ["éducation", "enquête CAP", "formation", "enfants déplacés"],
  },
  {
    id: "field-preparation-enquete-cap-kinshasa",
    slug: "preparation-enquete-cap-rentree-scolaire-enfants-deplaces",
    title:
      "Des grandes réflexions se préparent pour l’éducation des enfants déplacés",
    excerpt:
      "Le 20 juillet 2026, l’AFD a accueilli AJDP et CSDI pour préparer l’outil de collecte de l’enquête CAP sur les besoins d’appui à la rentrée scolaire des enfants déplacés.",
    preview:
      "L’AFD, AJDP et CSDI ont harmonisé les indicateurs clés et finalisé un questionnaire adapté aux réalités du terrain. L’enquête permettra de documenter les besoins prioritaires des familles déplacées en fournitures scolaires, frais d’accès et appui psychosocial.",
    content: `## Séance de travail

Le lundi 20 juillet 2026, l’AFD a accueilli dans ses locaux deux organisations partenaires, AJDP et CSDI. En synergie, une séance de travail a été tenue afin de préparer et de revoir l’outil de collecte de données pour l’enquête CAP, c’est-à-dire Connaissances, Attitudes et Pratiques.

## Objectif de l’enquête

L’enquête porte sur les besoins d’appui à la rentrée scolaire des enfants déplacés des sites de Lutendele, Pakadjuma et Nsele.

## Résultat de la séance

À l’issue de cet échange, les trois organisations sont parvenues à harmoniser les indicateurs clés et à finaliser un questionnaire ciblé, adapté aux réalités du terrain.

## Utilité des données

L’outil permettra de cartographier avec précision les besoins prioritaires des familles déplacées, notamment les fournitures scolaires, les frais d’accès et l’appui psychosocial à l’approche de la rentrée des classes.

## Prochaine étape

Les équipes d’enquêteurs seront déployées sur les sites de Lutendele, Pakadjuma et Nsele afin de collecter des données fiables pour guider le plaidoyer et les interventions auprès des partenaires.`,
    image_url: newsImages.capPreparation,
    category: "Éducation",
    published_at: "2026-07-20T08:00:00.000Z",
    author: "Daniella AWA",
    source: "rapport-terrain-afd",
    migrationNote:
      "Lot photo renommé depuis Nauveau/1-4 — préparation enquête CAP.",
    themes: ["éducation", "rentrée scolaire", "déplacés", "enquête CAP"],
  },
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
      "Sujet réorienté vers la lutte contre Ebola — image de sensibilisation STOP EBOLA.",
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
      "Contenu institutionnel publié — image d’évaluation du site CECA-20 MAKOKO.",
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
      "Contenu institutionnel publié — image de visite institutionnelle à Mambasa.",
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
