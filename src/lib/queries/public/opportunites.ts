import {
  getMigratedOpenOpportunities,
  getMigratedOpportunityBySlug,
} from "@/config/migrated-opportunities";
import type { Opportunity, OpportunityStatus } from "@/features/opportunites/types";
import { resolveOpportunityStatus } from "@/features/opportunites/utils/status";
import {
  applyTextSearch,
  buildPaginatedResult,
  DEFAULT_PAGE_SIZE,
  emptyPaginatedResult,
  sanitizeSearchQuery,
  withClient,
  type PaginatedResult,
} from "./client";

export type OpportunityFilters = {
  type?: string;
  departement?: string;
  localisation?: string;
  mode_travail?: string;
  statut?: string;
  q?: string;
  page?: number;
  pageSize?: number;
  sort?: "date_publication" | "date_limite";
  order?: "asc" | "desc";
};

function withResolvedStatus(opportunity: Opportunity): Opportunity {
  return {
    ...opportunity,
    statut: resolveOpportunityStatus(opportunity.date_limite, opportunity.statut),
  };
}

function mergeWithMigrated(items: Opportunity[]): Opportunity[] {
  const bySlug = new Map(items.map((item) => [item.slug, item]));
  for (const migrated of getMigratedOpenOpportunities(50)) {
    if (!bySlug.has(migrated.slug)) {
      bySlug.set(migrated.slug, migrated);
    }
  }
  return [...bySlug.values()].map(withResolvedStatus);
}

export async function getPublishedOpportunities(
  filters: OpportunityFilters = {},
): Promise<PaginatedResult<Opportunity>> {
  const page = Math.max(1, filters.page ?? 1);
  const pageSize = Math.min(48, Math.max(1, filters.pageSize ?? DEFAULT_PAGE_SIZE));
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const q = sanitizeSearchQuery(filters.q);

  const fromDb = await withClient(
    emptyPaginatedResult<Opportunity>(page, pageSize),
    async (supabase) => {
      let query = supabase
        .from("opportunites")
        .select("*", { count: "exact" })
        .eq("publie", true)
        .is("deleted_at", null)
        .in("statut", [
          "ouverte",
          "bientot_cloturee",
          "cloturee",
          "suspendue",
          "pourvue",
        ]);
      query = applyTextSearch(query, q, ["titre", "description", "departement"]);
      if (filters.type?.trim()) query = query.eq("type", filters.type.trim());
      if (filters.departement?.trim())
        query = query.eq("departement", filters.departement.trim());
      if (filters.localisation?.trim())
        query = query.eq("localisation", filters.localisation.trim());
      if (filters.mode_travail?.trim())
        query = query.eq("mode_travail", filters.mode_travail.trim());
      if (
        filters.statut &&
        ["ouverte", "bientot_cloturee", "cloturee", "suspendue", "pourvue"].includes(
          filters.statut,
        )
      ) {
        query = query.eq("statut", filters.statut as OpportunityStatus);
      }
      const sort =
        filters.sort === "date_limite" ? "date_limite" : "date_publication";
      const ascending = filters.order === "asc";
      const { data, error, count } = await query
        .order(sort, { ascending, nullsFirst: false })
        .range(from, to);
      return error || !data
        ? emptyPaginatedResult<Opportunity>(page, pageSize)
        : buildPaginatedResult(data, count, page, pageSize);
    },
  );

  if (fromDb.items.length > 0 && page === 1) {
    const merged = mergeWithMigrated(fromDb.items);
    let filtered = merged;
    if (filters.statut) {
      filtered = merged.filter((item) => item.statut === filters.statut);
    }
    if (q) {
      const needle = q.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.titre.toLowerCase().includes(needle) ||
          item.description.toLowerCase().includes(needle),
      );
    }
    return buildPaginatedResult(
      filtered.slice(0, pageSize),
      Math.max(fromDb.total, filtered.length),
      page,
      pageSize,
    );
  }

  if (fromDb.items.length === 0) {
    let migrated = getMigratedOpenOpportunities(50).map(withResolvedStatus);
    if (filters.statut) {
      migrated = migrated.filter((item) => item.statut === filters.statut);
    }
    if (filters.type?.trim()) {
      migrated = migrated.filter((item) => item.type === filters.type?.trim());
    }
    if (q) {
      const needle = q.toLowerCase();
      migrated = migrated.filter(
        (item) =>
          item.titre.toLowerCase().includes(needle) ||
          item.description.toLowerCase().includes(needle),
      );
    }
    const slice = migrated.slice(from, to + 1);
    return buildPaginatedResult(slice, migrated.length, page, pageSize);
  }

  return {
    ...fromDb,
    items: fromDb.items.map(withResolvedStatus),
  };
}

export async function getOpportunityBySlug(
  slug: string,
): Promise<Opportunity | null> {
  const fromDb = await withClient(null, async (supabase) => {
    const { data, error } = await supabase
      .from("opportunites")
      .select("*")
      .eq("slug", slug)
      .eq("publie", true)
      .is("deleted_at", null)
      .in("statut", [
        "ouverte",
        "bientot_cloturee",
        "cloturee",
        "suspendue",
        "pourvue",
      ])
      .maybeSingle();
    return error || !data ? null : data;
  });

  const opportunity = fromDb ?? getMigratedOpportunityBySlug(slug);
  return opportunity ? withResolvedStatus(opportunity) : null;
}
