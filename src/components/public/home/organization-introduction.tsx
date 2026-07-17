import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/motion/FadeIn";
import { Section } from "@/components/shared/Section";
import { SiteContainer } from "@/components/shared/SiteContainer";
import { homeContent } from "@/config/home-content";

export function OrganizationIntroduction() {
  const content = homeContent.about;
  const [lead, ...rest] = content.paragraphs;

  return (
    <Section id="presentation-afd" className="bg-[var(--afd-surface-elevated)]">
      <SiteContainer>
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
          <FadeIn className="relative lg:col-span-5">
            <div className="relative overflow-hidden rounded-[1.35rem]">
              <div className="relative aspect-[4/5]">
                <Image
                  src={content.image.src}
                  alt={content.image.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(6,38,83,0.35)_100%)]"
                />
              </div>
            </div>
            <p className="mt-3 text-xs text-[var(--afd-muted)]">
              {content.image.caption}
            </p>
          </FadeIn>

          <FadeIn delay={0.08} className="lg:col-span-7">
            <div className="flex items-center gap-3">
              <span
                className="h-px w-8 bg-[var(--afd-blue)]"
                aria-hidden
              />
              <p className="afd-label text-[var(--afd-blue)]">{content.eyebrow}</p>
            </div>

            <h2 className="afd-h2 mt-4 max-w-full tracking-[-0.02em] sm:max-w-[18ch]">
              {content.title}
            </h2>

            <div className="mt-6 max-w-[38rem]">
              <p className="text-[1.05rem] leading-[1.75] font-medium text-[var(--afd-text)] md:text-[1.125rem] md:leading-[1.7]">
                {lead}
              </p>
              {rest.map((paragraph) => (
                <p
                  key={paragraph}
                  className="mt-4 text-[15px] leading-[1.75] text-[var(--afd-muted)] md:text-base"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <ul className="mt-8 grid grid-cols-1 gap-4 min-[360px]:grid-cols-3 min-[360px]:gap-3">
              {content.highlights.map((item, index) => (
                <li
                  key={item}
                  className="border-l-2 border-[var(--afd-blue)]/70 pl-3"
                >
                  <span className="font-heading block text-[11px] font-bold tracking-[0.08em] text-[var(--afd-blue)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="mt-1 block text-[13px] leading-snug font-semibold text-[var(--afd-text)]">
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            <blockquote className="relative mt-8 border-l-[3px] border-[var(--afd-orange)] pl-5">
              <p className="text-[15px] leading-relaxed font-medium text-[var(--afd-text)] md:text-base">
                {content.boardNote}
              </p>
              <p className="mt-2 text-[12px] font-semibold tracking-wide text-[var(--afd-muted)] uppercase">
                Gouvernance institutionnelle
              </p>
            </blockquote>

            <Link
              href={content.cta.href}
              className="afd-btn-text mt-8 inline-flex min-h-11 items-center gap-2 rounded-lg bg-[var(--afd-blue)] px-5 py-2.5 text-white transition-colors hover:bg-[var(--afd-blue-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--afd-blue)] focus-visible:ring-offset-2"
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
