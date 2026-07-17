import type { Metadata } from "next";
import Link from "next/link";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { EmptyState } from "@/components/shared/EmptyState";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Appels d’offres",
  description:
    "Appels d’offres et consultations publiées par l’Alliance des Femmes pour le Développement.",
  alternates: { canonical: `${siteConfig.url}/ressources/appels-offres` },
};

export default function AppelsOffresPage() {
  return (
    <PublicPageShell
      eyebrow="Ressources"
      title="Appels d’offres"
      description="Consultations et appels d’offres de l’AFD."
      breadcrumbs={[
        { label: "Accueil", href: "/" },
        { label: "Ressources", href: "/ressources" },
        { label: "Appels d’offres" },
      ]}
    >
      <EmptyState
        title="Aucun appel d’offres publié"
        description="L’AFD n’a pas d’appel d’offres actif publié sur cette plateforme pour le moment. Pour toute consultation en cours ou toute question relative aux marchés, contactez directement l’équipe institutionnelle."
        action={
          <Link
            href="/contact"
            className="inline-flex min-h-10 items-center rounded-lg bg-[var(--afd-blue)] px-4 text-sm font-semibold text-white"
          >
            Nous contacter
          </Link>
        }
      />
    </PublicPageShell>
  );
}
