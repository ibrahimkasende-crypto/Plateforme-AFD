"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import type { ReactNode } from "react";

export function FadeIn({
  children,
  className,
  delay = 0,
  ...props
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
} & HTMLMotionProps<"div">) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay, ease: "easeOut" }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
