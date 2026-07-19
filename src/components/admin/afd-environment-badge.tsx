"use client";

import Image from "next/image";
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

/** Badge d’environnement AFD — jamais affiché en production. */
export function AfdEnvironmentBadge({ className }: AfdEnvironmentBadgeProps) {
  const label = resolveEnvLabel();
  if (!label) return null;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-[var(--admin-border)] bg-slate-50 px-2 py-1 text-[11px] font-semibold text-[var(--admin-muted)]",
        className,
      )}
      title={`Environnement ${label} — non visible en production`}
      data-afd-env-badge
    >
      <Image
        src="/assets/brand/Logo_AFD.jpeg"
        alt=""
        width={14}
        height={14}
        className="size-3.5 rounded-sm object-cover"
      />
      {label}
    </span>
  );
}
