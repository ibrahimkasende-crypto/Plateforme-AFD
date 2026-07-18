"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { ArrowRight, Handshake, UsersRound } from "lucide-react";
import { HeroBackgroundSlideshow } from "@/components/public/home/hero-background-slideshow";
import { homeContent } from "@/config/home-content";
import { SiteContainer } from "@/components/shared/SiteContainer";
import { cn } from "@/lib/utils";

function InstitutionalCard({
  className,
  breathe = false,
}: {
  className?: string;
  breathe?: boolean;
}) {
  return (
    <div
      className={cn(
        className ??
          "w-full rounded-[16px] border border-[var(--afd-sky)]/50 bg-white p-5 text-[#10233f] shadow-[0_14px_36px_rgba(3,27,60,0.28)] sm:max-w-md lg:max-w-[14.5rem] lg:p-3.5",
        breathe && "afd-card-breathe",
      )}
    >
      <div className="inline-flex size-9 items-center justify-center rounded-full bg-[#eaf5fd] text-[#0877d1] lg:size-8">
        <UsersRound className="size-4 lg:size-3.5" aria-hidden />
      </div>
      <p className="font-heading mt-2.5 text-[1.75rem] font-extrabold leading-none text-[#062653] lg:mt-2 lg:text-2xl">
        80&nbsp;%
      </p>
      <p className="mt-2 text-[13px] font-semibold leading-snug text-[#062653] lg:mt-1.5 lg:text-[12px]">
        de femmes de moins de 35 ans et de jeunes au Conseil d’administration.
      </p>
      <p className="mt-2 text-[12px] leading-relaxed text-[#5f6f83] lg:mt-1.5 lg:text-[11px]">
        Fait institutionnel — distinct des indicateurs d’impact terrain.
      </p>
    </div>
  );
}

function TypewriterTitle({
  text,
  lines,
  reduceMotion,
}: {
  text: string;
  lines: readonly string[];
  reduceMotion: boolean | null;
}) {
  const stream = lines.join("\n");
  const [typedCount, setTypedCount] = useState(0);
  const visibleCount = reduceMotion ? stream.length : typedCount;

  useEffect(() => {
    if (reduceMotion) return;

    let index = 0;
    let intervalId: number | undefined;

    const startDelay = window.setTimeout(() => {
      intervalId = window.setInterval(() => {
        index += 1;
        setTypedCount(index);
        if (index >= stream.length && intervalId !== undefined) {
          window.clearInterval(intervalId);
        }
      }, 55);
    }, 350);

    return () => {
      window.clearTimeout(startDelay);
      if (intervalId !== undefined) window.clearInterval(intervalId);
    };
  }, [stream, reduceMotion]);

  const lineStarts = lines.reduce<number[]>((starts, line, lineIndex) => {
    if (lineIndex === 0) return [0];
    const previous = lines[lineIndex - 1]!;
    const previousStart = starts[lineIndex - 1]!;
    return [...starts, previousStart + previous.length + 1];
  }, []);

  const renderedLines = lines.map((line, lineIndex) => {
    const start = lineStarts[lineIndex] ?? 0;
    const end = start + line.length;
    const localVisible = Math.max(
      0,
      Math.min(line.length, visibleCount - start),
    );
    const showCaret =
      !reduceMotion && visibleCount >= start && visibleCount < end;

    return (
      <span
        key={line}
        className="block whitespace-normal break-words sm:whitespace-nowrap"
      >
        <span className="bg-gradient-to-br from-white via-[#e8f6ff] to-[var(--afd-sky)] bg-clip-text text-transparent drop-shadow-[0_2px_18px_rgba(3,27,60,0.45)]">
          {line.slice(0, localVisible)}
        </span>
        {showCaret ? (
          <span className="ml-0.5 inline-block h-[0.9em] w-[0.08em] translate-y-[0.08em] animate-pulse bg-[var(--afd-sky)] align-middle" />
        ) : null}
      </span>
    );
  });

  return (
    <h1
      className="afd-h1-hero mt-4 max-w-full sm:mt-5"
      aria-label={text}
    >
      <span aria-hidden="true">{renderedLines}</span>
      <span className="sr-only">{text}</span>
    </h1>
  );
}

