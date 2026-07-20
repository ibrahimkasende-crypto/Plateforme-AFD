/**
 * Identité produit LISUNGI et éditeur Lisungi Hub.
 * Source unique — ne pas dupliquer ces chaînes dans les composants.
 */
export const productBrand = {
  productName: "LISUNGI",
  publisherName: "Lisungi Hub",
  productDescription:
    "Solution de gestion humanitaire et organisationnelle",
  productTaglineShort: "Solution de gestion",
  poweredByLabel: "Un produit Lisungi Hub",
  propelledByLabel: "Propulsé par Lisungi Hub",
  supportName: "Support Lisungi Hub",
  tenantLabel: "Organisation active",
  version: process.env.NEXT_PUBLIC_LISUNGI_VERSION ?? "0.1.0",
  logo: {
    src: "/images/afd/LisungiHub/logo_lisungi.png",
    alt: "Logo LISUNGI — produit Lisungi Hub",
    width: 64,
    height: 64,
  },
  publisherLogo: {
    src: "/images/afd/LisungiHub/logo_lisungi.png",
    alt: "Logo Lisungi Hub",
    width: 48,
    height: 48,
  },
  adminMetadata: {
    title: "LISUNGI | Administration AFD",
    description:
      "Plateforme de gestion de l’Alliance des Femmes pour le Développement, propulsée par Lisungi Hub.",
  },
  reportFooter:
    "Généré avec LISUNGI — un produit Lisungi Hub",
} as const;

export type ProductBrand = typeof productBrand;
