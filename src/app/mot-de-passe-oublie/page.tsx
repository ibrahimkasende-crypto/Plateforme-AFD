import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Mot de passe oublié",
  description:
    "Demandez la réinitialisation de votre mot de passe administrateur AFD.",
  robots: { index: false, follow: false },
};

export default function MotDePasseOubliePage() {
  return (
    <AuthShell
      title="Mot de passe oublié"
      subtitle="Réinitialisation du compte administrateur"
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
