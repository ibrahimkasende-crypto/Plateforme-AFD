export type PublicationModule = {
  slug: string;
  title: string;
  description: string;
  href: string;
  statusLabel: string;
};

export const PUBLICATION_MODULES: readonly PublicationModule[] = [
  {
    slug: "actualites",
    title: "Actualités",
    description: "Articles, communiqués et mises en avant.",
    href: "/admin/publications/actualites",
    statusLabel: "Éditorial",
  },
  {
    slug: "archives",
    title: "Archives terrain",
    description: "Événements, galeries et preuves classés par domaine.",
    href: "/admin/publications/archives",
    statusLabel: "Preuves",
  },
  {
    slug: "programmes",
    title: "Programmes",
    description: "Fiches programmes, couvertures et relations.",
    href: "/admin/publications/programmes",
    statusLabel: "Programmes",
  },
  {
    slug: "histoires-impact",
    title: "Histoires d’impact",
    description: "Récits publiés avec consentement obligatoire.",
    href: "/admin/publications/histoires-impact",
    statusLabel: "Impact",
  },
  {
    slug: "temoignages",
    title: "Témoignages",
    description: "Citations publiées avec consentement explicite.",
    href: "/admin/publications/temoignages",
    statusLabel: "Impact",
  },
  {
    slug: "pages",
    title: "Pages institutionnelles",
    description: "Titres, sections et SEO des pages publiques.",
    href: "/admin/publications/pages",
    statusLabel: "CMS",
  },
  {
    slug: "zones-intervention",
    title: "Zones d’intervention",
    description: "Provinces couvertes et données cartographiques.",
    href: "/admin/publications/zones-intervention",
    statusLabel: "Carte",
  },
  {
    slug: "notre-impact",
    title: "Notre impact",
    description: "Indicateurs validés affichés sur le site public.",
    href: "/admin/publications/notre-impact",
    statusLabel: "Indicateurs",
  },
  {
    slug: "appels-offres",
    title: "Appels d’offres",
    description: "AO publics et documents associés.",
    href: "/admin/publications/appels-offres",
    statusLabel: "AO",
  },
  {
    slug: "opportunites",
    title: "Opportunités",
    description: "Offres d’emploi, stages et consultances.",
    href: "/admin/publications/opportunites",
    statusLabel: "RH",
  },
  {
    slug: "documents",
    title: "Documents",
    description: "Centre documentaire public.",
    href: "/admin/publications/documents",
    statusLabel: "Docs",
  },
  {
    slug: "rapports",
    title: "Rapports",
    description: "Rapports publics téléchargeables.",
    href: "/admin/publications/rapports",
    statusLabel: "Rapports",
  },
] as const;

export const PUBLICATION_STATUSES = [
  "brouillon",
  "en_revision",
  "approuve",
  "programme",
  "publie",
  "depublie",
  "archive",
] as const;

export type PublicationStatus = (typeof PUBLICATION_STATUSES)[number];
