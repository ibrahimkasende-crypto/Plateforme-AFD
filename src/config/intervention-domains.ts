/**
 * Contenu institutionnel de secours pour les domaines d’intervention.
 * Source éditoriale : orientations AFD (dont afd-rdc.org) — modernisé localement.
 * Les administrateurs peuvent compléter / remplacer via Supabase (domaines_intervention).
 */

export type InterventionDomainStatus = "brouillon" | "publie" | "archive";

export type InterventionDomain = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  summary: string;
  description: string;
  challenge: string;
  response: string;
  priorityActions: readonly string[];
  audiences: readonly string[];
  expectedResults: readonly string[];
  keywords: readonly string[];
  icon: string;
  imageSrc: string | null;
  imageAlt: string;
  orderIndex: number;
  status: InterventionDomainStatus;
  featured: boolean;
  seoTitle: string;
  seoDescription: string;
  /** Compatibilité cartes / footer */
  topics: readonly string[];
};

const programmeImages = {
  economie: encodeURI(
    "/images/afd/programmes/autonomisation-economique.jpg",
  ),
  protection: encodeURI("/images/afd/programmes/Femmes face aux violences.jpg"),
  sante: encodeURI("/images/afd/programmes/Femmes santes Maternelle.jpg"),
  wash: encodeURI("/images/afd/programmes/Femme et acces a l'eau.jpg"),
  education: encodeURI("/images/afd/programmes/Femme et leadership.jpg"),
  urgences: encodeURI(
    "/images/afd/programmes/Femmes dans la reponse Humanitaire.jpg",
  ),
} as const;

