import type { Metadata } from "next";
import { PublicHubCard } from "@/components/public/PublicEntityCard";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Nos actions",
  description:
    "Explorez les domaines d’intervention, programmes, projets, urgences, zones et clusters de l’Alliance des Femmes pour le Développement.",
  alternates: { canonical: `${siteConfig.url}/actions` },
};

const hubs = [
  {
    title: "Domaines d’intervention",
    description:
      "Six piliers structurants : santé, protection, économie, éducation, sécurité alimentaire et urgences.",
    href: "/actions/domaines-intervention",
  },
  {
    title: "Programmes",
    description: "Programmes actifs portés par l’AFD auprès des communautés.",
    href: "/actions/programmes",
  },
  {
    title: "Projets",
    description: "Projets en cours et réalisés sur le terrain en RDC.",
    href: "/actions/projets",
  },
  {
    title: "Urgences",
    description: "Réponses humanitaires d’urgence et interventions prioritaires.",
    href: "/actions/urgences",
  },
  {
    title: "Zones d’intervention",
    description: "Provinces et localités couvertes par nos projets publiés.",
    href: "/actions/zones-intervention",
  },
  {
    title: "Clusters",
    description: "Coordination sectorielle et clusters humanitaires actifs.",
    href: "/actions/clusters",
  },
] as const;

export default function ActionsPage() {
  return (
    <PublicPageShell
      eyebrow="Actions"
      title="Nos actions sur le terrain"
      description="Découvrez comment l’AFD structure ses interventions humanitaires et de développement en République démocratique du Congo."
      breadcrumbs={[
        { label: "Accueil", href: "/" },
        { label: "Actions" },
      ]}
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {hubs.map((hub) => (
          <PublicHubCard key={hub.href} {...hub} />
        ))}
      </div>
    </PublicPageShell>
  );
}
