import Link from "next/link";
import type { Metadata } from "next";
import { FileText, LifeBuoy, Shield } from "lucide-react";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { institutionalContent } from "@/config/institutional-content";

export const metadata: Metadata = {
  title: "Politiques et engagements",
  description:
    "Cadre éthique, politiques institutionnelles et engagements de l’Alliance des Femmes pour le Développement.",
};

export default function PolitiquesEngagementsPage() {
  const { policies, urgences } = institutionalContent;

  return (
    <PublicPageShell
      title="Politiques et engagements"
      eyebrow="Qui sommes-nous"
      description="Le cadre éthique et les engagements qui guident l’action de l’AFD auprès des communautés et des partenaires."
      breadcrumbs={[
        { label: "Accueil", href: "/" },
        { label: "Qui sommes-nous", href: "/qui-sommes-nous" },
        { label: "Politiques et engagements" },
      ]}
    >
      <section>
        <div className="flex items-center gap-3">
          <div className="inline-flex size-10 items-center justify-center rounded-xl bg-[var(--afd-blue)]/10 text-[var(--afd-blue)]">
            <Shield className="size-5" aria-hidden />
          </div>
          <h2 className="font-display text-2xl font-semibold text-[var(--afd-ink)]">
            Politiques institutionnelles
          </h2>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {policies.map((policy) => (
            <article
              key={policy.id}
              className="rounded-2xl border border-[var(--afd-border)] bg-[var(--afd-surface)] p-5"
            >
              <div className="inline-flex size-9 items-center justify-center rounded-lg bg-[var(--afd-accent-soft)] text-[var(--afd-accent)]">
                <FileText className="size-4" aria-hidden />
              </div>
              <h3 className="mt-3 font-semibold text-[var(--afd-ink)]">
                {policy.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--afd-muted)]">
                {policy.description}
              </p>
            </article>
          ))}
        </div>
        <p className="mt-6 text-sm text-[var(--afd-muted)]">
          Les documents complets seront publiés après validation par l’équipe
          institutionnelle. {institutionalContent.contactPlaceholder}
        </p>
      </section>

      <section className="mt-14 rounded-2xl border border-[var(--afd-border)] bg-[var(--afd-surface-elevated)] p-6 md:p-8">
        <div className="flex items-start gap-4">
          <div className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--afd-orange)]/15 text-[var(--afd-orange)]">
            <LifeBuoy className="size-5" aria-hidden />
          </div>
          <div>
            <h2 className="font-display text-2xl font-semibold text-[var(--afd-ink)]">
              {urgences.title}
            </h2>
            {urgences.paragraphs.map((paragraph) => (
              <p
                key={paragraph.slice(0, 40)}
                className="mt-3 leading-relaxed text-[var(--afd-muted)]"
              >
                {paragraph}
              </p>
            ))}
            {urgences.topics.length > 0 ? (
              <ul className="mt-4 flex flex-wrap gap-2">
                {urgences.topics.map((topic) => (
                  <li
                    key={topic}
                    className="rounded-full border border-[var(--afd-border)] bg-[var(--afd-background)] px-3 py-1 text-sm text-[var(--afd-ink)]"
                  >
                    {topic}
                  </li>
                ))}
              </ul>
            ) : null}
            <Link
              href="/actions/urgences"
              className="mt-6 inline-flex min-h-12 items-center rounded-lg bg-[var(--afd-blue)] px-5 text-base font-semibold text-white transition hover:bg-[var(--afd-blue)]/90"
            >
              En savoir plus sur nos réponses d’urgence
            </Link>
          </div>
        </div>
      </section>

      <div className="mt-10 flex flex-wrap gap-4">
        <Link
          href="/politique-confidentialite"
          className="text-sm font-semibold text-[var(--afd-blue)] hover:underline"
        >
          Politique de confidentialité
        </Link>
        <Link
          href="/contact"
          className="text-sm font-semibold text-[var(--afd-blue)] hover:underline"
        >
          Nous contacter
        </Link>
      </div>
    </PublicPageShell>
  );
}
