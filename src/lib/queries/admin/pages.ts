import { createClientSafe } from "@/lib/supabase/safe";

export type AdminPageRow = {
  id: string;
  route: string;
  titre: string;
  surtitre: string | null;
  resume: string | null;
  description_seo: string | null;
  statut: string;
  publie: boolean;
  updated_at: string;
};

export async function getAdminPages(): Promise<AdminPageRow[]> {
  try {
    const supabase = await createClientSafe();
    if (!supabase) return [];
    const { data, error } = await supabase
      .from("pages")
      .select(
        "id, route, titre, surtitre, resume, description_seo, statut, publie, updated_at",
      )
      .is("deleted_at", null)
      .order("route", { ascending: true });
    return error || !data ? [] : (data as AdminPageRow[]);
  } catch {
    return [];
  }
}

export async function getAdminPage(id: string): Promise<AdminPageRow | null> {
  try {
    const supabase = await createClientSafe();
    if (!supabase) return null;
    const { data, error } = await supabase
      .from("pages")
      .select(
        "id, route, titre, surtitre, resume, description_seo, statut, publie, updated_at",
      )
      .eq("id", id)
      .maybeSingle();
    return error || !data ? null : (data as AdminPageRow);
  } catch {
    return null;
  }
}
