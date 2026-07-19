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
  const { data, error } = await supabase
    .from("profils_administrateurs" as never)
    .select(
      "id, nom_complet, email, photo_url, avatar_bucket, avatar_path, actif, derniere_connexion, created_at, updated_at",
    )
    .eq("id", userId)
    .maybeSingle();

  if (error || !data) return null;
  return data as unknown as ProfilAdministrateur;
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
