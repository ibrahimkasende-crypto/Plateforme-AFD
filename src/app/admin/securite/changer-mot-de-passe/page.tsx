import type { Metadata } from "next";
import Link from "next/link";
import { ChangePasswordForm } from "@/components/admin/security/change-password-form";
import { requireAdmin } from "@/lib/auth/require-admin";

export const metadata: Metadata = {
  title: "Changer le mot de passe",
  robots: { index: false, follow: false },
};

export default async function ChangerMotDePassePage() {
  const session = await requireAdmin("/admin/securite/changer-mot-de-passe");

  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-lg flex-col justify-center gap-6 p-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Sécurité
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">
          Modifier mon mot de passe
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Choisissez un mot de passe robuste et unique. Cette étape est
          facultative : vous pouvez aussi y accéder depuis Mon profil → Sécurité.
        </p>
      </div>

      <ChangePasswordForm
        email={session.user.email}
        displayName={session.profile.nom_complet}
        firstName={session.profile.prenom}
        lastName={session.profile.nom_famille}
        requireCurrentPassword
        redirectTo="/admin"
      />

      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <Link href="/admin" className="font-semibold text-slate-700 hover:underline">
          Retour au tableau de bord
        </Link>
      </div>
    </main>
  );
}
