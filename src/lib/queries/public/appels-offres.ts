import { emptyPaginatedResult, type PaginatedResult } from "./client";

/**
 * Appels d’offres publics.
 * Table dédiée absente : aucune opportunité inventée.
 */
export async function getPublishedTenders(
  page = 1,
  pageSize = 12,
): Promise<PaginatedResult<never>> {
  return emptyPaginatedResult(page, pageSize);
}

export async function getTenderBySlug(
  slug: string,
): Promise<null> {
  void slug;
  return null;
}
