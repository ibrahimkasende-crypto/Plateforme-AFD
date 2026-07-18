import { afdImages, type AfdImageAsset } from "@/config/afd-images";

export type ImpactBannerSlide = {
  image: AfdImageAsset;
  /** Message affiché sur la bannière (témoignage / remerciement). */
  message: string;
  attribution: string;
};

/**
 * Bannières « Histoire d’impact » — messages illustratifs à remplacer
 * par des témoignages officiels documentés.
 */
export const impactBannerSlides: ImpactBannerSlide[] = [
  {
    image: afdImages.histoireImpact,
    message:
      "Merci à l’AFD de nous accompagner avec dignité et respect.",
    attribution: "Témoignage communautaire",
  },
  {
    image: afdImages.impactGallery[0]!,
    message:
      "Grâce à l’AFD, les femmes de notre quartier trouvent une voix et des moyens d’agir.",
    attribution: "Bénéficiaire accompagnée",
  },
  {
    image: afdImages.impactGallery[1]!,
    message:
      "Ensemble avec l’AFD, nous construisons des réponses durables pour nos familles.",
    attribution: "Partenaire local",
  },
  {
    image: afdImages.impactGallery[2]!,
    message:
      "L’AFD est restée à nos côtés quand l’urgence a frappé. Nous n’oublierons pas.",
    attribution: "Communauté soutenue",
  },
  {
    image: afdImages.impactGallery[3]!,
    message:
      "Un grand merci à l’Alliance des Femmes pour le Développement pour son engagement.",
    attribution: "Remerciement terrain",
  },
  {
    image: afdImages.actionsTerrain[0]!,
    message:
      "Avec l’AFD, l’espoir redevient possible — chaque action compte pour nous.",
    attribution: "Témoignage d’impact",
  },
  {
    image: afdImages.actionsTerrain[1]!,
    message:
      "Nous remercions l’AFD d’investir dans les femmes et les jeunes de notre province.",
    attribution: "Acteur communautaire",
  },
  {
    image: afdImages.actionsTerrain[2]!,
    message:
      "L’AFD ne parle pas à notre place : elle marche avec nous.",
    attribution: "Femme leader locale",
  },
];
