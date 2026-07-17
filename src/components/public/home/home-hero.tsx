"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight } from "lucide-react";
import { homeContent } from "@/config/home-content";
import { SiteContainer } from "@/components/shared/SiteContainer";

export function HomeHero() {
  const content = homeContent.hero;
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative isolate min-h-[88vh] overflow-hidden bg-[var(--afd-accent-strong)] text-white">
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0"
          initial={reduceMotion ? false : { scale: 1.06 }}
          animate={reduceMotion ? undefined : { scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <Image
            src={content.image.src}
            alt={content.image.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(15,53,95,0.92)_0%,rgba(26,79,140,0.78)_48%,rgba(15,53,95,0.55)_100%)]" />
      </div>

      <SiteContainer className="relative flex min-h-[88vh] flex-col justify-center py-20 md:py-28">
        <div className="max-w-3xl">
          <motion.p
            className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--afd-gold)] md:text-sm"
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {content.eyebrow}
          </motion.p>

          <motion.h1
            className="font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl md:text-5xl lg:text-[3.25rem]"
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
          >
            {content.title}
          </motion.h1>

          <motion.p
            className="mt-5 max-w-2xl text-base leading-relaxed text-white/88 md:text-lg"
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.16 }}
          >
            {content.description}
          </motion.p>

          <motion.div
            className="mt-8 flex flex-wrap gap-3"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.24 }}
          >
            <Link
              href={content.primaryCta.href}
              className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-[var(--afd-accent-strong)] transition-colors duration-150 hover:bg-[var(--afd-accent-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              {content.primaryCta.label}
              <ArrowRight className="size-4" aria-hidden />
            </Link>
            <Link
              href={content.secondaryCta.href}
              className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[var(--afd-support)] px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-150 hover:bg-[var(--afd-support-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              {content.secondaryCta.label}
            </Link>
          </motion.div>

          <motion.ul
            className="mt-10 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/85"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.32 }}
          >
            {content.trustItems.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-[var(--afd-gold)]" aria-hidden />
                {item}
              </li>
            ))}
          </motion.ul>

          <motion.p
            className="mt-4 max-w-xl text-xs leading-relaxed text-white/70"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35, delay: 0.4 }}
          >
            {content.institutionalNote}
          </motion.p>

          {content.image.isTemporary ? (
            <p className="mt-4 text-[11px] text-white/55">{content.image.credit}</p>
          ) : null}
        </div>

        <a
          href="#presentation-afd"
          className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 items-center gap-2 text-xs font-medium text-white/70 transition hover:text-white md:inline-flex"
        >
          Découvrir
          <ArrowDown className="size-3.5" aria-hidden />
        </a>
      </SiteContainer>
    </section>
  );
}
