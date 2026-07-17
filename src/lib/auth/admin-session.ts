import type { AdminViewer } from "@/features/statistiques/types/dashboard";
import { getAdminSession } from "@/lib/auth/require-admin";

/**
 * Viewer admin pour le dashboard.
 * Ne bypass plus l’authentification — retourne null si non autorisé.
 */
export async function getAdminViewer(): Promise<AdminViewer | null> {
  const session = await getAdminSession();
  return session?.viewer ?? null;
}
