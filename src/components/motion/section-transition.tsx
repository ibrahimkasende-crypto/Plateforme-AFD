"use client";

import type { ReactNode } from "react";
import { AnimatedSection, type SectionVariant } from "./animated-section";

/** Alias sémantique pour envelopper un bloc de section. */
export function SectionTransition({
  children,
  variant = "fade-up",
  className,
  delay,
}: {
  children: ReactNode;
  variant?: SectionVariant;
  className?: string;
  delay?: number;
}) {
  return (
    <AnimatedSection as="div" variant={variant} className={className} delay={delay}>
      {children}
    </AnimatedSection>
  );
}
