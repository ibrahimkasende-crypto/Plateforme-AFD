import type { Metadata } from "next";
import Link from "next/link";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { EmptyState } from "@/components/shared/EmptyState";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Histoires d’impact",
  description:
    "Récits de terrain et histoires d’impact de l’Alliance des Femmes pour le Développement.",
  alternates: { canonical: `${siteConfig.url}/impact/histoires` },
};

export default function HistoiresPage() {
  return (
    <PublicPageShell
      eyebrow="Impact"
      title="Histoires d’impact"
      description="Récits authentiques de transformation communautaire portés par l’AFD."
      breadcrumbs={[
        { label: "Accueil", href: "/" },
        { label: "Impact", href: "/impact" },
        { label: "Histoires d’impact" },
      ]}
    >
      <EmptyState
        title="Aucune histoire publiée"
        description="Les histoires d’impact seront publiées ici dès qu’elles seront validées par l’équipe. En attendant, consultez nos actualités pour suivre nos actions sur le terrain."
        action={
          <Link
            href="/actualites"
            className="inline-flex min-h-10 items-center rounded-lg bg-[var(--afd-blue)] px-4 text-sm font-semibold text-white"
          >
            Voir les actualités
          </Link>
        }
      />
    </PublicPageShell>
  );
}
