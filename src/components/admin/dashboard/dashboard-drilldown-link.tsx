"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type DashboardDrilldownLinkProps = {
  href: string;
  title: string;
  description?: string;
  accessibleLabel?: string;
  className?: string;
  children: React.ReactNode;
  showIcon?: boolean;
};

export function DashboardDrilldownLink({
  href,
  title,
  description,
  accessibleLabel,
  className,
  children,
  showIcon = true,
}: DashboardDrilldownLinkProps) {
  return (
    <Link
      href={href}
      aria-label={accessibleLabel ?? `${title}${description ? ` — ${description}` : ""}`}
      title={description ?? title}
      className={cn(
        "group relative block h-full rounded-[inherit] outline-none transition",
        "hover:-translate-y-0.5 hover:shadow-[0_3px_12px_rgba(15,23,42,0.08)]",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--admin-primary)]",
        className,
      )}
    >
      {children}
      {showIcon ? (
        <span className="pointer-events-none absolute right-2 top-2 inline-flex size-6 items-center justify-center rounded-full bg-[var(--admin-primary)]/10 text-[var(--admin-primary)] opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
          <ArrowUpRight className="size-3.5" aria-hidden />
        </span>
      ) : null}
    </Link>
  );
}
