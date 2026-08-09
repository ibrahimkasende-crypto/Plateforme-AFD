import Link from "next/link";
import { redirect } from "next/navigation";
import { PrincipalAdminCreateForm } from "@/components/admin/users/principal-admin-create-form";
import { createPrincipalAdminAction } from "@/features/identity/actions/create-principal";
import { isSuperActor } from "@/features/identity/security/privilege-guards";
import { countActivePrincipalAdmins } from "@/features/identity/services/principal-admin.service";
import { getInviteAvailable } from "@/features/utilisateurs/actions/manage-utilisateur";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createClientSafe } from "@/lib/supabase/safe";

export default async function CreerAdministrateurPrincipalPage() {
  const session = await requireAdmin();
  if (!isSuperActor(session.roles)) {
    redirect("/acces-refuse");
  }

  const supabase = await createClientSafe();
  const count = supabase ? await countActivePrincipalAdmins(supabase) : 0;
  if (count >= 1) {
    redirect("/admin/administrateur-principal?error=already_exists");
  }

  const inviteAvailable = await getInviteAvailable();

  return (
    <main className="mx-auto w-full max-w-3xl space-y-6 p-4 md:p-6">
      <div>
        <Link
          href="/admin/administrateur-principal"
          className="text-sm text-[var(--admin-primary)]"
        >
          ← Retour
        </Link>
        <h1 className="mt-3 text-2xl font-bold">
          Créer l’Administrateur principal
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Formulaire distinct de la fiche employé. Invitation sécurisée — aucun
          mot de passe n’est défini par vous. Un seul compte actif est autorisé.
        </p>
      </div>

      {!inviteAvailable ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
          <p className="font-semibold">Invitation indisponible</p>
          <p className="mt-1">
            Ajoutez <code>SUPABASE_SERVICE_ROLE_KEY</code> dans les variables
            Hostinger (Supabase → Settings → API → service_role), puis
            redéployez. Interdit :{" "}
            <code>NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY</code>.
          </p>
          <p className="mt-2 text-xs">
            Local : clé dans <code>.env.local</code> + redémarrage du serveur.
          </p>
        </div>
      ) : null}

      <PrincipalAdminCreateForm
        action={createPrincipalAdminAction}
        inviteAvailable={inviteAvailable}
      />
    </main>
  );
}
