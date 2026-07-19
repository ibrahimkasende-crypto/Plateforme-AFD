import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import {
  removeAvatarAction,
  uploadAvatarAction,
  getAvatarSignedUrl,
} from "@/features/identity/actions/avatar";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createClientSafe } from "@/lib/supabase/safe";

type Profil = {
  id: string;
  email: string;
  nom_complet: string | null;
  nom_affichage: string | null;
  telephone: string | null;
  fonction: string | null;
  avatar_path: string | null;
  avatar_bucket: string | null;
  statut_compte: string | null;
  doit_configurer_mfa: boolean | null;
  derniere_connexion: string | null;
  actif: boolean;
};

export default async function AdminMonProfilPage() {
  const session = await requireAdmin("/admin/mon-profil");
  const supabase = await createClientSafe();

  let profil: Profil | null = null;
  if (supabase) {
    const { data } = await supabase
      .from("profils_administrateurs" as never)
      .select(
        "id, email, nom_complet, nom_affichage, telephone, fonction, avatar_path, avatar_bucket, statut_compte, doit_configurer_mfa, derniere_connexion, actif",
      )
      .eq("id", session.user.id)
      .maybeSingle();
    profil = data as Profil | null;
  }

  let avatarUrl: string | null = session.viewer.avatarUrl ?? null;
  if (!avatarUrl && profil?.avatar_path) {
    avatarUrl = await getAvatarSignedUrl(
      profil.avatar_bucket || "admin-avatars",
      profil.avatar_path,
    );
  }

  return (
    <main className="mx-auto max-w-2xl space-y-6 p-6">
      <AdminPageHeader
        title="Mon profil"
        description="Photo, coordonnées, rôle et sécurité de votre compte."
      />

      <section className="rounded border bg-white p-4">
        <div className="flex items-center gap-4">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarUrl}
              alt=""
              className="size-20 rounded-full object-cover"
            />
          ) : (
            <span className="flex size-20 items-center justify-center rounded-full bg-[#0d254e] text-lg font-semibold text-white">
              {session.viewer.initials}
            </span>
          )}
          <div className="text-sm">
            <p className="font-medium text-slate-900">
              {profil?.nom_affichage || profil?.nom_complet || session.viewer.displayName}
            </p>
            <p className="text-[var(--afd-muted)]">{session.viewer.roleLabel}</p>
          </div>
        </div>

        <form action={uploadAvatarAction} className="mt-4 space-y-2" encType="multipart/form-data">
          <label className="block text-sm font-medium">
            Photo de profil (JPEG, PNG ou WebP — max 5 Mo)
            <input
              name="avatar"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              required
              className="mt-1 block w-full text-sm"
            />
          </label>
          <button
            type="submit"
            className="rounded bg-[var(--afd-blue)] px-4 py-2 text-sm text-white"
          >
            Importer / remplacer
          </button>
        </form>
        {profil?.avatar_path ? (
          <form action={removeAvatarAction} className="mt-2">
            <button type="submit" className="text-sm text-red-700">
              Supprimer la photo
            </button>
          </form>
        ) : null}
      </section>

      <section className="rounded border bg-white p-4 text-sm space-y-2">
        <p>
          <span className="text-[var(--afd-muted)]">E-mail :</span>{" "}
          {profil?.email ?? session.user.email ?? "—"}
        </p>
        <p>
          <span className="text-[var(--afd-muted)]">Nom :</span>{" "}
          {profil?.nom_complet ?? "—"}
        </p>
        <p>
          <span className="text-[var(--afd-muted)]">Fonction :</span>{" "}
          {profil?.fonction ?? "—"}
        </p>
        <p>
          <span className="text-[var(--afd-muted)]">Téléphone :</span>{" "}
          {profil?.telephone ?? "—"}
        </p>
        <p>
          <span className="text-[var(--afd-muted)]">Statut compte :</span>{" "}
          {profil?.statut_compte ?? (profil?.actif !== false ? "active" : "disabled")}
        </p>
        <p>
          <span className="text-[var(--afd-muted)]">MFA à configurer :</span>{" "}
          {profil?.doit_configurer_mfa ? "Oui" : "Non"}
        </p>
        <p>
          <span className="text-[var(--afd-muted)]">Dernière connexion :</span>{" "}
          {profil?.derniere_connexion
            ? new Date(profil.derniere_connexion).toLocaleString("fr-FR")
            : "—"}
        </p>
        <p className="text-xs text-[var(--afd-muted)]">
          Votre rôle et vos permissions ne peuvent pas être modifiés depuis cet écran.
        </p>
      </section>

      <div className="flex flex-wrap gap-2">
        <Link href="/admin/securite/sessions" className="rounded border px-4 py-2 text-sm">
          Sessions
        </Link>
        <Link href="/admin/utilisateurs" className="rounded border px-4 py-2 text-sm">
          Utilisateurs
        </Link>
        <Link href="/espace-employe" className="rounded border px-4 py-2 text-sm">
          Espace employé
        </Link>
      </div>
    </main>
  );
}
