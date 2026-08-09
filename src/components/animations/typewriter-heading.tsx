"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

const DEFAULT_LINES = [
  "Des femmes engagées",
  "pour des communautés",
  "plus fortes",
] as const;

type TypewriterHeadingProps = {
  lines?: readonly string[];
  className?: string;
  lineClassName?: string;
  charMs?: number;
  linePauseMs?: number;
  showCursor?: boolean;
};

/**
 * Titre multi-lignes avec écriture lettre à lettre.
 * Réserve l’espace dès le départ ; texte complet pour lecteurs d’écran.
 */
export function TypewriterHeading({
  lines = DEFAULT_LINES,
  className,
  lineClassName,
  charMs = 42,
  linePauseMs = 280,
  showCursor = true,
}: TypewriterHeadingProps) {
  const reduceMotion = useReducedMotion();
  const fullText = lines.join(" ");
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const lastLine = lines[lines.length - 1] ?? "";
  const naturallyDone =
    lineIndex >= lines.length - 1 && charIndex >= lastLine.length;
  const done = Boolean(reduceMotion) || naturallyDone;

  useEffect(() => {
    if (reduceMotion || naturallyDone) return;

    const current = lines[lineIndex] ?? "";
    if (charIndex < current.length) {
      const t = window.setTimeout(() => setCharIndex((c) => c + 1), charMs);
      return () => window.clearTimeout(t);
    }
    if (lineIndex < lines.length - 1) {
      const t = window.setTimeout(() => {
        setLineIndex((i) => i + 1);
        setCharIndex(0);
      }, linePauseMs);
      return () => window.clearTimeout(t);
    }
  }, [
    charIndex,
    lineIndex,
    lines,
    charMs,
    linePauseMs,
    reduceMotion,
    naturallyDone,
  ]);

  return (
    <h1 className={cn("afd-h1-hero hero-slogan mt-4 text-left", className)}>
      <span className="sr-only">{fullText}</span>
      <span aria-hidden="true" className="flex w-fit max-w-full flex-col items-start">
        {lines.map((line, i) => {
          let visible = "";
          if (done || i < lineIndex) {
            visible = line;
          } else if (i === lineIndex) {
            visible = line.slice(0, charIndex);
          }

          const isActive = !done && i === lineIndex;

          return (
            <span
              key={line}
              className={cn(
                "hero-slogan-line relative block whitespace-nowrap",
                lineClassName,
              )}
            >
              <span className="invisible select-none" aria-hidden>
                {line}
              </span>
              <span className="hero-slogan-gradient absolute inset-0 overflow-hidden whitespace-nowrap">
                {visible}
                {showCursor && isActive ? (
                  <span className="ml-0.5 inline-block h-[0.85em] w-[0.09em] translate-y-[0.08em] animate-pulse bg-[var(--afd-sky)] align-middle opacity-90 [-webkit-text-fill-color:initial]" />
                ) : null}
              </span>
            </span>
          );
        })}
      </span>
    </h1>
  );
}
