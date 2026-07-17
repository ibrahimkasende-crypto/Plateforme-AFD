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

type Media = Database["public"]["Tables"]["galerie"]["Row"];

export type PublicMedia = Pick<
  Media,
  | "id"
  | "title"
  | "description"
  | "media_type"
  | "media_url"
  | "thumbnail_url"
  | "program_id"
  | "project_id"
  | "created_at"
>;

export type GetPublicMediaParams = {
  mediaType?: string;
  q?: string;
  page?: number;
  pageSize?: number;
};

export async function getPublicMedia(
  params: GetPublicMediaParams = {},
): Promise<PaginatedResult<PublicMedia>> {
  const page = Math.max(1, params.page ?? 1);
  const pageSize = Math.min(48, Math.max(1, params.pageSize ?? DEFAULT_PAGE_SIZE));
  const q = sanitizeSearchQuery(params.q);
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  return withClient(emptyPaginatedResult<PublicMedia>(page, pageSize), async (supabase) => {
    let query = supabase
      .from("galerie")
      .select(
        "id, title, description, media_type, media_url, thumbnail_url, program_id, project_id, created_at",
        { count: "exact" },
      )
      .eq("active", true);

    query = applyTextSearch(query, q, ["title", "description"]);

    if (params.mediaType?.trim()) {
      query = query.eq("media_type", params.mediaType.trim());
    }

    const { data, error, count } = await query
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error || !data) {
      return emptyPaginatedResult<PublicMedia>(page, pageSize);
    }

    return buildPaginatedResult(data, count, page, pageSize);
  });
}

export type PublishedDocument = Pick<
  Media,
  "id" | "title" | "description" | "media_url" | "thumbnail_url" | "created_at"
>;

export async function getPublishedDocuments(): Promise<PublishedDocument[]> {
  return withClient([], async (supabase) => {
    const { data, error } = await supabase
      .from("galerie")
      .select("id, title, description, media_url, thumbnail_url, created_at, media_type, active")
      .eq("active", true)
      .ilike("media_type", "%document%")
      .order("created_at", { ascending: false });

    if (error || !data) return [];

    return data.map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      media_url: row.media_url,
      thumbnail_url: row.thumbnail_url,
      created_at: row.created_at,
    }));
  });
}
