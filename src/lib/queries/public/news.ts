import {
  getMigratedNewsArticles,
  getMigratedNewsBySlug,
  type MigratedNewsArticle,
} from "@/config/migrated-news";
import {
  applyTextSearch,
  buildPaginatedResult,
  DEFAULT_PAGE_SIZE,
  sanitizeSearchQuery,
  withClient,
  type PaginatedResult,
} from "@/lib/queries/public/client";
import type { Database } from "@/types/database.types";

type Actualite = Database["public"]["Tables"]["actualites"]["Row"];

export type PublicNewsItem = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  preview?: string;
  image_url: string | null;
  category: string | null;
  published_at: string | null;
  author: string | null;
  source?: string;
  isMigratedFallback?: boolean;
};

function fromMigrated(article: MigratedNewsArticle): PublicNewsItem {
  return {
    id: article.id,
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    content: article.content,
    preview: article.preview,
    image_url: article.image_url,
    category: article.category,
    published_at: article.published_at,
    author: article.author,
    source: article.source,
    isMigratedFallback: true,
  };
}

function fromRow(
  row: Pick<
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
  >,
): PublicNewsItem {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    image_url: row.image_url,
    category: row.category,
    published_at: row.published_at,
    author: row.author,
    isMigratedFallback: false,
  };
}

function mergeWithoutDuplicates(
  primary: PublicNewsItem[],
  secondary: PublicNewsItem[],
): PublicNewsItem[] {
  const seen = new Set(
    primary.map((item) => item.slug.toLowerCase()),
  );
  const merged = [...primary];
  for (const item of secondary) {
    if (seen.has(item.slug.toLowerCase())) continue;
    if (
      primary.some(
        (p) => p.title.trim().toLowerCase() === item.title.trim().toLowerCase(),
      )
    ) {
      continue;
    }
    merged.push(item);
    seen.add(item.slug.toLowerCase());
  }
  return merged;
}

export async function getPublishedNews(params: {
  q?: string;
  category?: string;
  page?: number;
  pageSize?: number;
} = {}): Promise<PaginatedResult<PublicNewsItem>> {
  const page = Math.max(1, params.page ?? 1);
  const pageSize = Math.min(48, Math.max(1, params.pageSize ?? DEFAULT_PAGE_SIZE));
  const q = sanitizeSearchQuery(params.q);
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const migrated = getMigratedNewsArticles().map(fromMigrated);

  const fromDb = await withClient([] as PublicNewsItem[], async (supabase) => {
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

    const { data, error } = await query
      .order("published_at", { ascending: false })
      .range(from, to);

    if (error || !data) return [];
    return data.map(fromRow);
  });

  let combined = mergeWithoutDuplicates(fromDb, migrated);

  if (q) {
    const needle = q.toLowerCase();
    combined = combined.filter(
      (item) =>
        item.title.toLowerCase().includes(needle) ||
        item.excerpt.toLowerCase().includes(needle) ||
        item.content.toLowerCase().includes(needle),
    );
  }
  if (params.category?.trim()) {
    const category = params.category.trim().toLowerCase();
    combined = combined.filter(
      (item) => item.category?.toLowerCase() === category,
    );
  }

  combined.sort((a, b) => {
    const da = a.published_at ? Date.parse(a.published_at) : 0;
    const db = b.published_at ? Date.parse(b.published_at) : 0;
    return db - da;
  });

  const slice = combined.slice(from, to + 1);
  return buildPaginatedResult(slice, combined.length, page, pageSize);
}

export async function getFeaturedNews(limit = 3): Promise<PublicNewsItem[]> {
  const fromDb = await withClient([] as PublicNewsItem[], async (supabase) => {
    const { data, error } = await supabase
      .from("actualites")
      .select(
        "id, slug, title, excerpt, content, image_url, category, published_at, author",
      )
      .eq("published", true)
      .order("published_at", { ascending: false })
      .limit(Math.max(limit, 6));

    if (error || !data) return [];
    return data.map(fromRow);
  });

  const migrated = getMigratedNewsArticles().map(fromMigrated);
  // Priorité aux sujets institutionnels migrés, puis compléments Supabase.
  const merged = mergeWithoutDuplicates(migrated, fromDb).sort((a, b) => {
    const da = a.published_at ? Date.parse(a.published_at) : 0;
    const db = b.published_at ? Date.parse(b.published_at) : 0;
    return db - da;
  });

  return merged.slice(0, limit);
}

export async function getNewsBySlug(
  slug: string,
): Promise<PublicNewsItem | null> {
  const fromDb = await withClient(null as PublicNewsItem | null, async (supabase) => {
    const { data, error } = await supabase
      .from("actualites")
      .select(
        "id, slug, title, excerpt, content, image_url, category, published_at, author",
      )
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();

    if (error || !data) return null;
    return fromRow(data);
  });

  if (fromDb) return fromDb;

  const migrated = getMigratedNewsBySlug(slug);
  return migrated ? fromMigrated(migrated) : null;
}

/** Fusion utile pour l’admin / migration — évite les doublons slug/titre. */
export function listMigratedNewsForSeed(): PublicNewsItem[] {
  return mergeWithoutDuplicates([], getMigratedNewsArticles().map(fromMigrated));
}
