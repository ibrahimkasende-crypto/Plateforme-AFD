import { assets } from "@/config/assets";
import { siteConfig } from "@/config/site";

export const homeContent = {
  hero: {
    eyebrow: "ONG nationale congolaise",
    title:
      "Des femmes engagées pour des communautés plus fortes et résilientes.",
    description:
      "Depuis 2024, l’Alliance des Femmes pour le Développement agit aux côtés des communautés vulnérables à travers des réponses humanitaires et des solutions durables, inclusives et participatives.",
    primaryCta: { label: "Découvrir nos actions", href: "/actions" },
    secondaryCta: { label: "Devenir partenaire", href: "/contact" },
    trustItems: [
      "ONG nationale congolaise",
      "Créée en 2024",
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
      "Créée en 2024, l’Alliance des Femmes pour le Développement est une ONG nationale congolaise qui accompagne les communautés vulnérables à travers des réponses humanitaires et des programmes de développement durables, inclusifs et participatifs.",
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
      alt: "Visuel institutionnel AFD — à remplacer par une photographie authentique d’activité",
      caption: "Visuel temporaire en attendant une photographie de terrain validée",
      isTemporary: true,
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
  pillars: [
    {
      id: "sante-wash",
      title: "Santé, Nutrition et WASH",
      description:
        "Soins communautaires, nutrition et accès à l’eau, l’hygiène et l’assainissement.",
      topics: [
        "Santé communautaire et primaire",
        "Nutrition",
        "Eau, hygiène et assainissement",
      ],
      icon: "HeartPulse",
      featured: true,
    },
    {
      id: "protection",
      title: "Protection, VBG et droits des femmes",
      description:
        "Protection de l’enfant, prévention des VBG et lutte contre l’exploitation.",
      topics: [
        "Protection de l’enfant",
        "Lutte contre les VBG",
        "Protection contre l’exploitation et les abus sexuels",
      ],
      icon: "Shield",
      featured: false,
    },
    {
      id: "economie",
      title: "Autonomisation économique",
      description:
        "Entrepreneuriat, coopératives et activités génératrices de revenus.",
      topics: [
        "Autonomisation financière des femmes",
        "Entrepreneuriat",
        "Coopératives et AGR",
      ],
      icon: "Briefcase",
      featured: false,
    },
    {
      id: "education",
      title: "Éducation et leadership",
      description:
        "Éducation, alphabétisation et participation des femmes aux décisions.",
      topics: ["Éducation", "Alphabétisation", "Leadership des femmes"],
      icon: "GraduationCap",
      featured: false,
    },
    {
      id: "alimentaire",
      title: "Sécurité alimentaire et agriculture",
      description:
        "Agriculture durable, pêche, élevage et moyens de subsistance.",
      topics: [
        "Sécurité alimentaire",
        "Agriculture durable",
        "Pêche et élevage",
      ],
      icon: "Sprout",
      featured: false,
    },
    {
      id: "urgences",
      title: "Urgences, cohésion et redevabilité",
      description:
        "Réponses d’urgence, relèvement, Cash for Work et engagement communautaire.",
      topics: [
        "Réponse humanitaire d’urgence",
        "Relèvement et Cash for Work",
        "Cohésion sociale et redevabilité",
      ],
      icon: "LifeBuoy",
      featured: true,
    },
  ] as const,
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
      note: "L’intégration SerdiPay sera activée après configuration officielle.",
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
  organization: {
    foundedYear: 2024,
    legalName: siteConfig.name,
    shortName: siteConfig.shortName,
    country: siteConfig.country,
  },
} as const;

export type HomeValue = (typeof homeContent.values)[number];
export type HomePillar = (typeof homeContent.pillars)[number];
export type HomeSupportAction = (typeof homeContent.supportActions)[number];
