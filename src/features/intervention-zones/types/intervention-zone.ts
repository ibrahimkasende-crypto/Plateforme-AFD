export type ProvinceIntensity = "none" | "low" | "medium" | "high";

export type InterventionProvince = {
  id: string;
  code: string;
  name: string;
  /** Ville ou territoire principal affiché (distinct du nom de province). */
  mainLocality?: string | null;
  active: boolean;
  projectCount: number;
  activityCount?: number | null;
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
