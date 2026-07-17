import {
  applyTextSearch,
  buildPaginatedResult,
  DEFAULT_PAGE_SIZE,
  emptyPaginatedResult,
  sanitizeSearchQuery,
  withClient,
  type PaginatedResult,
} from "@/lib/queries/public/client";
import type { Database } from "@/types/database.types";

type Projet = Database["public"]["Tables"]["projets"]["Row"];

export type PublishedProject = Pick<
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
  | "start_date"
  | "end_date"
  | "results"
> & {
  programmeTitle: string | null;
  programmeSlug: string | null;
};

export type GetPublishedProjectsParams = {
  q?: string;
  status?: string;
  location?: string;
  page?: number;
  pageSize?: number;
};

async function attachProgrammeTitles(
  supabase: NonNullable<
    Awaited<ReturnType<typeof import("@/lib/supabase/safe").createClientSafe>>
  >,
  projects: Omit<PublishedProject, "programmeTitle" | "programmeSlug">[],
): Promise<PublishedProject[]> {
  const programIds = [
    ...new Set(
      projects
        .map((project) => project.program_id)
        .filter((id): id is string => Boolean(id)),
    ),
  ];

  const programmeMeta = new Map<string, { title: string; slug: string }>();
  if (programIds.length > 0) {
    const { data: programmes } = await supabase
      .from("programmes")
      .select("id, title, slug")
      .in("id", programIds);

    programmes?.forEach((programme) => {
      programmeMeta.set(programme.id, {
        title: programme.title,
        slug: programme.slug,
      });
    });
  }

  return projects.map((project) => ({
    ...project,
    programmeTitle: project.program_id
      ? (programmeMeta.get(project.program_id)?.title ?? null)
      : null,
    programmeSlug: project.program_id
      ? (programmeMeta.get(project.program_id)?.slug ?? null)
      : null,
  }));
}

export async function getPublishedProjects(
  params: GetPublishedProjectsParams = {},
): Promise<PaginatedResult<PublishedProject>> {
  const page = Math.max(1, params.page ?? 1);
  const pageSize = Math.min(48, Math.max(1, params.pageSize ?? DEFAULT_PAGE_SIZE));
  const q = sanitizeSearchQuery(params.q);
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  return withClient(emptyPaginatedResult<PublishedProject>(page, pageSize), async (supabase) => {
    let query = supabase
      .from("projets")
      .select(
        "id, slug, title, description, image_url, location, status, program_id, beneficiaries, start_date, end_date, results",
        { count: "exact" },
      )
      .eq("active", true);

    query = applyTextSearch(query, q, ["title", "description", "location"]);

    if (params.status?.trim()) {
      query = query.eq("status", params.status.trim());
    }

    if (params.location?.trim()) {
      query = query.ilike("location", `%${params.location.trim()}%`);
    }

    const { data, error, count } = await query
      .order("updated_at", { ascending: false })
      .range(from, to);

    if (error || !data) {
      return emptyPaginatedResult<PublishedProject>(page, pageSize);
    }

    const items = await attachProgrammeTitles(supabase, data);
    return buildPaginatedResult(items, count, page, pageSize);
  });
}

export async function getProjectBySlug(
  slug: string,
): Promise<PublishedProject | null> {
  return withClient(null, async (supabase) => {
    const { data, error } = await supabase
      .from("projets")
      .select(
        "id, slug, title, description, image_url, location, status, program_id, beneficiaries, start_date, end_date, results",
      )
      .eq("slug", slug)
      .eq("active", true)
      .maybeSingle();

    if (error || !data) return null;

    const [project] = await attachProgrammeTitles(supabase, [data]);
    return project ?? null;
  });
}

const URGENCY_STATUS_KEYWORDS = ["urgence", "urgent", "emergency", "humanitaire"];
const URGENCY_TEXT_KEYWORDS = ["urgence", "urgent", "humanitaire"];

function matchesUrgency(project: {
  status: string | null;
  title: string;
  description: string;
}): boolean {
  const status = (project.status ?? "").toLowerCase();
  if (URGENCY_STATUS_KEYWORDS.some((keyword) => status.includes(keyword))) {
    return true;
  }
  const text = `${project.title} ${project.description}`.toLowerCase();
  return URGENCY_TEXT_KEYWORDS.some((keyword) => text.includes(keyword));
}

export async function getEmergencyProjects(): Promise<PublishedProject[]> {
  return withClient([], async (supabase) => {
    const { data, error } = await supabase
      .from("projets")
      .select(
        "id, slug, title, description, image_url, location, status, program_id, beneficiaries, start_date, end_date, results",
      )
      .eq("active", true)
      .order("updated_at", { ascending: false });

    if (error || !data) return [];

    const urgent = data.filter(matchesUrgency);
    return attachProgrammeTitles(supabase, urgent);
  });
}

export async function getProjectStatusOptions(): Promise<string[]> {
  return withClient([], async (supabase) => {
    const { data, error } = await supabase
      .from("projets")
      .select("status")
      .eq("active", true);

    if (error || !data) return [];

    const statuses = new Set<string>();
    for (const row of data) {
      const value = row.status?.trim();
      if (value) statuses.add(value);
    }

    return Array.from(statuses).sort((a, b) => a.localeCompare(b, "fr"));
  });
}
