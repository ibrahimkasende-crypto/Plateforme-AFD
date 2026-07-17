import type { Metadata } from "next";
import Link from "next/link";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { EmptyState } from "@/components/shared/EmptyState";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Témoignages",
  description:
    "Témoignages des bénéficiaires et partenaires de l’Alliance des Femmes pour le Développement.",
  alternates: { canonical: `${siteConfig.url}/impact/temoignages` },
};

export default function TemoignagesPage() {
  return (
    <PublicPageShell
      eyebrow="Impact"
      title="Témoignages"
      description="Voix des personnes et communautés accompagnées par l’AFD."
      breadcrumbs={[
        { label: "Accueil", href: "/" },
        { label: "Impact", href: "/impact" },
        { label: "Témoignages" },
      ]}
    >
      <EmptyState
        title="Aucun témoignage publié"
        description="Les témoignages seront publiés ici avec le consentement explicite des personnes concernées. Aucun contenu fictif n’est présenté."
        action={
          <Link
            href="/contact"
            className="inline-flex min-h-10 items-center rounded-lg border border-[var(--afd-border)] px-4 text-sm font-semibold text-[var(--afd-ink)]"
          >
            Proposer un témoignage
          </Link>
        }
      />
    </PublicPageShell>
  );
}
