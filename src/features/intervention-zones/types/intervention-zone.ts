export type ProvinceIntensity = "none" | "low" | "medium" | "high";

export type InterventionProvince = {
  id: string;
  code: string;
  name: string;
  active: boolean;
  projectCount: number;
  beneficiaries: number | null;
  sectors: string[];
  programmes: Array<{ id: string; title: string; slug: string }>;
  projects: Array<{
    id: string;
    title: string;
    slug: string;
    beneficiaries: number | null;
  }>;
  intensity: ProvinceIntensity;
  href: string;
};

export type InterventionZonesSummary = {
  activeProvinces: number;
  totalProjects: number;
  totalBeneficiaries: number | null;
  totalSectors: number;
  totalProgrammes: number;
};

export type InterventionZonesBundle = {
  provinces: InterventionProvince[];
  summary: InterventionZonesSummary;
  source: "supabase" | "unavailable" | "demo";
  hasPublishedLocations: boolean;
  /** True uniquement lorsque des valeurs de démonstration sont affichées. */
  isDemo: boolean;
};
