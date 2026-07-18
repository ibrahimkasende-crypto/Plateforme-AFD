/**
 * Données FICTIVES pour démontrer la carte interactive.
 * Ne jamais les enregistrer dans Supabase comme données officielles.
 */
export type DemoInterventionZone = {
  province: string;
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
    svgId: "CDKN",
    code: "KN",
    projects: 3,
    beneficiaries: 980,
    activities: 12,
    sectors: ["Autonomisation économique", "Éducation"],
    programmePrincipal: "Autonomisation économique des femmes",
    isDemo: true,
  },
  {
    province: "Kongo Central",
    svgId: "CDBC",
    code: "BC",
    projects: 2,
    beneficiaries: 640,
    activities: 8,
    sectors: ["WASH", "Santé"],
    programmePrincipal: "Eau, hygiène et assainissement",
    isDemo: true,
  },
  {
    province: "Sud-Kivu",
    svgId: "CDSK",
    code: "SK",
    projects: 4,
    beneficiaries: 1520,
    activities: 18,
    sectors: ["Protection", "Urgences"],
    programmePrincipal: "Protection et promotion des droits",
    isDemo: true,
  },
  {
    province: "Nord-Kivu",
    svgId: "CDNK",
    code: "NK",
    projects: 3,
    beneficiaries: 1210,
    activities: 15,
    sectors: ["Protection", "Nutrition"],
    programmePrincipal: "Santé communautaire et nutrition",
    isDemo: true,
  },
  {
    province: "Ituri",
    svgId: "CDIT",
    code: "IT",
    projects: 2,
    beneficiaries: 870,
    activities: 10,
    sectors: ["Urgences", "Protection"],
    programmePrincipal: "Réponses d’urgence et cohésion",
    isDemo: true,
  },
  {
    province: "Tanganyika",
    svgId: "CDTA",
    code: "TA",
    projects: 1,
    beneficiaries: 420,
    activities: 6,
    sectors: ["Agriculture", "Autonomisation économique"],
    programmePrincipal: "Sécurité alimentaire",
    isDemo: true,
  },
  {
    province: "Kasaï",
    svgId: "CDKS",
    code: "KS",
    projects: 2,
    beneficiaries: 760,
    activities: 9,
    sectors: ["Éducation", "Autonomisation économique"],
    programmePrincipal: "Éducation et leadership",
    isDemo: true,
  },
  {
    province: "Kasaï Central",
    svgId: "CDKC",
    code: "KC",
    projects: 2,
    beneficiaries: 690,
    activities: 7,
    sectors: ["Santé", "WASH"],
    programmePrincipal: "Santé communautaire et nutrition",
    isDemo: true,
  },
] as const;

export function isDemoContentEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ENABLE_DEMO_CONTENT === "true";
}
