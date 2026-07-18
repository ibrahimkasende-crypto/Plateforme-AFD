import {
  getPublicImpactStats,
  type PublicImpactStats,
} from "@/lib/queries/home";
import type { HistoireImpact, Temoignage } from "@/features/impact/types";
import {
  buildPaginatedResult,
  DEFAULT_PAGE_SIZE,
  emptyPaginatedResult,
  withClient,
  type PaginatedResult,
} from "./client";

export type { PublicImpactStats };

export async function getPublicImpactOverview(): Promise<PublicImpactStats> {
  return getPublicImpactStats();
}

/**
 * Histoires d’impact publiées avec consentement validé.
 * Aucune donnée inventée si la table est vide.
 */
export async function getPublishedImpactStories(
  page = 1,
  pageSize = DEFAULT_PAGE_SIZE,
): Promise<PaginatedResult<HistoireImpact>> {
  const safePage = Math.max(1, page);
  const safeSize = Math.min(48, Math.max(1, pageSize));
  const from = (safePage - 1) * safeSize;
  const to = from + safeSize - 1;

  return withClient(emptyPaginatedResult<HistoireImpact>(safePage, safeSize), async (supabase) => {
    const { data, error, count } = await supabase
      .from("histoires_impact")
      .select("*", { count: "exact" })
      .eq("published", true)
      .eq("status", "publie")
      .is("deleted_at", null)
      .in("consent_status", ["approved", "not-required"])
      .order("published_at", { ascending: false, nullsFirst: false })
      .range(from, to);

    if (error || !data) {
      return emptyPaginatedResult<HistoireImpact>(safePage, safeSize);
    }
    return buildPaginatedResult(data as HistoireImpact[], count, safePage, safeSize);
  });
}

export async function getImpactStoryBySlug(
  slug: string,
): Promise<HistoireImpact | null> {
  const safeSlug = slug.trim();
  if (!safeSlug) return null;

  return withClient(null, async (supabase) => {
    const { data, error } = await supabase
      .from("histoires_impact")
      .select("*")
      .eq("slug", safeSlug)
      .eq("published", true)
      .eq("status", "publie")
      .is("deleted_at", null)
      .in("consent_status", ["approved", "not-required"])
      .maybeSingle();

    if (error || !data) return null;
    return data as HistoireImpact;
  });
}

/**
 * Témoignages publiés et autorisés.
 * Aucune donnée inventée si la table est vide.
 */
export async function getPublishedTestimonials(
  page = 1,
  pageSize = DEFAULT_PAGE_SIZE,
): Promise<PaginatedResult<Temoignage>> {
  const safePage = Math.max(1, page);
  const safeSize = Math.min(48, Math.max(1, pageSize));
  const from = (safePage - 1) * safeSize;
  const to = from + safeSize - 1;

  return withClient(emptyPaginatedResult<Temoignage>(safePage, safeSize), async (supabase) => {
    const { data, error, count } = await supabase
      .from("temoignages")
      .select("*", { count: "exact" })
      .eq("publie", true)
      .eq("active", true)
      .is("deleted_at", null)
      .in("consent_status", ["approved", "not-required"])
      .order("order_index", { ascending: true })
      .order("published_at", { ascending: false, nullsFirst: false })
      .range(from, to);

    if (error || !data) {
      return emptyPaginatedResult<Temoignage>(safePage, safeSize);
    }
    return buildPaginatedResult(data as Temoignage[], count, safePage, safeSize);
  });
}

/**
 * Rapports publics (via documents publiés de type rapport).
 */
export async function getPublishedReports(
  page = 1,
  pageSize = DEFAULT_PAGE_SIZE,
): Promise<PaginatedResult<{ id: string; titre: string; slug?: string | null }>> {
  return withClient(
    emptyPaginatedResult(page, pageSize),
    async (supabase) => {
      const safePage = Math.max(1, page);
      const safeSize = Math.min(48, Math.max(1, pageSize));
      const from = (safePage - 1) * safeSize;
      const to = from + safeSize - 1;

      const { data, error, count } = await supabase
        .from("documents")
        .select("id, titre, slug", { count: "exact" })
        .eq("publie", true)
        .eq("niveau_confidentialite", "public")
        .is("deleted_at", null)
        .or("type.ilike.%rapport%,slug.ilike.%rapport%")
        .order("date_publication", { ascending: false, nullsFirst: false })
        .range(from, to);

      if (error || !data) {
        return emptyPaginatedResult(safePage, safeSize);
      }
      return buildPaginatedResult(data, count, safePage, safeSize);
    },
  );
}
