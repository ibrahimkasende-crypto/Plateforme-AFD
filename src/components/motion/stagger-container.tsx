"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { visualEffects } from "@/config/visual-effects";

export function StaggerContainer({
  children,
  className,
  stagger = 0.08,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
}) {
  const reduceMotion = useReducedMotion();
  const enabled = visualEffects.sectionAnimations.enabled && !reduceMotion;

  if (!enabled) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.18 }}
      variants={{
        hidden: {},
        show: {
          transition: { staggerChildren: Math.min(Math.max(stagger, 0.06), 0.1) },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
