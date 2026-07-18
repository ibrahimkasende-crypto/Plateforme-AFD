import Link from "next/link";
import { ArrowLeft, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export function SecondaryPageBack({
  href = "/",
  label = "Retour",
  variant = "hero",
  className,
}: {
  href?: string;
  label?: string;
  /** Style pour hero sombre ou fond clair. */
  variant?: "hero" | "light" | "overlay";
  className?: string;
}) {
  if (variant === "overlay") {
    return (
      <Link
        href={href}
        aria-label={label}
        className={cn(
          "inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-2 text-[var(--afd-navy)] shadow-md backdrop-blur-sm transition hover:bg-white hover:text-[var(--afd-blue)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
          className,
        )}
      >
        <ArrowLeft className="size-4 shrink-0" aria-hidden />
        <Heart
          className="afd-heart-breathe size-4 shrink-0 fill-[var(--afd-orange)] text-[var(--afd-orange)] motion-reduce:animate-none"
          aria-hidden
          strokeWidth={2}
        />
      </Link>
    );
  }

  if (variant === "light") {
    return (
      <Link
        href={href}
        className={cn(
          "inline-flex min-h-11 items-center gap-2.5 rounded-xl border border-[var(--afd-blue)]/20 bg-white px-3.5 text-sm font-semibold text-[var(--afd-navy)] shadow-sm transition hover:border-[var(--afd-blue)]/40 hover:text-[var(--afd-blue)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--afd-blue)]",
          className,
        )}
      >
        <span className="inline-flex size-8 items-center justify-center rounded-lg bg-[var(--afd-blue)]/10 text-[var(--afd-blue)]">
          <ArrowLeft className="size-4" aria-hidden />
        </span>
        <Heart
          className="afd-heart-breathe size-4 fill-[var(--afd-orange)] text-[var(--afd-orange)] motion-reduce:animate-none"
          aria-hidden
          strokeWidth={2}
        />
        <span>{label}</span>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        "mb-5 inline-flex min-h-11 items-center gap-2.5 rounded-full border border-white/25 bg-white/10 px-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/18 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
        className,
      )}
    >
      <ArrowLeft className="size-4 shrink-0" aria-hidden />
      <Heart
        className="afd-heart-breathe size-4 shrink-0 fill-[var(--afd-orange)] text-[var(--afd-orange)] motion-reduce:animate-none"
        aria-hidden
        strokeWidth={2}
      />
      <span>{label}</span>
    </Link>
  );
}

/** Dernier fil d’Ariane avec href = page parente. */
export function backHrefFromBreadcrumbs(
  breadcrumbs: Array<{ href?: string }>,
): string {
  for (let index = breadcrumbs.length - 2; index >= 0; index -= 1) {
    const href = breadcrumbs[index]?.href;
    if (href) return href;
  }
  return "/";
}
