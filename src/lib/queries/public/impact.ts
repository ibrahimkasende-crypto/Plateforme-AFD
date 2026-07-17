import {
  getPublicImpactStats,
  type PublicImpactStats,
} from "@/lib/queries/home";
import { emptyPaginatedResult, type PaginatedResult } from "./client";

export type { PublicImpactStats };

export async function getPublicImpactOverview(): Promise<PublicImpactStats> {
  return getPublicImpactStats();
}

/**
 * Histoires d’impact publiées.
 * Table dédiée absente : retour vide honnête (aucune donnée inventée).
 */
export async function getPublishedImpactStories(
  page = 1,
  pageSize = 12,
): Promise<PaginatedResult<never>> {
  return emptyPaginatedResult(page, pageSize);
}

/**
 * Témoignages publiés et autorisés.
 * Table dédiée absente : retour vide honnête.
 */
export async function getPublishedTestimonials(
  page = 1,
  pageSize = 12,
): Promise<PaginatedResult<never>> {
  return emptyPaginatedResult(page, pageSize);
}

/**
 * Rapports publics.
 * Table dédiée absente : retour vide honnête.
 */
export async function getPublishedReports(
  page = 1,
  pageSize = 12,
): Promise<PaginatedResult<never>> {
  return emptyPaginatedResult(page, pageSize);
}
