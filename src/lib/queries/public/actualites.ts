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

type Actualite = Database["public"]["Tables"]["actualites"]["Row"];

export type PublishedNews = Pick<
  Actualite,
  | "id"
  | "slug"
  | "title"
  | "excerpt"
  | "content"
  | "image_url"
  | "category"
  | "published_at"
  | "author"
>;

export type GetPublishedNewsParams = {
  q?: string;
  category?: string;
  page?: number;
  pageSize?: number;
};

export async function getPublishedNews(
  params: GetPublishedNewsParams = {},
): Promise<PaginatedResult<PublishedNews>> {
  const page = Math.max(1, params.page ?? 1);
  const pageSize = Math.min(48, Math.max(1, params.pageSize ?? DEFAULT_PAGE_SIZE));
  const q = sanitizeSearchQuery(params.q);
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  return withClient(emptyPaginatedResult<PublishedNews>(page, pageSize), async (supabase) => {
    let query = supabase
      .from("actualites")
      .select(
        "id, slug, title, excerpt, content, image_url, category, published_at, author",
        { count: "exact" },
      )
      .eq("published", true);

    query = applyTextSearch(query, q, ["title", "excerpt", "content"]);

    if (params.category?.trim()) {
      query = query.eq("category", params.category.trim());
    }

    const { data, error, count } = await query
      .order("published_at", { ascending: false })
      .range(from, to);

    if (error || !data) {
      return emptyPaginatedResult<PublishedNews>(page, pageSize);
    }

    return buildPaginatedResult(data, count, page, pageSize);
  });
}

export async function getNewsBySlug(slug: string): Promise<PublishedNews | null> {
  return withClient(null, async (supabase) => {
    const { data, error } = await supabase
      .from("actualites")
      .select(
        "id, slug, title, excerpt, content, image_url, category, published_at, author",
      )
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();

    if (error || !data) return null;
    return data;
  });
}
