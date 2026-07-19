"use client";

import { useRouter } from "next/navigation";
import type { KeyboardEvent, ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type DashboardInteractiveCardProps = {
  href: string;
  title: string;
  description?: string;
  accessibleLabel?: string;
  contextParameters?: Record<string, string | null | undefined>;
  permission?: boolean;
  className?: string;
  children: ReactNode;
  onKeyboardOpen?: () => void;
};

function withParams(
  href: string,
  context?: Record<string, string | null | undefined>,
): string {
  if (!context) return href;
  const url = new URL(href, "http://local");
  for (const [key, value] of Object.entries(context)) {
    if (value) url.searchParams.set(key, value);
  }
  return `${url.pathname}${url.search}`;
}

export function DashboardInteractiveCard({
  href,
  title,
  description,
  accessibleLabel,
  contextParameters,
  permission = true,
  className,
  children,
  onKeyboardOpen,
}: DashboardInteractiveCardProps) {
  const router = useRouter();
  const target = withParams(href, contextParameters);

  if (!permission) {
    return <div className={className}>{children}</div>;
  }

  const open = () => {
    onKeyboardOpen?.();
    router.push(target);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      open();
    }
  };

  return (
    <div
      role="link"
      tabIndex={0}
      aria-label={accessibleLabel ?? title}
      title={description ?? title}
      onClick={(event) => {
        const el = event.target as HTMLElement;
        if (el.closest("a, button, [role='button'], input, select, textarea")) {
          return;
        }
        open();
      }}
      onKeyDown={onKeyDown}
      className={cn(
        "group relative h-full cursor-pointer rounded-[inherit] outline-none transition",
        "hover:-translate-y-0.5 hover:border-[var(--admin-primary)]/40 hover:shadow-[0_3px_12px_rgba(15,23,42,0.08)]",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--admin-primary)]",
        className,
      )}
    >
      {children}
      <span className="pointer-events-none absolute right-2 top-2 inline-flex size-6 items-center justify-center rounded-full bg-[var(--admin-primary)]/10 text-[var(--admin-primary)] opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
        <ArrowUpRight className="size-3.5" aria-hidden />
      </span>
    </div>
  );
}
