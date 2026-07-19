import Link from "next/link";
import { roles, roleLabels } from "@/config/roles";
import { inviteUserAction } from "@/features/identity/actions/invite-user";
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
  const canCreateSuperAdmin = await hasPermission(
    session.user.id,
    "users.create_super_admin",
  );

  if (isSuperAdminFlow && !canCreateSuperAdmin && !isPlatformOwner) {
    return (
      <main className="max-w-2xl space-y-6 p-6">
        <h1 className="text-2xl font-bold">Invitation super administrateur</h1>
        <p className="rounded border border-red-200 bg-red-50 p-4 text-sm text-red-900">
          Permission <code>users.create_super_admin</code> requise pour inviter un super
          administrateur.
        </p>
        <Link href="/admin/utilisateurs" className="text-sm text-[var(--afd-blue)]">
          Retour
        </Link>
      </main>
    );
  }

  const selectableRoles = roles.filter(
    (role) => role !== "platform_owner" || isPlatformOwner,
  );
  const defaultRole = isSuperAdminFlow ? "super_admin" : "administrateur";

  return (
    <main className="max-w-3xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Inviter un utilisateur administrateur</h1>
        <p className="mt-1 text-sm text-[var(--afd-muted)]">
          Invitation par e-mail — aucun mot de passe n&apos;est défini par un tiers.
        </p>
      </div>

      {!inviteAvailable ? (
        <div className="rounded border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <p className="font-medium">Invitation indisponible</p>
          <p className="mt-1">
            Définissez <code>SUPABASE_SERVICE_ROLE_KEY</code> côté serveur pour envoyer une
            invitation par e-mail.
          </p>
        </div>
      ) : null}

      {isSuperAdminFlow ? (
        <div className="rounded border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950">
          <p className="font-semibold">Compte très privilégié — MFA obligatoire</p>
          <p className="mt-1">
            L&apos;invitation d&apos;un super administrateur exige une session MFA (aal2) et une
            justification écrite. Le compte devra configurer la MFA avant toute action sensible.
          </p>
        </div>
      ) : null}

      <form action={inviteUserAction} className="space-y-8">
        <fieldset className="space-y-4 rounded-lg border p-4" disabled={!inviteAvailable}>
          <legend className="px-2 text-sm font-semibold uppercase tracking-wide text-slate-600">
            1. Identité
          </legend>
          <label className="block space-y-1">
            <span className="text-sm font-medium">E-mail professionnel</span>
            <input
              required
              name="email"
              type="email"
              autoComplete="email"
              className="w-full rounded border p-3"
            />
          </label>
          <label className="block space-y-1">
            <span className="text-sm font-medium">Nom complet</span>
            <input required name="nom_complet" className="w-full rounded border p-3" />
          </label>
          <label className="block space-y-1">
            <span className="text-sm font-medium">Téléphone (optionnel)</span>
            <input name="telephone" type="tel" className="w-full rounded border p-3" />
          </label>
        </fieldset>

        <fieldset className="space-y-4 rounded-lg border p-4" disabled={!inviteAvailable}>
          <legend className="px-2 text-sm font-semibold uppercase tracking-wide text-slate-600">
            2. Fonction
          </legend>
          <label className="block space-y-1">
            <span className="text-sm font-medium">Fonction / titre</span>
            <input name="fonction" className="w-full rounded border p-3" />
          </label>
        </fieldset>

        <fieldset className="space-y-4 rounded-lg border p-4" disabled={!inviteAvailable}>
          <legend className="px-2 text-sm font-semibold uppercase tracking-wide text-slate-600">
            3. Type de compte
          </legend>
          <p className="text-sm text-slate-600">
            {isSuperAdminFlow
              ? "Flux super administrateur — accès étendu à la plateforme."
              : "Compte administrateur standard — périmètre défini par le rôle attribué."}
          </p>
        </fieldset>

        <fieldset className="space-y-4 rounded-lg border p-4" disabled={!inviteAvailable}>
          <legend className="px-2 text-sm font-semibold uppercase tracking-wide text-slate-600">
            4. Rôle
          </legend>
          <label className="block space-y-1">
            <span className="text-sm font-medium">Rôle principal</span>
            <select
              name="role"
              defaultValue={defaultRole}
              className="w-full rounded border p-3"
            >
              {selectableRoles.map((role) => (
                <option key={role} value={role}>
                  {roleLabels[role]}
                </option>
              ))}
            </select>
          </label>
          {!isPlatformOwner ? (
            <p className="text-xs text-slate-500">
              Le rôle <em>platform_owner</em> n&apos;est visible que pour un propriétaire
              plateforme.
            </p>
          ) : null}
        </fieldset>

        <fieldset className="space-y-4 rounded-lg border p-4" disabled={!inviteAvailable}>
          <legend className="px-2 text-sm font-semibold uppercase tracking-wide text-slate-600">
            5. Sécurité
          </legend>
          <label className="inline-flex items-center gap-2 text-sm">
            <input name="require_mfa" type="checkbox" defaultChecked={isSuperAdminFlow} />
            Exiger la configuration MFA à la première connexion
          </label>
          {isSuperAdminFlow ? (
            <label className="block space-y-1">
              <span className="text-sm font-medium">Raison de l&apos;invitation *</span>
              <textarea
                required
                name="reason"
                rows={3}
                className="w-full rounded border p-3"
                placeholder="Justification métier (audit obligatoire)"
              />
            </label>
          ) : (
            <label className="block space-y-1">
              <span className="text-sm font-medium">Raison (optionnel)</span>
              <textarea name="reason" rows={2} className="w-full rounded border p-3" />
            </label>
          )}
        </fieldset>

        <fieldset className="space-y-4 rounded-lg border border-[var(--afd-blue)]/30 bg-slate-50 p-4">
          <legend className="px-2 text-sm font-semibold uppercase tracking-wide text-slate-600">
            6. Confirmation
          </legend>
          <p className="text-sm text-slate-700">
            Un e-mail d&apos;invitation sera envoyé. L&apos;utilisateur définira son mot de passe
            via le lien sécurisé reçu.
          </p>
          <div className="flex gap-3">
            <button
              type="submit"
              className="rounded bg-[var(--afd-blue)] px-4 py-2 text-white disabled:opacity-50"
              disabled={!inviteAvailable}
            >
              Envoyer l&apos;invitation
            </button>
            <Link href="/admin/utilisateurs" className="rounded border px-4 py-2">
              Annuler
            </Link>
          </div>
        </fieldset>
      </form>
    </main>
  );
}
