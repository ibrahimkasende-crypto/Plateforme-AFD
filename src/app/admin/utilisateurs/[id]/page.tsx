import Link from "next/link";
import { notFound } from "next/navigation";
import { roles, roleLabels } from "@/config/roles";
import { updateAdminUser } from "@/features/utilisateurs/actions/manage-utilisateur";
import { requirePermission } from "@/lib/auth/require-permission";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getAdminUser } from "@/lib/queries/admin/utilisateurs";

export default async function AdminUtilisateurDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePermission("utilisateurs:read");
  const session = await requireAdmin();
  const id = (await params).id;
  const user = await getAdminUser(id);
  if (!user) notFound();

  const isSelf = session.user.id === user.id;
  const primaryRole = user.roles[0] ?? "secretariat";

  return (
    <main className="max-w-2xl space-y-6 p-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Profil administrateur</h1>
        <Link href="/admin/utilisateurs" className="text-sm text-[var(--afd-blue)]">
          Retour à la liste
        </Link>
      </div>

      <div className="rounded border bg-white p-4 text-sm">
        <p>
          <span className="text-[var(--afd-muted)]">E-mail :</span> {user.email}
        </p>
        <p className="mt-2">
          <span className="text-[var(--afd-muted)]">Dernière connexion :</span>{" "}
          {user.derniere_connexion ? new Date(user.derniere_connexion).toLocaleString("fr-FR") : "—"}
        </p>
        <p className="mt-2">
          <span className="text-[var(--afd-muted)]">Rôles actuels :</span>{" "}
          {user.roles.length
            ? user.roles.map((r) => roleLabels[r as keyof typeof roleLabels] ?? r).join(", ")
            : "Aucun"}
        </p>
      </div>

      {isSelf ? (
        <p className="rounded border border-blue-100 bg-blue-50 p-3 text-sm text-blue-900">
          Vous ne pouvez pas modifier votre propre rôle. Contactez un super administrateur pour tout
          changement de permissions.
        </p>
      ) : null}

      <form action={updateAdminUser} className="space-y-4">
        <input type="hidden" name="id" value={user.id} />
        <label className="block space-y-1">
          <span className="text-sm font-medium">Nom complet</span>
          <input required name="nom_complet" defaultValue={user.nom_complet ?? ""} className="w-full rounded border p-3" />
        </label>
        {!isSelf ? (
          <label className="block space-y-1">
            <span className="text-sm font-medium">Rôle principal</span>
            <select name="role" defaultValue={primaryRole} className="w-full rounded border p-3">
              {roles.map((role) => (
                <option key={role} value={role}>
                  {roleLabels[role]}
                </option>
              ))}
            </select>
          </label>
        ) : null}
        <label className="inline-flex items-center gap-2 text-sm">
          <input name="actif" type="checkbox" defaultChecked={user.actif} />
          Compte actif
        </label>
        <button type="submit" className="rounded bg-[var(--afd-blue)] px-4 py-2 text-white">
          Enregistrer
        </button>
      </form>
    </main>
  );
}
