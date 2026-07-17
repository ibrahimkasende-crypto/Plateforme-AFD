import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/motion/FadeIn";
import { EmptyState } from "@/components/shared/EmptyState";
import { Section } from "@/components/shared/Section";
import { SiteContainer } from "@/components/shared/SiteContainer";
import type { FeaturedProgram } from "@/lib/queries/home";

export function FeaturedPrograms({
  programs,
}: {
  programs: FeaturedProgram[];
}) {
  return (
    <Section className="bg-[var(--afd-background)]">
      <SiteContainer>
        <FadeIn>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="h-1 w-10 rounded-full bg-[var(--afd-blue)]" aria-hidden />
              <h2 className="afd-h2 mt-4">Nos programmes prioritaires</h2>
            </div>
            <Link
              href="/actions/programmes"
              className="afd-btn-text inline-flex min-h-11 items-center gap-2 text-[var(--afd-blue)]"
            >
              Voir tous les programmes
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        </FadeIn>

        {programs.length === 0 ? (
          <div className="mt-10">
            <EmptyState
              title="Aucun programme publié pour le moment"
              description="Les programmes actifs apparaîtront ici dès leur publication."
            />
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-5 sm:mt-10 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 lg:gap-7">
            {programs.map((program, index) => (
              <FadeIn key={program.id} delay={index * 0.04} className="h-full min-w-0">
                <article className="group flex h-full flex-col overflow-hidden rounded-[16px] border border-[var(--afd-border)] bg-[var(--afd-surface-elevated)] transition duration-180 hover:border-[var(--afd-blue)]/30 sm:rounded-[18px]">
                  <div className="relative aspect-[16/10] bg-[var(--afd-light-blue)]">
                    {program.image_url ? (
                      <Image
                        src={program.image_url}
                        alt=""
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition duration-300 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-[var(--afd-muted)]">
                        Image à venir
                      </div>
                    )}
                    <span className="absolute bottom-0 left-4 inline-flex size-10 translate-y-1/2 items-center justify-center rounded-full bg-[var(--afd-blue)] text-[11px] font-bold text-white shadow-md">
                      AFD
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col px-4 pb-5 pt-7">
                    <h3 className="afd-h3 line-clamp-3 break-words text-[1.125rem] sm:text-[1.2rem]">
                      {program.title}
                    </h3>
                    <p className="mt-2 line-clamp-4 flex-1 text-[14px] leading-[1.6] text-[var(--afd-muted)]">
                      {program.description}
                    </p>
                    <Link
                      href={`/actions/programmes/${program.slug}`}
                      className="afd-btn-text mt-4 inline-flex min-h-11 items-center gap-2 text-[var(--afd-blue)]"
                    >
                      En savoir plus
                      <ArrowRight className="size-4" aria-hidden />
                    </Link>
                  </div>
                </article>
              </FadeIn>
            ))}
          </div>
        )}
      </SiteContainer>
    </Section>
  );
}
