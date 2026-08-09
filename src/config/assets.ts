/**
 * Chemins centralisés des assets publics AFD.
 * Images éditoriales → Supabase Storage (afd-media).
 * Brand / logos partenaires → fichiers locaux dans `public/`.
 */
import {
  afdBankImage,
  afdImages,
  programmeFallbackImages,
} from "@/config/afd-images";

export const assets = {
  brand: {
    logo: "/assets/brand/Logo_AFD.jpeg",
  },
  home: {
    /** Hero : banque Storage (pas de PNG local dans le ZIP). */
    hero: afdImages.homeHeroSlides[0].src,
    /** Image présentation accueil — Storage. */
    presentation: afdBankImage(
      "24_visites_institutionnelles/afd_visites_institutionnelles_visite_mcz_hgr_mambasa_012.jpg",
    ),
  },
  programmes: {
    directory: "/assets/programmes",
    /** Visuels de secours lorsque `image_url` n’est pas encore renseigné. */
    fallbacks: [...programmeFallbackImages],
  },
  projets: {
    directory: "/assets/projets",
  },
  impact: {
    directory: "/assets/impact",
    histoirePrincipale: afdImages.histoireImpact.src,
  },
  actualites: {
    directory: "/assets/actualites",
  },
  partenaires: {
    directory: "/images/afd/partenaires",
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
