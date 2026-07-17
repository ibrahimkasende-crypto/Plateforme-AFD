import type { Metadata } from "next";
import {
  Activity,
  FolderKanban,
  Handshake,
  MapPinned,
  Users,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { EmptyState } from "@/components/shared/EmptyState";
import { StatCard } from "@/components/shared/StatCard";
import { homeContent } from "@/config/home-content";
import { siteConfig } from "@/config/site";
import { getPublicImpactStats } from "@/lib/queries/home";
import type { PublicImpactStats } from "@/lib/queries/home";

export const metadata: Metadata = {
  title: "Résultats",
  description:
    "Indicateurs de résultats et approche MEAL de l’Alliance des Femmes pour le Développement.",
  alternates: { canonical: `${siteConfig.url}/impact/resultats` },
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

export default async function ResultatsPage() {
  const stats = await getPublicImpactStats();
  const visibleStats = statCards.filter((card) => {
    const value = stats[card.key];
    return typeof value === "number" && value > 0;
  });

  return (
    <PublicPageShell
      eyebrow="Impact"
      title="Résultats"
      description="Indicateurs agrégés disponibles et cadre de suivi-évaluation de l’AFD."
      breadcrumbs={[
        { label: "Accueil", href: "/" },
        { label: "Impact", href: "/impact" },
        { label: "Résultats" },
      ]}
    >
      <section className="mb-10 rounded-2xl border border-[var(--afd-border)] bg-[var(--afd-surface)] p-6">
        <h2 className="font-display text-lg font-semibold text-[var(--afd-ink)]">
          Approche MEAL
        </h2>
        <div className="mt-3 space-y-3 text-sm leading-relaxed text-[var(--afd-muted)]">
          <p>
            L’AFD applique une approche MEAL (Monitoring, Evaluation,
            Accountability and Learning) pour mesurer les résultats, garantir la
            redevabilité envers les communautés et améliorer continuellement ses
            interventions.
          </p>
          <p>
            Les indicateurs publiés proviennent des projets actifs et validés.
            Des indicateurs détaillés par programme seront publiés lorsque les
            données seront disponibles et vérifiées.
          </p>
        </div>
      </section>

      {visibleStats.length > 0 ? (
        <section className="mb-10">
          <h2 className="font-display text-xl font-semibold text-[var(--afd-ink)]">
            Indicateurs disponibles
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
      ) : null}

      <EmptyState
        title="Aucun indicateur détaillé publié"
        description="Aucun indicateur détaillé par programme ou par projet n’est publié pour le moment. Consultez les pages Impact et Contact pour en savoir plus sur le suivi MEAL de l’AFD."
      />
    </PublicPageShell>
  );
}
