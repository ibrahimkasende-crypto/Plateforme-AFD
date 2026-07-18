"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { impactBannerSlides } from "@/config/impact-banners";

/** Vitesse du défilement auto (px / seconde) — plus élevé = plus rapide */
const AUTO_SPEED_PX_PER_SEC = 75;

export function ImpactImageBanner() {
  const reduceMotion = useReducedMotion();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const draggingRef = useRef(false);
  const dragStartX = useRef(0);
  const dragStartScroll = useRef(0);

  const loopSlides = [...impactBannerSlides, ...impactBannerSlides];

  const pause = useCallback(() => setPaused(true), []);
  const resume = useCallback(() => {
    if (!draggingRef.current) setPaused(false);
  }, []);

  useEffect(() => {
    if (reduceMotion || paused) return;
    const el = scrollerRef.current;
    if (!el) return;

    let frame = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      el.scrollLeft += AUTO_SPEED_PX_PER_SEC * dt;

      // Boucle fluide : quand on a parcouru la première moitié (copie), on revient
      const half = el.scrollWidth / 2;
      if (half > 0 && el.scrollLeft >= half) {
        el.scrollLeft -= half;
      }

      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [reduceMotion, paused]);

  function onPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    const el = scrollerRef.current;
    if (!el) return;
    draggingRef.current = true;
    setPaused(true);
    dragStartX.current = event.clientX;
    dragStartScroll.current = el.scrollLeft;
    el.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (!draggingRef.current) return;
    const el = scrollerRef.current;
    if (!el) return;
    const delta = event.clientX - dragStartX.current;
    el.scrollLeft = dragStartScroll.current - delta;
  }

  function onPointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    const el = scrollerRef.current;
    draggingRef.current = false;
    el?.releasePointerCapture(event.pointerId);
    setPaused(false);
  }

  return (
    <div className="mt-10 border-t border-[var(--afd-border)] pt-8 sm:mt-12 sm:pt-10">
      <div className="mb-4 flex flex-col gap-2 sm:mb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="afd-label text-[var(--afd-blue)]">Impact</p>
          <h3 className="font-heading mt-2 text-[22px] font-extrabold text-[#062653] sm:text-[26px]">
            Histoire d’impact
          </h3>
          <p className="mt-1 text-[14px] leading-relaxed text-[#5F6F83] sm:text-[15px]">
            Témoignages et remerciements depuis le terrain
          </p>
        </div>
        <Link
          href="/impact/histoires"
          className="inline-flex min-h-10 items-center gap-2 text-sm font-bold text-[var(--afd-blue)]"
        >
          Voir les histoires
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>

      <div
        className="relative -mx-4 sm:-mx-6 lg:mx-0"
        role="region"
        aria-label="Bannières — histoires d’impact"
        onMouseEnter={pause}
        onMouseLeave={resume}
        onFocusCapture={pause}
        onBlurCapture={resume}
      >
        {/* Fondus latéraux pour un rendu plus moderne */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-8 bg-gradient-to-r from-[var(--afd-surface-elevated)] to-transparent sm:w-12"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-[1] w-8 bg-gradient-to-l from-[var(--afd-surface-elevated)] to-transparent sm:w-12"
          aria-hidden
        />

        <div
          ref={scrollerRef}
          className="afd-h-rail flex cursor-grab touch-pan-x snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 select-none active:cursor-grabbing [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:gap-4 sm:px-6 lg:snap-none lg:px-0"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          {loopSlides.map((slide, index) => (
            <figure
              key={`${slide.image.src}-${index}`}
              className="relative h-[168px] w-[min(84vw,300px)] shrink-0 snap-start overflow-hidden rounded-[16px] border border-[var(--afd-blue)]/10 bg-[var(--afd-navy)] shadow-[0_8px_24px_rgba(6,38,83,0.08)] sm:h-[200px] sm:w-[300px] sm:rounded-[18px] md:h-[220px] md:w-[340px]"
            >
              <Image
                src={slide.image.src}
                alt={slide.image.alt}
                fill
                sizes="(max-width:768px) 84vw, 340px"
                className="pointer-events-none object-cover"
                style={{ objectPosition: slide.image.objectPosition }}
                draggable={false}
              />

              <div
                className="pointer-events-none absolute inset-y-0 left-0 w-[70%] sm:w-[62%]"
                aria-hidden
              >
                <div className="absolute inset-0 backdrop-blur-[3px] [mask-image:linear-gradient(to_right,black_0%,black_42%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_right,black_0%,black_42%,transparent_100%)]" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#031b3c]/55 via-[#0877d1]/22 to-transparent" />
              </div>

              <figcaption className="pointer-events-none absolute inset-y-0 left-0 z-[1] flex w-[88%] flex-col justify-center px-4 py-3 sm:px-5">
                <p className="text-[10px] font-bold tracking-[0.14em] text-[var(--afd-sky)] uppercase">
                  Témoignage
                </p>
                <blockquote className="font-heading mt-1.5 text-[13px] font-bold leading-snug text-white sm:text-[15px]">
                  « {slide.message} »
                </blockquote>
                <p className="mt-2 text-[11px] font-medium text-white/80">
                  — {slide.attribution}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </div>
  );
}
