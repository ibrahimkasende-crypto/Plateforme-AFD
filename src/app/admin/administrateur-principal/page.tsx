import Link from "next/link";
import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
import {
  reactivatePrincipalAction,
  suspendPrincipalAction,
} from "@/features/identity/actions/manage-principal";
import { isSuperActor } from "@/features/identity/security/privilege-guards";
import {
  countActivePrincipalAdmins,
  getActivePrincipalAdmin,
} from "@/features/identity/services/principal-admin.service";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createClientSafe } from "@/lib/supabase/safe";
import { createAdminServiceClient } from "@/lib/supabase/admin-service";

type PageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function AdministrateurPrincipalPage({
  searchParams,
}: PageProps) {
  const session = await requireAdmin();
  if (!isSuperActor(session.roles)) {
    redirect("/acces-refuse");
  }

  const { error } = await searchParams;
  const supabase = await createClientSafe();
  const principal = supabase
    ? await getActivePrincipalAdmin(supabase)
    : null;
  const count = supabase ? await countActivePrincipalAdmins(supabase) : 0;

  let photoUrl: string | null = null;
  if (principal && supabase) {
    const { data: profile } = await supabase
      .from("profils_administrateurs" as never)
      .select("avatar_bucket, avatar_path, departement, statut_compte")
      .eq("id", principal.id)
      .maybeSingle();
    const row = profile as {
      avatar_bucket?: string | null;
      avatar_path?: string | null;
    } | null;
    if (row?.avatar_path) {
      const service = createAdminServiceClient();
      if (service) {
        const { data } = await service.storage
          .from(row.avatar_bucket || "admin-avatars")
          .createSignedUrl(row.avatar_path, 3600);
        photoUrl = data?.signedUrl ?? null;
      }
    }
  }

  return (
    <main className="mx-auto w-full max-w-4xl space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex size-11 items-center justify-center rounded-xl bg-[var(--admin-primary)]/10 text-[var(--admin-primary)]">
            <ShieldCheck className="size-6" />
          </span>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Administrateur principal
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Un seul Administrateur principal actif pour l’AFD. Il gère ensuite
              les agents au quotidien.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/administrateur-principal/historique"
            className="rounded-lg border px-4 py-2 text-sm font-semibold"
          >
            Voir l’historique
          </Link>
          {!principal ? (
            <Link
              href="/admin/administrateur-principal/creer"
              className="rounded-lg bg-[var(--admin-primary)] px-4 py-2 text-sm font-semibold text-white"
            >
              Créer l’Administrateur principal
            </Link>
          ) : null}
        </div>
      </div>

      {error === "already_exists" ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950">
          Un Administrateur principal actif ou invité existe déjà. Suspendez-le
          ou utilisez le remplacement.
        </p>
      ) : null}

      <p className="text-xs text-slate-500">
        Administrateurs principaux actifs détectés : {count}
      </p>

      {!principal ? (
        <EmptyState
          title="Aucun Administrateur principal n’a encore été créé pour l’AFD."
          description="Désignez la personne qui gérera les comptes des agents AFD."
          action={
            <Link
              href="/admin/administrateur-principal/creer"
              className="rounded-lg bg-[var(--admin-primary)] px-4 py-2 text-sm font-semibold text-white"
            >
              Créer l’Administrateur principal
            </Link>
          }
        />
      ) : (
        <section className="space-y-4 rounded-2xl border bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="aspect-square size-20 overflow-hidden rounded-full bg-slate-100">
              {photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={photoUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-xl font-bold text-slate-500">
                  {(principal.nom_complet || principal.email || "?")
                    .charAt(0)
                    .toUpperCase()}
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-lg font-semibold text-slate-900">
                {principal.nom_complet ?? "Sans nom"}
              </h2>
              <p className="truncate text-sm text-slate-600">{principal.email}</p>
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-emerald-50 px-3 py-1 font-semibold text-emerald-800">
                  {principal.statut_compte ??
                    (principal.actif ? "active" : "—")}
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-700">
                  Administrateur principal
                </span>
              </div>
            </div>
          </div>

          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-slate-500">Fonction</dt>
              <dd className="font-medium">{principal.fonction ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Téléphone</dt>
              <dd className="font-medium">{principal.telephone ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Dernière connexion</dt>
              <dd className="font-medium">
                {principal.derniere_connexion
                  ? new Date(principal.derniere_connexion).toLocaleString("fr-FR")
                  : "Jamais"}
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">Créé le</dt>
              <dd className="font-medium">
                {principal.created_at
                  ? new Date(principal.created_at).toLocaleDateString("fr-FR")
                  : "—"}
              </dd>
            </div>
          </dl>

          <div className="flex flex-wrap gap-2 pt-2">
            <Link
              href={`/admin/utilisateurs/${principal.id}`}
              className="rounded-lg border px-3 py-2 text-sm font-semibold"
            >
              Voir le profil
            </Link>
            <Link
              href={`/admin/administrateur-principal/modifier?id=${principal.id}`}
              className="rounded-lg border px-3 py-2 text-sm font-semibold"
            >
              Modifier
            </Link>
            <Link
              href="/admin/invitations"
              className="rounded-lg border px-3 py-2 text-sm font-semibold"
            >
              Renvoyer l’invitation
            </Link>
            <Link
              href="/admin/securite/sessions"
              className="rounded-lg border px-3 py-2 text-sm font-semibold"
            >
              Révoquer les sessions
            </Link>
            <Link
              href="/admin/administrateur-principal/historique"
              className="rounded-lg border px-3 py-2 text-sm font-semibold"
            >
              Voir l’historique
            </Link>
          </div>

          <form
            action={suspendPrincipalAction}
            className="mt-4 space-y-3 rounded-xl border border-amber-200 bg-amber-50 p-4"
          >
            <input type="hidden" name="target_id" value={principal.id} />
            <p className="text-sm font-semibold text-amber-950">
              Suspendre / préparer un remplacement
            </p>
            <textarea
              name="justification"
              required
              minLength={8}
              rows={3}
              placeholder="Justification obligatoire…"
              className="w-full rounded-lg border border-amber-200 p-2 text-sm"
            />
            <div className="flex flex-wrap gap-2">
              <button
                type="submit"
                className="rounded-lg bg-amber-800 px-4 py-2 text-sm font-semibold text-white"
              >
                Suspendre le compte
              </button>
              <Link
                href="/admin/administrateur-principal/creer"
                className="rounded-lg border border-amber-300 bg-white px-4 py-2 text-sm font-semibold text-amber-950"
              >
                Remplacer l’Administrateur principal
              </Link>
            </div>
          </form>

          <form
            action={reactivatePrincipalAction}
            className="space-y-3 rounded-xl border p-4"
          >
            <input type="hidden" name="target_id" value={principal.id} />
            <p className="text-sm font-semibold">Réactiver (si suspendu)</p>
            <textarea
              name="justification"
              required
              minLength={8}
              rows={2}
              className="w-full rounded-lg border p-2 text-sm"
              placeholder="Justification…"
            />
            <button
              type="submit"
              className="rounded-lg border px-4 py-2 text-sm font-semibold"
            >
              Réactiver
            </button>
          </form>
        </section>
      )}
    </main>
  );
}
