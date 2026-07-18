import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
  className?: string;
  /** Sur mobile : lien sous le titre (défaut) ou en bas via children. */
  linkPlacement?: "under-title" | "end";
  actions?: ReactNode;
};

export function ResponsiveSectionHeader({
  eyebrow,
  title,
  description,
  href,
  linkLabel,
  className,
  linkPlacement = "under-title",
  actions,
}: Props) {
  const link =
    href && linkLabel ? (
      <Link
        href={href}
        className="inline-flex min-h-11 shrink-0 items-center gap-2 text-sm font-bold text-[var(--afd-blue)] transition hover:gap-2.5"
      >
        {linkLabel}
        <ArrowRight className="size-4" aria-hidden />
      </Link>
    ) : null;

  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        linkPlacement === "end" && "sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className="min-w-0 max-w-2xl">
        {eyebrow ? (
          <p className="afd-label text-[var(--afd-blue)]">{eyebrow}</p>
        ) : null}
        <h2
          className="mt-3 text-[length:var(--text-section)] font-extrabold leading-[1.15] tracking-[-0.02em] text-[var(--afd-navy)] text-balance"
          style={{ fontFamily: "var(--font-heading), Segoe UI, sans-serif" }}
        >
          {title}
        </h2>
        {description ? (
          <p className="mt-3 max-w-xl text-[length:var(--text-body)] leading-[1.7] text-[var(--afd-muted)] text-pretty">
            {description}
          </p>
        ) : null}
        {linkPlacement === "under-title" && link ? (
          <div className="mt-3 sm:hidden">{link}</div>
        ) : null}
      </div>
      <div className="flex flex-col gap-2 sm:items-end">
        {actions}
        {linkPlacement === "end" ? (
          link
        ) : (
          <div className="hidden sm:block">{link}</div>
        )}
      </div>
    </div>
  );
}
