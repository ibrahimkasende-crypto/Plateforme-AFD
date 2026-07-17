import { emptyPaginatedResult, type PaginatedResult } from "./client";

/**
 * Opportunités publiques (emploi, stage, volontariat…).
 * Table dédiée absente : aucune offre inventée.
 */
export async function getPublishedOpportunities(
  page = 1,
  pageSize = 12,
): Promise<PaginatedResult<never>> {
  return emptyPaginatedResult(page, pageSize);
}

export async function getOpportunityBySlug(
  slug: string,
): Promise<null> {
  void slug;
  return null;
}
