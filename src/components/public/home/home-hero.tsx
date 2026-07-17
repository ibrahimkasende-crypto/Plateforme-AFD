"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Handshake, UsersRound } from "lucide-react";
import { homeContent } from "@/config/home-content";
import { SiteContainer } from "@/components/shared/SiteContainer";

function InstitutionalCard({ className }: { className?: string }) {
  return (
    <div
      className={
        className ??
        "w-full rounded-[16px] border border-white/40 bg-white/70 p-5 text-[#10233f] shadow-[0_12px_28px_rgba(3,27,60,0.18)] backdrop-blur-md sm:max-w-md lg:max-w-[14.5rem] lg:p-3.5"
      }
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

export function HomeHero() {
  const content = homeContent.hero;
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative isolate overflow-hidden bg-[#031b3c] text-white">
      <div className="absolute inset-0">
        <div
          className={
            reduceMotion ? "absolute inset-0" : "afd-hero-media absolute inset-0"
          }
        >
          <Image
            src={content.image.src}
            alt={content.image.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-[70%_center] md:object-[68%_center] lg:object-center"
          />
        </div>
        <div
          className={
            reduceMotion
              ? "pointer-events-none absolute -left-[20%] top-0 hidden h-full w-[58%] bg-[radial-gradient(ellipse_at_30%_50%,rgba(8,119,209,0.42),transparent_68%)] lg:block"
              : "afd-hero-glow pointer-events-none absolute -left-[20%] top-0 hidden h-full w-[58%] bg-[radial-gradient(ellipse_at_30%_50%,rgba(8,119,209,0.45),transparent_68%)] lg:block"
          }
          aria-hidden
        />
        {/* Mobile: overlay fort en bas / gauche pour la lisibilité */}
        <div
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,27,60,0.35)_0%,rgba(3,27,60,0.55)_38%,rgba(3,27,60,0.88)_100%)] lg:hidden"
          aria-hidden
        />
        {/* Desktop: flou bleu à gauche, droite plus claire */}
        <div
          className="absolute inset-0 hidden bg-[linear-gradient(90deg,rgba(3,27,60,0.82)_0%,rgba(6,45,95,0.62)_28%,rgba(8,90,170,0.28)_52%,rgba(6,38,83,0.08)_72%,rgba(6,38,83,0.02)_100%)] lg:block"
          aria-hidden
        />
      </div>

      <SiteContainer className="relative grid min-h-[min(100svh,720px)] content-end gap-6 py-10 pb-[max(2.5rem,env(safe-area-inset-bottom))] sm:min-h-[640px] sm:content-center sm:py-14 md:min-h-[640px] lg:min-h-[660px] lg:grid-cols-12 lg:content-center lg:gap-10 lg:py-0">
        <div className="min-w-0 lg:col-span-7 xl:col-span-7">
          <motion.span
            className="afd-label inline-flex max-w-full rounded-md bg-[var(--afd-blue)] px-3 py-1.5 text-[11px] text-white sm:px-3.5"
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            {content.eyebrow}
          </motion.span>

          <motion.h1
            className="afd-h1-hero mt-4 max-w-full break-words text-white sm:mt-5"
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.06 }}
          >
            {content.title}
          </motion.h1>

          <motion.p
            className="mt-4 max-w-[40rem] text-[15px] leading-[1.6] text-white/90 sm:mt-5 sm:text-base md:text-lg"
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
              className="afd-btn-text inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-[var(--afd-blue)] px-5 py-3 text-white transition-colors duration-180 hover:bg-[var(--afd-blue-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white min-[400px]:w-auto"
            >
              {content.primaryCta.label}
              <ArrowRight className="size-4 shrink-0" aria-hidden />
            </Link>
            <Link
              href={content.secondaryCta.href}
              className="afd-btn-text inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border border-white/90 bg-white px-5 py-3 text-[#062653] shadow-sm transition-colors duration-180 hover:bg-white/92 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white min-[400px]:w-auto"
            >
              <Handshake className="size-4 shrink-0" aria-hidden />
              {content.secondaryCta.label}
            </Link>
          </motion.div>

          <motion.ul
            className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-[13px] text-white/75 sm:mt-7 sm:gap-x-5"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35, delay: 0.24 }}
          >
            {content.trustItems.map((item) => (
              <li key={item} className="inline-flex max-w-full items-center gap-2">
                <span
                  className="size-1.5 shrink-0 rounded-full bg-[var(--afd-orange)]"
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
            <InstitutionalCard />
          </motion.div>
        </div>

        {/* Carte 80 % — desktop, bas à droite */}
        <motion.aside
          className="hidden lg:col-span-5 lg:flex lg:items-end lg:justify-end lg:pb-16 xl:col-span-5 xl:pb-20"
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.28 }}
          aria-label="Gouvernance institutionnelle"
        >
          <InstitutionalCard />
        </motion.aside>
      </SiteContainer>
    </section>
  );
}
