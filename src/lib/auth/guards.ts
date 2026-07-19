import "server-only";

import type { Permission } from "@/config/permissions";
import { hasPermission } from "@/lib/auth/has-permission";
import { requireAdmin, type AdminSession } from "@/lib/auth/require-admin";
import { requirePermission } from "@/lib/auth/require-permission";
import { redirect } from "next/navigation";

export async function requireAuthenticatedUser(): Promise<AdminSession> {
  return requireAdmin();
}

export async function requireAnyPermission(
  permissions: Permission[],
): Promise<AdminSession> {
  const session = await requireAdmin();
  for (const permission of permissions) {
    if (await hasPermission(session.user.id, permission)) {
      return session;
    }
  }
  redirect("/acces-refuse");
}

export async function requireMfaLevel(
  minAal: "aal1" | "aal2" = "aal2",
): Promise<AdminSession> {
  const session = await requireAdmin();
  // En production, exiger aal2 pour actions sensibles.
  // En développement, on tolère aal1 pour ne pas bloquer le travail local.
  if (process.env.NODE_ENV === "production" && minAal === "aal2") {
    const aal =
      (session.user.app_metadata?.aal as string | undefined) || "aal1";
    if (aal !== "aal2") {
      redirect("/admin/securite/sessions?mfa=required");
    }
  }
  return session;
}

export { requirePermission, hasPermission, requireAdmin };
export type { AdminSession };
