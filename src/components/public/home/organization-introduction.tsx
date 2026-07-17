import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { FadeIn } from "@/components/motion/FadeIn";
import { Section } from "@/components/shared/Section";
import { SiteContainer } from "@/components/shared/SiteContainer";
import { homeContent } from "@/config/home-content";

export function OrganizationIntroduction() {
  const content = homeContent.about;

  return (
    <Section id="presentation-afd" className="bg-white">
      <SiteContainer>
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <FadeIn className="relative lg:col-span-5">
            <div className="relative overflow-hidden rounded-2xl bg-[var(--afd-surface)]">
              <div className="relative aspect-[4/5]">
                <Image
                  src={content.image.src}
                  alt={content.image.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
              <div
                aria-hidden
                className="absolute -bottom-6 -right-6 size-28 rounded-full bg-[var(--afd-accent)]/15"
              />
            </div>
            <p className="mt-3 text-xs text-[var(--afd-muted)]">
              {content.image.caption}
            </p>
          </FadeIn>

          <FadeIn delay={0.08} className="lg:col-span-7">
            <p className="afd-label text-[var(--afd-blue)]">{content.eyebrow}</p>
            <h2 className="afd-h2 mt-3">{content.title}</h2>
            <div className="mt-5 max-w-[40rem] space-y-4 text-base leading-[1.7] text-[var(--afd-muted)] md:text-[1.05rem]">
              {content.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <ul className="mt-6 space-y-3">
              {content.highlights.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-sm font-medium text-[var(--afd-ink)]"
                >
                  <CheckCircle2
                    className="mt-0.5 size-4 shrink-0 text-[var(--afd-accent)]"
                    aria-hidden
                  />
                  {item}
                </li>
              ))}
            </ul>

            <p className="mt-6 rounded-xl border border-[var(--afd-border)] bg-[var(--afd-surface)] px-4 py-3 text-sm leading-relaxed text-[var(--afd-ink)]">
              {content.boardNote}
            </p>

            <Link
              href={content.cta.href}
              className="mt-7 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[var(--afd-accent)] transition-colors hover:text-[var(--afd-accent-strong)]"
            >
              {content.cta.label}
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </FadeIn>
        </div>
      </SiteContainer>
    </Section>
  );
}
