"use client";

import Link from "next/link";
import { ArrowRight, Handshake, UsersRound } from "lucide-react";
import { HeroBackgroundSlideshow } from "@/components/public/home/hero-background-slideshow";
import { homeContent } from "@/config/home-content";
import { SiteContainer } from "@/components/shared/SiteContainer";
import { TypewriterHeading } from "@/components/animations/typewriter-heading";
import { cn } from "@/lib/utils";

function InstitutionalCard({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      className={cn(
        className ??
          "w-full max-w-[11rem] rounded-[12px] border border-[var(--afd-sky)]/50 bg-white p-2.5 text-[#10233f] shadow-[0_8px_20px_rgba(3,27,60,0.22)] sm:max-w-[13rem] sm:rounded-[14px] sm:p-3 lg:max-w-[14.5rem] lg:rounded-[16px] lg:p-3.5 lg:shadow-[0_14px_36px_rgba(3,27,60,0.28)]",
      )}
    >
      <div className="inline-flex size-6 items-center justify-center rounded-full bg-[#eaf5fd] text-[#0877d1] sm:size-7 lg:size-8">
        <UsersRound className="size-3 sm:size-3.5 lg:size-3.5" aria-hidden />
      </div>
      <p className="font-heading mt-1.5 text-[1.05rem] font-extrabold leading-none text-[#062653] sm:mt-2 sm:text-[1.25rem] lg:text-2xl">
        80&nbsp;%
      </p>
      <p className="mt-1 text-[10px] font-semibold leading-snug text-[#062653] sm:mt-1.5 sm:text-[11px] lg:text-[12px]">
        de femmes de moins de 35 ans et de jeunes au Conseil d&apos;administration.
      </p>
      <p className="mt-1 text-[9px] leading-relaxed text-[#5f6f83] sm:mt-1.5 sm:text-[10px] lg:text-[11px]">
        Fait institutionnel — distinct des indicateurs d&apos;impact terrain.
      </p>
    </div>
  );
}

/** Slogan hero : 3 lignes + typewriter. */
function HeroTitle() {
  return (
    <TypewriterHeading
      lines={[
        "Des femmes engagées",
        "pour des communautés",
        "plus fortes",
      ]}
    />
  );
}

export function HomeHero() {
  const content = homeContent.hero;
  return (
    <section className="relative isolate overflow-hidden bg-[#031b3c] text-white">
      <div className="absolute inset-0 z-0">
        <HeroBackgroundSlideshow />
        <div
          className="pointer-events-none absolute -left-[20%] top-0 hidden h-full w-[58%] bg-[radial-gradient(ellipse_at_30%_50%,rgba(8,119,209,0.38),transparent_68%)] lg:block"
          aria-hidden
        />
        <div
          className="absolute inset-0 z-[1] bg-[linear-gradient(180deg,rgba(3,27,60,0.28)_0%,rgba(6,45,95,0.45)_40%,rgba(3,27,60,0.92)_100%)] lg:hidden"
          aria-hidden
        />
        <div
          className="absolute inset-0 z-[1] hidden bg-[linear-gradient(90deg,rgba(3,27,60,0.88)_0%,rgba(6,55,110,0.72)_26%,rgba(8,119,209,0.32)_48%,rgba(59,163,230,0.08)_68%,transparent_100%)] lg:block"
          aria-hidden
        />
      </div>

      <SiteContainer className="pointer-events-none relative z-20 grid min-h-[min(92dvh,680px)] content-end gap-5 py-8 pb-[max(2rem,env(safe-area-inset-bottom))] max-[360px]:min-h-[620px] sm:min-h-[640px] sm:content-center sm:gap-6 sm:py-14 md:min-h-[640px] lg:min-h-[660px] lg:grid-cols-12 lg:content-center lg:gap-10 lg:py-0">
        <div className="pointer-events-auto min-w-0 lg:col-span-7 xl:col-span-7">
          <span className="afd-label inline-flex max-w-full rounded-md border border-white/35 bg-[var(--afd-blue)] px-3 py-1.5 text-[11px] text-white shadow-[0_4px_16px_rgba(8,119,209,0.45)] sm:px-3.5">
            {content.eyebrow}
          </span>

          <HeroTitle />

          <p
            className="mt-4 max-w-[40rem] text-[15px] font-medium leading-[1.65] text-[#eaf6ff] sm:mt-5 sm:text-base md:text-lg"
            style={{ textShadow: "0 1px 12px rgba(3,27,60,0.55)" }}
          >
            {content.description}
          </p>

          <div className="mt-6 flex flex-col gap-3 min-[390px]:flex-row min-[390px]:flex-wrap sm:mt-8">
            <Link
              href={content.primaryCta.href}
              className="afd-btn-text inline-flex min-h-[50px] w-full items-center justify-center gap-2 rounded-lg bg-[var(--afd-blue)] px-5 py-3 text-white shadow-[0_8px_24px_rgba(8,119,209,0.55)] transition-colors duration-180 hover:bg-[var(--afd-blue-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--afd-sky)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#031b3c] min-[390px]:w-auto"
            >
              {content.primaryCta.label}
              <ArrowRight className="size-4 shrink-0" aria-hidden />
            </Link>
            <Link
              href={content.secondaryCta.href}
              className="afd-btn-text inline-flex min-h-[50px] w-full items-center justify-center gap-2 rounded-lg border-2 border-[var(--afd-sky)] bg-white px-5 py-3 text-[var(--afd-blue)] shadow-[0_8px_24px_rgba(255,255,255,0.28)] transition-colors duration-180 hover:bg-[#eaf6ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#031b3c] min-[390px]:w-auto"
            >
              <Handshake className="size-4 shrink-0" aria-hidden />
              {content.secondaryCta.label}
            </Link>
          </div>

          <ul
            className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-[13px] font-medium text-[#c8e9fc] sm:mt-7 sm:gap-x-5"
            style={{ textShadow: "0 1px 10px rgba(3,27,60,0.5)" }}
          >
            {content.trustItems.map((item) => (
              <li key={item} className="inline-flex max-w-full items-center gap-2">
                <span
                  className="size-1.5 shrink-0 rounded-full bg-[var(--afd-sky)] shadow-[0_0_8px_rgba(59,163,230,0.8)]"
                  aria-hidden
                />
                <span className="min-w-0">{item}</span>
              </li>
            ))}
          </ul>

          <div
            className="mt-5 flex justify-start lg:hidden"
            aria-label="Gouvernance institutionnelle"
          >
            <InstitutionalCard />
          </div>
        </div>

        <aside
          className="pointer-events-auto hidden lg:col-span-5 lg:flex lg:items-end lg:justify-end lg:pb-16 xl:col-span-5 xl:pb-20"
          aria-label="Gouvernance institutionnelle"
        >
          <InstitutionalCard />
        </aside>
      </SiteContainer>
    </section>
  );
}
