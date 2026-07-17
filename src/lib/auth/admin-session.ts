import { roleHasPermission } from "@/config/permissions";
import { roleLabels, type Role } from "@/config/roles";
import type { AdminViewer } from "@/features/statistiques/types/dashboard";
import { createClientSafe } from "@/lib/supabase/safe";

/**
 * Session admin minimale pour cette phase.
 * Sans authentification complète : rôle de développement configurable,
 * sinon lecture partenaire (accès limité) en production.
 */
export async function getAdminViewer(): Promise<AdminViewer> {
  const envRole = process.env.AFD_ADMIN_DEV_ROLE as Role | undefined;
  const isDev = process.env.NODE_ENV === "development";

  let role: Role = "lecture_partenaire";
  let displayName = "Utilisateur AFD";

  if (isDev && envRole && roleLabels[envRole]) {
    role = envRole;
    displayName = "Directrice Générale";
  } else if (isDev) {
    role = "direction_generale";
    displayName = "Directrice Générale";
  }

  try {
    const supabase = await createClientSafe();
    if (supabase) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user?.email) {
        displayName = user.user_metadata?.full_name ?? user.email;
        // Table administrateurs legacy — si présent, élève le rôle.
        const { data: adminRow } = await supabase
          .from("administrateurs")
          .select("est_admin, email")
          .eq("email", user.email)
          .maybeSingle();
        if (adminRow?.est_admin) {
          role = "super_admin";
        }
      }
    }
  } catch {
    // Conserver le fallback.
  }

  const parts = displayName.trim().split(/\s+/);
  const initials =
    parts.length >= 2
      ? `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}`.toUpperCase()
      : displayName.slice(0, 2).toUpperCase();

  return {
    displayName,
    roleLabel: roleLabels[role],
    role,
    initials: initials || "AF",
    canReadFinances: roleHasPermission(role, "finances:read"),
  };
}
