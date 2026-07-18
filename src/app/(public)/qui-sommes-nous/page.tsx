import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  Briefcase,
  GraduationCap,
  HeartHandshake,
  HeartPulse,
  LifeBuoy,
  Shield,
  Sprout,
  Users,
} from "lucide-react";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { institutionalContent } from "@/config/institutional-content";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Présentation de l’AFD",
  description:
    "Découvrez l’Alliance des Femmes pour le Développement — ONG nationale congolaise créée en 2019, portée par les femmes et les jeunes.",
};

const pillarIcons = {
  HeartPulse,
  Shield,
  Briefcase,
  GraduationCap,
  Sprout,
  LifeBuoy,
} as const;

export default function QuiSommesNousPage() {
  const { identity, ctas, governance } = institutionalContent;

  return (
    <PublicPageShell
      title="Présentation de l’AFD"
      eyebrow="Qui sommes-nous"
      description={`${identity.legalName} — ONG nationale congolaise créée en ${identity.foundedYear}, engagée aux côtés des communautés vulnérables.`}
      breadcrumbs={[
        { label: "Accueil", href: "/" },
        { label: "Qui sommes-nous" },
      ]}
      actions={
        <>
          {ctas.primary.map((cta) => (
            <Link
              key={cta.href}
              href={cta.href}
              className="inline-flex min-h-12 items-center rounded-lg bg-white px-5 text-base font-semibold text-[var(--afd-navy)] transition hover:bg-white/90"
            >
              {cta.label}
            </Link>
          ))}
        </>
      }
    >
      <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-14">
        <div className="space-y-6">
          <p className="text-lg leading-relaxed text-[var(--afd-muted)]">
            {identity.summary.split("\n\n")[0]}
          </p>
          <p className="leading-relaxed text-[var(--afd-muted)]">
            {identity.summary.split("\n\n")[1]}
          </p>

          <ul className="grid gap-3 sm:grid-cols-2">
            {identity.highlights.map((item) => (
              <li
                key={item}
                className="rounded-xl border border-[var(--afd-border)] bg-[var(--afd-surface)] px-4 py-3 text-sm font-medium text-[var(--afd-ink)]"
              >
                {item}
              </li>
            ))}
          </ul>

          <p className="rounded-xl border border-[var(--afd-border)] bg-[var(--afd-accent-soft)] px-4 py-3 text-sm leading-relaxed text-[var(--afd-ink)]">
            {identity.boardNote}
          </p>
        </div>

        <aside className="space-y-4 rounded-2xl border border-[var(--afd-border)] bg-[var(--afd-surface)] p-6">
          <h2 className="font-display text-xl font-semibold text-[var(--afd-ink)]">
            Informations clés
          </h2>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="font-semibold text-[var(--afd-ink)]">Dénomination</dt>
              <dd className="text-[var(--afd-muted)]">{identity.legalName}</dd>
            </div>
            <div>
              <dt className="font-semibold text-[var(--afd-ink)]">Sigle</dt>
              <dd className="text-[var(--afd-muted)]">{identity.acronym}</dd>
            </div>
            <div>
              <dt className="font-semibold text-[var(--afd-ink)]">Pays</dt>
              <dd className="text-[var(--afd-muted)]">{identity.country}</dd>
            </div>
            <div>
              <dt className="font-semibold text-[var(--afd-ink)]">Création</dt>
              <dd className="text-[var(--afd-muted)]">{identity.foundedYear}</dd>
            </div>
            <div>
              <dt className="font-semibold text-[var(--afd-ink)]">Contact</dt>
              <dd className="text-[var(--afd-muted)]">
                {institutionalContent.contactPlaceholder}
              </dd>
            </div>
          </dl>
        </aside>
      </div>

      <section className="mt-14">
        <h2 className="font-display text-2xl font-semibold text-[var(--afd-ink)]">
          Domaines d’intervention
        </h2>
        <p className="mt-2 max-w-2xl text-[var(--afd-muted)]">
          Six piliers structurants pour accompagner les communautés avec clarté,
          proximité et impact mesurable.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {institutionalContent.pillars.map((pillar) => {
            const Icon =
              pillarIcons[pillar.icon as keyof typeof pillarIcons] ?? HeartPulse;
            return (
              <div
                key={pillar.id}
                className="rounded-2xl border border-[var(--afd-border)] bg-[var(--afd-background)] p-5"
              >
                <div className="inline-flex size-10 items-center justify-center rounded-xl bg-[var(--afd-blue)]/10 text-[var(--afd-blue)]">
                  <Icon className="size-5" aria-hidden />
                </div>
                <h3 className="mt-3 font-semibold text-[var(--afd-ink)]">
                  {pillar.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--afd-muted)]">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>
        <Link
          href="/actions/domaines-intervention"
          className="mt-6 inline-flex items-center gap-2 text-base font-semibold text-[var(--afd-blue)] hover:underline"
        >
          Explorer nos domaines
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </section>

      <section className="mt-14 rounded-2xl border border-[var(--afd-border)] bg-[var(--afd-surface-elevated)] p-6 md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold text-[var(--afd-ink)]">
              Rejoignez le mouvement
            </h2>
            <p className="mt-2 max-w-xl text-[var(--afd-muted)]">
              Engagez-vous aux côtés de {siteConfig.shortName} pour transformer
              durablement les communautés.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/adhesion"
              className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-[var(--afd-orange)] px-5 text-base font-bold text-white transition hover:bg-[var(--afd-orange-hover)]"
            >
              <Users className="size-4" aria-hidden />
              Devenir membre
            </Link>
            <Link
              href="/contact"
              className="inline-flex min-h-12 items-center gap-2 rounded-lg border border-[var(--afd-border)] px-5 text-base font-semibold text-[var(--afd-ink)] transition hover:border-[var(--afd-blue)]"
            >
              <HeartHandshake className="size-4" aria-hidden />
              Nous contacter
            </Link>
          </div>
        </div>
      </section>

      <nav className="mt-10 flex flex-wrap gap-4 border-t border-[var(--afd-border)] pt-8">
        {ctas.secondary.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-sm font-semibold text-[var(--afd-blue)] hover:underline"
          >
            {link.label}
          </Link>
        ))}
        <Link
          href="/qui-sommes-nous/gouvernance"
          className="text-sm font-semibold text-[var(--afd-blue)] hover:underline"
        >
          {governance.bodies[0]?.title}
        </Link>
      </nav>
    </PublicPageShell>
  );
}
