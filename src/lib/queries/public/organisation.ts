import type { Database } from "@/types/database.types";
import { withClient } from "./client";

type ParametreSite = Database["public"]["Tables"]["parametres_site"]["Row"];

export type PublicSiteParameter = Pick<
  ParametreSite,
  "id" | "key" | "value" | "updated_at"
>;

/**
 * Paramètres publics du site (si exposés via RLS).
 * Ne jamais inventer de coordonnées institutionnelles.
 */
export async function getPublicSiteParameters(): Promise<PublicSiteParameter[]> {
  return withClient([], async (supabase) => {
    const { data, error } = await supabase
      .from("parametres_site")
      .select("id, key, value, updated_at");

    if (error || !data) return [];
    return data;
  });
}
