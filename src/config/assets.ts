/**
 * Chemins centralisés des assets publics AFD.
 * Les fichiers vivent dans `public/assets/` → URL `/assets/...`.
 */
export const assets = {
  brand: {
    logo: "/assets/brand/Logo_AFD.jpeg",
  },
  home: {
    hero: "/assets/home/Femmes_AFD.png",
    presentation: "/assets/home/presentation_afd.png",
  },
  programmes: {
    directory: "/assets/programmes",
    /** Visuels de secours lorsque `image_url` n’est pas encore renseigné. */
    fallbacks: [
      "/images/afd/programmes/autonomisation-economique.webp",
      "/images/afd/programmes/sante-nutrition.webp",
      "/images/afd/programmes/wash.webp",
      "/images/afd/programmes/protection-droits-femmes.webp",
    ],
  },
  projets: {
    directory: "/assets/projets",
  },
  impact: {
    directory: "/assets/impact",
    histoirePrincipale: "/assets/impact/histoire-principale.webp",
  },
  actualites: {
    directory: "/assets/actualites",
  },
  partenaires: {
    directory: "/assets/partenaires",
  },
  mediatheque: {
    directory: "/assets/mediatheque",
  },
  newsletter: {
    directory: "/assets/newsletter",
  },
  equipe: {
    directory: "/assets/equipe",
  },
  zones: {
    directory: "/assets/zones",
  },
  placeholders: {
    directory: "/assets/placeholders",
  },
  og: {
    directory: "/assets/og",
    defaultShare: "/assets/brand/Logo_AFD.jpeg",
  },
} as const;

export type AssetBrandKey = keyof typeof assets.brand;
export type AssetHomeKey = keyof typeof assets.home;
