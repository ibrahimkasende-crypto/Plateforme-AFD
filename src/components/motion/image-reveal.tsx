"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { visualEffects } from "@/config/visual-effects";
import { cn } from "@/lib/utils";

export function ImageReveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const enabled = visualEffects.sectionAnimations.enabled && !reduceMotion;

  if (!enabled) return <div className={cn("overflow-hidden", className)}>{children}</div>;

  return (
    <motion.div
      className={cn("overflow-hidden", className)}
      initial={{ opacity: 0, clipPath: "inset(8% 8% 8% 8%)", scale: 1.02 }}
      whileInView={{ opacity: 1, clipPath: "inset(0% 0% 0% 0%)", scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
