import type { Database } from "@/types/database.types";
import { createClientSafe } from "@/lib/supabase/safe";

export type SiteParameter = Database["public"]["Tables"]["parametres_site"]["Row"];

export async function getAdminSiteParameters(): Promise<SiteParameter[]> {
  try {
    const supabase = await createClientSafe();
    if (!supabase) return [];
    const { data, error } = await supabase
      .from("parametres_site")
      .select("*")
      .order("key", { ascending: true });
    return error || !data ? [] : data;
  } catch {
    return [];
  }
}

export async function getAdminSiteParameterMap(): Promise<Record<string, string>> {
  const rows = await getAdminSiteParameters();
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
}
