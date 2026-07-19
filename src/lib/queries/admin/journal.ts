import { createClientSafe } from "@/lib/supabase/safe";

export type JournalEntry = {
  id: string;
  utilisateur_id: string | null;
  action: string;
  details: Record<string, unknown>;
  created_at: string;
  module?: string | null;
  result?: string | null;
  sensitivity?: string | null;
  source?: "journal_activite" | "audit_logs";
};

export async function getAdminJournal(filters: {
  q?: string;
  action?: string;
} = {}): Promise<JournalEntry[]> {
  try {
    const supabase = await createClientSafe();
    if (!supabase) return [];

    const q = filters.q?.trim().replace(/[%_,]/g, " ").slice(0, 120);

    let legacyQuery = supabase
      .from("journal_activite" as never)
      .select("id, utilisateur_id, action, details, created_at");
    if (q) legacyQuery = legacyQuery.ilike("action", `%${q}%`);
    if (filters.action?.trim()) {
      legacyQuery = legacyQuery.eq("action", filters.action);
    }

    let auditQuery = supabase
      .from("audit_logs" as never)
      .select(
        "id, actor_id, action, module, entity_type, entity_id, result, sensitivity, created_at, new_values, old_values",
      );
    if (q) {
      auditQuery = auditQuery.or(
        `action.ilike.%${q}%,module.ilike.%${q}%`,
      );
    }
    if (filters.action?.trim()) {
      auditQuery = auditQuery.eq("action", filters.action);
    }

    const [legacyRes, auditRes] = await Promise.all([
      legacyQuery.order("created_at", { ascending: false }).limit(150),
      auditQuery.order("created_at", { ascending: false }).limit(150),
    ]);

    const legacy = ((legacyRes.data ?? []) as JournalEntry[]).map((row) => ({
      ...row,
      details: row.details ?? {},
      source: "journal_activite" as const,
    }));

    const audit = (
      (auditRes.data ?? []) as Array<{
        id: string;
        actor_id: string | null;
        action: string;
        module: string | null;
        entity_type: string | null;
        entity_id: string | null;
        result: string | null;
        sensitivity: string | null;
        created_at: string;
        new_values: Record<string, unknown> | null;
        old_values: Record<string, unknown> | null;
      }>
    ).map((row) => ({
      id: row.id,
      utilisateur_id: row.actor_id,
      action: row.action,
      module: row.module,
      result: row.result,
      sensitivity: row.sensitivity,
      created_at: row.created_at,
      details: {
        module: row.module,
        entity_type: row.entity_type,
        entity_id: row.entity_id,
        result: row.result,
        sensitivity: row.sensitivity,
        old_values: row.old_values,
        new_values: row.new_values,
      },
      source: "audit_logs" as const,
    }));

    return [...legacy, ...audit]
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )
      .slice(0, 200);
  } catch {
    return [];
  }
}
