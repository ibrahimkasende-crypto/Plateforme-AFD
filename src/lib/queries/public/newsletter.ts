import { emptyPaginatedResult, type PaginatedResult } from "./client";

/**
 * Éditions newsletter publiques (si une table de campagnes publiques existe).
 * Aucune édition inventée.
 */
export async function getPublicNewsletterEditions(
  page = 1,
  pageSize = 12,
): Promise<PaginatedResult<never>> {
  return emptyPaginatedResult(page, pageSize);
}
