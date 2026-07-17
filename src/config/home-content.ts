import { siteConfig } from "@/config/site";

export const homeContent = {
  hero: {
    eyebrow: "AFD ASBL · République démocratique du Congo",
    title:
      "Des femmes engagées pour des communautés plus fortes et résilientes.",
    description:
      "L’Alliance des Femmes pour le Développement accompagne les communautés vulnérables à travers des réponses humanitaires et des solutions durables, inclusives et participatives en République démocratique du Congo.",
    primaryCta: { label: "Découvrir nos actions", href: "/actions" },
    secondaryCta: { label: "Soutenir l’AFD", href: "/soutenir" },
    trustItems: [
      "ONG nationale congolaise",
      "Créée en 2024",
      "Portée par les femmes et les jeunes",
    ] as const,
    institutionalNote:
      "Conseil d’administration composé à 80 % de femmes de moins de 35 ans et de jeunes.",
    image: {
      src: "/images/adf1.jpg",
      alt: "Visuel institutionnel AFD — à remplacer par une photographie de terrain documentée",
      credit: "Visuel temporaire — photo de terrain AFD à intégrer",
      isTemporary: true,
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
      src: "/images/adf2.png",
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
      title: "Santé, nutrition et WASH",
      description:
        "Renforcer l’accès aux soins de santé communautaire, à la nutrition et à des services d’eau, hygiène et assainissement.",
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
      title: "Protection et droits des femmes",
      description:
        "Prévenir et répondre aux violences, protéger les enfants et promouvoir la dignité.",
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
        "Soutenir l’entrepreneuriat féminin, les coopératives et les activités génératrices de revenus.",
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
        "Favoriser l’éducation, l’alphabétisation et la participation des femmes aux décisions.",
      topics: ["Éducation", "Alphabétisation", "Leadership des femmes"],
      icon: "GraduationCap",
      featured: false,
    },
    {
      id: "alimentaire",
      title: "Sécurité alimentaire et environnement",
      description:
        "Appuyer l’agriculture durable, la pêche, l’élevage et les moyens de subsistance.",
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
      title: "Urgences, relèvement et cohésion sociale",
      description:
        "Répondre aux crises, accompagner le relèvement et renforcer la cohésion communautaire.",
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
    title: "Restez informé des actions de l’AFD",
    description:
      "Recevez nos actualités, nos résultats, nos publications et les opportunités liées à nos programmes.",
    interests: [
      { id: "actualites", label: "Actualités" },
      { id: "rapports", label: "Rapports et publications" },
      { id: "opportunites", label: "Opportunités" },
      { id: "urgences", label: "Urgences humanitaires" },
    ] as const,
    consentLabel:
      "J’accepte que l’AFD utilise mon adresse e-mail pour m’envoyer des informations liées à ses actions.",
  },
  supportActions: [
    {
      id: "adhesion",
      title: "Rejoindre l’AFD",
      description:
        "Engagez-vous aux côtés des femmes et des jeunes pour transformer durablement les communautés.",
      href: "/adhesion",
      cta: "Nous rejoindre",
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
      title: "Soutenir nos actions",
      description:
        "Soutenez les interventions de l’AFD. Le paiement en ligne sera prochainement disponible.",
      href: "/soutenir",
      cta: "Soutenir l’AFD",
      note: "L’intégration SerdiPay sera activée après configuration officielle des identifiants et webhooks.",
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
