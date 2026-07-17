import Link from "next/link";
import { ArrowRight, HeartHandshake, Users } from "lucide-react";
import { FadeIn } from "@/components/motion/FadeIn";
import { PageHero } from "@/components/shared/PageHero";
import { Section } from "@/components/shared/Section";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { SiteContainer } from "@/components/shared/SiteContainer";
import { sectors } from "@/config/sectors";
import { siteConfig } from "@/config/site";

export default function HomePage() {
  return (
    <>
      <PageHero
        eyebrow={siteConfig.shortName}
        title={siteConfig.name}
        description={siteConfig.description}
        actions={
          <>
            <Link
              href="/soutenir"
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--afd-gold)] px-5 py-2.5 text-sm font-semibold text-[var(--afd-ink)]"
            >
              Soutenir l’AFD
              <HeartHandshake className="size-4" aria-hidden />
            </Link>
            <Link
              href="/adhesion"
              className="inline-flex items-center gap-2 rounded-lg border border-white/40 px-5 py-2.5 text-sm font-semibold text-white"
            >
              Nous rejoindre
              <Users className="size-4" aria-hidden />
            </Link>
          </>
        }
      />

      <Section>
        <SiteContainer>
          <FadeIn>
            <SectionHeading
              eyebrow="Fondation"
              title="Une plateforme institutionnelle en construction structurée"
              description="Cette phase pose l’architecture publique, administrative, data et paiements. Les modules seront enrichis progressivement sans données fictives présentées comme réelles."
            />
          </FadeIn>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Qui sommes-nous",
                href: "/qui-sommes-nous",
                text: "Identité, gouvernance et engagements.",
              },
              {
                title: "Nos actions",
                href: "/actions",
                text: "Programmes, projets et urgences.",
              },
              {
                title: "Notre impact",
                href: "/impact",
                text: "Résultats, histoires et rapports.",
              },
            ].map((item) => (
              <FadeIn key={item.href}>
                <Link
                  href={item.href}
                  className="group block rounded-2xl border border-[var(--afd-border)] bg-white p-6 transition hover:border-[var(--afd-accent)]/40"
                >
                  <h3 className="font-display text-xl font-semibold text-[var(--afd-ink)]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-[var(--afd-muted)]">{item.text}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[var(--afd-accent)]">
                    Découvrir
                    <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </FadeIn>
            ))}
          </div>
        </SiteContainer>
      </Section>

      <Section className="bg-[var(--afd-surface)]">
        <SiteContainer>
          <SectionHeading
            title="Domaines d’intervention"
            description="L’AFD intervient sur des secteurs humanitaires et de développement prioritaires."
          />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {sectors.map((sector) => (
              <div
                key={sector.id}
                className="rounded-xl border border-[var(--afd-border)] bg-white px-4 py-3 text-sm font-medium text-[var(--afd-ink)]"
              >
                {sector.label}
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Link
              href="/actions/domaines-intervention"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--afd-accent)]"
            >
              Voir les domaines
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </SiteContainer>
      </Section>
    </>
  );
}
