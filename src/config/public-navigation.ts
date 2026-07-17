export type PublicNavChild = {
  label: string;
  href: string;
  description?: string;
};

export type PublicNavItem = {
  label: string;
  href: string;
  children?: PublicNavChild[];
};

export const publicNavigation: PublicNavItem[] = [
  { label: "Accueil", href: "/" },
  {
    label: "Qui sommes-nous",
    href: "/qui-sommes-nous",
    children: [
      { label: "Présentation de l’AFD", href: "/qui-sommes-nous" },
      { label: "Notre histoire", href: "/qui-sommes-nous/histoire" },
      {
        label: "Mission, vision et valeurs",
        href: "/qui-sommes-nous/mission-vision-valeurs",
      },
      { label: "Gouvernance", href: "/qui-sommes-nous/gouvernance" },
      { label: "Équipe", href: "/qui-sommes-nous/equipe" },
      { label: "Organigramme", href: "/qui-sommes-nous/organigramme" },
      {
        label: "Politiques et engagements",
        href: "/qui-sommes-nous/politiques-engagements",
      },
    ],
  },
  {
    label: "Nos actions",
    href: "/actions",
    children: [
      {
        label: "Domaines d’intervention",
        href: "/actions/domaines-intervention",
      },
      { label: "Programmes", href: "/actions/programmes" },
      { label: "Projets", href: "/actions/projets" },
      { label: "Réponses d’urgence", href: "/actions/urgences" },
      { label: "Zones d’intervention", href: "/actions/zones-intervention" },
      {
        label: "Clusters et groupes de travail",
        href: "/actions/clusters",
      },
    ],
  },
  {
    label: "Notre impact",
    href: "/impact",
    children: [
      { label: "Chiffres clés", href: "/impact" },
      { label: "Résultats", href: "/impact/resultats" },
      { label: "Histoires d’impact", href: "/impact/histoires" },
      { label: "Témoignages", href: "/impact/temoignages" },
      {
        label: "Carte des interventions",
        href: "/impact#carte-interventions",
      },
      { label: "Rapports et publications", href: "/impact/rapports" },
    ],
  },
  { label: "Actualités", href: "/actualites" },
  {
    label: "Ressources",
    href: "/ressources",
    children: [
      { label: "Médiathèque", href: "/ressources/mediatheque" },
      { label: "Documents", href: "/ressources/documents" },
      { label: "Rapports", href: "/impact/rapports" },
      { label: "Appels d’offres", href: "/ressources/appels-offres" },
      { label: "Opportunités", href: "/ressources/opportunites" },
      { label: "Newsletter", href: "/ressources/newsletter" },
    ],
  },
  { label: "Contact", href: "/contact" },
];

export const publicCtas = [
  { label: "Nous rejoindre", href: "/adhesion", variant: "secondary" as const },
  { label: "Soutenir l’AFD", href: "/soutenir", variant: "primary" as const },
] as const;

export const footerLinks = {
  legal: [
    { label: "Mentions légales", href: "/mentions-legales" },
    {
      label: "Politique de confidentialité",
      href: "/politique-confidentialite",
    },
  ],
  quick: [
    { label: "Nous rejoindre", href: "/adhesion" },
    { label: "Soutenir l’AFD", href: "/soutenir" },
    { label: "Newsletter", href: "/ressources/newsletter" },
    { label: "Contact", href: "/contact" },
  ],
} as const;
