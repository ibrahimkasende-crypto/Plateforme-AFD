import type { DocumentCentre } from "@/features/documents/types";
import { createClientSafe } from "@/lib/supabase/safe";

export async function getAdminDocuments(type?: string): Promise<DocumentCentre[]> {
  try {
    const supabase = await createClientSafe();
    if (!supabase) return [];
    let query = supabase.from("documents").select("*").is("deleted_at", null);
    if (type) query = query.ilike("type", `%${type}%`);
    const { data, error } = await query.order("updated_at", { ascending: false });
    return error || !data ? [] : data;
  } catch { return []; }
}

export async function getAdminDocument(id: string): Promise<DocumentCentre | null> {
  try {
    const supabase = await createClientSafe();
    if (!supabase) return null;
    const { data, error } = await supabase.from("documents").select("*").eq("id", id).maybeSingle();
    return error || !data ? null : data;
  } catch { return null; }
}