export function HomeHero() {
  const content = homeContent.hero;
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative isolate overflow-hidden bg-[#031b3c] text-white">
      <div className="absolute inset-0 z-0">
        <HeroBackgroundSlideshow />
        <div
          className={
            reduceMotion
              ? "pointer-events-none absolute -left-[20%] top-0 hidden h-full w-[58%] bg-[radial-gradient(ellipse_at_30%_50%,rgba(8,119,209,0.38),transparent_68%)] lg:block"
              : "afd-hero-glow pointer-events-none absolute -left-[20%] top-0 hidden h-full w-[58%] bg-[radial-gradient(ellipse_at_30%_50%,rgba(8,119,209,0.4),transparent_68%)] lg:block"
          }
          aria-hidden
        />
        {/* Mobile: contraste net sans voile gris */}
        <div
          className="absolute inset-0 z-[1] bg-[linear-gradient(180deg,rgba(3,27,60,0.28)_0%,rgba(6,45,95,0.45)_40%,rgba(3,27,60,0.92)_100%)] lg:hidden"
          aria-hidden
        />
        {/* Desktop: panneau gauche plus net (navy → ciel), droite ouverte */}
        <div
          className="absolute inset-0 z-[1] hidden bg-[linear-gradient(90deg,rgba(3,27,60,0.88)_0%,rgba(6,55,110,0.72)_26%,rgba(8,119,209,0.32)_48%,rgba(59,163,230,0.08)_68%,transparent_100%)] lg:block"
          aria-hidden
        />
      </div>

      <SiteContainer className="pointer-events-none relative z-20 grid min-h-[min(92svh,640px)] content-end gap-5 py-8 pb-[max(2rem,env(safe-area-inset-bottom))] sm:min-h-[640px] sm:content-center sm:gap-6 sm:py-14 md:min-h-[640px] lg:min-h-[660px] lg:grid-cols-12 lg:content-center lg:gap-10 lg:py-0">
        <div className="pointer-events-auto min-w-0 lg:col-span-7 xl:col-span-7">
          <motion.span
            className="afd-label inline-flex max-w-full rounded-md border border-white/35 bg-[var(--afd-blue)] px-3 py-1.5 text-[11px] text-white shadow-[0_4px_16px_rgba(8,119,209,0.45)] sm:px-3.5"
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            {content.eyebrow}
          </motion.span>

          <TypewriterTitle
            key={content.titleLines.join("|")}
            text={content.title}
            lines={content.titleLines}
            reduceMotion={reduceMotion}
          />

          <motion.p
            className="mt-4 max-w-[40rem] text-[15px] font-medium leading-[1.65] text-[#eaf6ff] sm:mt-5 sm:text-base md:text-lg"
            style={{ textShadow: "0 1px 12px rgba(3,27,60,0.55)" }}
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.12 }}
          >
            {content.description}
          </motion.p>

          <motion.div
            className="mt-6 flex flex-col gap-3 min-[400px]:flex-row min-[400px]:flex-wrap sm:mt-8"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.18 }}
          >
            <Link
              href={content.primaryCta.href}
              className="afd-btn-text inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-[var(--afd-blue)] px-5 py-3 text-white shadow-[0_8px_24px_rgba(8,119,209,0.55)] transition-colors duration-180 hover:bg-[var(--afd-blue-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--afd-sky)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#031b3c] min-[400px]:w-auto"
            >
              {content.primaryCta.label}
              <ArrowRight className="size-4 shrink-0" aria-hidden />
            </Link>
            <Link
              href={content.secondaryCta.href}
              className="afd-btn-text inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border-2 border-[var(--afd-sky)] bg-white px-5 py-3 text-[var(--afd-blue)] shadow-[0_8px_24px_rgba(255,255,255,0.28)] transition-colors duration-180 hover:bg-[#eaf6ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#031b3c] min-[400px]:w-auto"
            >
              <Handshake className="size-4 shrink-0" aria-hidden />
              {content.secondaryCta.label}
            </Link>
          </motion.div>

          <motion.ul
            className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-[13px] font-medium text-[#c8e9fc] sm:mt-7 sm:gap-x-5"
            style={{ textShadow: "0 1px 10px rgba(3,27,60,0.5)" }}
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35, delay: 0.24 }}
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
          </motion.ul>

          {/* Carte 80 % — flux mobile / tablette */}
          <motion.div
            className="mt-6 lg:hidden"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.28 }}
            aria-label="Gouvernance institutionnelle"
          >
            <InstitutionalCard breathe={!reduceMotion} />
          </motion.div>
        </div>

        {/* Carte 80 % — desktop, bas à droite */}
        <motion.aside
          className="pointer-events-auto hidden lg:col-span-5 lg:flex lg:items-end lg:justify-end lg:pb-16 xl:col-span-5 xl:pb-20"
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.28 }}
          aria-label="Gouvernance institutionnelle"
        >
          <InstitutionalCard breathe={!reduceMotion} />
        </motion.aside>
      </SiteContainer>
    </section>
  );
}
