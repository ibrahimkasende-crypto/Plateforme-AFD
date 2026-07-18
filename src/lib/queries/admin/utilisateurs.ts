import { createClientSafe } from "@/lib/supabase/safe";
import type { ProfilAdministrateur, RoleRow } from "@/types/admin-auth.types";

export type AdminUserListItem = ProfilAdministrateur & {
  roles: string[];
};

export async function getAdminUsers(filters: { q?: string } = {}): Promise<AdminUserListItem[]> {
  try {
    const supabase = await createClientSafe();
    if (!supabase) return [];

    let query = supabase
      .from("profils_administrateurs" as never)
      .select("id, nom_complet, email, photo_url, actif, derniere_connexion, created_at, updated_at")
      .order("created_at", { ascending: false });

    if (filters.q?.trim()) {
      const q = filters.q.trim().replace(/[%_,]/g, " ").slice(0, 120);
      query = query.or(`email.ilike.%${q}%,nom_complet.ilike.%${q}%`);
    }

    const { data: profiles, error } = await query;
    if (error || !profiles) return [];

    const typedProfiles = profiles as unknown as ProfilAdministrateur[];
    const ids = typedProfiles.map((p) => p.id);
    if (ids.length === 0) return [];

    const { data: roleRows } = await supabase
      .from("utilisateurs_roles" as never)
      .select("utilisateur_id, roles(nom)")
      .in("utilisateur_id", ids);

    const roleMap = new Map<string, string[]>();
    for (const row of (roleRows ?? []) as unknown as Array<{ utilisateur_id: string; roles: { nom: string } | null }>) {
      const nom = row.roles?.nom;
      if (!nom) continue;
      const list = roleMap.get(row.utilisateur_id) ?? [];
      list.push(nom);
      roleMap.set(row.utilisateur_id, list);
    }

    return typedProfiles.map((profile) => ({
      ...profile,
      roles: roleMap.get(profile.id) ?? [],
    }));
  } catch {
    return [];
  }
}

export async function getAdminUser(id: string): Promise<AdminUserListItem | null> {
  const users = await getAdminUsers();
  return users.find((u) => u.id === id) ?? null;
}

export async function getAssignableRoles(): Promise<RoleRow[]> {
  try {
    const supabase = await createClientSafe();
    if (!supabase) return [];
    const { data, error } = await supabase
      .from("roles" as never)
      .select("id, nom, description")
      .order("nom", { ascending: true });
    return error || !data ? [] : (data as unknown as RoleRow[]);
  } catch {
    return [];
  }
}
