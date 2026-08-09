import { getMigratedNewsArticles } from "@/config/migrated-news";
import { sanitizeSearchQuery, withClient } from "@/lib/queries/public/client";
import type { PublishedNews } from "@/lib/queries/public/actualites";
import { searchLibraryActivities } from "@/lib/queries/public/bibliotheque";
import type { PublishedProgram } from "@/lib/queries/public/programmes";
import type { PublishedProject } from "@/lib/queries/public/projets";

export type PublicSearchResults = {
  programmes: Pick<PublishedProgram, "id" | "slug" | "title" | "description">[];
  projets: Pick<
    PublishedProject,
    "id" | "slug" | "title" | "description" | "location"
  >[];
  actualites: Pick<
    PublishedNews,
    "id" | "slug" | "title" | "excerpt" | "category"
  >[];
  bibliotheque: Array<{
    id: string;
    slug: string;
    title: string;
    summary: string;
    categoryLabel: string;
  }>;
};

const EMPTY_RESULTS: PublicSearchResults = {
  programmes: [],
  projets: [],
  actualites: [],
  bibliotheque: [],
};

export async function searchPublicContent(
  q: string,
): Promise<PublicSearchResults> {
  const sanitized = sanitizeSearchQuery(q);
  if (!sanitized) return EMPTY_RESULTS;

  const pattern = `%${sanitized}%`;
  const needle = sanitized.toLowerCase();
  const fallbackActualites = getMigratedNewsArticles()
    .filter((item) =>
      [item.title, item.excerpt, item.content, item.category ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(needle),
    )
    .slice(0, 8)
    .map((item) => ({
      id: item.id,
      slug: item.slug,
      title: item.title,
      excerpt: item.excerpt,
      category: item.category,
    }));

  const [fromDb, libraryHits] = await Promise.all([
    withClient(EMPTY_RESULTS, async (supabase) => {
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
          .or(
            `title.ilike.${pattern},excerpt.ilike.${pattern},content.ilike.${pattern}`,
          )
          .order("published_at", { ascending: false })
          .limit(8),
      ]);

      return {
        programmes: programmesRes.data ?? [],
        projets: projetsRes.data ?? [],
        actualites: actualitesRes.data ?? [],
        bibliotheque: [],
      };
    }),
    searchLibraryActivities({ q: sanitized }).then((items) =>
      items.slice(0, 8).map((item) => ({
        id: item.id,
        slug: item.slug,
        title: item.title,
        summary: item.summary,
        categoryLabel: item.categoryLabel,
      })),
    ),
  ]);

  const seen = new Set(fromDb.actualites.map((item) => item.slug));
  return {
    ...fromDb,
    bibliotheque: libraryHits,
    actualites: [
      ...fromDb.actualites,
      ...fallbackActualites.filter((item) => !seen.has(item.slug)),
    ].slice(0, 8),
  };
}
