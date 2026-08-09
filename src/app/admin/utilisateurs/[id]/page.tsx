import Link from "next/link";
import { notFound } from "next/navigation";
import { UserProfileTabs } from "@/components/admin/users/user-profile-tabs";
import { principalAssignableRoles } from "@/config/afd-staff";
import { roles, roleLabels, type Role } from "@/config/roles";
import { updateAdminUser } from "@/features/utilisateurs/actions/manage-utilisateur";
import {
  isPrincipalActor,
  isSuperActor,
} from "@/features/identity/security/privilege-guards";
import { requirePermission } from "@/lib/auth/require-permission";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getAdminUser } from "@/lib/queries/admin/utilisateurs";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
};

export default async function AdminUtilisateurDetailPage({
  params,
  searchParams,
}: PageProps) {
  await requirePermission("utilisateurs:read");
  const session = await requireAdmin();
  const id = (await params).id;
  const { tab } = await searchParams;
  const user = await getAdminUser(id);
  if (!user) notFound();

  const isSelf = session.user.id === user.id;
  const primaryRole = user.roles[0] ?? "agent";
  const actorIsSuper = isSuperActor(session.roles);
  const actorIsPrincipal = isPrincipalActor(session.roles);

  let selectable: Role[] = [];
  if (actorIsSuper) {
    selectable = roles.filter((r) => r !== "platform_owner");
  } else if (actorIsPrincipal) {
    selectable = (principalAssignableRoles as readonly string[]).filter(
      (code): code is Role => (roles as readonly string[]).includes(code),
    );
  } else {
    selectable = [];
  }

  return (
    <main className="mx-auto w-full max-w-3xl space-y-4 p-4 md:p-6">
      <Link href="/admin/utilisateurs" className="text-sm text-[var(--afd-blue)]">
        ← Retour à la liste
      </Link>
      <UserProfileTabs
        user={user}
        isSelf={isSelf}
        canEditRole={selectable.length > 0}
        selectableRoles={selectable.map((value) => ({
          value,
          label: roleLabels[value],
        }))}
        primaryRole={primaryRole}
        updateAction={updateAdminUser}
        initialTab={tab}
      />
    </main>
  );
}
