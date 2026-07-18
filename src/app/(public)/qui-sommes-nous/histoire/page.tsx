import Link from "next/link";
import type { Metadata } from "next";
import { Calendar } from "lucide-react";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { institutionalContent } from "@/config/institutional-content";

export const metadata: Metadata = {
  title: "Notre histoire",
  description:
    "Parcours et jalons de l’Alliance des Femmes pour le Développement depuis sa création en 2019.",
};

export default function HistoirePage() {
  const { timeline, identity } = institutionalContent;

  return (
    <PublicPageShell
      title="Notre histoire"
      eyebrow="Qui sommes-nous"
      description={`Retracez le parcours de ${identity.legalName} depuis ${identity.foundedYear}.`}
      breadcrumbs={[
        { label: "Accueil", href: "/" },
        { label: "Qui sommes-nous", href: "/qui-sommes-nous" },
        { label: "Notre histoire" },
      ]}
    >
      <p className="max-w-3xl text-lg leading-relaxed text-[var(--afd-muted)]">
        Créée en {identity.foundedYear}, l’AFD est une ONG nationale congolaise
        portée principalement par les femmes et les jeunes. Son histoire s’inscrit
        dans une volonté d’accompagner les communautés vulnérables à travers des
        réponses humanitaires et des programmes de développement durables,
        inclusifs et participatifs.
      </p>

      <ol className="relative mt-10 space-y-0 border-l-2 border-[var(--afd-border)] pl-8">
        {timeline.map((event, index) => (
          <li key={`${event.year}-${event.title}`} className="relative pb-10 last:pb-0">
            <span
              className="absolute -left-[calc(1rem+5px)] top-1 inline-flex size-4 rounded-full border-2 border-[var(--afd-blue)] bg-[var(--afd-background)]"
              aria-hidden
            />
            <div className="rounded-2xl border border-[var(--afd-border)] bg-[var(--afd-surface)] p-5 md:p-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--afd-blue)]/10 px-3 py-1 text-sm font-semibold text-[var(--afd-blue)]">
                  <Calendar className="size-3.5" aria-hidden />
                  {event.year}
                </span>
                {index === 0 ? (
                  <span className="text-xs font-medium uppercase tracking-wide text-[var(--afd-muted)]">
                    Fondation
                  </span>
                ) : null}
              </div>
              <h2 className="mt-3 font-display text-xl font-semibold text-[var(--afd-ink)]">
                {event.title}
              </h2>
              <p className="mt-2 leading-relaxed text-[var(--afd-muted)]">
                {event.description}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-12 flex flex-wrap gap-4">
        <Link
          href="/qui-sommes-nous/mission-vision-valeurs"
          className="inline-flex min-h-12 items-center rounded-lg bg-[var(--afd-blue)] px-5 text-base font-semibold text-white transition hover:bg-[var(--afd-blue)]/90"
        >
          Mission, vision et valeurs
        </Link>
        <Link
          href="/actions"
          className="inline-flex min-h-12 items-center rounded-lg border border-[var(--afd-border)] px-5 text-base font-semibold text-[var(--afd-ink)] transition hover:border-[var(--afd-blue)]"
        >
          Découvrir nos actions
        </Link>
      </div>
    </PublicPageShell>
  );
}
