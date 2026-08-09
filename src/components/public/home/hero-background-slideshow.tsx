"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { afdImages } from "@/config/afd-images";
import { cn } from "@/lib/utils";

const SLIDE_MS = 6500;
const TRANSITION_S = 0.85;

/**
 * Fond hero stable : fondu simple entre images, sans parallaxe ni dérive continue.
 */
export function HeroBackgroundSlideshow({
  className,
}: {
  className?: string;
}) {
  const slides = afdImages.homeHeroSlides;
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry?.isIntersecting ?? true),
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reduceMotion || paused || !inView || slides.length <= 1) return;

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, SLIDE_MS);

    return () => window.clearInterval(timer);
  }, [reduceMotion, paused, inView, slides.length]);

  const active = slides[index] ?? slides[0];

  return (
    <div
      ref={rootRef}
      className={cn("absolute inset-0 overflow-hidden", className)}
    >
      {reduceMotion ? (
        <div className="absolute inset-0">
          <Image
            src={active.src}
            alt={active.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-[65%_center] md:object-[58%_center] lg:[object-position:var(--hero-focal)]"
            style={
              {
                "--hero-focal": active.objectPosition,
              } as CSSProperties
            }
          />
        </div>
      ) : (
        <>
          <div className="absolute inset-0 bg-[#031b3c]" aria-hidden />

          <AnimatePresence mode="sync" initial={false}>
            <motion.div
              key={active.src}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: TRANSITION_S, ease: "easeInOut" }}
            >
              <Image
                src={active.src}
                alt={active.alt}
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover object-[65%_center] md:object-[58%_center] lg:[object-position:var(--hero-focal)]"
                style={
                  {
                    "--hero-focal": active.objectPosition,
                  } as CSSProperties
                }
              />
            </motion.div>
          </AnimatePresence>

          <div
            className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(3,27,60,0.45)_100%)]"
            aria-hidden
          />
        </>
      )}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] hidden sm:block">
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#031b3c]/55 to-transparent" />
        <div className="relative mx-auto flex max-w-[var(--afd-container)] items-end justify-end gap-2 px-4 pb-5 sm:px-6 lg:px-8">
          <div
            className="pointer-events-auto flex items-center gap-2.5 rounded-full border border-white/20 bg-black/30 px-3.5 py-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.25)] backdrop-blur-xl"
            role="tablist"
            aria-label="Images du hero"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocusCapture={() => setPaused(true)}
            onBlurCapture={() => setPaused(false)}
          >
            {slides.map((slide, slideIndex) => {
              const isActive = slideIndex === index;
              return (
                <button
                  key={slide.src}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`Afficher l’image ${slideIndex + 1}`}
                  className={cn(
                    "relative h-1.5 overflow-hidden rounded-full transition-all duration-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
                    isActive
                      ? "w-12 bg-white/20"
                      : "w-2 bg-white/35 hover:bg-white/70",
                  )}
                  onClick={() => setIndex(slideIndex)}
                >
                  {isActive && !reduceMotion ? (
                    <span
                      key={`progress-${index}-${paused}-${inView}`}
                      className="absolute inset-y-0 left-0 rounded-full bg-[var(--afd-orange)] shadow-[0_0_12px_rgba(255,122,26,0.65)]"
                      style={{
                        animation:
                          paused || !inView
                            ? "none"
                            : `afd-hero-slide-progress ${SLIDE_MS}ms linear forwards`,
                        width: paused || !inView ? "100%" : undefined,
                      }}
                    />
                  ) : null}
                  {isActive && reduceMotion ? (
                    <span className="absolute inset-0 rounded-full bg-[var(--afd-orange)]" />
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
