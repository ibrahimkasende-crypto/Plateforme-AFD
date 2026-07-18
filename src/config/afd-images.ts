export type ConsentStatus = "approved" | "to-review" | "not-required";

export type AfdImageAsset = {
  src: string;
  alt: string;
  objectPosition: string;
  source: string;
  consentStatus: ConsentStatus;
  childrenVisible?: boolean;
};

/**
 * Manifeste des images web sélectionnées depuis la banque AFD.
 * Chemins alignés sur les fichiers présents dans public/images/afd.
 * Alt descriptifs uniquement — sans interprétation non vérifiée.
 */
export const afdImages = {
  heroCandidate: {
    src: "/images/afd/home/hero-afd.webp",
    alt: "Groupe de personnes photographiées en extérieur dans un contexte associatif.",
    objectPosition: "68% center",
    source: "Banque d’images officielle AFD",
    consentStatus: "to-review",
  },
  programmes: {
    autonomisation: {
      src: encodeURI("/images/afd/programmes/autonomisation-economique.jpg"),
      alt: "Personnes participant à une activité communautaire en extérieur.",
      objectPosition: "50% 40%",
      source: "Banque d’images officielle AFD",
      consentStatus: "to-review",
      childrenVisible: true,
    },
    sante: {
      src: encodeURI("/images/afd/programmes/Femmes santes Maternelle.jpg"),
      alt: "Scène communautaire photographiée en extérieur.",
      objectPosition: "50% 45%",
      source: "Banque d’images officielle AFD",
      consentStatus: "to-review",
      childrenVisible: true,
    },
    wash: {
      src: encodeURI("/images/afd/programmes/Femme et acces a l'eau.jpg"),
      alt: "Groupe de femmes rassemblées lors d’une activité en extérieur.",
      objectPosition: "50% 40%",
      source: "Banque d’images officielle AFD",
      consentStatus: "to-review",
    },
    protection: {
      src: encodeURI("/images/afd/programmes/Femmes face aux violences.jpg"),
      alt: "Portrait institutionnel lié à l’équipe AFD.",
      objectPosition: "50% 30%",
      source: "Banque d’images officielle AFD",
      consentStatus: "to-review",
    },
    education: {
      src: encodeURI("/images/afd/programmes/Femme et leadership.jpg"),
      alt: "Illustration liée au leadership et à l’éducation des femmes.",
      objectPosition: "50% 35%",
      source: "Banque d’images officielle AFD",
      consentStatus: "to-review",
    },
    urgences: {
      src: encodeURI(
        "/images/afd/programmes/Femmes dans la reponse Humanitaire.jpg",
      ),
      alt: "Illustration liée à la réponse humanitaire.",
      objectPosition: "50% 40%",
      source: "Banque d’images officielle AFD",
      consentStatus: "to-review",
    },
  },
  actionsTerrain: [
    {
      src: "/images/afd/actions-terrain/action-terrain-01.webp",
      alt: "Illustration d’une activité AFD en extérieur.",
      objectPosition: "50% 40%",
      source: "Banque d’images officielle AFD",
      consentStatus: "to-review" as const,
      childrenVisible: true,
    },
    {
      src: "/images/afd/actions-terrain/action-terrain-02.webp",
      alt: "Illustration d’une activité AFD en extérieur.",
      objectPosition: "50% 45%",
      source: "Banque d’images officielle AFD",
      consentStatus: "to-review" as const,
      childrenVisible: true,
    },
    {
      src: "/images/afd/actions-terrain/action-terrain-03.webp",
      alt: "Groupe photographié dans un contexte associatif.",
      objectPosition: "50% 40%",
      source: "Banque d’images officielle AFD",
      consentStatus: "to-review" as const,
    },
  ],
  actualites: [
    {
      src: encodeURI("/images/afd/actualites/Urgence a Ituri.jpg"),
      alt: "Illustration d’une activité communautaire AFD.",
      objectPosition: "50% 40%",
      source: "Banque d’images officielle AFD",
      consentStatus: "to-review" as const,
    },
    {
      src: encodeURI("/images/afd/actualites/Expension AFD.jpg"),
      alt: "Illustration d’une séance de sensibilisation.",
      objectPosition: "50% 45%",
      source: "Banque d’images officielle AFD",
      consentStatus: "to-review" as const,
    },
    {
      src: encodeURI("/images/afd/actualites/Amelioration de la sante.jpg"),
      alt: "Illustration d’une rencontre institutionnelle.",
      objectPosition: "50% 40%",
      source: "Banque d’images officielle AFD",
      consentStatus: "to-review" as const,
    },
  ],
  histoireImpact: {
    src: "/images/afd/impact/histoire-principale.webp",
    alt: "Portrait photographique pouvant illustrer une histoire d’impact à documenter.",
    objectPosition: "50% 35%",
    source: "Banque d’images officielle AFD",
    consentStatus: "to-review",
  },
} as const;

export const programmeFallbackImages = [
  afdImages.programmes.autonomisation.src,
  afdImages.programmes.sante.src,
  afdImages.programmes.wash.src,
  afdImages.programmes.protection.src,
  afdImages.programmes.education.src,
  afdImages.programmes.urgences.src,
] as const;
