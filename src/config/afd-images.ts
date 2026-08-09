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
 * Banque d'images AFD.
 * En production / avec Supabase : URLs Storage (bucket afd-media).
 * Fallback local : /assets/Banque des images AFD - Classees (dev hors Storage).
 */
const LOCAL_BANK_PREFIX = "/assets/Banque des images AFD - Classees";
const STORAGE_BUCKET = "afd-media";
const STORAGE_BANK_PREFIX = "banque";
/** Projet Supabase AFD mandaté — media publics toujours ici en production. */
const MANDATED_SUPABASE_URL = "https://mxxuxnoqnwjygawvvhcb.supabase.co";

/** Base publique Storage, ou null si URL Supabase absente (dev local → fichiers locaux). */
export function getAfdMediaPublicBase(): string | null {
  const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim().replace(/\/$/, "");
  const isProd =
    process.env.NODE_ENV === "production" ||
    process.env.NEXT_PUBLIC_APP_ENV === "production";

  // En prod : toujours le bucket AFD mandaté (évite un mauvais projet Hostinger).
  if (isProd) {
    return `${MANDATED_SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}`;
  }

  if (envUrl) {
    return `${envUrl}/storage/v1/object/public/${STORAGE_BUCKET}`;
  }
  return null;
}

function encodeStoragePath(relativePath: string): string {
  return relativePath
    .split("/")
    .filter(Boolean)
    .map((segment) => {
      const sanitized = segment
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9._-]+/g, "_");
      return encodeURIComponent(sanitized);
    })
    .join("/");
}

/** URL publique d’un fichier de la banque (chemin relatif type `01_sante/fichier.jpg`). */
export function afdBankImage(path: string) {
  const base = getAfdMediaPublicBase();
  if (base) {
    return `${base}/${STORAGE_BANK_PREFIX}/${encodeStoragePath(path)}`;
  }
  return encodeURI(`${LOCAL_BANK_PREFIX}/${path}`);
}

/**
 * Normalise une URL image :
 * - http(s) → inchangé
 * - chemin banque locale → URL Storage si possible
 * - autre /assets/ → encodeURI local
 */
