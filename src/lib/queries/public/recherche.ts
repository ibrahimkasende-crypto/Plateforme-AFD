import { sanitizeSearchQuery, withClient } from "@/lib/queries/public/client";
import type { PublishedNews } from "@/lib/queries/public/actualites";
import type { PublishedProgram } from "@/lib/queries/public/programmes";
import type { PublishedProject } from "@/lib/queries/public/projets";

export type PublicSearchResults = {
  programmes: Pick<PublishedProgram, "id" | "slug" | "title" | "description">[];
  projets: Pick<PublishedProject, "id" | "slug" | "title" | "description" | "location">[];
  actualites: Pick<PublishedNews, "id" | "slug" | "title" | "excerpt" | "category">[];
};

const EMPTY_RESULTS: PublicSearchResults = {
  programmes: [],
  projets: [],
  actualites: [],
};

export async function searchPublicContent(q: string): Promise<PublicSearchResults> {
  const sanitized = sanitizeSearchQuery(q);
  if (!sanitized) return EMPTY_RESULTS;

  const pattern = `%${sanitized}%`;

  return withClient(EMPTY_RESULTS, async (supabase) => {
    const [programmesRes, projetsRes, actualitesRes] = await Promise.all([
      supabase
        .from("programmes")
        .select("id, slug, title, description")
        .eq("active", true)
        .or(`title.ilike.${pattern},description.ilike.${pattern}`)
        .order("order", { ascending: true })
        .limit(8),
      supabase
        .from("projets")
        .select("id, slug, title, description, location")
        .eq("active", true)
        .or(`title.ilike.${pattern},description.ilike.${pattern}`)
        .order("updated_at", { ascending: false })
        .limit(8),
      supabase
        .from("actualites")
        .select("id, slug, title, excerpt, category")
        .eq("published", true)
        .or(`title.ilike.${pattern},excerpt.ilike.${pattern},content.ilike.${pattern}`)
        .order("published_at", { ascending: false })
        .limit(8),
    ]);

    return {
      programmes: programmesRes.data ?? [],
      projets: projetsRes.data ?? [],
      actualites: actualitesRes.data ?? [],
    };
  });
}
