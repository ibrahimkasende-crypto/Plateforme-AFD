import type { AppelOffre, AppelOffreDocument } from "@/features/appels-offres/types";
import {
  applyTextSearch,
  buildPaginatedResult,
  DEFAULT_PAGE_SIZE,
  emptyPaginatedResult,
  sanitizeSearchQuery,
  withClient,
  type PaginatedResult,
} from "./client";

export type TenderFilters = {
  q?: string;
  statut?: string;
  page?: number;
  pageSize?: number;
};

/**
 * Appels d’offres publics publiés.
 * Aucune donnée inventée si la table est vide.
 */
export async function getPublishedTenders(
  filters: TenderFilters = {},
): Promise<PaginatedResult<AppelOffre>> {
  const page = Math.max(1, filters.page ?? 1);
  const pageSize = Math.min(48, Math.max(1, filters.pageSize ?? DEFAULT_PAGE_SIZE));
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const q = sanitizeSearchQuery(filters.q);

  return withClient(emptyPaginatedResult<AppelOffre>(page, pageSize), async (supabase) => {
    let query = supabase
      .from("appels_offres")
      .select("*", { count: "exact" })
      .eq("publie", true)
      .is("deleted_at", null)
      .in("statut", ["ouvert", "cloture"]);

    query = applyTextSearch(query, q, ["titre", "resume", "localisation"]);
    if (filters.statut === "ouvert" || filters.statut === "cloture") {
      query = query.eq("statut", filters.statut);
    }

    const { data, error, count } = await query
      .order("date_limite", { ascending: true, nullsFirst: false })
      .order("date_publication", { ascending: false, nullsFirst: false })
      .range(from, to);

    if (error || !data) {
      return emptyPaginatedResult<AppelOffre>(page, pageSize);
    }
    return buildPaginatedResult(data as AppelOffre[], count, page, pageSize);
  });
}

export async function getTenderBySlug(
  slug: string,
): Promise<(AppelOffre & { documents: AppelOffreDocument[] }) | null> {
  const safeSlug = slug.trim();
  if (!safeSlug) return null;

  return withClient(null, async (supabase) => {
    const { data, error } = await supabase
      .from("appels_offres")
      .select("*")
      .eq("slug", safeSlug)
      .eq("publie", true)
      .is("deleted_at", null)
      .in("statut", ["ouvert", "cloture"])
      .maybeSingle();

    if (error || !data) return null;

    const { data: documents } = await supabase
      .from("appels_offres_documents")
      .select("*")
      .eq("appel_offre_id", data.id)
      .order("order_index", { ascending: true });

    return {
      ...(data as AppelOffre),
      documents: (documents ?? []) as AppelOffreDocument[],
    };
  });
}
