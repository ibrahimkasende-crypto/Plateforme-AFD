import type { Metadata } from "next";
import Link from "next/link";
import { ChangePasswordForm } from "@/components/admin/security/change-password-form";
import { requestPasswordReset } from "@/actions/auth";
import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { requireAdmin } from "@/lib/auth/require-admin";

export const metadata: Metadata = {
  title: "Sécurité du compte",
  robots: { index: false, follow: false },
};

export default async function MonProfilSecuritePage() {
  const session = await requireAdmin("/admin/mon-profil/securite");
  const changedAt = session.profile.password_changed_at;
  const email = session.user.email ?? "";

  return (
    <main className="mx-auto max-w-2xl space-y-6 p-6">
      <AdminPageHeader
        title="Sécurité"
        description="Mot de passe, sessions et réinitialisation de votre compte."
        backFallbackHref="/admin/mon-profil"
      />

      <section className="space-y-2 rounded-xl border border-[var(--admin-border)] bg-white p-5">
        <h2 className="text-sm font-semibold text-slate-900">État du compte</h2>
        <p className="text-sm text-slate-600">
          Dernier changement de mot de passe :{" "}
          {changedAt
            ? new Date(changedAt).toLocaleString("fr-FR")
            : "Non renseigné"}
        </p>
        <p className="text-sm text-slate-600">
          Vous pouvez modifier votre mot de passe à tout moment ci-dessous.
        </p>
        <div className="flex flex-wrap gap-3 pt-2 text-sm">
          <Link
            href="/admin/securite/sessions"
            className="font-semibold text-[var(--admin-primary)] hover:underline"
          >
            Sessions récentes
          </Link>
          <Link
            href="/admin/mon-profil"
            className="font-semibold text-slate-600 hover:underline"
          >
            Profil
          </Link>
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-[var(--admin-border)] bg-white p-5">
        <h2 className="text-sm font-semibold text-slate-900">
          Modifier mon mot de passe
        </h2>
        <ChangePasswordForm
          email={session.user.email}
          displayName={session.profile.nom_complet}
          firstName={session.profile.prenom}
          lastName={session.profile.nom_famille}
          requireCurrentPassword
          redirectTo="/admin/mon-profil/securite"
        />
      </section>

      <section className="space-y-3 rounded-xl border border-[var(--admin-border)] bg-white p-5">
        <h2 className="text-sm font-semibold text-slate-900">
          Lien de réinitialisation
        </h2>
        <p className="text-sm text-slate-600">
          Un e-mail sécurisé sera envoyé à votre adresse si le compte existe.
        </p>
        <form
          action={async () => {
            "use server";
            await requestPasswordReset({ email });
          }}
        >
          <button
            type="submit"
            className="rounded-lg border px-4 py-2 text-sm font-semibold"
          >
            Demander un lien de réinitialisation
          </button>
        </form>
      </section>
    </main>
  );
}
