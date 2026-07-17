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

type Programme = Database["public"]["Tables"]["programmes"]["Row"];

export type PublishedProgram = Pick<
  Programme,
  | "id"
  | "slug"
  | "title"
  | "description"
  | "long_description"
  | "image_url"
  | "icon"
  | "color"
  | "order"
>;

export type GetPublishedProgramsParams = {
  q?: string;
  page?: number;
  pageSize?: number;
};

export async function getPublishedPrograms(
  params: GetPublishedProgramsParams = {},
): Promise<PaginatedResult<PublishedProgram>> {
  const page = Math.max(1, params.page ?? 1);
  const pageSize = Math.min(48, Math.max(1, params.pageSize ?? DEFAULT_PAGE_SIZE));
  const q = sanitizeSearchQuery(params.q);
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  return withClient(emptyPaginatedResult<PublishedProgram>(page, pageSize), async (supabase) => {
    let query = supabase
      .from("programmes")
      .select(
        "id, slug, title, description, long_description, image_url, icon, color, order",
        { count: "exact" },
      )
      .eq("active", true);

    query = applyTextSearch(query, q, ["title", "description", "long_description"]);

    const { data, error, count } = await query
      .order("order", { ascending: true })
      .range(from, to);

    if (error || !data) {
      return emptyPaginatedResult<PublishedProgram>(page, pageSize);
    }

    return buildPaginatedResult(data, count, page, pageSize);
  });
}

export async function getProgramBySlug(
  slug: string,
): Promise<PublishedProgram | null> {
  return withClient(null, async (supabase) => {
    const { data, error } = await supabase
      .from("programmes")
      .select(
        "id, slug, title, description, long_description, image_url, icon, color, order",
      )
      .eq("slug", slug)
      .eq("active", true)
      .maybeSingle();

    if (error || !data) return null;
    return data;
  });
}

type RelatedProject = Pick<
  Database["public"]["Tables"]["projets"]["Row"],
  "id" | "slug" | "title" | "description" | "image_url" | "location" | "status"
>;

export async function getProjectsByProgramId(
  programId: string,
  limit = 6,
): Promise<RelatedProject[]> {
  return withClient([], async (supabase) => {
    const { data, error } = await supabase
      .from("projets")
      .select("id, slug, title, description, image_url, location, status")
      .eq("active", true)
      .eq("program_id", programId)
      .order("updated_at", { ascending: false })
      .limit(limit);

    if (error || !data) return [];
    return data;
  });
}
