/**
 * Contenu institutionnel de secours pour les domaines d’intervention.
 * Source éditoriale : orientations AFD (dont afd-rdc.org) — modernisé localement.
 * Les administrateurs peuvent compléter / remplacer via Supabase (domaines_intervention).
 */
import { afdBankImage } from "@/config/afd-images";

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

/** Images de la banque AFD classée — appariées par sujet visible. */
const domainImages = {
  economie: afdBankImage(
    "19_gouvernance/afd_gouvernance_remise_documents_coordination_tshopo_005.jpg",
  ),
  protection: afdBankImage(
    "22_sensibilisation/afd_sensibilisation_sensibilisation_8_mars_camp_kabila_004.jpg",
  ),
  sante: afdBankImage(
    "01_sante/afd_sante_sensibilisation_cpn_salama_012.jpg",
  ),
  wash: afdBankImage(
    "06_wash/afd_wash_sensibilisation_dotation_lavage_mains_site_ceca_20_makoko_1_007.jpg",
  ),
  education: afdBankImage(
    "19_gouvernance/afd_gouvernance_remise_documents_coordination_tshopo_001.jpg",
  ),
  urgences: afdBankImage(
    "17_missions_terrain/afd_missions_terrain_visite_evaluation_site_deplaces_site_ceca_20_makoko_1_010.jpg",
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
    imageSrc: domainImages.economie,
    imageAlt:
      "Délégation AFD devant une affiche liée à la promotion économique et à l’entrepreneuriat.",
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
    imageSrc: domainImages.protection,
    imageAlt:
      "Activité de sensibilisation sur les droits des femmes et des filles.",
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
    imageSrc: domainImages.sante,
    imageAlt:
      "Femmes réunies pendant une séance de sensibilisation en santé communautaire.",
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
    imageSrc: domainImages.wash,
    imageAlt:
      "Dispositifs de lavage des mains installés lors d’une activité WASH.",
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
    id: "leadership",
    slug: "femmes-leadership-gouvernance-communautaire",
    title: "Femmes, leadership et gouvernance communautaire",
    subtitle: "Participation, prise de décision et gouvernance locale",
    summary:
      "Renforcer le leadership des femmes et leur participation active à la gouvernance communautaire, afin qu’elles prennent part aux décisions qui façonnent leur environnement.",
    description:
      "L’AFD accompagne les femmes et les jeunes filles pour développer leur leadership, investir les espaces de dialogue et contribuer à une gouvernance communautaire plus inclusive. L’approche privilégie le renforcement des capacités, la participation citoyenne et l’accès aux instances locales de décision.",
    challenge:
      "Les femmes restent souvent sous-représentées dans les espaces de décision et dans les mécanismes de gouvernance communautaire, ce qui limite leur influence sur les priorités locales.",
    response:
      "L’AFD favorise le leadership féminin, la participation aux instances communautaires et le renforcement des compétences utiles à une gouvernance plus inclusive et responsable.",
    priorityActions: [
      "Renforcer les compétences de leadership des femmes",
      "Soutenir la participation aux instances communautaires",
      "Favoriser le dialogue et la co-construction locale",
      "Promouvoir une gouvernance inclusive et redevable",
    ],
    audiences: [
      "Femmes leaders et aspirantes leaders",
      "Jeunes filles engagées dans la vie communautaire",
      "Structures et instances de gouvernance locale",
    ],
    expectedResults: [
      "Leadership des femmes renforcé",
      "Participation accrue aux décisions locales",
      "Gouvernance communautaire plus inclusive",
    ],
    keywords: ["Leadership", "Gouvernance", "Participation"],
    icon: "Users",
    imageSrc: domainImages.education,
    imageAlt:
      "Remise de documents lors d’une activité institutionnelle de gouvernance.",
    orderIndex: 5,
    status: "publie",
    featured: false,
    seoTitle: "Femmes, leadership et gouvernance communautaire | AFD ASBL",
    seoDescription:
      "L’AFD renforce le leadership des femmes et leur participation à la gouvernance communautaire en RDC.",
    topics: [
      "Leadership des femmes",
      "Gouvernance communautaire",
      "Participation aux décisions",
      "Renforcement des capacités",
    ],
  },
  {
    id: "urgences",
    slug: "femmes-reponse-humanitaire-urgence",
    title: "Femmes dans la réponse humanitaire et d’urgence",
    subtitle: "Action humanitaire centrée sur les femmes et les filles",
    summary:
      "Placer les femmes au cœur de la réponse humanitaire et d’urgence, en veillant à leur sécurité, leur dignité et à la prise en compte de leurs besoins spécifiques.",
    description:
      "L’AFD agit pour que les femmes et les filles soient pleinement considérées dans les réponses humanitaires et d’urgence. Les interventions articulent assistance, protection et participation, afin de renforcer des réponses plus adaptées, dignes et inclusives.",
    challenge:
      "En situation de crise, les femmes et les filles font face à des risques spécifiques et restent souvent insuffisamment prises en compte dans la conception et la mise en œuvre des réponses humanitaires.",
    response:
      "L’AFD place les femmes au centre de l’action humanitaire et d’urgence, avec une attention particulière à la protection, à la dignité et à la participation des femmes et des filles.",
    priorityActions: [
      "Intégrer les besoins des femmes et des filles dans la réponse d’urgence",
      "Renforcer la protection et la dignité en contexte de crise",
      "Soutenir la participation des femmes à l’action humanitaire",
      "Articuler l’aide d’urgence avec les perspectives de relèvement",
    ],
    audiences: [
      "Femmes et filles en situation de crise",
      "Populations affectées par les urgences",
      "Acteurs humanitaires et communautaires",
    ],
    expectedResults: [
      "Réponses humanitaires plus attentives aux femmes et aux filles",
      "Meilleure prise en compte de la protection et de la dignité",
      "Participation accrue des femmes à l’action d’urgence",
    ],
    keywords: ["Humanitaire", "Urgences", "Femmes"],
    icon: "LifeBuoy",
    imageSrc: domainImages.urgences,
    imageAlt:
      "Équipe AFD évaluant les besoins dans un site de déplacés.",
    orderIndex: 6,
    status: "publie",
    featured: true,
    seoTitle: "Femmes dans la réponse humanitaire et d’urgence | AFD ASBL",
    seoDescription:
      "L’AFD place les femmes au cœur de la réponse humanitaire et d’urgence en République démocratique du Congo.",
    topics: [
      "Réponse humanitaire",
      "Urgences",
      "Protection des femmes et des filles",
      "Participation des femmes",
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
