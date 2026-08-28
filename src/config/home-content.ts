import { assets } from "@/config/assets";
import { FALLBACK_INTERVENTION_DOMAINS } from "@/config/intervention-domains";
import { siteConfig } from "@/config/site";

export const homeContent = {
  hero: {
    eyebrow: "ONG nationale congolaise",
    title: "Des femmes engagées pour des communautés plus fortes",
    titleLines: [
      "Des femmes engagées",
      "pour des communautés",
      "plus fortes",
    ] as const,
    description:
      "Depuis le 24 janvier 2020, l’Alliance des Femmes pour le Développement agit aux côtés des communautés vulnérables à travers des réponses humanitaires et des solutions durables, inclusives et participatives.",
    primaryCta: { label: "Découvrir nos actions", href: "/actions" },
    secondaryCta: { label: "Devenir partenaire", href: "/contact" },
    trustItems: [
      "ONG nationale congolaise",
      "Créée le 24 janvier 2020",
      "Portée par les femmes et les jeunes",
    ] as const,
    institutionalNote:
      "80 % de femmes de moins de 35 ans et de jeunes au Conseil d’administration.",
    image: {
      src: assets.home.hero,
      preferredSrc: assets.home.hero,
      alt: "Femmes de l’Alliance des Femmes pour le Développement sur le terrain",
      credit: "",
      isTemporary: false,
    },
  },
  about: {
    eyebrow: "À propos de l’AFD",
    title: "Une ONG nationale au service des communautés",
    paragraphs: [
      "Créée le 24 janvier 2020, l’Alliance des Femmes pour le Développement est une ONG nationale congolaise qui accompagne les communautés vulnérables à travers des réponses humanitaires et des programmes de développement durables, inclusifs et participatifs.",
      "Portée principalement par les femmes et les jeunes, l’AFD agit pour un développement construit à partir des communautés, dans lequel les femmes participent pleinement aux décisions et à la transformation de leur environnement.",
    ] as const,
    highlights: [
      "ONG nationale congolaise",
      "Leadership des femmes et des jeunes",
      "Approche humanitaire et développement durable",
    ] as const,
    boardNote:
      "Le Conseil d’administration est composé à 80 % de femmes de moins de 35 ans et de jeunes.",
    cta: { label: "En savoir plus", href: "/qui-sommes-nous" },
    image: {
      src: assets.home.presentation,
      alt: "Présentation de l’Alliance des Femmes pour le Développement",
      caption: "L’AFD auprès des communautés",
      isTemporary: false,
    },
  },
  values: [
    {
      id: "engagement",
      title: "Engagement",
      description: "Agir avec constance aux côtés des communautés.",
      icon: "HeartHandshake",
    },
    {
      id: "integrite",
      title: "Intégrité",
      description: "Garantir transparence et responsabilité.",
      icon: "ShieldCheck",
    },
    {
      id: "ouverture",
      title: "Ouverture",
      description: "Écouter, dialoguer et co-construire.",
      icon: "Users",
    },
    {
      id: "adaptabilite",
      title: "Adaptabilité",
      description: "Ajuster les réponses aux réalités du terrain.",
      icon: "RefreshCw",
    },
    {
      id: "respect",
      title: "Respect",
      description: "Honorer la dignité de chaque personne.",
      icon: "HandHeart",
    },
  ] as const,
  /** Aligné sur les six domaines officiels (secours local / footer / pages institutionnelles). */
  pillars: FALLBACK_INTERVENTION_DOMAINS.map((domain) => ({
    id: domain.id,
    title: domain.title,
    description: domain.summary,
    topics: domain.topics,
    icon: domain.icon,
    featured: domain.featured,
    slug: domain.slug,
  })),
  newsletter: {
    title: "Restez informé de nos actions",
    description:
      "Inscrivez-vous à notre newsletter pour recevoir nos actualités, nos rapports et nos opportunités d’engagement.",
    popupTitle: "Suivez les actions de l’AFD",
    popupDescription:
      "Recevez nos actualités, publications, opportunités et informations sur nos actions humanitaires et de développement.",
    interests: [
      { id: "actualites", label: "Actualités générales" },
      { id: "programmes", label: "Programmes humanitaires" },
      { id: "autonomisation", label: "Autonomisation des femmes" },
      { id: "rapports", label: "Rapports et publications" },
      { id: "opportunites", label: "Opportunités" },
      { id: "appels", label: "Appels d’offres" },
    ] as const,
    consentLabel:
      "J’accepte que l’AFD utilise mon adresse e-mail pour m’envoyer des informations liées à ses actions.",
  },
  supportActions: [
    {
      id: "adhesion",
      title: "Devenir membre",
      description:
        "Engagez-vous aux côtés des femmes et des jeunes pour transformer durablement les communautés.",
      href: "/adhesion",
      cta: "En savoir plus",
    },
    {
      id: "partenaire",
      title: "Devenir partenaire",
      description:
        "Construisons ensemble des programmes inclusifs, mesurables et ancrés dans les réalités locales.",
      href: "/contact",
      cta: "Nous contacter",
    },
    {
      id: "soutenir",
      title: "Soutenir un projet",
      description:
        "Soutenez les interventions de l’AFD. Le paiement en ligne sera prochainement disponible.",
      href: "/soutenir",
      cta: "Faire un don",
      note: "Le virement bancaire Equity BCDC est disponible. La carte Visa/Mastercard sera activée après contrat marchand AFD.",
    },
    {
      id: "contact",
      title: "Nous contacter",
      description:
        "Une question, une proposition de collaboration ou une demande d’information ?",
      href: "/contact",
      cta: "Nous écrire",
    },
  ] as const,
  statsDisclaimer: "Données validées par l’équipe AFD.",
  /** Chiffres institutionnels validés pour le bloc d’impact public. */
  publishedImpactStats: {
    personnesAccompagnees: 4944,
    projetsRealises: 8,
    provincesCouvertes: 8,
    /** Pourcentage de femmes et jeunes filles parmi les bénéficiaires. */
    femmesAccompagnees: 75,
    partenairesActifs: 13,
    /** Affiché comme « Plus de 70 ». */
    activitesRealisees: 70,
  },
  organization: {
    /** Date officielle de création de l’organisation. */
    foundedDate: "2020-01-24",
    foundedYear: 2020,
    foundedLabel: "24 janvier 2020",
    legalName: siteConfig.name,
    shortName: siteConfig.shortName,
    country: siteConfig.country,
  },
} as const;

export type HomeValue = (typeof homeContent.values)[number];
export type HomePillar = (typeof homeContent.pillars)[number];
export type HomeSupportAction = (typeof homeContent.supportActions)[number];
