import { createClientSafe } from "@/lib/supabase/safe";
import type { Database } from "@/types/database.types";

type Programme = Database["public"]["Tables"]["programmes"]["Row"];
type Projet = Database["public"]["Tables"]["projets"]["Row"];
type Actualite = Database["public"]["Tables"]["actualites"]["Row"];
type Partenaire = Database["public"]["Tables"]["partenaires"]["Row"];

export type PublicImpactStats = {
  personnesAccompagnees: number | null;
  femmesAccompagnees: number | null;
  projetsRealises: number | null;
  provincesCouvertes: number | null;
  partenairesActifs: number | null;
  activitesRealisees: number | null;
  source: "supabase" | "unavailable";
  missing: string[];
};

export type FeaturedProgram = Pick<
  Programme,
  "id" | "slug" | "title" | "description" | "image_url" | "active"
>;

export type FeaturedProject = Pick<
  Projet,
  | "id"
  | "slug"
  | "title"
  | "description"
  | "image_url"
  | "location"
  | "status"
  | "program_id"
  | "beneficiaries"
> & {
  programmeTitle: string | null;
};

export type LatestNews = Pick<
  Actualite,
  | "id"
  | "slug"
  | "title"
  | "excerpt"
  | "image_url"
  | "category"
  | "published_at"
>;

export type ActivePartner = Pick<
  Partenaire,
  "id" | "name" | "logo_url" | "category"
>;

export type InterventionZone = {
  label: string;
  projectCount: number;
  beneficiaries: number | null;
};

export type FeaturedImpactStory = {
  id: string;
  title: string;
  excerpt: string;
  location: string | null;
  imageUrl: string | null;
  href: string;
} | null;

async function withClient<T>(
  fallback: T,
  run: (
    client: NonNullable<Awaited<ReturnType<typeof createClientSafe>>>,
  ) => Promise<T>,
): Promise<T> {
  try {
    const client = await createClientSafe();
    if (!client) return fallback;
    return await run(client);
  } catch {
    return fallback;
  }
}

export async function getPublicImpactStats(): Promise<PublicImpactStats> {
  const missing = [
    "femmesAccompagnees",
    "activitesRealisees",
  ];

  return withClient<PublicImpactStats>(
    {
      personnesAccompagnees: null,
      femmesAccompagnees: null,
      projetsRealises: null,
      provincesCouvertes: null,
      partenairesActifs: null,
      activitesRealisees: null,
      source: "unavailable",
      missing: [
        ...missing,
        "personnesAccompagnees",
        "projetsRealises",
        "provincesCouvertes",
        "partenairesActifs",
      ],
    },
    async (supabase) => {
      const [projetsRes, partenairesRes] = await Promise.all([
        supabase
          .from("projets")
          .select("beneficiaries, location, status, active")
          .eq("active", true),
        supabase.from("partenaires").select("id").eq("active", true),
      ]);

      const projets = projetsRes.data ?? [];
      const partenaires = partenairesRes.data ?? [];

      const personnes = projets.reduce((sum, project) => {
        return sum + (project.beneficiaries ?? 0);
      }, 0);

      const locations = new Set(
        projets
          .map((project) => project.location?.trim())
          .filter((value): value is string => Boolean(value)),
      );

      const completed = projets.filter((project) =>
        ["completed", "terminé", "termine", "achevé", "acheve"].includes(
          (project.status ?? "").toLowerCase(),
        ),
      );

      const nextMissing = [...missing];
      if (personnes === 0) nextMissing.push("personnesAccompagnees");

      return {
        personnesAccompagnees: personnes > 0 ? personnes : null,
        femmesAccompagnees: null,
        projetsRealises:
          completed.length > 0 ? completed.length : projets.length || null,
        provincesCouvertes: locations.size > 0 ? locations.size : null,
        partenairesActifs: partenaires.length > 0 ? partenaires.length : null,
        activitesRealisees: null,
        source: "supabase" as const,
        missing: nextMissing,
      };
    },
  );
}

export async function getFeaturedPrograms(): Promise<FeaturedProgram[]> {
  return withClient([], async (supabase) => {
    const { data, error } = await supabase
      .from("programmes")
      .select("id, slug, title, description, image_url, active")
      .eq("active", true)
      .order("order", { ascending: true })
      .limit(4);

    if (error || !data) return [];
    return data;
  });
}

export async function getFeaturedProjects(): Promise<FeaturedProject[]> {
  return withClient([], async (supabase) => {
    const { data, error } = await supabase
      .from("projets")
      .select(
        "id, slug, title, description, image_url, location, status, program_id, beneficiaries",
      )
      .eq("active", true)
      .order("updated_at", { ascending: false })
      .limit(3);

    if (error || !data) return [];

    const programIds = [
      ...new Set(
        data
          .map((project) => project.program_id)
          .filter((id): id is string => Boolean(id)),
      ),
    ];

    const programmeTitles = new Map<string, string>();
    if (programIds.length > 0) {
      const { data: programmes } = await supabase
        .from("programmes")
        .select("id, title")
        .in("id", programIds);
      programmes?.forEach((programme) => {
        programmeTitles.set(programme.id, programme.title);
      });
    }

    return data.map((project) => ({
      id: project.id,
      slug: project.slug,
      title: project.title,
      description: project.description,
      image_url: project.image_url,
      location: project.location,
      status: project.status,
      program_id: project.program_id,
      beneficiaries: project.beneficiaries,
      programmeTitle: project.program_id
        ? (programmeTitles.get(project.program_id) ?? null)
        : null,
    }));
  });
}

export async function getFeaturedImpactStory(): Promise<FeaturedImpactStory> {
  // Table histoires_impact non encore créée — ne pas inventer de récit.
  return null;
}

export async function getLatestPublishedNews(): Promise<LatestNews[]> {
  return withClient([], async (supabase) => {
    const { data, error } = await supabase
      .from("actualites")
      .select(
        "id, slug, title, excerpt, image_url, category, published_at",
      )
      .eq("published", true)
      .order("published_at", { ascending: false })
      .limit(3);

    if (error || !data) return [];
    return data;
  });
}

export async function getActivePartners(): Promise<ActivePartner[]> {
  return withClient([], async (supabase) => {
    const { data, error } = await supabase
      .from("partenaires")
      .select("id, name, logo_url, category")
      .eq("active", true)
      .order("order", { ascending: true });

    if (error || !data) return [];
    return data;
  });
}

export async function getInterventionZones(): Promise<InterventionZone[]> {
  return withClient([], async (supabase) => {
    const { data, error } = await supabase
      .from("projets")
      .select("location, beneficiaries, active")
      .eq("active", true);

    if (error || !data) return [];

    const map = new Map<string, InterventionZone>();

    for (const project of data) {
      const label = project.location?.trim();
      if (!label) continue;
      const current = map.get(label) ?? {
        label,
        projectCount: 0,
        beneficiaries: 0,
      };
      current.projectCount += 1;
      if (project.beneficiaries != null) {
        current.beneficiaries =
          (current.beneficiaries ?? 0) + project.beneficiaries;
      }
      map.set(label, current);
    }

    return Array.from(map.values()).sort((a, b) =>
      a.label.localeCompare(b.label, "fr"),
    );
  });
}
