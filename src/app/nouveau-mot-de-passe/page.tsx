import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata: Metadata = {
  title: "Nouveau mot de passe",
  description: "Définissez un nouveau mot de passe pour votre compte administrateur AFD.",
  robots: { index: false, follow: false },
};

export default function NouveauMotDePassePage() {
  return (
    <AuthShell
      title="Nouveau mot de passe"
      subtitle="Choisissez un mot de passe sécurisé"
    >
      <ResetPasswordForm />
    </AuthShell>
  );
}
