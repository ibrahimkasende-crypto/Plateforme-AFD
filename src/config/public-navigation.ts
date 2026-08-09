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

/**
 * Navigation publique.
 * - `desktopPrimary` : toujours visible en desktop
 * - `desktopSecondary` : visibles en full (≥1440) ; regroupés dans « Plus » en compact
 */
export const publicNavigation: PublicNavItem[] = [
  { label: "Accueil", href: "/" },
  {
    label: "Qui sommes-nous",
    href: "/qui-sommes-nous",
    children: [
      {
        label: "Présentation de l’AFD",
        href: "/qui-sommes-nous",
        description: "Identité et ancrage institutionnel",
      },
      {
        label: "Notre histoire",
        href: "/qui-sommes-nous/histoire",
        description: "Parcours et jalons de l’AFD",
      },
      {
        label: "Mission, vision et valeurs",
        href: "/qui-sommes-nous/mission-vision-valeurs",
        description: "Fondements stratégiques",
      },
      {
        label: "Gouvernance",
        href: "/qui-sommes-nous/gouvernance",
        description: "Instances de direction",
      },
      {
        label: "Équipe",
        href: "/qui-sommes-nous/equipe",
        description: "Profils et compétences",
      },
      {
        label: "Organigramme",
        href: "/qui-sommes-nous/organigramme",
        description: "Structure organisationnelle",
      },
      {
        label: "Politiques et engagements",
        href: "/qui-sommes-nous/politiques-engagements",
        description: "Cadre éthique et engagements",
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
        description: "Secteurs prioritaires",
      },
      {
        label: "Programmes",
        href: "/actions/programmes",
        description: "Programmes institutionnels",
      },
      {
        label: "Projets",
        href: "/actions/projets",
        description: "Projets en cours et réalisés",
      },
      {
        label: "Réponses d’urgence",
        href: "/actions/urgences",
        description: "Interventions humanitaires",
      },
      {
        label: "Zones d’intervention",
        href: "/actions/zones-intervention",
        description: "Territoires d’action",
      },
      {
        label: "Clusters et groupes de travail",
        href: "/actions/clusters",
        description: "Coordination sectorielle",
      },
    ],
  },
  {
    label: "Notre impact",
    href: "/impact",
    children: [
      {
        label: "Vue générale",
        href: "/impact",
        description: "Chiffres et synthèse d’impact",
      },
      {
        label: "Résultats",
        href: "/impact/resultats",
        description: "Indicateurs consolidés",
      },
      {
        label: "Histoires d’impact",
        href: "/impact/histoires",
        description: "Récits de terrain",
      },
      {
        label: "Témoignages",
        href: "/impact/temoignages",
        description: "Voix des communautés",
      },
      {
        label: "Rapports et publications",
        href: "/impact/rapports",
        description: "Documents officiels",
      },
    ],
  },
  { label: "Bibliothèque", href: "/bibliotheque" },
  { label: "Actualités", href: "/actualites" },
  {
    label: "Ressources",
    href: "/ressources",
    children: [
      {
        label: "Bibliothèque",
        href: "/bibliotheque",
        description: "Archives institutionnelles des activités",
      },
      {
        label: "Photothèque",
        href: "/bibliotheque/phototheque",
        description: "Toutes les photographies",
      },
      {
        label: "Médiathèque",
        href: "/ressources/mediatheque",
        description: "Photos et médias",
      },
      {
        label: "Documents",
        href: "/bibliotheque/documents",
        description: "Documents institutionnels",
      },
      {
        label: "Rapports",
        href: "/bibliotheque/rapports",
        description: "Rapports et publications",
      },
      {
        label: "Appels d’offres",
        href: "/ressources/appels-offres",
        description: "Consultations et AO",
      },
      {
        label: "Opportunités",
        href: "/ressources/opportunites",
        description: "Carrières et collaborations",
      },
      {
        label: "Newsletter",
        href: "/ressources/newsletter",
        description: "Restez informés",
      },
    ],
  },
  { label: "Contact", href: "/contact" },
];

/** Liens toujours visibles dès le mode desktop compact. */
export const desktopNavPrimaryHrefs = [
  "/",
  "/qui-sommes-nous",
  "/actions",
  "/impact",
] as const;

/** Liens déplacés dans « Plus » entre 1280 et 1439 px. */
export const desktopNavSecondaryHrefs = [
  "/bibliotheque",
  "/actualites",
  "/ressources",
  "/contact",
] as const;

export function getDesktopNavPrimary(): PublicNavItem[] {
  return publicNavigation.filter((item) =>
    (desktopNavPrimaryHrefs as readonly string[]).includes(item.href),
  );
}

export function getDesktopNavSecondary(): PublicNavItem[] {
  return publicNavigation.filter((item) =>
    (desktopNavSecondaryHrefs as readonly string[]).includes(item.href),
  );
}

export const publicCtas = [
  {
    label: "Nous rejoindre",
    href: "/rejoindre-equipe",
    variant: "secondary" as const,
    icon: "user" as const,
  },
  {
    label: "Soutenir l’AFD",
    href: "/soutenir",
    variant: "primary" as const,
    icon: "heart" as const,
  },
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
    { label: "Bibliothèque", href: "/bibliotheque" },
    { label: "Rejoindre l’équipe", href: "/rejoindre-equipe" },
    { label: "Nos partenaires", href: "/partenaires" },
    { label: "Devenir partenaire", href: "/partenariat" },
    { label: "Soutenir l’AFD", href: "/soutenir" },
    { label: "Newsletter", href: "/ressources/newsletter" },
    { label: "Contact", href: "/contact" },
  ],
} as const;

export function isNavItemActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
