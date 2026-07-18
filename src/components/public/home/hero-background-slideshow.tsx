"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
} from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { afdImages } from "@/config/afd-images";
import { cn } from "@/lib/utils";

const SLIDE_MS = 4200;
const TRANSITION_S = 1.05;

/** Alternance de révélations cinématiques (clip-path) — style portfolios premium / Codrops */
const REVEALS = [
  {
    initial: {
      clipPath: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
      scale: 1.18,
      filter: "blur(10px) brightness(1.08)",
    },
    animate: {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      scale: 1.06,
      filter: "blur(0px) brightness(1)",
    },
    exit: {
      clipPath: "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)",
      scale: 1.12,
      filter: "blur(12px) brightness(0.85)",
      opacity: 0.35,
    },
    drift: { x: ["0%", "-2.5%"], y: ["0%", "1.5%"] },
  },
  {
    initial: {
      clipPath: "circle(0% at 72% 42%)",
      scale: 1.22,
      filter: "blur(14px) brightness(1.1)",
    },
    animate: {
      clipPath: "circle(160% at 72% 42%)",
      scale: 1.05,
      filter: "blur(0px) brightness(1)",
    },
    exit: {
      clipPath: "circle(0% at 28% 60%)",
      scale: 1.14,
      filter: "blur(16px) brightness(0.8)",
      opacity: 0.3,
    },
    drift: { x: ["0%", "2%"], y: ["0%", "-1.8%"] },
  },
  {
    initial: {
      clipPath: "inset(100% 0% 0% 0%)",
      scale: 1.16,
      filter: "blur(8px) brightness(1.06)",
    },
    animate: {
      clipPath: "inset(0% 0% 0% 0%)",
      scale: 1.07,
      filter: "blur(0px) brightness(1)",
    },
    exit: {
      clipPath: "inset(0% 0% 100% 0%)",
      scale: 1.1,
      filter: "blur(10px) brightness(0.88)",
      opacity: 0.4,
    },
    drift: { x: ["0%", "-1.5%"], y: ["0%", "2.2%"] },
  },
] as const;

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

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const springX = useSpring(mouseX, { stiffness: 40, damping: 22, mass: 0.8 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 22, mass: 0.8 });
  const parallaxX = useMotionTemplate`calc((${springX} - 0.5) * 28px)`;
  const parallaxY = useMotionTemplate`calc((${springY} - 0.5) * 18px)`;

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
  const reveal = REVEALS[index % REVEALS.length]!;

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (reduceMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    mouseX.set((event.clientX - rect.left) / rect.width);
    mouseY.set((event.clientY - rect.top) / rect.height);
  }

  function handlePointerLeave() {
    mouseX.set(0.5);
    mouseY.set(0.5);
  }

  return (
    <div
      ref={rootRef}
      className={cn("absolute inset-0 overflow-hidden", className)}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
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

          {/* Parallaxe souris (couche externe) */}
          <motion.div
            className="absolute inset-[-3%] will-change-transform"
            style={{ x: parallaxX, y: parallaxY }}
          >
            <AnimatePresence mode="sync" initial={false}>
              <motion.div
                key={active.src}
                className="absolute inset-0 will-change-[clip-path,transform,filter]"
                initial={reveal.initial}
                animate={{
                  clipPath: reveal.animate.clipPath,
                  scale: reveal.animate.scale,
                  filter: reveal.animate.filter,
                  x: [...reveal.drift.x],
                  y: [...reveal.drift.y],
                }}
                exit={{ ...reveal.exit }}
                transition={{
                  clipPath: {
                    duration: TRANSITION_S,
                    ease: [0.76, 0, 0.24, 1],
                  },
                  filter: { duration: TRANSITION_S * 0.85, ease: "easeOut" },
                  opacity: { duration: TRANSITION_S * 0.7, ease: "easeInOut" },
                  scale: {
                    duration: SLIDE_MS / 1000,
                    ease: [0.22, 1, 0.36, 1],
                  },
                  x: {
                    duration: SLIDE_MS / 1000,
                    ease: "linear",
                  },
                  y: {
                    duration: SLIDE_MS / 1000,
                    ease: "linear",
                  },
                }}
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
          </motion.div>

          {/* Flash lumineux au changement */}
          <AnimatePresence>
            <motion.div
              key={`flash-${index}`}
              className="pointer-events-none absolute inset-0 z-[1]"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.4, 0] }}
              transition={{
                duration: 0.95,
                times: [0, 0.22, 1],
                ease: "easeOut",
              }}
              aria-hidden
            >
              <div className="absolute inset-0 bg-[linear-gradient(105deg,transparent_28%,rgba(255,255,255,0.22)_48%,transparent_68%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,rgba(255,140,60,0.14),transparent_55%)]" />
            </motion.div>
          </AnimatePresence>

          <div
            className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(3,27,60,0.45)_100%)]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 z-[1] opacity-[0.035] mix-blend-overlay"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            }}
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
