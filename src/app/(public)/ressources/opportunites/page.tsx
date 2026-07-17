import type { Metadata } from "next";
import Link from "next/link";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { EmptyState } from "@/components/shared/EmptyState";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Opportunités",
  description:
    "Opportunités de collaboration, stages et engagements auprès de l’Alliance des Femmes pour le Développement.",
  alternates: { canonical: `${siteConfig.url}/ressources/opportunites` },
};

export default function OpportunitesPage() {
  return (
    <PublicPageShell
      eyebrow="Ressources"
      title="Opportunités"
      description="Offres de collaboration et opportunités d’engagement."
      breadcrumbs={[
        { label: "Accueil", href: "/" },
        { label: "Ressources", href: "/ressources" },
        { label: "Opportunités" },
      ]}
    >
      <EmptyState
        title="Aucune opportunité publiée"
        description="Il n’y a pas d’offre de stage, de mission ou de collaboration publiée actuellement. Pour exprimer votre intérêt ou proposer votre candidature spontanée, contactez l’équipe AFD."
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
