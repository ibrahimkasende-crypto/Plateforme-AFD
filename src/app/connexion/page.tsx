import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";
import { organizationBrand } from "@/config/organization-brand";
import { productBrand } from "@/config/product-brand";

export const metadata: Metadata = {
  title: `Connexion ${productBrand.productName}`,
  description: `Espace de gestion de ${organizationBrand.organizationName}.`,
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
      title={`Connexion ${productBrand.productName}`}
      subtitle={`Espace de gestion de l’${organizationBrand.organizationName}`}
    >
      <Suspense fallback={<LoginFormFallback />}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
