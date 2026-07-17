import type { Metadata } from "next";
import Link from "next/link";
import { HeartHandshake, Users } from "lucide-react";
import { MembershipForm } from "@/components/public/forms/membership-form";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { homeContent } from "@/config/home-content";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Nous rejoindre",
  description:
    "Rejoignez l’Alliance des Femmes pour le Développement et engagez-vous aux côtés des femmes et des jeunes.",
  alternates: { canonical: `${siteConfig.url}/adhesion` },
};

const WHY_JOIN = [
  {
    title: "Agir aux côtés des communautés",
    description:
      "Contribuez à des interventions humanitaires et de développement ancrées dans les réalités locales.",
  },
  {
    title: "Placer les femmes et les jeunes au centre",
    description:
      "Rejoignez un mouvement porté à 80 % par des femmes de moins de 35 ans et des jeunes au sein du Conseil d’administration.",
  },
  {
    title: "Participer à la transformation durable",
    description:
      "Engagez-vous dans la santé, la protection, l’autonomisation économique, l’éducation et les réponses d’urgence.",
  },
] as const;

export default function AdhesionPage() {
  const adhesionAction = homeContent.supportActions.find((item) => item.id === "adhesion");

  return (
    <PublicPageShell
      eyebrow="Engagement"
      title="Nous rejoindre"
      description={
        adhesionAction?.description ??
        "Engagez-vous aux côtés des femmes et des jeunes pour transformer durablement les communautés."
      }
      breadcrumbs={[
        { label: "Accueil", href: "/" },
        { label: "Nous rejoindre" },
      ]}
    >
      <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
        <div className="space-y-8">
          <section>
            <h2 className="font-display text-2xl font-semibold text-[var(--afd-ink)]">
              Pourquoi nous rejoindre ?
            </h2>
            <p className="mt-3 leading-relaxed text-[var(--afd-muted)]">
              {homeContent.about.paragraphs[1]}
            </p>
          </section>

          <ul className="space-y-4">
            {WHY_JOIN.map((item) => (
              <li
                key={item.title}
                className="rounded-xl border border-[var(--afd-border)] bg-[var(--afd-surface)] p-5"
              >
                <div className="flex items-start gap-3">
                  <Users className="mt-0.5 size-5 shrink-0 text-[var(--afd-accent)]" aria-hidden />
                  <div>
                    <h3 className="font-semibold text-[var(--afd-ink)]">{item.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-[var(--afd-muted)]">
                      {item.description}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <p className="rounded-xl border border-[var(--afd-border)] bg-[var(--afd-accent-soft)] px-4 py-3 text-sm leading-relaxed text-[var(--afd-ink)]">
            Vous souhaitez plutôt collaborer en tant qu’organisation ?{" "}
            <Link href="/partenariat" className="font-semibold text-[var(--afd-blue)] hover:underline">
              Proposer un partenariat
            </Link>
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--afd-border)] bg-[var(--afd-background)] p-6 md:p-8">
          <div className="mb-6 flex items-center gap-3">
            <HeartHandshake className="size-6 text-[var(--afd-orange)]" aria-hidden />
            <h2 className="font-display text-xl font-semibold text-[var(--afd-ink)]">
              Demande d’adhésion
            </h2>
          </div>
          <MembershipForm />
        </div>
      </div>
    </PublicPageShell>
  );
}