export function normalizeLibraryAssetUrl(src: string): string {
  if (!src) return src;
  if (/^https?:\/\//i.test(src)) return src;

  let decoded = src;
  try {
    decoded = decodeURI(src);
  } catch {
    decoded = src;
  }

  const marker = "Banque des images AFD - Classees/";
  const markerIdx = decoded.indexOf(marker);
  if (markerIdx !== -1) {
    const relative = decoded.slice(markerIdx + marker.length);
    const base = getAfdMediaPublicBase();
    if (base) {
      return `${base}/${STORAGE_BANK_PREFIX}/${encodeStoragePath(relative)}`;
    }
    return encodeURI(`${LOCAL_BANK_PREFIX}/${relative}`);
  }

  if (src.startsWith("/assets/")) return encodeURI(src);
  return src;
}

export const AFD_MEDIA_BUCKET = STORAGE_BUCKET;
export const AFD_MEDIA_BANK_PREFIX = STORAGE_BANK_PREFIX;

export const afdImages = {
  heroCandidate: {
    src: afdBankImage(
      "24_visites_institutionnelles/afd_visites_institutionnelles_visite_mcz_hgr_mambasa_012.jpg",
    ),
    alt: "Équipe AFD et partenaires devant une structure de santé à Mambasa.",
    objectPosition: "50% center",
    source: "Banque d’images officielle AFD",
    consentStatus: "to-review",
  },
  /** Fonds hero scrollables / diaporama — banque d’images classée AFD. */
  homeHeroSlides: [
    {
      src: afdBankImage(
        "24_visites_institutionnelles/afd_visites_institutionnelles_visite_mcz_hgr_mambasa_012.jpg",
      ),
      alt: "Équipe AFD et partenaires réunis lors d’une visite institutionnelle à Mambasa.",
      objectPosition: "50% 52%",
      source: "Banque d’images officielle AFD",
      consentStatus: "to-review" as const,
    },
    {
      src: afdBankImage(
        "01_sante/afd_sante_sensibilisation_cpn_salama_012.jpg",
      ),
      alt: "Femmes réunies lors d’une sensibilisation en santé communautaire.",
      objectPosition: "50% 44%",
      source: "Banque d’images officielle AFD",
      consentStatus: "to-review" as const,
    },
    {
      src: afdBankImage(
        "06_wash/afd_wash_sensibilisation_dotation_lavage_mains_site_ceca_20_makoko_1_007.jpg",
      ),
      alt: "Dispositifs de lavage des mains installés pendant une action WASH.",
      objectPosition: "50% 54%",
      source: "Banque d’images officielle AFD",
      consentStatus: "to-review" as const,
    },
    {
      src: afdBankImage(
        "17_missions_terrain/afd_missions_terrain_visite_evaluation_site_deplaces_site_ceca_20_makoko_1_010.jpg",
      ),
      alt: "Équipe AFD en visite d’évaluation dans un site de déplacés.",
      objectPosition: "50% 48%",
      source: "Banque d’images officielle AFD",
      consentStatus: "to-review" as const,
    },
  ],
  programmes: {
    autonomisation: {
      src: afdBankImage(
        "19_gouvernance/afd_gouvernance_remise_documents_coordination_tshopo_005.jpg",
      ),
      alt: "Délégation AFD devant une affiche liée à la promotion économique et à l’entrepreneuriat.",
      objectPosition: "48% 48%",
      source: "Banque d’images officielle AFD",
      consentStatus: "to-review",
    },
    sante: {
      src: afdBankImage(
        "01_sante/afd_sante_sensibilisation_cpn_salama_012.jpg",
      ),
      alt: "Femmes réunies pour une séance de sensibilisation en santé communautaire.",
      objectPosition: "50% 44%",
      source: "Banque d’images officielle AFD",
      consentStatus: "to-review",
      childrenVisible: true,
    },
    wash: {
      src: afdBankImage(
        "06_wash/afd_wash_sensibilisation_dotation_lavage_mains_site_ceca_20_makoko_1_007.jpg",
      ),
      alt: "Dispositifs de lavage des mains installés lors d’une activité WASH.",
      objectPosition: "50% 52%",
      source: "Banque d’images officielle AFD",
      consentStatus: "to-review",
    },
    protection: {
      src: afdBankImage(
        "22_sensibilisation/afd_sensibilisation_sensibilisation_8_mars_camp_kabila_004.jpg",
      ),
      alt: "Équipe AFD lors d’une activité de sensibilisation sur les droits des femmes et des filles.",
      objectPosition: "50% 45%",
      source: "Banque d’images officielle AFD",
      consentStatus: "to-review",
    },
    education: {
      src: afdBankImage(
        "19_gouvernance/afd_gouvernance_remise_documents_coordination_tshopo_001.jpg",
      ),
      alt: "Remise de documents lors d’une activité institutionnelle de gouvernance.",
      objectPosition: "50% 46%",
      source: "Banque d’images officielle AFD",
      consentStatus: "to-review",
    },
    urgences: {
      src: afdBankImage(
        "17_missions_terrain/afd_missions_terrain_visite_evaluation_site_deplaces_site_ceca_20_makoko_1_010.jpg",
      ),
      alt: "Équipe AFD évaluant les besoins dans un site de déplacés.",
      objectPosition: "50% 48%",
      source: "Banque d’images officielle AFD",
      consentStatus: "to-review",
      childrenVisible: true,
    },
  },
  actionsTerrain: [
    {
      src: afdBankImage(
        "17_missions_terrain/afd_missions_terrain_visite_evaluation_site_deplaces_site_ceca_20_makoko_1_010.jpg",
      ),
      alt: "Équipe AFD en échange avec des habitants dans un site de déplacés.",
      objectPosition: "50% 48%",
      source: "Banque d’images officielle AFD",
      consentStatus: "to-review" as const,
      childrenVisible: true,
    },
    {
      src: afdBankImage(
        "06_wash/afd_wash_sensibilisation_dotation_lavage_mains_site_ceca_20_makoko_1_017.jpg",
      ),
      alt: "Démonstration autour de dispositifs de lavage des mains.",
      objectPosition: "50% 52%",
      source: "Banque d’images officielle AFD",
      consentStatus: "to-review" as const,
    },
    {
      src: afdBankImage(
        "22_sensibilisation/afd_sensibilisation_sensibilisation_8_mars_camp_kabila_007.jpg",
      ),
      alt: "Groupe AFD photographié lors d’une sensibilisation sur les droits des femmes.",
      objectPosition: "50% 45%",
      source: "Banque d’images officielle AFD",
      consentStatus: "to-review" as const,
    },
  ],
  actualites: [
    {
      src: afdBankImage(
        "01_sante/afd_sante_sensibilisation_cpn_salama_011.jpg",
      ),
      alt: "Gilet de sensibilisation Ebola lors d’une activité de prévention communautaire.",
      objectPosition: "50% 46%",
      source: "Banque d’images officielle AFD",
      consentStatus: "to-review" as const,
    },
    {
      src: afdBankImage(
        "17_missions_terrain/afd_missions_terrain_visite_evaluation_site_deplaces_site_ceca_20_makoko_1_010.jpg",
      ),
      alt: "Visite d’évaluation des besoins dans un site de déplacés.",
      objectPosition: "50% 48%",
      source: "Banque d’images officielle AFD",
      consentStatus: "to-review" as const,
    },
    {
      src: afdBankImage(
        "24_visites_institutionnelles/afd_visites_institutionnelles_visite_mcz_hgr_mambasa_012.jpg",
      ),
      alt: "Équipe AFD et partenaires locaux réunis lors d’une visite institutionnelle.",
      objectPosition: "50% 52%",
      source: "Banque d’images officielle AFD",
      consentStatus: "to-review" as const,
    },
  ],
  histoireImpact: {
    src: afdBankImage(
      "06_wash/afd_wash_sensibilisation_dotation_lavage_mains_site_ceca_20_makoko_1_017.jpg",
    ),
    alt: "Démonstration communautaire autour de dispositifs de lavage des mains.",
    objectPosition: "50% 52%",
    source: "Banque d’images officielle AFD",
    consentStatus: "to-review",
  },
  impactGallery: [
    {
      src: afdBankImage(
        "01_sante/afd_sante_sensibilisation_cpn_salama_012.jpg",
      ),
      alt: "Femmes réunies pendant une activité de sensibilisation en santé communautaire.",
      objectPosition: "50% 44%",
      source: "Banque d’images officielle AFD",
      consentStatus: "to-review" as const,
    },
    {
      src: afdBankImage(
        "22_sensibilisation/afd_sensibilisation_sensibilisation_8_mars_camp_kabila_004.jpg",
      ),
      alt: "Sensibilisation sur les droits des femmes et des filles.",
      objectPosition: "50% 45%",
      source: "Banque d’images officielle AFD",
      consentStatus: "to-review" as const,
    },
    {
      src: afdBankImage(
        "06_wash/afd_wash_sensibilisation_dotation_lavage_mains_site_ceca_20_makoko_1_007.jpg",
      ),
      alt: "Dispositifs de lavage des mains préparés pour une activité WASH.",
      objectPosition: "50% 52%",
      source: "Banque d’images officielle AFD",
      consentStatus: "to-review" as const,
    },
    {
      src: afdBankImage(
        "24_visites_institutionnelles/afd_visites_institutionnelles_visite_mcz_hgr_mambasa_012.jpg",
      ),
      alt: "Équipe AFD et partenaires locaux devant une structure de santé.",
      objectPosition: "50% 52%",
      source: "Banque d’images officielle AFD",
      consentStatus: "to-review" as const,
    },
  ],
} as const;

export const programmeFallbackImages = [
  afdImages.programmes.autonomisation.src,
  afdImages.programmes.sante.src,
  afdImages.programmes.wash.src,
  afdImages.programmes.protection.src,
  afdImages.programmes.education.src,
  afdImages.programmes.urgences.src,
] as const;
