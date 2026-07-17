import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { roleLabels, type Role } from "@/config/roles";
import { roleHasPermission } from "@/config/permissions";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getAdminProfileWithRoles } from "@/lib/auth/get-user-role";
import { logAdminActivity } from "@/lib/auth/log-admin-activity";
import type { ProfilAdministrateur } from "@/types/admin-auth.types";
import type { AdminViewer } from "@/features/statistiques/types/dashboard";

export type AdminSession = {
  user: User;
  profile: ProfilAdministrateur;
  role: Role;
  roles: string[];
  viewer: AdminViewer;
};

function toViewer(
  profile: ProfilAdministrateur,
  role: Role,
): AdminViewer {
  const displayName =
    profile.nom_complet?.trim() || profile.email || "Administrateur AFD";
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

/**
 * Garde d’accès administration.
 * Redirige vers /connexion sans session, /acces-refuse sinon.
 */
export async function requireAdmin(
  nextPath = "/admin",
): Promise<AdminSession> {
  const user = await getCurrentUser();
  if (!user) {
    redirect(`/connexion?next=${encodeURIComponent(nextPath)}`);
  }

  const bundle = await getAdminProfileWithRoles(user.id);

  if (!bundle) {
    await logAdminActivity(
      "auth.login_denied",
      { reason: "profile_missing", email: user.email ?? null },
      user.id,
    );
    redirect("/acces-refuse?raison=profil");
  }

  if (!bundle.profile.actif) {
    await logAdminActivity(
      "auth.account_disabled_attempt",
      { email: user.email ?? null },
      user.id,
    );
    redirect("/acces-refuse?raison=desactive");
  }

  if (!bundle.primaryRole) {
    await logAdminActivity(
      "auth.role_missing",
      { email: user.email ?? null },
      user.id,
    );
    redirect("/acces-refuse?raison=role");
  }

  return {
    user,
    profile: bundle.profile,
    role: bundle.primaryRole,
    roles: bundle.roles,
    viewer: toViewer(bundle.profile, bundle.primaryRole),
  };
}

/**
 * Version non-redirect pour les services (retourne null si non autorisé).
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  const bundle = await getAdminProfileWithRoles(user.id);
  if (!bundle?.profile.actif || !bundle.primaryRole) return null;

  return {
    user,
    profile: bundle.profile,
    role: bundle.primaryRole,
    roles: bundle.roles,
    viewer: toViewer(bundle.profile, bundle.primaryRole),
  };
}
