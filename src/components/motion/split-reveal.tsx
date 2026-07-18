"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { visualEffects } from "@/config/visual-effects";
import { cn } from "@/lib/utils";

export function SplitReveal({
  left,
  right,
  className,
  reverse = false,
}: {
  left: ReactNode;
  right: ReactNode;
  className?: string;
  reverse?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const enabled = visualEffects.sectionAnimations.enabled && !reduceMotion;

  if (!enabled) {
    return (
      <div className={cn("grid gap-8 lg:grid-cols-2 lg:items-center", className)}>
        {left}
        {right}
      </div>
    );
  }

  return (
    <div className={cn("grid gap-8 lg:grid-cols-2 lg:items-center", className)}>
      <motion.div
        initial={{ opacity: 0, x: reverse ? 32 : -32 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {left}
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: reverse ? -32 : 32 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
      >
        {right}
      </motion.div>
    </div>
  );
}
