import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { createAdminServiceClient } from "@/lib/supabase/admin-service";
import { isPrincipalRole } from "@/features/identity/security/privilege-guards";
import { appendAuditLog } from "@/features/identity/services/audit.service";

export type PrincipalAdminRow = {
  id: string;
  email: string;
  nom_complet: string | null;
  fonction: string | null;
  telephone: string | null;
  actif: boolean | null;
  statut_compte: string | null;
  derniere_connexion: string | null;
  created_at: string | null;
};

const ACTIVE_STATUSES = new Set(["active", "invited", "pending"]);

export async function getActivePrincipalAdmin(
  supabase: SupabaseClient,
): Promise<PrincipalAdminRow | null> {
  const { data: roleRows } = await supabase
    .from("roles" as never)
    .select("id")
    .in("nom", [
      "admin_principal_direction",
      "admin_principal_it",
      "admin_principal",
      "administrateur",
    ]);

  const roleIds = ((roleRows ?? []) as Array<{ id: string }>).map((r) => r.id);
  if (roleIds.length === 0) return null;

  const { data: assignments } = await supabase
    .from("utilisateurs_roles" as never)
    .select("utilisateur_id")
    .in("role_id", roleIds);

  const userIds = [
    ...new Set(
      ((assignments ?? []) as Array<{ utilisateur_id: string }>).map(
        (a) => a.utilisateur_id,
      ),
    ),
  ];
  if (userIds.length === 0) return null;

  const { data: profiles } = await supabase
    .from("profils_administrateurs" as never)
    .select(
      "id, email, nom_complet, fonction, telephone, actif, statut_compte, derniere_connexion, created_at",
    )
    .in("id", userIds)
    .neq("actif", false);

  const typed = (profiles ?? []) as PrincipalAdminRow[];
  return (
    typed.find((profile) => {
      const status = profile.statut_compte ?? "active";
      return ACTIVE_STATUSES.has(status);
    }) ?? null
  );
}

export async function countActivePrincipalAdmins(
  supabase: SupabaseClient,
): Promise<number> {
  const { data, error } = await supabase.rpc(
    "count_active_admin_principals" as never,
  );
  if (!error && typeof data === "number") return data;
  const principal = await getActivePrincipalAdmin(supabase);
  return principal ? 1 : 0;
}

export async function logPrincipalHistory(input: {
  userId: string;
  action: string;
  actorId: string;
  justification?: string;
  previousUserId?: string | null;
  metadata?: Record<string, unknown>;
}) {
  const service = createAdminServiceClient();
  if (!service) return;
  await service.from("admin_principal_history" as never).insert({
    user_id: input.userId,
    action: input.action,
    actor_id: input.actorId,
    justification: input.justification ?? null,
    previous_user_id: input.previousUserId ?? null,
    metadata: input.metadata ?? {},
  } as never);
}

export async function assertCanCreatePrincipal(
  supabase: SupabaseClient,
  roleCode: string,
) {
  if (!isPrincipalRole(roleCode)) return;
  const count = await countActivePrincipalAdmins(supabase);
  if (count >= 1) {
    throw new Error(
      "Un Administrateur principal actif existe déjà. Suspendez-le ou remplacez-le avant d’en créer un autre.",
    );
  }
}

export async function suspendPrincipalAdmin(input: {
  supabase: SupabaseClient;
  targetId: string;
  actorId: string;
  justification: string;
}) {
  const service = createAdminServiceClient();
  const client = service ?? input.supabase;

  await client
    .from("profils_administrateurs" as never)
    .update({
      actif: false,
      statut_compte: "suspended",
      justification_statut: input.justification,
      updated_at: new Date().toISOString(),
    } as never)
    .eq("id", input.targetId);

  await client.from("user_status_history" as never).insert({
    user_id: input.targetId,
    from_status: "active",
    to_status: "suspended",
    actor_id: input.actorId,
    justification: input.justification,
  } as never);

  await logPrincipalHistory({
    userId: input.targetId,
    action: "suspended",
    actorId: input.actorId,
    justification: input.justification,
  });

  if (service) {
    await service.auth.admin.signOut(input.targetId).catch(() => undefined);
  }

  await appendAuditLog(input.supabase, {
    action: "users.suspend",
    module: "identity",
    entityType: "profils_administrateurs",
    entityId: input.targetId,
    newValues: { statut_compte: "suspended" },
    reason: input.justification,
    sensitivity: "strictement_confidentiel",
  });
}

export async function reactivatePrincipalAdmin(input: {
  supabase: SupabaseClient;
  targetId: string;
  actorId: string;
  justification: string;
}) {
  const count = await countActivePrincipalAdmins(input.supabase);
  if (count >= 1) {
    throw new Error(
      "Un Administrateur principal actif existe déjà. Suspendez-le avant de réactiver un autre.",
    );
  }

  const service = createAdminServiceClient();
  const client = service ?? input.supabase;

  await client
    .from("profils_administrateurs" as never)
    .update({
      actif: true,
      statut_compte: "active",
      justification_statut: input.justification,
      updated_at: new Date().toISOString(),
    } as never)
    .eq("id", input.targetId);

  await client.from("user_status_history" as never).insert({
    user_id: input.targetId,
    from_status: "suspended",
    to_status: "active",
    actor_id: input.actorId,
    justification: input.justification,
  } as never);

  await logPrincipalHistory({
    userId: input.targetId,
    action: "reactivated",
    actorId: input.actorId,
    justification: input.justification,
  });

  await appendAuditLog(input.supabase, {
    action: "users.activate",
    module: "identity",
    entityType: "profils_administrateurs",
    entityId: input.targetId,
    newValues: { statut_compte: "active" },
    reason: input.justification,
    sensitivity: "strictement_confidentiel",
  });
}
