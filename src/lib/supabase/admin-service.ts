import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

/**
 * Clé service (serveur uniquement).
 * Préférer SUPABASE_SERVICE_ROLE_KEY ; alias SUPABASE_SECRET_KEY accepté.
 * Jamais NEXT_PUBLIC_*.
 */
export function getSupabaseServiceRoleKey(): string | null {
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
    process.env.SUPABASE_SECRET_KEY?.trim() ||
    "";
  if (!key) return null;
  if (
    key.length < 20 ||
    /^(your-|changeme|xxx|placeholder|ta_vraie|sb_secret_your|sb_publishable_your)/i.test(
      key,
    )
  ) {
    return null;
  }
  // Accepte JWT legacy (eyJ…) et nouvelles clés sb_secret_…
  return key;
}

/**
 * Client service_role (serveur uniquement) pour invitations auth admin.
 * Retourne null si la clé n'est pas configurée.
 */
export function createAdminServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = getSupabaseServiceRoleKey();
  if (!url || !key) return null;
  return createClient<Database>(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
