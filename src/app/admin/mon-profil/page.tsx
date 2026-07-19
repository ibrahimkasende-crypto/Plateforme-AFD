import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { ProfileAvatarUploader } from "@/components/admin/profile/profile-avatar-uploader";
import { getAvatarSignedUrl } from "@/features/identity/actions/avatar";
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
  if (avatarUrl && profil?.avatar_path) {
    const bust = encodeURIComponent(profil.avatar_path);
    avatarUrl = `${avatarUrl}${avatarUrl.includes("?") ? "&" : "?"}v=${bust}`;
  }

  return (
    <main className="mx-auto max-w-2xl space-y-6 p-6">
      <AdminPageHeader
        title="Mon profil"
        description="Photo, coordonnées, rôle et sécurité de votre compte."
        backFallbackHref="/admin"
      />

      <ProfileAvatarUploader
        currentUrl={avatarUrl}
        initials={session.viewer.initials}
        hasAvatar={Boolean(profil?.avatar_path)}
      />

      <section className="space-y-2 rounded border bg-white p-4 text-sm">
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
          <span className="text-[var(--afd-muted)]">Rôle :</span>{" "}
          {session.viewer.roleLabel}
        </p>
        <p>
          <Link href="/admin/parametres" className="text-[var(--afd-blue)]">
            Paramètres du compte
          </Link>
        </p>
      </section>
    </main>
  );
}
