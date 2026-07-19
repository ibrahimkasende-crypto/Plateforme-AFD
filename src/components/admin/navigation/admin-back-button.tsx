"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

type AdminBackButtonProps = {
  fallbackHref: string;
  label?: string;
  compact?: boolean;
  className?: string;
};

/**
 * Retour admin : historique si navigation interne /admin, sinon fallbackHref.
 */
export function AdminBackButton({
  fallbackHref,
  label = "Retour",
  compact = false,
  className,
}: AdminBackButtonProps) {
  const router = useRouter();

  function handleClick() {
    if (typeof window === "undefined") {
      router.push(fallbackHref);
      return;
    }
    const ref = document.referrer;
    try {
      const sameOrigin = ref && new URL(ref).origin === window.location.origin;
      const fromAdmin = sameOrigin && new URL(ref).pathname.startsWith("/admin");
      if (fromAdmin && window.history.length > 1) {
        router.back();
        return;
      }
    } catch {
      // ignore
    }
    router.push(fallbackHref);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      title={label}
      aria-label={label}
      className={cn(
        "group inline-flex min-h-10 min-w-10 items-center justify-center gap-2 rounded-lg border border-[var(--admin-border)] bg-white px-3 text-sm font-semibold text-[var(--admin-text)] transition hover:border-[var(--admin-primary)]/40 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-primary)]/40",
        compact && "px-2",
        className,
      )}
    >
      <ArrowLeft
        className="size-4 shrink-0 transition group-hover:-translate-x-0.5"
        aria-hidden
      />
      {!compact ? <span>{label}</span> : null}
    </button>
  );
}
