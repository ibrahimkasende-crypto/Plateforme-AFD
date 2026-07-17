import { createClientSafe } from "@/lib/supabase/safe";

export type AdminActivityAction =
  | "auth.login_success"
  | "auth.login_denied"
  | "auth.logout"
  | "auth.password_reset_requested"
  | "auth.password_updated"
  | "auth.account_disabled_attempt"
  | "auth.role_missing";

/**
 * Journalise un événement admin sans secrets (pas de mot de passe / token).
 */
export async function logAdminActivity(
  action: AdminActivityAction,
  details: Record<string, unknown> = {},
  utilisateurId?: string | null,
): Promise<void> {
  try {
    const supabase = await createClientSafe();
    if (!supabase) return;

    // RPC security definer — table hors types générés.
    await supabase.rpc("log_admin_activity" as never, {
      p_action: action,
      p_details: details,
      p_utilisateur_id: utilisateurId ?? null,
    } as never);
  } catch {
    // Ne jamais faire échouer l’auth pour un journal indisponible.
  }
}
