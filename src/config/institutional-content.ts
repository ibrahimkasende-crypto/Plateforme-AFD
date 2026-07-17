import { homeContent } from "@/config/home-content";
import { siteConfig } from "@/config/site";

export const institutionalContent = {
  identity: {
    legalName: siteConfig.name,
    shortName: siteConfig.shortName,
    acronym: siteConfig.acronym,
    country: siteConfig.country,
    foundedYear: homeContent.organization.foundedYear,
    tagline: homeContent.hero.title,
    summary: homeContent.about.paragraphs.join("\n\n"),
    highlights: homeContent.about.highlights,
    boardNote: homeContent.about.boardNote,
  },
  contactPlaceholder:
    "Information institutionnelle à compléter par l’AFD",
  mission: {
    title: "Mission",
    content:
      "Accompagner les communautés vulnérables en République démocratique du Congo à travers des réponses humanitaires et des programmes de développement durables, inclusifs et participatifs, en plaçant les femmes et les jeunes au cœur de l’action et de la prise de décision.",
  },
  vision: {
    title: "Vision",
    content:
      "Des communautés plus fortes et résilientes, où les femmes et les jeunes participent pleinement à la transformation de leur environnement et où les réponses humanitaires et de développement sont ancrées dans les réalités locales.",
  },
  values: homeContent.values.map((value) => ({
    ...value,
    expanded:
      value.id === "engagement"
        ? "L’AFD s’engage aux côtés des communautés avec constance, en privilégiant une présence de proximité et des interventions adaptées aux contextes locaux."
        : value.id === "integrite"
          ? "Transparence, redevabilité et rigueur dans la gestion des ressources et des relations avec les partenaires et les bénéficiaires."
          : value.id === "ouverture"
            ? "Écoute active, dialogue avec les parties prenantes et co-construction des solutions avec les communautés."
            : value.id === "adaptabilite"
              ? "Capacité à ajuster les réponses aux évolutions du terrain, aux urgences et aux besoins identifiés localement."
              : "Respect de la dignité, des droits et des savoirs de chaque personne accompagnée.",
  })),
  pillars: homeContent.pillars,
  timeline: [
    {
      year: "2024",
      title: "Création de l’AFD",
      description:
        "Fondation de l’Alliance des Femmes pour le Développement en tant qu’ONG nationale congolaise, portée par les femmes et les jeunes.",
    },
    {
      year: "2024",
      title: "Structuration institutionnelle",
      description:
        "Mise en place des piliers d’intervention et des orientations stratégiques en santé, protection, autonomisation économique, éducation, sécurité alimentaire et réponses d’urgence.",
    },
    {
      year: "2024+",
      title: "Déploiement des actions",
      description:
        "Lancement progressif des programmes et projets sur le terrain, avec une approche participative et inclusive.",
    },
  ] as const,
  governance: {
    intro:
      "L’AFD est organisée autour d’instances de gouvernance et de directions fonctionnelles garantissant la redevabilité, la qualité des interventions et la participation des femmes et des jeunes.",
    bodies: [
      {
        id: "ca",
        title: "Conseil d’administration",
        description:
          "Instance de orientation stratégique. Composé à 80 % de femmes de moins de 35 ans et de jeunes, conformément à l’engagement institutionnel de l’AFD.",
        responsibilities: [
          "Valider les orientations stratégiques",
          "Superviser la gouvernance et la redevabilité",
          "Approuver les grandes lignes de programmation",
        ],
      },
      {
        id: "direction",
        title: "Direction exécutive",
        description:
          "Assure la mise en œuvre opérationnelle des décisions du Conseil d’administration et la coordination des équipes.",
        responsibilities: [
          "Pilotage opérationnel",
          "Coordination inter-départements",
          "Représentation institutionnelle",
        ],
      },
    ],
    departments: [
      {
        id: "programmes",
        title: "Programmes et projets",
        description:
          "Conception, suivi et évaluation des interventions humanitaires et de développement.",
      },
      {
        id: "urgences",
        title: "Urgences et relèvement",
        description:
          "Coordination des réponses humanitaires d’urgence, relèvement et activités génératrices de revenus (Cash for Work).",
      },
      {
        id: "protection",
        title: "Protection et genre",
        description:
          "Actions de protection de l’enfance, prévention des VBG et promotion des droits des femmes.",
      },
      {
        id: "finance",
        title: "Finance et administration",
        description:
          "Gestion financière, conformité, ressources humaines et appui logistique.",
      },
      {
        id: "communication",
        title: "Communication et plaidoyer",
        description:
          "Visibilité des actions, relations partenaires, mobilisation et redevabilité communautaire.",
      },
      {
        id: "me",
        title: "Suivi-évaluation et apprentissage",
        description:
          "Mesure des résultats, capitalisation et amélioration continue des pratiques.",
      },
    ],
  },
  organigramme: {
    intro:
      "Structure organisationnelle de l’AFD — les intitulés de postes seront complétés par l’équipe institutionnelle.",
    hierarchy: [
      {
        id: "root",
        title: "Conseil d’administration",
        children: [
          {
            id: "exec",
            title: "Direction exécutive",
            children: [
              {
                id: "prog",
                title: "Département Programmes et projets",
                children: [
                  { id: "prog-urg", title: "Unité Urgences et relèvement" },
                  { id: "prog-dev", title: "Unité Développement communautaire" },
                ],
              },
              {
                id: "prot",
                title: "Département Protection et genre",
                children: [
                  { id: "prot-enf", title: "Unité Protection de l’enfance" },
                  { id: "prot-vbg", title: "Unité VBG et droits des femmes" },
                ],
              },
              {
                id: "ops",
                title: "Département Finance et administration",
                children: [
                  { id: "ops-fin", title: "Unité Finances" },
                  { id: "ops-rh", title: "Unité Ressources humaines et logistique" },
                ],
              },
              {
                id: "com",
                title: "Département Communication et plaidoyer",
                children: [],
              },
              {
                id: "me",
                title: "Département Suivi-évaluation",
                children: [],
              },
            ],
          },
        ],
      },
    ],
  },
  policies: [
    {
      id: "code-conduite",
      title: "Code de conduite",
      description:
        "Cadre éthique régissant le comportement des membres, du personnel et des partenaires de l’AFD.",
    },
    {
      id: "psea",
      title: "Protection contre l’exploitation et les abus sexuels (PSEA)",
      description:
        "Engagement de l’AFD à prévenir et répondre à toute forme d’exploitation ou d’abus sexuel dans le cadre de ses interventions.",
    },
    {
      id: "safeguarding",
      title: "Protection de l’enfance et des personnes vulnérables",
      description:
        "Mesures de protection intégrées dans la conception et la mise en œuvre des programmes.",
    },
    {
      id: "genre",
      title: "Égalité genre et inclusion",
      description:
        "Promotion de la participation des femmes et des jeunes dans toutes les étapes du cycle de projet.",
    },
    {
      id: "redevabilite",
      title: "Redevabilité envers les communautés",
      description:
        "Mécanismes de feedback, de plaintes et de participation communautaire.",
    },
    {
      id: "donnees",
      title: "Protection des données personnelles",
      description:
        "Respect de la confidentialité des informations collectées auprès des bénéficiaires, membres et partenaires.",
    },
  ] as const,
  urgences: {
    title: "Approche des réponses d’urgence",
    paragraphs: [
      "L’AFD intervient dans les situations d’urgence humanitaire avec une approche rapide, coordonnée et centrée sur les besoins des communautés les plus vulnérables, en particulier les femmes et les enfants.",
      "Les réponses combinent assistance immédiate, relèvement et activités génératrices de revenus (Cash for Work), dans une logique de cohésion sociale et de redevabilité envers les populations touchées.",
      "Les interventions s’inscrivent dans le pilier « Urgences, cohésion et redevabilité » et sont alignées sur les standards humanitaires applicables.",
    ],
    topics: homeContent.pillars.find((p) => p.id === "urgences")?.topics ?? [],
  },
  ctas: {
    primary: [
      { label: "Découvrir nos actions", href: "/actions" },
      { label: "Devenir membre", href: "/adhesion" },
      { label: "Nous contacter", href: "/contact" },
    ],
    secondary: [
      { label: "Notre histoire", href: "/qui-sommes-nous/histoire" },
      { label: "Mission et valeurs", href: "/qui-sommes-nous/mission-vision-valeurs" },
      { label: "Gouvernance", href: "/qui-sommes-nous/gouvernance" },
    ],
  },
} as const;

export type OrganigrammeNode = {
  readonly id: string;
  readonly title: string;
  readonly children?: readonly OrganigrammeNode[];
};
