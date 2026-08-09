import { homeContent } from "@/config/home-content";
import { createClientSafe } from "@/lib/supabase/safe";
import type { Database } from "@/types/database.types";

type Programme = Database["public"]["Tables"]["programmes"]["Row"];
type Projet = Database["public"]["Tables"]["projets"]["Row"];
type Actualite = Database["public"]["Tables"]["actualites"]["Row"];

export type PublicImpactStats = {
  personnesAccompagnees: number | null;
  femmesAccompagnees: number | null;
  projetsRealises: number | null;
  provincesCouvertes: number | null;
  partenairesActifs: number | null;
  activitesRealisees: number | null;
  source: "published" | "supabase" | "unavailable";
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

export type { PublicPartner as ActivePartner } from "@/lib/queries/partenaires";

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
  const published = homeContent.publishedImpactStats;
  const fallback: PublicImpactStats = {
    personnesAccompagnees: published.personnesAccompagnees,
    femmesAccompagnees: published.femmesAccompagnees,
    projetsRealises: published.projetsRealises,
    provincesCouvertes: published.provincesCouvertes,
    partenairesActifs: published.partenairesActifs,
    activitesRealisees: published.activitesRealisees,
    source: "published",
    missing: [],
  };

  return withClient(fallback, async (supabase) => {
    const { data, error } = await supabase
      .from("chiffres_impact" as never)
      .select("key, value, active, validated")
      .eq("active", true);

    if (error || !data || data.length === 0) return fallback;

    const rows = data as Array<{
      key: string;
      value: number | null;
      validated: boolean | null;
    }>;

    const byKey = new Map(
      rows
        .filter((r) => r.value != null)
        .map((r) => [r.key, Number(r.value)]),
    );

    const pickNum = (...keys: string[]) => {
      for (const k of keys) {
        const v = byKey.get(k);
        if (typeof v === "number" && Number.isFinite(v)) return v;
      }
      return null;
    };

    const personnesAccompagnees =
      pickNum("personnes_accompagnees", "personnesAccompagnees", "beneficiaires") ??
      fallback.personnesAccompagnees;
    const femmesAccompagnees =
      pickNum("femmes_accompagnees", "femmesAccompagnees", "femmes_pct") ??
      fallback.femmesAccompagnees;
    const projetsRealises =
      pickNum("projets_realises", "projetsRealises", "projets") ??
      fallback.projetsRealises;
    const provincesCouvertes =
      pickNum("provinces_couvertes", "provincesCouvertes", "provinces") ??
      fallback.provincesCouvertes;
    const partenairesActifs =
      pickNum("partenaires_actifs", "partenairesActifs", "partenaires") ??
      fallback.partenairesActifs;
    const activitesRealisees =
      pickNum("activites_realisees", "activitesRealisees", "activites") ??
      fallback.activitesRealisees;

    return {
      personnesAccompagnees,
      femmesAccompagnees,
      projetsRealises,
      provincesCouvertes,
      partenairesActifs,
      activitesRealisees,
      source: "supabase",
      missing: [],
    };
  });
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
  return withClient(null, async (supabase) => {
    const { data, error } = await supabase
      .from("histoires_impact")
      .select("id, title, excerpt, location, image_url, slug, published, status")
      .eq("published", true)
      .is("deleted_at", null)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !data) return null;

    const row = data as {
      id: string;
      title: string;
      excerpt: string | null;
      location: string | null;
      image_url: string | null;
      slug: string;
    };

    return {
      id: row.id,
      title: row.title,
      excerpt: row.excerpt ?? "",
      location: row.location,
      imageUrl: row.image_url,
      href: `/impact/histoires/${row.slug}`,
    };
  });
}

export async function getLatestPublishedNews(): Promise<LatestNews[]> {
  const { getFeaturedNews } = await import("@/lib/queries/public/news");
  const items = await getFeaturedNews(3);
  return items.map((item) => ({
    id: item.id,
    slug: item.slug,
    title: item.title,
    excerpt: item.excerpt,
    image_url: item.image_url,
    category: item.category,
    published_at: item.published_at,
  }));
}

export async function getActivePartners() {
  const { getActivePublicPartners } = await import("@/lib/queries/partenaires");
  return getActivePublicPartners();
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
