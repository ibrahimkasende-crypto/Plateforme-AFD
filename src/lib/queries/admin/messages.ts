import type { Database } from "@/types/database.types";
import { createClientSafe } from "@/lib/supabase/safe";

export type Message = Database["public"]["Tables"]["messages"]["Row"];

export async function getAdminMessages(filters: {
  q?: string;
  status?: string;
} = {}): Promise<Message[]> {
  try {
    const supabase = await createClientSafe();
    if (!supabase) return [];
    let query = supabase.from("messages").select("*");
    if (filters.q?.trim()) {
      const q = filters.q.trim().replace(/[%_,]/g, " ").slice(0, 120);
      query = query.or(`name.ilike.%${q}%,email.ilike.%${q}%,subject.ilike.%${q}%`);
    }
    if (filters.status?.trim()) {
      query = query.eq("status", filters.status);
    }
    const { data, error } = await query.order("created_at", { ascending: false });
    return error || !data ? [] : data;
  } catch {
    return [];
  }
}

export async function getAdminMessage(id: string): Promise<Message | null> {
  try {
    const supabase = await createClientSafe();
    if (!supabase) return null;
    const { data, error } = await supabase.from("messages").select("*").eq("id", id).maybeSingle();
    return error || !data ? null : data;
  } catch {
    return null;
  }
}
