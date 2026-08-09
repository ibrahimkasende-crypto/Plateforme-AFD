import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Réinitialiser le mot de passe",
  description: "Choisissez un nouveau mot de passe pour votre compte AFD.",
  robots: { index: false, follow: false },
};

type PageProps = {
  searchParams: Promise<{ code?: string }>;
};

/**
 * URL Auth configurée dans Supabase :
 * https://afd-rdc.org/auth/reset-password
 * http://localhost:3000/auth/reset-password
 */
export default async function AuthResetPasswordPage({ searchParams }: PageProps) {
  const params = await searchParams;
  if (params.code) {
    try {
      const supabase = await createClient();
      await supabase.auth.exchangeCodeForSession(params.code);
    } catch {
      // Le formulaire affichera une erreur de session si besoin.
    }
  }

  return (
    <AuthShell
      title="Nouveau mot de passe"
      subtitle="Choisissez un mot de passe sécurisé pour votre compte administrateur"
    >
      <ResetPasswordForm />
      <p className="mt-4 text-center text-xs text-slate-500">
        Lien expiré ?{" "}
        <a href="/mot-de-passe-oublie" className="underline">
          Demander un nouveau lien
        </a>
      </p>
    </AuthShell>
  );
}
