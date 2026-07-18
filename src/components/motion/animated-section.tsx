"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { visualEffects } from "@/config/visual-effects";
import { cn } from "@/lib/utils";

export type SectionVariant =
  | "fade-up"
  | "soft-scale"
  | "slide-left"
  | "slide-right"
  | "mask-up"
  | "parallax-soft";

const variants: Record<
  SectionVariant,
  { initial: Record<string, number | string>; animate: Record<string, number | string> }
> = {
  "fade-up": {
    initial: { opacity: 0, y: 28 },
    animate: { opacity: 1, y: 0 },
  },
  "soft-scale": {
    initial: { opacity: 0, scale: 0.97, filter: "blur(6px)" },
    animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
  },
  "slide-left": {
    initial: { opacity: 0, x: -36 },
    animate: { opacity: 1, x: 0 },
  },
  "slide-right": {
    initial: { opacity: 0, x: 36 },
    animate: { opacity: 1, x: 0 },
  },
  "mask-up": {
    initial: { opacity: 0, y: 20, clipPath: "inset(12% 0 0 0)" },
    animate: { opacity: 1, y: 0, clipPath: "inset(0% 0 0 0)" },
  },
  "parallax-soft": {
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
  },
};

export function AnimatedSection({
  children,
  className,
  variant = "fade-up",
  delay = 0,
  as = "section",
}: {
  children: ReactNode;
  className?: string;
  variant?: SectionVariant;
  delay?: number;
  as?: "section" | "div" | "article";
}) {
  const reduceMotion = useReducedMotion();
  const enabled = visualEffects.sectionAnimations.enabled && !reduceMotion;
  const preset = variants[variant];
  const motionProps = {
    className: cn(className),
    initial: preset.initial,
    whileInView: preset.animate,
    viewport: { once: true, amount: 0.2 as const },
    transition: {
      duration: variant === "mask-up" ? 0.72 : 0.55,
      delay: Math.min(delay, 0.35),
      ease: [0.22, 1, 0.36, 1] as const,
    },
  };

  if (!enabled) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  if (as === "article") {
    return <motion.article {...motionProps}>{children}</motion.article>;
  }
  if (as === "div") {
    return <motion.div {...motionProps}>{children}</motion.div>;
  }
  return <motion.section {...motionProps}>{children}</motion.section>;
}
