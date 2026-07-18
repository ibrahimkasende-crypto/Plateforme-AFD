/**
 * Données FICTIVES pour démontrer la carte interactive (8 provinces AFD).
 * Ne jamais les présenter comme des résultats officiels.
 * isDemo = true → badge « Données de démonstration ».
 */
export type DemoInterventionZone = {
  province: string;
  /** Ville / territoire principal affiché (séparé du nom de province). */
  mainLocality: string;
  /** Identifiant SVG Simplemaps (ex. CDKN). */
  svgId: string;
  code: string;
  projects: number;
  beneficiaries: number;
  activities: number;
  sectors: string[];
  programmePrincipal: string;
  isDemo: true;
};

export const DEMO_INTERVENTION_ZONES: readonly DemoInterventionZone[] = [
  {
    province: "Kinshasa",
    mainLocality: "Kinshasa",
    svgId: "CDKN",
    code: "KN",
    projects: 3,
    beneficiaries: 420,
    activities: 8,
    sectors: ["Autonomisation économique", "Éducation"],
    programmePrincipal: "Autonomisation économique des femmes",
    isDemo: true,
  },
  {
    province: "Kwilu",
    mainLocality: "Kikwit",
    svgId: "CDKL",
    code: "KL",
    projects: 2,
    beneficiaries: 260,
    activities: 5,
    sectors: ["Santé communautaire", "Protection"],
    programmePrincipal: "Santé et protection communautaire",
    isDemo: true,
  },
  {
    province: "Kwango",
    mainLocality: "Kenge",
    svgId: "CDKG",
    code: "KG",
    projects: 1,
    beneficiaries: 140,
    activities: 3,
    sectors: ["Sécurité alimentaire"],
    programmePrincipal: "Sécurité alimentaire",
    isDemo: true,
  },
  {
    province: "Haut-Katanga",
    mainLocality: "Lubumbashi",
    svgId: "CDHK",
    code: "HK",
    projects: 2,
    beneficiaries: 230,
    activities: 4,
    sectors: ["Autonomisation économique", "VBG"],
    programmePrincipal: "Autonomisation et protection",
    isDemo: true,
  },
  {
    province: "Ituri",
    mainLocality: "Bunia et Aru",
    svgId: "CDIT",
    code: "IT",
    projects: 2,
    beneficiaries: 310,
    activities: 6,
    sectors: ["Urgences", "Protection"],
    programmePrincipal: "Urgences et protection",
    isDemo: true,
  },
  {
    province: "Tshopo",
    mainLocality: "Kisangani",
    svgId: "CDTO",
    code: "TO",
    projects: 1,
    beneficiaries: 180,
    activities: 4,
    sectors: ["WASH", "Santé"],
    programmePrincipal: "WASH et santé",
    isDemo: true,
  },
  {
    province: "Tshuapa",
    mainLocality: "Boende",
    svgId: "CDTU",
    code: "TU",
    projects: 1,
    beneficiaries: 125,
    activities: 3,
    sectors: ["Agriculture", "Sécurité alimentaire"],
    programmePrincipal: "Sécurité alimentaire",
    isDemo: true,
  },
  {
    province: "Nord-Kivu",
    mainLocality: "Beni",
    svgId: "CDNK",
    code: "NK",
    projects: 2,
    beneficiaries: 350,
    activities: 7,
    sectors: ["Urgences", "Protection", "Santé"],
    programmePrincipal: "Urgences et protection",
    isDemo: true,
  },
] as const;

export function isDemoContentEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ENABLE_DEMO_CONTENT === "true";
}
