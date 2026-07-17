import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/motion/FadeIn";
import { EmptyState } from "@/components/shared/EmptyState";
import { Section } from "@/components/shared/Section";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { SiteContainer } from "@/components/shared/SiteContainer";
import type { FeaturedProgram } from "@/lib/queries/home";

export function FeaturedPrograms({
  programs,
}: {
  programs: FeaturedProgram[];
}) {
  return (
    <Section className="bg-[var(--afd-surface)]">
      <SiteContainer>
        <FadeIn>
          <SectionHeading
            eyebrow="Programmes"
            title="Programmes prioritaires"
            description="Les programmes publiés et mis en avant par l’AFD."
          />
        </FadeIn>

        {programs.length === 0 ? (
          <EmptyState
            title="Aucun programme publié pour le moment"
            description="Les programmes actifs apparaîtront ici dès leur publication."
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {programs.map((program, index) => (
              <FadeIn key={program.id} delay={index * 0.05}>
                <Link
                  href={`/actions/programmes/${program.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--afd-border)] bg-white transition duration-200 hover:border-[var(--afd-accent)]/40"
                >
                  <div className="relative aspect-[16/10] bg-[var(--afd-accent-soft)]">
                    {program.image_url ? (
                      <Image
                        src={program.image_url}
                        alt=""
                        fill
                        sizes="(max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition duration-300 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-[var(--afd-muted)]">
                        Image à venir
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[var(--afd-accent)]">
                      Programme
                    </p>
                    <h3 className="font-display mt-2 text-lg font-semibold text-[var(--afd-ink)]">
                      {program.title}
                    </h3>
                    <p className="mt-2 line-clamp-3 text-sm text-[var(--afd-muted)]">
                      {program.description}
                    </p>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        )}

        <div className="mt-8">
          <Link
            href="/actions/programmes"
            className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[var(--afd-accent)]"
          >
            Voir tous les programmes
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </SiteContainer>
    </Section>
  );
}
