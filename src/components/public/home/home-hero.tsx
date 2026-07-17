"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Handshake, UsersRound } from "lucide-react";
import { homeContent } from "@/config/home-content";
import { SiteContainer } from "@/components/shared/SiteContainer";

export function HomeHero() {
  const content = homeContent.hero;
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative isolate overflow-hidden bg-[var(--afd-navy)] text-white">
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0"
          initial={reduceMotion ? false : { scale: 1.04 }}
          animate={reduceMotion ? undefined : { scale: 1 }}
          transition={{ duration: 1.1, ease: "easeOut" }}
        >
          <Image
            src={content.image.src}
            alt={content.image.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-[68%_center] md:object-center"
          />
        </motion.div>
        <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(3,27,60,0.92)_0%,rgba(6,38,83,0.78)_38%,rgba(6,38,83,0.28)_72%,rgba(6,38,83,0.12)_100%)]" />
      </div>

      <SiteContainer className="relative grid min-h-[600px] items-center gap-8 py-16 md:min-h-[640px] md:py-20 lg:min-h-[660px] lg:grid-cols-12 lg:gap-10 lg:py-0">
        <div className="lg:col-span-7 xl:col-span-7">
          <motion.span
            className="afd-label inline-flex rounded-md bg-[var(--afd-blue)] px-3.5 py-1.5 text-white"
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {content.eyebrow}
          </motion.span>

          <motion.h1
            className="afd-h1-hero mt-5 text-white"
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
          >
            {content.title}
          </motion.h1>

          <motion.p
            className="mt-5 max-w-[40rem] text-base leading-[1.7] text-white/90 md:text-lg"
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.16 }}
          >
            {content.description}
          </motion.p>

          <motion.div
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.24 }}
          >
            <Link
              href={content.primaryCta.href}
              className="afd-btn-text inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[var(--afd-blue)] px-5 py-3 text-white transition-colors duration-180 hover:bg-[var(--afd-blue-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              {content.primaryCta.label}
              <ArrowRight className="size-4" aria-hidden />
            </Link>
            <Link
              href={content.secondaryCta.href}
              className="afd-btn-text inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-white/75 bg-transparent px-5 py-3 text-white transition-colors duration-180 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <Handshake className="size-4" aria-hidden />
              {content.secondaryCta.label}
            </Link>
          </motion.div>

          <motion.ul
            className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-white/75"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.32 }}
          >
            {content.trustItems.map((item) => (
              <li key={item} className="inline-flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-[var(--afd-orange)]" aria-hidden />
                {item}
              </li>
            ))}
          </motion.ul>

          {content.image.isTemporary ? (
            <p className="mt-5 text-[11px] text-white/50">{content.image.credit}</p>
          ) : null}
        </div>

        <motion.aside
          className="hidden lg:col-span-5 lg:flex lg:justify-end xl:col-span-5"
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.28 }}
          aria-label="Gouvernance institutionnelle"
        >
          <div className="max-w-[18rem] rounded-[20px] bg-white p-5 text-[var(--afd-text)] shadow-[0_16px_40px_rgba(3,27,60,0.2)]">
            <div className="inline-flex size-11 items-center justify-center rounded-full bg-[var(--afd-light-blue)] text-[var(--afd-blue)]">
              <UsersRound className="size-5" aria-hidden />
            </div>
            <p className="font-heading mt-3 text-3xl font-extrabold leading-none text-[var(--afd-navy)]">
              80&nbsp;%
            </p>
            <p className="mt-2 text-sm font-semibold leading-snug text-[var(--afd-navy)]">
              de femmes de moins de 35 ans et de jeunes au Conseil
              d’administration.
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-[var(--afd-muted)]">
              Fait institutionnel — distinct des indicateurs d’impact terrain.
            </p>
          </div>
        </motion.aside>
      </SiteContainer>
    </section>
  );
}
