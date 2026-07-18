import type { OpportunityStatus } from "@/features/opportunites/types";

/** Calcule le statut public à partir de la date limite réelle (sans invention). */
export function resolveOpportunityStatus(
  dateLimite: string | null,
  fallback: OpportunityStatus = "ouverte",
): OpportunityStatus {
  if (fallback === "suspendue" || fallback === "pourvue" || fallback === "brouillon") {
    return fallback;
  }
  if (!dateLimite) return fallback === "cloturee" ? "cloturee" : "ouverte";

  const end = Date.parse(dateLimite);
  if (Number.isNaN(end)) return fallback;

  const now = Date.now();
  if (end < now) return "cloturee";

  const daysLeft = (end - now) / (24 * 60 * 60 * 1000);
  if (daysLeft <= 7) return "bientot_cloturee";
  return "ouverte";
}

export function isOpportunityOpenForApplications(status: OpportunityStatus): boolean {
  return status === "ouverte" || status === "bientot_cloturee";
}
