import { createClientSafe } from "@/lib/supabase/safe";

export type JournalEntry = {
  id: string;
  utilisateur_id: string | null;
  action: string;
  details: Record<string, unknown>;
  created_at: string;
};

export async function getAdminJournal(filters: {
  q?: string;
  action?: string;
} = {}): Promise<JournalEntry[]> {
  try {
    const supabase = await createClientSafe();
    if (!supabase) return [];
    let query = supabase.from("journal_activite" as never).select("id, utilisateur_id, action, details, created_at");
    if (filters.q?.trim()) {
      const q = filters.q.trim().replace(/[%_,]/g, " ").slice(0, 120);
      query = query.ilike("action", `%${q}%`);
    }
    if (filters.action?.trim()) {
      query = query.eq("action", filters.action);
    }
    const { data, error } = await query.order("created_at", { ascending: false }).limit(200);
    if (error || !data) return [];
    return (data as JournalEntry[]).map((row) => ({
      ...row,
      details: row.details ?? {},
    }));
  } catch {
    return [];
  }
}
