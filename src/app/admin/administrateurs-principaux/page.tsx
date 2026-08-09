import Link from "next/link";
import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { isSuperActor } from "@/features/identity/security/privilege-guards";
import { listMainAdministrators } from "@/features/identity/services/main-administrators.service";
import { getAvatarSignedUrl } from "@/features/identity/actions/avatar";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createClientSafe } from "@/lib/supabase/safe";

export default async function AdministrateursPrincipauxPage() {
  const session = await requireAdmin("/admin/administrateurs-principaux");
  if (!isSuperActor(session.roles)) {
    redirect("/acces-refuse");
  }

  const supabase = await createClientSafe();
  const seats = supabase
    ? await listMainAdministrators(supabase)
    : { direction: null, it: null };

  async function avatarFor(card: {
    avatar_bucket: string | null;
    avatar_path: string | null;
  } | null) {
    if (!card?.avatar_path) return null;
    return getAvatarSignedUrl(
      card.avatar_bucket || "admin-avatars",
      card.avatar_path,
    );
  }

  const cards = [
    {
      title: "Direction",
      card: seats.direction,
      photo: await avatarFor(seats.direction),
    },
    {
      title: "IT",
      card: seats.it,
      photo: await avatarFor(seats.it),
    },
  ];

  return (
    <main className="mx-auto w-full max-w-5xl space-y-6 p-4 md:p-6">
      <div className="flex items-start gap-3">
        <span className="flex size-11 items-center justify-center rounded-xl bg-[var(--admin-primary)]/10 text-[var(--admin-primary)]">
          <ShieldCheck className="size-6" />
        </span>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Administrateurs principaux
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Deux sièges actifs autorisés : Direction et IT. Le Super
            Administrateur reste unique.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {cards.map(({ title, card, photo }) => (
          <article
            key={title}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {title}
            </p>
            <div className="mt-4 flex items-center gap-3">
              {photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={photo}
                  alt=""
                  className="size-14 rounded-full object-cover"
                />
              ) : (
                <span className="flex size-14 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-700">
                  {card?.initials ?? "—"}
                </span>
              )}
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  {card?.nom_complet ?? "Siège vacant"}
                </h2>
                <p className="text-sm text-slate-600">
                  {card?.fonction ?? "À compléter"}
                </p>
              </div>
            </div>

            <dl className="mt-4 space-y-2 text-sm text-slate-700">
              <div className="flex justify-between gap-3">
                <dt className="text-slate-500">Rôle</dt>
                <dd className="text-right font-medium">{card?.roleLabel ?? "—"}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-slate-500">E-mail</dt>
                <dd className="text-right">{card?.email ?? "—"}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-slate-500">Téléphone</dt>
                <dd className="text-right">{card?.telephone ?? "À compléter"}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-slate-500">Statut</dt>
                <dd className="text-right">{card?.statut_compte ?? "—"}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-slate-500">Dernière connexion</dt>
                <dd className="text-right">
                  {card?.derniere_connexion
                    ? new Date(card.derniere_connexion).toLocaleString("fr-FR")
                    : "—"}
                </dd>
              </div>
            </dl>

            {card?.id ? (
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href={`/admin/utilisateurs/${card.id}`}
                  className="rounded-lg border px-3 py-1.5 text-xs font-semibold"
                >
                  Voir le profil
                </Link>
              </div>
            ) : (
              <p className="mt-4 text-xs text-amber-700">
                Aucun titulaire — exécuter le script serveur de création.
              </p>
            )}
          </article>
        ))}
      </div>
    </main>
  );
}
