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
    <section className="relative isolate overflow-hidden bg-[var(--afd-accent-strong)] text-white">
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0"
          initial={reduceMotion ? false : { scale: 1.05 }}
          animate={reduceMotion ? undefined : { scale: 1 }}
          transition={{ duration: 1.15, ease: "easeOut" }}
        >
          <Image
            src={content.image.src}
            alt={content.image.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </motion.div>
        <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(10,40,75,0.88)_0%,rgba(15,53,95,0.72)_42%,rgba(15,53,95,0.35)_100%)]" />
      </div>

      <SiteContainer className="relative grid min-h-[78vh] items-center gap-10 py-20 md:min-h-[82vh] md:py-24 lg:grid-cols-12 lg:py-28">
        <div className="lg:col-span-7">
          <motion.span
            className="inline-flex rounded-full bg-[var(--afd-accent)] px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white"
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            ONG nationale congolaise
          </motion.span>

          <motion.h1
            className="font-display mt-5 max-w-3xl text-3xl font-semibold leading-[1.12] tracking-tight sm:text-4xl md:text-5xl lg:text-[3.15rem]"
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
          >
            {content.title}
          </motion.h1>

          <motion.p
            className="mt-5 max-w-2xl text-base leading-relaxed text-white/90 md:text-lg"
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.16 }}
          >
            Depuis 2024, {content.description}
          </motion.p>

          <motion.div
            className="mt-8 flex flex-wrap gap-3"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.24 }}
          >
            <Link
              href={content.primaryCta.href}
              className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[var(--afd-accent)] px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-150 hover:bg-[var(--afd-accent-bright)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              {content.primaryCta.label}
              <ArrowRight className="size-4" aria-hidden />
            </Link>
            <Link
              href="/contact"
              className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/70 bg-transparent px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-150 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <Handshake className="size-4" aria-hidden />
              Devenir partenaire
            </Link>
          </motion.div>

          {content.image.isTemporary ? (
            <p className="mt-6 text-[11px] text-white/55">{content.image.credit}</p>
          ) : null}
        </div>

        <motion.aside
          className="hidden lg:col-span-5 lg:flex lg:justify-end"
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.28 }}
        >
          <div className="max-w-sm rounded-2xl bg-white p-5 text-[var(--afd-ink)] shadow-[0_12px_40px_rgba(10,40,75,0.18)]">
            <div className="inline-flex size-10 items-center justify-center rounded-full bg-[var(--afd-accent-soft)] text-[var(--afd-accent)]">
              <UsersRound className="size-5" aria-hidden />
            </div>
            <p className="mt-3 text-sm font-semibold leading-snug text-[var(--afd-accent-strong)]">
              80 % de femmes et de jeunes au Conseil d’administration
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[var(--afd-muted)]">
              Leadership engagé, innovant et ancré dans les réalités locales.
            </p>
          </div>
        </motion.aside>
      </SiteContainer>
    </section>
  );
}
