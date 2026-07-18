import Link from "next/link";
import { roles, roleLabels } from "@/config/roles";
import { createAdminUser, getInviteAvailable } from "@/features/utilisateurs/actions/manage-utilisateur";
import { requirePermission } from "@/lib/auth/require-permission";

export default async function NouvelUtilisateurPage() {
  await requirePermission("utilisateurs:write");
  const inviteAvailable = await getInviteAvailable();

  return (
    <main className="max-w-2xl space-y-6 p-6">
      <h1 className="text-2xl font-bold">Nouvel utilisateur administrateur</h1>

      {!inviteAvailable ? (
        <div className="rounded border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <p className="font-medium">Invitation indisponible</p>
          <p className="mt-1">
            Définissez <code>SUPABASE_SERVICE_ROLE_KEY</code> côté serveur pour envoyer une invitation
            par e-mail, ou créez d&apos;abord le compte dans Supabase Auth puis associez un profil
            administrateur manuellement.
          </p>
        </div>
      ) : null}

      <form action={createAdminUser} className="space-y-4">
        <label className="block space-y-1">
          <span className="text-sm font-medium">E-mail</span>
          <input required name="email" type="email" className="w-full rounded border p-3" disabled={!inviteAvailable} />
        </label>
        <label className="block space-y-1">
          <span className="text-sm font-medium">Nom complet</span>
          <input required name="nom_complet" className="w-full rounded border p-3" disabled={!inviteAvailable} />
        </label>
        <label className="block space-y-1">
          <span className="text-sm font-medium">Rôle principal</span>
          <select name="role" className="w-full rounded border p-3" disabled={!inviteAvailable}>
            {roles.map((role) => (
              <option key={role} value={role}>
                {roleLabels[role]}
              </option>
            ))}
          </select>
        </label>
        <label className="inline-flex items-center gap-2 text-sm">
          <input name="actif" type="checkbox" defaultChecked disabled={!inviteAvailable} />
          Compte actif
        </label>
        <div className="flex gap-3">
          <button
            type="submit"
            className="rounded bg-[var(--afd-blue)] px-4 py-2 text-white disabled:opacity-50"
            disabled={!inviteAvailable}
          >
            Inviter
          </button>
          <Link href="/admin/utilisateurs" className="rounded border px-4 py-2">
            Annuler
          </Link>
        </div>
      </form>
    </main>
  );
}
