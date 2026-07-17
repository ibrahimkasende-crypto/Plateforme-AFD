import Link from "next/link";
import type { Metadata } from "next";
import { Building2, Users } from "lucide-react";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { institutionalContent } from "@/config/institutional-content";

export const metadata: Metadata = {
  title: "Gouvernance",
  description:
    "Instances de direction et départements de l’Alliance des Femmes pour le Développement.",
};

export default function GouvernancePage() {
  const { governance, identity } = institutionalContent;

  return (
    <PublicPageShell
      title="Gouvernance"
      eyebrow="Qui sommes-nous"
      description={governance.intro}
      breadcrumbs={[
        { label: "Accueil", href: "/" },
        { label: "Qui sommes-nous", href: "/qui-sommes-nous" },
        { label: "Gouvernance" },
      ]}
    >
      <p className="max-w-3xl leading-relaxed text-[var(--afd-muted)]">
        {identity.boardNote}
      </p>

      <section className="mt-10 space-y-6">
        <h2 className="font-display text-2xl font-semibold text-[var(--afd-ink)]">
          Instances de gouvernance
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          {governance.bodies.map((body) => (
            <article
              key={body.id}
              className="rounded-2xl border border-[var(--afd-border)] bg-[var(--afd-surface)] p-6"
            >
              <div className="inline-flex size-10 items-center justify-center rounded-xl bg-[var(--afd-blue)]/10 text-[var(--afd-blue)]">
                <Users className="size-5" aria-hidden />
              </div>
              <h3 className="mt-3 font-display text-xl font-semibold text-[var(--afd-ink)]">
                {body.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--afd-muted)]">
                {body.description}
              </p>
              <ul className="mt-4 space-y-2">
                {body.responsibilities.map((item) => (
                  <li
                    key={item}
                    className="flex gap-2 text-sm text-[var(--afd-ink)]/85"
                  >
                    <span className="text-[var(--afd-blue)]" aria-hidden>
                      ›
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <h2 className="font-display text-2xl font-semibold text-[var(--afd-ink)]">
          Départements
        </h2>
        <p className="mt-2 max-w-2xl text-[var(--afd-muted)]">
          Les directions fonctionnelles assurent la mise en œuvre des programmes
          et le respect des standards de qualité et de redevabilité.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {governance.departments.map((dept) => (
            <article
              key={dept.id}
              className="rounded-2xl border border-[var(--afd-border)] bg-[var(--afd-background)] p-5"
            >
              <div className="inline-flex size-9 items-center justify-center rounded-lg bg-[var(--afd-accent-soft)] text-[var(--afd-accent)]">
                <Building2 className="size-4" aria-hidden />
              </div>
              <h3 className="mt-3 font-semibold text-[var(--afd-ink)]">
                {dept.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--afd-muted)]">
                {dept.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <div className="mt-12 flex flex-wrap gap-4">
        <Link
          href="/qui-sommes-nous/organigramme"
          className="inline-flex min-h-12 items-center rounded-lg bg-[var(--afd-blue)] px-5 text-base font-semibold text-white transition hover:bg-[var(--afd-blue)]/90"
        >
          Voir l’organigramme
        </Link>
        <Link
          href="/qui-sommes-nous/equipe"
          className="inline-flex min-h-12 items-center rounded-lg border border-[var(--afd-border)] px-5 text-base font-semibold text-[var(--afd-ink)] transition hover:border-[var(--afd-blue)]"
        >
          Découvrir l’équipe
        </Link>
      </div>
    </PublicPageShell>
  );
}
