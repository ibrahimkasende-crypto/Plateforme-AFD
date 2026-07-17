import type { Metadata } from "next";
import Link from "next/link";
import { PublicEntityCard } from "@/components/public/PublicEntityCard";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { EmptyState } from "@/components/shared/EmptyState";
import { siteConfig } from "@/config/site";
import { getEmergencyProjects } from "@/lib/queries/public/projets";

export const metadata: Metadata = {
  title: "Urgences humanitaires",
  description:
    "Réponses d’urgence de l’Alliance des Femmes pour le Développement : interventions prioritaires auprès des communautés vulnérables.",
  alternates: { canonical: `${siteConfig.url}/actions/urgences` },
};

export default async function UrgencesPage() {
  const projects = await getEmergencyProjects();

  return (
    <PublicPageShell
      eyebrow="Actions"
      title="Urgences humanitaires"
      description="L’AFD intervient avec rapidité et proximité lorsque les communautés font face à des situations de crise ou de vulnérabilité aiguë."
      breadcrumbs={[
        { label: "Accueil", href: "/" },
        { label: "Actions", href: "/actions" },
        { label: "Urgences" },
      ]}
    >
      <section className="mb-10 rounded-2xl border border-[var(--afd-border)] bg-[var(--afd-surface)] p-6">
        <h2 className="font-display text-lg font-semibold text-[var(--afd-ink)]">
          Notre approche des urgences
        </h2>
        <div className="mt-3 space-y-3 text-sm leading-relaxed text-[var(--afd-muted)]">
          <p>
            Les interventions d’urgence de l’AFD s’inscrivent dans une logique de
            protection, de dignité et de participation communautaire. Nous
            privilégions des réponses adaptées au contexte local, en coordination
            avec les acteurs humanitaires et les autorités concernées.
          </p>
          <p>
            Les projets listés ci-dessous correspondent aux interventions
            publiées dont le statut ou la description indique une dimension
            d’urgence ou humanitaire.
          </p>
        </div>
      </section>

      {projects.length === 0 ? (
        <EmptyState
          title="Aucune urgence publique active"
          description="Aucune intervention d’urgence n’est actuellement publiée sur la plateforme. Revenez consulter cette page ou contactez-nous pour toute information."
          action={
            <Link
              href="/contact"
              className="inline-flex min-h-10 items-center rounded-lg bg-[var(--afd-blue)] px-4 text-sm font-semibold text-white"
            >
              Nous contacter
            </Link>
          }
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <PublicEntityCard
              key={project.id}
              title={project.title}
              description={project.description}
              href={`/actions/projets/${project.slug}`}
              imageUrl={project.image_url}
              meta={[project.location, project.status].filter(Boolean).join(" · ")}
            />
          ))}
        </div>
      )}
    </PublicPageShell>
  );
}
