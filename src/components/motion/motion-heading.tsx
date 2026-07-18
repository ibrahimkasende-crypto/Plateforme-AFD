"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { visualEffects } from "@/config/visual-effects";

export function MotionHeading({
  children,
  className,
  as = "h2",
}: {
  children: ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3";
}) {
  const reduceMotion = useReducedMotion();
  const enabled = visualEffects.sectionAnimations.enabled && !reduceMotion;
  const Tag = as;

  if (!enabled) return <Tag className={className}>{children}</Tag>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, clipPath: "inset(0 0 40% 0)" }}
      whileInView={{ opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)" }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
    >
      <Tag className={className}>{children}</Tag>
    </motion.div>
  );
}
