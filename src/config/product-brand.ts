/**
 * Identité de la plateforme d’administration AFD.
 * Source unique — ne pas dupliquer ces chaînes dans les composants.
 */
export const productBrand = {
  productName: "AFD ASBL",
  publisherName: "Alliance des Femmes pour le Développement",
  productDescription:
    "Plateforme d’administration institutionnelle",
  productTaglineShort: "Administration AFD",
  poweredByLabel: "Plateforme officielle AFD",
  propelledByLabel: "Pilotage institutionnel AFD",
  supportName: "Support AFD",
  tenantLabel: "Organisation",
  version: process.env.NEXT_PUBLIC_APP_VERSION ?? "0.1.0",
  logo: {
    src: "/assets/brand/Logo_AFD.jpeg",
    alt: "Logo officiel AFD — Alliance des Femmes pour le Développement",
    width: 64,
    height: 64,
  },
  publisherLogo: {
    src: "/assets/brand/Logo_AFD.jpeg",
    alt: "Logo officiel AFD",
    width: 48,
    height: 48,
  },
  adminMetadata: {
    title: "Administration AFD | AFD ASBL",
    description:
      "Plateforme de gestion de l’Alliance des Femmes pour le Développement.",
  },
  reportFooter:
    "Généré par la plateforme AFD ASBL",
} as const;

export type ProductBrand = typeof productBrand;
