import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  FileText,
  UsersRound,
} from "lucide-react";
import { FadeIn } from "@/components/motion/FadeIn";
import { Section } from "@/components/shared/Section";
import { SiteContainer } from "@/components/shared/SiteContainer";
import { siteConfig } from "@/config/site";
import { getPublishedTenders } from "@/lib/queries/public/appels-offres";
import { getPublishedOpportunities } from "@/lib/queries/public/opportunites";
import { cn } from "@/lib/utils";

export async function OpenOpportunities() {
  const [opportunities, tenders] = await Promise.all([
    getPublishedOpportunities({ statut: "ouverte", pageSize: 3 }),
    getPublishedTenders({ page: 1, pageSize: 3 }),
  ]);

  const openJobs = opportunities.items;
  const openTenders = tenders.items;
  const spontaneousOpen = siteConfig.features.spontaneousApplications;

  return (
    <Section className="relative overflow-hidden bg-[var(--afd-surface)]">
      <div
        className="pointer-events-none absolute -right-20 top-0 h-64 w-64 rounded-full bg-[var(--afd-blue)]/8 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-[var(--afd-orange)]/10 blur-3xl"
        aria-hidden
      />

      <SiteContainer className="relative">
        <FadeIn>
          <div className="max-w-2xl">
            <p className="afd-label text-[var(--afd-blue)]">Engagement</p>
            <h2 className="afd-h2 mt-3">
              Appels d’offres &amp; rejoindre l’AFD
            </h2>
            <p className="mt-3 max-w-xl text-[15px] leading-[1.7] text-[var(--afd-muted)] md:text-base">
              Consultez les opportunités pour rejoindre l’équipe, postuler, ou
              répondre aux appels d’offres publiés par l’AFD.
            </p>
          </div>
        </FadeIn>

        <div className="mt-8 grid gap-5 lg:mt-10 lg:grid-cols-2 lg:gap-6">
          {/* Rejoindre / candidatures */}
          <FadeIn delay={0.04}>
            <article className="flex h-full flex-col overflow-hidden rounded-[22px] border border-[var(--afd-blue)]/15 bg-white shadow-[0_12px_36px_rgba(6,38,83,0.06)]">
              <div className="bg-[linear-gradient(135deg,#062653_0%,#0877d1_100%)] px-6 py-5 text-white sm:px-7">
                <div className="flex items-start gap-3">
                  <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-2xl bg-white/15">
                    <Briefcase className="size-5" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold tracking-[0.14em] text-[#c8e9fc] uppercase">
                      Carrières
                    </p>
                    <h3 className="font-heading mt-1 text-xl font-extrabold">
                      Rejoindre l’équipe AFD
                    </h3>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-white/85">
                      Opportunités d’emploi, stages et collaborations publiées.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-1 flex-col p-5 sm:p-6">
                {openJobs.length > 0 ? (
                  <ul className="space-y-3">
                    {openJobs.map((opportunity) => (
                      <li key={opportunity.id}>
                        <Link
                          href={`/ressources/opportunites/${opportunity.slug}`}
                          className="group block rounded-xl border border-[var(--afd-border)] bg-[var(--afd-surface)]/60 px-4 py-3 transition hover:border-[var(--afd-blue)]/40 hover:bg-[#eaf5fd]"
                        >
                          <p className="font-semibold text-[var(--afd-navy)] group-hover:text-[var(--afd-blue)]">
                            {opportunity.titre}
                          </p>
                          <p className="mt-1 text-[13px] text-[var(--afd-muted)]">
                            {[opportunity.type, opportunity.localisation]
                              .filter(Boolean)
                              .join(" · ")}
                            {opportunity.date_limite
                              ? ` · Limite : ${opportunity.date_limite}`
                              : ""}
                          </p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="rounded-xl border border-dashed border-[var(--afd-border)] bg-[var(--afd-surface)]/50 px-4 py-5">
                    <p className="text-sm text-[var(--afd-muted)]">
                      Aucune opportunité ouverte pour le moment. Vous pouvez
                      consulter la page carrières
                      {spontaneousOpen
                        ? " ou envoyer une candidature spontanée"
                        : ""}
                      .
                    </p>
                  </div>
                )}

                <div className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
                  <Link
                    href="/rejoindre-equipe"
                    className="afd-btn-text inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[var(--afd-blue)] px-4 text-white transition hover:bg-[var(--afd-blue-hover)]"
                  >
                    <UsersRound className="size-4" aria-hidden />
                    Rejoindre l’AFD
                    <ArrowRight className="size-4" aria-hidden />
                  </Link>
                  <Link
                    href="/ressources/opportunites"
                    className="afd-btn-text inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[var(--afd-blue)]/25 bg-white px-4 text-[var(--afd-blue)] transition hover:border-[var(--afd-blue)]/50"
                  >
                    Voir les opportunités
                  </Link>
                </div>
              </div>
            </article>
          </FadeIn>

          {/* Appels d'offres */}
          <FadeIn delay={0.08}>
            <article className="flex h-full flex-col overflow-hidden rounded-[22px] border border-[var(--afd-orange)]/20 bg-white shadow-[0_12px_36px_rgba(6,38,83,0.06)]">
              <div className="bg-[linear-gradient(135deg,#7a4a00_0%,#e99308_100%)] px-6 py-5 text-white sm:px-7">
                <div className="flex items-start gap-3">
                  <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-2xl bg-white/15">
                    <FileText className="size-5" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold tracking-[0.14em] text-[#ffe8c2] uppercase">
                      Marchés
                    </p>
                    <h3 className="font-heading mt-1 text-xl font-extrabold">
                      Appels d’offres
                    </h3>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-white/90">
                      Consultations et marchés publiés par l’AFD.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-1 flex-col p-5 sm:p-6">
                {openTenders.length > 0 ? (
                  <p className="text-sm text-[var(--afd-muted)]">
                    {openTenders.length} appel
                    {openTenders.length > 1 ? "s" : ""} d’offres disponible
                    {openTenders.length > 1 ? "s" : ""}.
                  </p>
                ) : (
                  <div className="rounded-xl border border-dashed border-[var(--afd-border)] bg-[var(--afd-surface)]/50 px-4 py-5">
                    <p className="text-sm text-[var(--afd-muted)]">
                      Aucun appel d’offres publié pour le moment. Les
                      consultations actives apparaîtront ici dès leur mise en
                      ligne.
                    </p>
                  </div>
                )}

                <div className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
                  <Link
                    href="/ressources/appels-offres"
                    className={cn(
                      "afd-btn-text inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[var(--afd-orange)] px-4 text-white transition hover:bg-[var(--afd-orange-hover)]",
                    )}
                  >
                    Voir les appels d’offres
                    <ArrowRight className="size-4" aria-hidden />
                  </Link>
                  <Link
                    href="/contact"
                    className="afd-btn-text inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[var(--afd-orange)]/30 bg-white px-4 text-[var(--afd-orange-hover)] transition hover:border-[var(--afd-orange)]/55"
                  >
                    Nous contacter
                  </Link>
                </div>
              </div>
            </article>
          </FadeIn>
        </div>
      </SiteContainer>
    </Section>
  );
}
