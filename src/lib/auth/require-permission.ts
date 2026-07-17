import { redirect } from "next/navigation";
import type { Permission } from "@/config/permissions";
import { hasPermission } from "@/lib/auth/has-permission";
import { requireAdmin, type AdminSession } from "@/lib/auth/require-admin";

export async function requirePermission(
  permission: Permission,
): Promise<AdminSession> {
  const session = await requireAdmin();
  const allowed = await hasPermission(session.user.id, permission);
  if (!allowed) {
    redirect("/acces-refuse");
  }
  return session;
}
