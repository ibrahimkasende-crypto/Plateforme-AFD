import { createClientSafe } from "@/lib/supabase/safe";
import type { RoleRow } from "@/types/admin-auth.types";

export type PermissionRow = {
  id: string;
  nom: string;
  description: string | null;
};

export type RoleWithPermissions = RoleRow & {
  permissions: string[];
};

export async function getAdminRolesWithPermissions(): Promise<RoleWithPermissions[]> {
  try {
    const supabase = await createClientSafe();
    if (!supabase) return [];

    const { data: roles, error: rolesError } = await supabase
      .from("roles" as never)
      .select("id, nom, description")
      .order("nom", { ascending: true });

    if (rolesError || !roles) return [];

    const { data: links } = await supabase
      .from("roles_permissions" as never)
      .select("role_id, permissions(nom)");

    const permMap = new Map<string, string[]>();
    for (const row of (links ?? []) as unknown as Array<{ role_id: string; permissions: { nom: string } | null }>) {
      const nom = row.permissions?.nom;
      if (!nom) continue;
      const list = permMap.get(row.role_id) ?? [];
      list.push(nom);
      permMap.set(row.role_id, list);
    }

    return (roles as unknown as RoleRow[]).map((role) => ({
      ...role,
      permissions: (permMap.get(role.id) ?? []).sort(),
    }));
  } catch {
    return [];
  }
}

export async function getAllPermissions(): Promise<PermissionRow[]> {
  try {
    const supabase = await createClientSafe();
    if (!supabase) return [];
    const { data, error } = await supabase
      .from("permissions" as never)
      .select("id, nom, description")
      .order("nom", { ascending: true });
    return error || !data ? [] : (data as unknown as PermissionRow[]);
  } catch {
    return [];
  }
}
