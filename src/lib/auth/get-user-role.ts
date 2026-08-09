import { createClient } from "@/lib/supabase/server";
import { pickPrimaryRole } from "@/lib/auth/role-priority";
import type { Role } from "@/config/roles";
import type { ProfilAdministrateur } from "@/types/admin-auth.types";

export type AdminProfileWithRoles = {
  profile: ProfilAdministrateur;
  roles: string[];
  primaryRole: Role | null;
};

export async function getAdminProfile(
  userId: string,
): Promise<ProfilAdministrateur | null> {
  const supabase = await createClient();
  // Select large : inclut avatar_* si la migration identity est appliquée.
  const full = await supabase
    .from("profils_administrateurs" as never)
    .select(
      "id, nom_complet, email, photo_url, avatar_bucket, avatar_path, actif, derniere_connexion, created_at, updated_at, must_change_password, password_changed_at, temporary_password_issued_at, prenom, nom_famille, telephone, fonction, statut_compte",
    )
    .eq("id", userId)
    .maybeSingle();

  if (!full.error && full.data) {
    return full.data as unknown as ProfilAdministrateur;
  }

  // Fallback schéma partiel (projet récemment migré sans colonnes avatar).
  const basic = await supabase
    .from("profils_administrateurs" as never)
    .select(
      "id, nom_complet, email, photo_url, actif, derniere_connexion, created_at, updated_at",
    )
    .eq("id", userId)
    .maybeSingle();

  if (basic.error || !basic.data) return null;

  return {
    ...(basic.data as object),
    avatar_bucket: null,
    avatar_path: null,
    must_change_password: false,
  } as ProfilAdministrateur;
}

export async function getUserRoleNames(userId: string): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("utilisateurs_roles" as never)
    .select("role_id, roles(nom)")
    .eq("utilisateur_id", userId);

  if (error || !data) return [];

  return (data as unknown as Array<{ roles: { nom: string } | null }>)
    .map((row) => row.roles?.nom)
    .filter((nom): nom is string => Boolean(nom));
}

export async function getUserRole(userId: string): Promise<Role | null> {
  const names = await getUserRoleNames(userId);
  return pickPrimaryRole(names);
}

export async function getAdminProfileWithRoles(
  userId: string,
): Promise<AdminProfileWithRoles | null> {
  const profile = await getAdminProfile(userId);
  if (!profile) return null;
  const roles = await getUserRoleNames(userId);
  return {
    profile,
    roles,
    primaryRole: pickPrimaryRole(roles),
  };
}