export const FALLBACK_INTERVENTION_DOMAINS: readonly InterventionDomain[] = [
  {
    id: "economie",
    slug: "autonomisation-economique",
    title: "Autonomisation économique des femmes",
    subtitle: "Entrepreneuriat, formation et moyens de subsistance",
    summary:
      "Renforcer l’indépendance financière des femmes à travers l’entrepreneuriat, la formation professionnelle, les activités génératrices de revenus, les coopératives et l’accompagnement vers l’emploi.",
    description:
      "L’AFD accompagne les femmes et les jeunes filles pour développer des compétences économiques durables, accéder à des opportunités d’activités génératrices de revenus et renforcer leur rôle dans l’économie locale. L’approche combine formation, accompagnement entrepreneurial et organisation collective.",
    challenge:
      "De nombreuses femmes font face à des obstacles structurels pour accéder à la formation, au capital, aux marchés et à un emploi digne, ce qui limite leur autonomie économique et celle de leur ménage.",
    response:
      "L’AFD favorise l’entrepreneuriat féminin, les coopératives et les parcours de formation professionnelle, avec un accompagnement de proximité adapté aux réalités des communautés.",
    priorityActions: [
      "Former aux compétences entrepreneuriales et à la gestion",
      "Soutenir les activités génératrices de revenus",
      "Renforcer les coopératives et les groupes d’épargne",
      "Accompagner l’accès à l’emploi et aux opportunités économiques",
    ],
    audiences: [
      "Femmes entrepreneures et aspirantes entrepreneures",
      "Jeunes filles en recherche de formation ou d’emploi",
      "Groupes et coopératives communautaires",
    ],
    expectedResults: [
      "Renforcement des capacités économiques des femmes",
      "Diversification des moyens de subsistance",
      "Participation accrue des femmes aux initiatives économiques locales",
    ],
    keywords: ["Entrepreneuriat", "Formation", "AGR"],
    icon: "Briefcase",
    imageSrc: programmeImages.economie,
    imageAlt:
      "Personnes participant à une activité d’autonomisation économique.",
    orderIndex: 1,
    status: "publie",
    featured: true,
    seoTitle: "Autonomisation économique des femmes | AFD ASBL",
    seoDescription:
      "Découvrez comment l’Alliance des Femmes pour le Développement renforce l’indépendance financière des femmes en RDC.",
    topics: [
      "Entrepreneuriat féminin",
      "Formation professionnelle",
      "Activités génératrices de revenus",
      "Coopératives",
      "Accompagnement vers l’emploi",
    ],
  },
  {
    id: "protection",
    slug: "protection-vbg-droits-femmes",
    title: "Protection, VBG et droits des femmes",
    subtitle: "Prévention, accompagnement et dignité",
    summary:
      "Prévenir et répondre aux violences basées sur le genre, protéger les survivantes et promouvoir les droits et la dignité des femmes et des filles.",
    description:
      "L’AFD agit pour la prévention des violences basées sur le genre, la protection des survivantes, la sensibilisation communautaire et la lutte contre l’exploitation, les abus sexuels et le harcèlement. L’intervention vise à renforcer la sécurité, l’accès à l’accompagnement et le respect des droits des femmes et des filles.",
    challenge:
      "Les violences basées sur le genre, l’exploitation et les abus sexuels portent atteinte à la sécurité, à la santé et aux droits fondamentaux des femmes et des filles, en particulier dans les contextes de vulnérabilité.",
    response:
      "L’AFD combine prévention, sensibilisation, accompagnement des survivantes et promotion des droits, dans une approche centrée sur la dignité et la protection.",
    priorityActions: [
      "Sensibiliser les communautés à la prévention des VBG",
      "Accompagner les survivantes vers des services adaptés",
      "Prévenir l’exploitation, les abus sexuels et le harcèlement",
      "Promouvoir les droits et la dignité des femmes et des filles",
    ],
    audiences: [
      "Femmes et filles exposées aux risques de violence",
      "Survivantes de VBG",
      "Communautés, leaders et acteurs de protection",
    ],
    expectedResults: [
      "Meilleure connaissance des risques et des recours",
      "Accès renforcé à l’accompagnement pour les survivantes",
      "Environnements plus protecteurs pour les femmes et les filles",
    ],
    keywords: ["VBG", "Protection", "Droits"],
    icon: "Shield",
    imageSrc: programmeImages.protection,
    imageAlt:
      "Illustration liée à la protection et aux droits des femmes.",
    orderIndex: 2,
    status: "publie",
    featured: true,
    seoTitle: "Protection, VBG et droits des femmes | AFD ASBL",
    seoDescription:
      "Actions de l’AFD contre les violences basées sur le genre et pour la protection des femmes et des filles en RDC.",
    topics: [
      "Violences basées sur le genre",
      "Protection des survivantes",
      "Prévention et sensibilisation",
      "Protection contre l’exploitation et les abus sexuels",
      "Prévention du harcèlement sexuel",
      "Droits et dignité des femmes et des filles",
    ],
  },
  {
    id: "sante-maternelle",
    slug: "sante-maternelle-infantile",
    title: "Santé maternelle et infantile",
    subtitle: "Prévention, soins essentiels et accompagnement",
    summary:
      "Améliorer l’accès des femmes, des mères et des enfants aux services de santé, à la prévention, aux soins essentiels et à l’accompagnement communautaire.",
    description:
      "L’AFD contribue à améliorer l’accès aux informations et aux services de santé maternelle et infantile, en privilégiant la prévention, la sensibilisation et l’accompagnement communautaire. L’objectif est de renforcer les pratiques favorables à la santé des mères et des enfants.",
    challenge:
      "L’accès limité aux soins essentiels, à l’information et à un accompagnement de proximité expose les mères et les enfants à des risques évitables pour leur santé.",
    response:
      "L’AFD mobilise la sensibilisation, l’orientation vers les soins et l’accompagnement communautaire pour renforcer la santé maternelle et infantile.",
    priorityActions: [
      "Sensibiliser aux bonnes pratiques de santé maternelle",
      "Faciliter l’accès aux soins essentiels et à la prévention",
      "Renforcer l’accompagnement communautaire des mères",
      "Promouvoir la santé infantile au niveau local",
    ],
    audiences: [
      "Femmes enceintes et jeunes mères",
      "Enfants et familles",
      "Relais et acteurs de santé communautaire",
    ],
    expectedResults: [
      "Meilleure information sur la santé maternelle et infantile",
      "Orientation renforcée vers les services essentiels",
      "Pratiques communautaires plus protectrices",
    ],
    keywords: ["Santé", "Maternité", "Prévention"],
    icon: "HeartPulse",
    imageSrc: programmeImages.sante,
    imageAlt: "Illustration liée à la santé maternelle et infantile.",
    orderIndex: 3,
    status: "publie",
    featured: false,
    seoTitle: "Santé maternelle et infantile | AFD ASBL",
    seoDescription:
      "L’AFD améliore l’accès des femmes, des mères et des enfants aux services de santé et à l’accompagnement communautaire.",
    topics: [
      "Santé maternelle",
      "Santé infantile",
      "Prévention",
      "Soins essentiels",
      "Accompagnement communautaire",
    ],
  },
  {
    id: "wash",
    slug: "eau-hygiene-assainissement",
    title: "Eau, hygiène et assainissement — WASH",
    subtitle: "Accès durable à l’eau et aux infrastructures sanitaires",
    summary:
      "Favoriser un accès durable à l’eau potable, à l’hygiène et aux infrastructures sanitaires afin de protéger la santé des femmes, des enfants et des communautés.",
    description:
      "Dans le domaine WASH, l’AFD agit pour améliorer l’accès à l’eau potable, promouvoir les pratiques d’hygiène et soutenir des solutions d’assainissement adaptées aux besoins des communautés, en particulier des femmes et des enfants.",
    challenge:
      "Le manque d’accès à l’eau potable, à l’hygiène et à l’assainissement expose les communautés à des risques sanitaires majeurs et alourdit la charge quotidienne des femmes et des filles.",
    response:
      "L’AFD promeut des solutions durables d’accès à l’eau, d’hygiène et d’assainissement, en lien avec la santé communautaire et la dignité des usagers.",
    priorityActions: [
      "Améliorer l’accès à l’eau potable",
      "Promouvoir les pratiques d’hygiène",
      "Soutenir les infrastructures sanitaires adaptées",
      "Sensibiliser les communautés aux enjeux WASH",
    ],
    audiences: [
      "Femmes et enfants",
      "Ménages et communautés locales",
      "Acteurs communautaires de l’eau et de l’hygiène",
    ],
    expectedResults: [
      "Accès amélioré à l’eau et à l’hygiène",
      "Réduction des risques sanitaires liés à l’eau",
      "Pratiques d’hygiène renforcées au niveau communautaire",
    ],
    keywords: ["WASH", "Eau", "Hygiène"],
    icon: "Droplets",
    imageSrc: programmeImages.wash,
    imageAlt: "Illustration liée à l’accès à l’eau et à l’hygiène.",
    orderIndex: 4,
    status: "publie",
    featured: false,
    seoTitle: "Eau, hygiène et assainissement — WASH | AFD ASBL",
    seoDescription:
      "Actions WASH de l’AFD pour un accès durable à l’eau potable, l’hygiène et l’assainissement en RDC.",
    topics: [
      "Eau potable",
      "Hygiène",
      "Assainissement",
      "Santé communautaire",
    ],
  },
  {
    id: "education",
    slug: "education-femmes-filles",
    title: "Éducation des femmes et des filles",
    subtitle: "Éducation inclusive, alphabétisation et leadership",
    summary:
      "Promouvoir l’accès à une éducation inclusive et de qualité, à l’alphabétisation, à la formation et au développement du leadership des femmes et des jeunes filles.",
    description:
      "L’AFD promeut l’éducation des femmes et des filles comme levier d’autonomie et de participation. Les interventions portent sur l’accès à l’apprentissage, l’alphabétisation, la formation et le renforcement du leadership.",
    challenge:
      "Les barrières économiques, sociales et culturelles limitent encore l’accès des femmes et des filles à une éducation inclusive, à la formation et aux espaces de décision.",
    response:
      "L’AFD soutient des parcours éducatifs et de leadership qui renforcent les compétences, la confiance et la participation des femmes et des jeunes filles.",
    priorityActions: [
      "Favoriser l’accès à une éducation inclusive",
      "Soutenir l’alphabétisation et la formation",
      "Renforcer le leadership des femmes et des filles",
      "Encourager la participation aux espaces de décision",
    ],
    audiences: [
      "Jeunes filles",
      "Femmes en reprise d’apprentissage",
      "Groupes de leadership communautaire",
    ],
    expectedResults: [
      "Accès élargi à l’éducation et à la formation",
      "Compétences et leadership renforcés",
      "Participation accrue des femmes et des filles",
    ],
    keywords: ["Éducation", "Leadership", "Alphabétisation"],
    icon: "GraduationCap",
    imageSrc: programmeImages.education,
    imageAlt: "Illustration liée à l’éducation et au leadership des femmes.",
    orderIndex: 5,
    status: "publie",
    featured: false,
    seoTitle: "Éducation des femmes et des filles | AFD ASBL",
    seoDescription:
      "L’AFD promeut l’éducation inclusive, l’alphabétisation et le leadership des femmes et des filles en RDC.",
    topics: [
      "Éducation inclusive",
      "Alphabétisation",
      "Formation",
      "Leadership des femmes et des filles",
    ],
  },
  {
    id: "urgences",
    slug: "urgences-populations-deplacees",
    title: "Urgences et assistance aux populations déplacées",
    subtitle: "Assistance humanitaire, sécurité et dignité",
    summary:
      "Apporter une assistance aux populations déplacées et affectées par les conflits, en accordant une attention particulière à la sécurité, à la dignité et aux besoins des femmes et des filles.",
    description:
      "Dans les contextes d’urgence, l’AFD mobilise une assistance adaptée aux populations déplacées et affectées par les conflits. Les interventions privilégient la protection, la dignité et les besoins spécifiques des femmes et des filles.",
    challenge:
      "Les conflits et les déplacements exposent les populations, en particulier les femmes et les filles, à des risques accrus pour leur sécurité, leur santé et leurs moyens de subsistance.",
    response:
      "L’AFD apporte une assistance humanitaire attentive à la protection, à la dignité et aux priorités des femmes et des filles dans les situations d’urgence.",
    priorityActions: [
      "Assister les populations déplacées et affectées",
      "Renforcer la sécurité et la dignité des femmes et des filles",
      "Répondre aux besoins essentiels en contexte d’urgence",
      "Articuler l’aide d’urgence avec les perspectives de relèvement",
    ],
    audiences: [
      "Populations déplacées",
      "Femmes et filles en situation d’urgence",
      "Communautés hôtes et affectées",
    ],
    expectedResults: [
      "Assistance adaptée aux besoins prioritaires",
      "Meilleure prise en compte de la protection des femmes et des filles",
      "Réponses d’urgence plus dignes et inclusives",
    ],
    keywords: ["Urgences", "Déplacés", "Protection"],
    icon: "LifeBuoy",
    imageSrc: programmeImages.urgences,
    imageAlt:
      "Illustration liée à la réponse humanitaire et aux urgences.",
    orderIndex: 6,
    status: "publie",
    featured: true,
    seoTitle: "Urgences et populations déplacées | AFD ASBL",
    seoDescription:
      "Assistance de l’AFD aux populations déplacées et affectées par les conflits, avec attention aux femmes et aux filles.",
    topics: [
      "Assistance aux populations déplacées",
      "Réponse humanitaire d’urgence",
      "Sécurité et dignité",
      "Besoins des femmes et des filles",
    ],
  },
] as const;

export function getFallbackInterventionDomains(): InterventionDomain[] {
  return FALLBACK_INTERVENTION_DOMAINS.map((domain) => ({ ...domain }));
}

export function getFallbackDomainBySlug(
  slug: string,
): InterventionDomain | undefined {
  return FALLBACK_INTERVENTION_DOMAINS.find((domain) => domain.slug === slug);
}
