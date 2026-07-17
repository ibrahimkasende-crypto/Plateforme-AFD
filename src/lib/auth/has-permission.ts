import { roleHasPermission, type Permission } from "@/config/permissions";
import { createClient } from "@/lib/supabase/server";
import { getUserRole } from "@/lib/auth/get-user-role";

/**
 * Vérifie une permission côté serveur.
 * 1) RPC SQL `has_permission` si disponible
 * 2) Matrice TS basée sur le rôle primaire Supabase
 */
export async function hasPermission(
  userId: string,
  permission: Permission,
): Promise<boolean> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("has_permission" as never, {
      permission_name: permission,
    } as never);

    if (!error && typeof data === "boolean") {
      return data;
    }
  } catch {
    // Fallback matrice locale.
  }

  const role = await getUserRole(userId);
  if (!role) return false;
  return roleHasPermission(role, permission);
}
