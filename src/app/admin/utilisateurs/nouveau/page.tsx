import Link from "next/link";
import { InviteAgentWizard } from "@/components/admin/users/invite-agent-wizard";
import { roles, type Role } from "@/config/roles";
import { principalAssignableRoles } from "@/config/afd-staff";
import { inviteUserAction } from "@/features/identity/actions/invite-user";
import {
  isPrincipalActor,
  isSuperActor,
} from "@/features/identity/security/privilege-guards";
import { getInviteAvailable } from "@/features/utilisateurs/actions/manage-utilisateur";
import { requirePermission } from "@/lib/auth/require-permission";
import { requireAdmin } from "@/lib/auth/require-admin";
import { hasPermission } from "@/lib/auth/has-permission";

type PageProps = {
  searchParams: Promise<{ type?: string }>;
};

export default async function NouvelUtilisateurPage({ searchParams }: PageProps) {
  await requirePermission("users.invite");
  const session = await requireAdmin();
  const inviteAvailable = await getInviteAvailable();
  const params = await searchParams;

  const isSuperAdminFlow = params.type === "super_admin";
  const isPlatformOwner = session.roles.includes("platform_owner");
  const actorIsSuper = isSuperActor(session.roles);
  const actorIsPrincipal = isPrincipalActor(session.roles);
  const canCreateSuperAdmin = await hasPermission(
    session.user.id,
    "users.create_super_admin",
  );

  if (isSuperAdminFlow && !canCreateSuperAdmin && !isPlatformOwner) {
    return (
      <main className="max-w-2xl space-y-6 p-6">
        <h1 className="text-2xl font-bold">Invitation super administrateur</h1>
        <p className="rounded border border-red-200 bg-red-50 p-4 text-sm text-red-900">
          Permission <code>users.create_super_admin</code> requise.
        </p>
        <Link href="/admin/utilisateurs" className="text-sm text-[var(--afd-blue)]">
          Retour
        </Link>
      </main>
    );
  }

  let selectableRoles: Role[] = [];
  if (isSuperAdminFlow && (canCreateSuperAdmin || isPlatformOwner)) {
    selectableRoles = ["super_admin"];
  } else if (actorIsSuper) {
    selectableRoles = roles.filter(
      (role) =>
        role !== "platform_owner" &&
        role !== "admin_principal" &&
        role !== "administrateur" &&
        (role !== "super_admin" || canCreateSuperAdmin || isPlatformOwner),
    );
  } else if (actorIsPrincipal) {
    selectableRoles = (principalAssignableRoles as readonly string[]).filter(
      (code): code is Role => (roles as readonly string[]).includes(code),
    );
  } else {
    selectableRoles = ["agent", "lecture_seule"];
  }

  const defaultRole = isSuperAdminFlow
    ? "super_admin"
    : selectableRoles.includes("agent")
      ? "agent"
      : selectableRoles[0] ?? "employe";

  return (
    <main className="mx-auto w-full max-w-3xl space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold">Inviter un utilisateur AFD</h1>
        <p className="mt-1 text-sm text-[var(--afd-muted)]">
          Formulaire en étapes — invitation par e-mail, sans mot de passe défini
          par un tiers.
          {actorIsPrincipal && !actorIsSuper
            ? " En tant qu’Administrateur principal, vous créez les agents et responsables."
            : null}
        </p>
        {actorIsSuper && !isSuperAdminFlow ? (
          <p className="mt-2 text-sm">
            Pour l’Administrateur principal unique, utilisez{" "}
            <Link
              href="/admin/administrateur-principal/creer"
              className="font-semibold text-[var(--afd-blue)] underline"
            >
              cet écran dédié
            </Link>
            .
          </p>
        ) : null}
      </div>

      {!inviteAvailable ? (
        <div className="rounded border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <p className="font-medium">Invitation indisponible</p>
          <p className="mt-1">
            Ajoutez <code>SUPABASE_SERVICE_ROLE_KEY</code> dans les variables
            d&apos;environnement Hostinger (Settings → API → service_role), puis
            redéployez. Ne jamais utiliser{" "}
            <code>NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY</code>.
          </p>
          <p className="mt-2 text-xs">
            En local : ajoutez la clé dans <code>.env.local</code> et
            redémarrez <code>npm run dev</code>.
          </p>
        </div>
      ) : null}

      <InviteAgentWizard
        action={inviteUserAction}
        selectableRoles={selectableRoles}
        defaultRole={defaultRole}
        inviteAvailable={inviteAvailable}
        actorIsPrincipal={actorIsPrincipal && !actorIsSuper}
      />

      <Link href="/admin/utilisateurs" className="inline-block text-sm text-[var(--afd-blue)]">
        Annuler et retourner à la liste
      </Link>
    </main>
  );
}
