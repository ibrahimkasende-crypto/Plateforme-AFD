import Link from "next/link";
import type { Metadata } from "next";
import {
  HandHeart,
  HeartHandshake,
  RefreshCw,
  ShieldCheck,
  Users,
  type LucideIcon,
} from "lucide-react";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { institutionalContent } from "@/config/institutional-content";

export const metadata: Metadata = {
  title: "Mission, vision et valeurs",
  description:
    "Fondements stratégiques de l’Alliance des Femmes pour le Développement — mission, vision et valeurs institutionnelles.",
};

const valueIcons: Record<string, LucideIcon> = {
  HeartHandshake,
  ShieldCheck,
  Users,
  RefreshCw,
  HandHeart,
};

export default function MissionVisionValeursPage() {
  const { mission, vision, values, pillars } = institutionalContent;

  return (
    <PublicPageShell
      title="Mission, vision et valeurs"
      eyebrow="Qui sommes-nous"
      description="Les fondements qui guident l’action de l’AFD sur le terrain et dans ses relations institutionnelles."
      breadcrumbs={[
        { label: "Accueil", href: "/" },
        { label: "Qui sommes-nous", href: "/qui-sommes-nous" },
        { label: "Mission, vision et valeurs" },
      ]}
    >
      <div className="grid gap-6 md:grid-cols-2">
        <article className="rounded-2xl border border-[var(--afd-border)] bg-[var(--afd-surface)] p-6">
          <h2 className="font-display text-2xl font-semibold text-[var(--afd-ink)]">
            {mission.title}
          </h2>
          <p className="mt-4 leading-relaxed text-[var(--afd-muted)]">
            {mission.content}
          </p>
        </article>
        <article className="rounded-2xl border border-[var(--afd-border)] bg-[var(--afd-surface)] p-6">
          <h2 className="font-display text-2xl font-semibold text-[var(--afd-ink)]">
            {vision.title}
          </h2>
          <p className="mt-4 leading-relaxed text-[var(--afd-muted)]">
            {vision.content}
          </p>
        </article>
      </div>

      <section className="mt-14">
        <h2 className="font-display text-2xl font-semibold text-[var(--afd-ink)]">
          Nos valeurs
        </h2>
        <p className="mt-2 max-w-2xl text-[var(--afd-muted)]">
          Cinq valeurs fondatrices qui orientent nos choix, nos partenariats et
          notre présence auprès des communautés.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((value) => {
            const Icon = valueIcons[value.icon] ?? HeartHandshake;
            return (
              <article
                key={value.id}
                className="rounded-2xl border border-[var(--afd-border)] bg-[var(--afd-background)] p-5"
              >
                <div className="inline-flex size-10 items-center justify-center rounded-xl bg-[var(--afd-accent-soft)] text-[var(--afd-accent)]">
                  <Icon className="size-5" aria-hidden />
                </div>
                <h3 className="mt-3 font-semibold text-[var(--afd-ink)]">
                  {value.title}
                </h3>
                <p className="mt-2 text-sm text-[var(--afd-muted)]">
                  {value.description}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-[var(--afd-ink)]/80">
                  {value.expanded}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mt-14">
        <h2 className="font-display text-2xl font-semibold text-[var(--afd-ink)]">
          Piliers d’intervention
        </h2>
        <p className="mt-2 max-w-2xl text-[var(--afd-muted)]">
          La mission et la vision se déclinent concrètement à travers six
          domaines d’action prioritaires.
        </p>
        <ul className="mt-6 space-y-3">
          {pillars.map((pillar) => (
            <li
              key={pillar.id}
              className="rounded-xl border border-[var(--afd-border)] px-4 py-3"
            >
              <span className="font-semibold text-[var(--afd-ink)]">
                {pillar.title}
              </span>
              <span className="text-[var(--afd-muted)]"> — {pillar.description}</span>
            </li>
          ))}
        </ul>
        <Link
          href="/actions/domaines-intervention"
          className="mt-6 inline-flex min-h-12 items-center rounded-lg bg-[var(--afd-blue)] px-5 text-base font-semibold text-white transition hover:bg-[var(--afd-blue)]/90"
        >
          Voir nos domaines d’intervention
        </Link>
      </section>
    </PublicPageShell>
  );
}
