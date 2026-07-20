import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { ProfileAvatarUploader } from "@/components/admin/profile/profile-avatar-uploader";
import { OrganizationLogo } from "@/components/branding/organization-logo";
import { organizationBrand } from "@/config/organization-brand";
import { productBrand } from "@/config/product-brand";
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
        description="Compte utilisateur — distinct du produit LISUNGI et de l’organisation cliente."
        backFallbackHref="/admin"
      />

      <section className="flex flex-wrap items-center gap-3 rounded-xl border border-[var(--admin-border)] bg-white px-4 py-3 text-sm">
        <OrganizationLogo size="sm" />
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
            {productBrand.tenantLabel}
          </p>
          <p className="font-medium text-[var(--admin-text)]">
            {organizationBrand.organizationLegalName}
          </p>
        </div>
        <p className="ml-auto text-[11px] text-slate-400">
          Produit : {productBrand.productName}
        </p>
      </section>

      <ProfileAvatarUploader
        currentUrl={avatarUrl}
        initials={session.viewer.initials}
        hasAvatar={Boolean(profil?.avatar_path)}
      />

      <section className="space-y-2 rounded border bg-white p-4 text-sm" data-user-profile>
        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
          Utilisateur
        </p>
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
            Paramètres
          </Link>
          {" · "}
          <Link href="/admin/securite/sessions" className="text-[var(--afd-blue)]">
            Sessions
          </Link>
        </p>
      </section>
    </main>
  );
}
