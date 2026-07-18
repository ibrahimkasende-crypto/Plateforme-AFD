import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Connexion administration",
  description:
    "Accès sécurisé à l’espace d’administration de la Plateforme AFD.",
  robots: { index: false, follow: false },
};

function LoginFormFallback() {
  return (
    <div className="flex min-h-[200px] items-center justify-center">
      <p className="text-sm text-slate-500">Chargement…</p>
    </div>
  );
}

export default function ConnexionPage() {
  return (
    <AuthShell
      title="Administration Plateforme-AFD"
      subtitle="Connexion sécurisée réservée aux administrateurs et équipes autorisées de l’AFD ASBL."
    >
      <Suspense fallback={<LoginFormFallback />}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
