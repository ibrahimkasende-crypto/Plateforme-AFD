"use client";

import { cn } from "@/lib/utils";

function resolveEnvLabel(): string | null {
  const env = (
    process.env.NEXT_PUBLIC_APP_ENV ??
    process.env.NODE_ENV ??
    ""
  ).toLowerCase();
  if (env === "production" || env === "prod") return null;
  if (env === "staging" || env === "preprod" || env === "préproduction") {
    return "Préproduction";
  }
  if (process.env.NODE_ENV === "development" || env === "development") {
    return "Développement";
  }
  return null;
}

type AfdEnvironmentBadgeProps = {
  className?: string;
};

/** Badge d’environnement — jamais affiché en production. Sans logo (évite la répétition de marque). */
export function AfdEnvironmentBadge({ className }: AfdEnvironmentBadgeProps) {
  const label = resolveEnvLabel();
  if (!label) return null;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-[var(--admin-border)] bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-[var(--admin-muted)]",
        className,
      )}
      title={`Environnement ${label} — non visible en production`}
      data-afd-env-badge
    >
      {label}
    </span>
  );
}
