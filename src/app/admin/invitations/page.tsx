import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { EmptyState } from "@/components/shared/EmptyState";
import { roleLabels, roles } from "@/config/roles";
import { inviteUserAction } from "@/features/identity/actions/invite-user";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";

const fieldClass = "w-full rounded border p-2 text-sm";

type Invitation = {
  id: string;
  email: string;
  role_code: string;
  statut: string;
  expires_at: string | null;
  created_at: string;
};

export default async function AdminInvitationsPage() {
  await requirePermission("users.invite");
  const supabase = await createClientSafe();

  let items: Invitation[] = [];
  if (supabase) {
    const { data } = await supabase
      .from("admin_invitations" as never)
      .select("id, email, role_code, statut, expires_at, created_at")
      .order("created_at", { ascending: false })
      .limit(100);
    items = (data ?? []) as Invitation[];
  }

  return (
    <main className="space-y-6 p-6">
      <AdminPageHeader
        title="Invitations"
        description="Invitations administrateurs en attente ou acceptées."
        actions={
          <Link href="/admin/utilisateurs" className="rounded border px-4 py-2 text-sm">
            Utilisateurs
          </Link>
        }
      />

      <form action={inviteUserAction} className="grid gap-3 rounded border bg-white p-4 lg:grid-cols-3">
        <input required type="email" name="email" placeholder="E-mail *" className={fieldClass} />
        <input required name="nom_complet" placeholder="Nom complet *" className={fieldClass} />
        <select required name="role" className={fieldClass} defaultValue="secretariat">
          {roles.map((role) => (
            <option key={role} value={role}>
              {roleLabels[role]}
            </option>
          ))}
        </select>
        <input name="fonction" placeholder="Fonction" className={fieldClass} />
        <input name="telephone" placeholder="Téléphone" className={fieldClass} />
        <button type="submit" className="rounded bg-[var(--afd-blue)] px-4 py-2 text-sm text-white">
          Envoyer l&apos;invitation
        </button>
      </form>

      {items.length === 0 ? (
        <EmptyState title="Aucune invitation" description="Invitez un nouvel administrateur ci-dessus." />
      ) : (
        <div className="overflow-x-auto rounded border bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                <th className="p-3">E-mail</th>
                <th>Rôle</th>
                <th>Statut</th>
                <th>Expire le</th>
                <th>Créée le</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr className="border-t" key={item.id}>
                  <td className="p-3">{item.email}</td>
                  <td>{roleLabels[item.role_code as keyof typeof roleLabels] ?? item.role_code}</td>
                  <td>{item.statut}</td>
                  <td>{item.expires_at?.slice(0, 10) ?? "—"}</td>
                  <td>{item.created_at.slice(0, 10)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
