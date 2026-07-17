import type { Metadata } from "next";
import Link from "next/link";
import {
  Activity,
  FolderKanban,
  Handshake,
  MapPinned,
  Users,
  UsersRound,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { PublicHubCard } from "@/components/public/PublicEntityCard";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { StatCard } from "@/components/shared/StatCard";
import { homeContent } from "@/config/home-content";
import { siteConfig } from "@/config/site";
import { getPublicImpactStats } from "@/lib/queries/home";
import type { PublicImpactStats } from "@/lib/queries/home";

export const metadata: Metadata = {
  title: "Notre impact",
  description:
    "Mesurez l’impact de l’Alliance des Femmes pour le Développement : chiffres clés, résultats, histoires et rapports.",
  alternates: { canonical: `${siteConfig.url}/impact` },
};

const statCards: {
  key: keyof PublicImpactStats;
  label: string;
  icon: LucideIcon;
}[] = [
  { key: "personnesAccompagnees", label: "Personnes accompagnées", icon: Users },
  { key: "projetsRealises", label: "Projets réalisés", icon: FolderKanban },
  { key: "provincesCouvertes", label: "Provinces d’intervention", icon: MapPinned },
  { key: "femmesAccompagnees", label: "Femmes et filles bénéficiaires", icon: UsersRound },
  { key: "partenairesActifs", label: "Partenaires actifs", icon: Handshake },
  { key: "activitesRealisees", label: "Activités réalisées", icon: Activity },
];

const impactLinks = [
  {
    title: "Résultats",
    description: "Indicateurs disponibles et approche MEAL de l’AFD.",
    href: "/impact/resultats",
  },
  {
    title: "Histoires d’impact",
    description: "Récits de terrain publiés par l’organisation.",
    href: "/impact/histoires",
  },
  {
    title: "Témoignages",
    description: "Voix des bénéficiaires et partenaires.",
    href: "/impact/temoignages",
  },
  {
    title: "Rapports",
    description: "Publications et documents institutionnels.",
    href: "/impact/rapports",
  },
] as const;

export default async function ImpactPage() {
  const stats = await getPublicImpactStats();
  const visibleStats = statCards.filter((card) => {
    const value = stats[card.key];
    return typeof value === "number" && value > 0;
  });

  return (
    <PublicPageShell
      eyebrow="Impact"
      title="Notre impact"
      description="Transparence et redevabilité : l’AFD publie uniquement des données validées, sans chiffres inventés."
      breadcrumbs={[
        { label: "Accueil", href: "/" },
        { label: "Impact" },
      ]}
    >
      {visibleStats.length > 0 ? (
        <section className="mb-10">
          <h2 className="font-display text-2xl font-semibold text-[var(--afd-ink)]">
            Chiffres clés
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visibleStats.map((card) => {
              const value = stats[card.key];
              if (typeof value !== "number") return null;
              return (
                <StatCard
                  key={card.key}
                  label={card.label}
                  value={new Intl.NumberFormat("fr-FR").format(value)}
                  icon={card.icon}
                />
              );
            })}
          </div>
          <p className="mt-4 text-xs text-[var(--afd-muted)]">
            {homeContent.statsDisclaimer}
          </p>
        </section>
      ) : (
        <p className="mb-10 text-sm text-[var(--afd-muted)]">
          Aucun indicateur chiffré n’est disponible pour le moment. Les statistiques
          apparaîtront dès validation des données terrain.
        </p>
      )}

      <section>
        <h2 className="font-display text-2xl font-semibold text-[var(--afd-ink)]">
          Explorer notre impact
        </h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {impactLinks.map((link) => (
            <PublicHubCard key={link.href} {...link} />
          ))}
        </div>
        <Link
          href="/actualites"
          className="mt-8 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[var(--afd-blue)]"
        >
          Voir les actualités
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </section>
    </PublicPageShell>
  );
}
