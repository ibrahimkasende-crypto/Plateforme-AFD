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
      "Le lavage des mains devient un geste simple quand le matériel est là, visible et accessible.",
    attribution: "Activité WASH",
  },
  {
    image: afdImages.impactGallery[0]!,
    message:
      "Informer les mères et les familles, c’est déjà renforcer la prévention.",
    attribution: "Santé communautaire",
  },
  {
    image: afdImages.impactGallery[1]!,
    message:
      "Parler des droits des femmes et des filles ouvre un espace de protection et d’écoute.",
    attribution: "Sensibilisation aux droits",
  },
  {
    image: afdImages.impactGallery[2]!,
    message:
      "Des dispositifs concrets permettent aux familles de pratiquer l’hygiène au quotidien.",
    attribution: "Prévention WASH",
  },
  {
    image: afdImages.impactGallery[3]!,
    message:
      "La proximité institutionnelle aide l’AFD à mieux coordonner ses réponses sur le terrain.",
    attribution: "Visite institutionnelle",
  },
  {
    image: afdImages.actionsTerrain[0]!,
    message:
      "Écouter les personnes déplacées permet de partir des besoins réels avant d’agir.",
    attribution: "Mission terrain",
  },
  {
    image: afdImages.actionsTerrain[1]!,
    message:
      "La démonstration rend les messages d’hygiène plus clairs pour toute la communauté.",
    attribution: "Sensibilisation WASH",
  },
  {
    image: afdImages.actionsTerrain[2]!,
    message:
      "Les journées de sensibilisation rapprochent les messages de protection des femmes et des filles.",
    attribution: "Droits des femmes",
  },
];
